var map;
var marker1;
let service = "all";
let base = "fosc";
let copia;

function getBounds() {
  const bounds = map.getBounds();
  var bbox = {
    minX: bounds.getWest(),
    minY: bounds.getSouth(),
    maxX: bounds.getEast(),
    maxY: bounds.getNorth(),
  };
  return bbox;
}

function onServeiChange() {
  // Obtenir el valor seleccionat
  const serveiSelector = document.getElementById("serveiSelector");
  service = serveiSelector.value;
}

function onBaseChange() {
  const serveiSelector2 = document.getElementById("serveiSelector2");
  base = serveiSelector2.value;

  if (base === 'orto') {
    map.setStyle("https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json");

  } else if (base === 'topo') {
    map.setStyle("https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json");
  } else if (base === 'fosc') {
    map.setStyle("https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json");
  }
}

async function apiConnect(lat, lon, service) {
  if (map.getLayer('clicked-layer')) {
    map.removeLayer('clicked-layer');
  }
  if (map.getSource('clicked-layer')) {
    map.removeSource('clicked-layer');
  }
  openPanel();
  showLoader();
  const response = await fetch(`https://api.icgc.cat/territori/${service}/geo/${lon}/${lat}`);
  const dades = await response.json();
  copia = dades[0].features;
  const contentHtml = document.getElementById("infoPanelContent");
  contentHtml.innerHTML = '';

  let serveisDisponibles = [];
  let address = null;
  let elevation = null;

  if (dades[0].features.length < 4) {
    document.getElementById("infoPanelContent").innerHTML = "No hi ha dades sobre el punt seleccionat.";
  } else {
    for (let i = 0; i < dades[0].features.length; i++) {
      serveisDisponibles.push(dades[0].features[i].id)
      if (dades[0].features[i].id === 'Geocodificador') {
        address = dades[0].features[i].properties;
      } else if (dades[0].features[i].id === 'Elevació') {
        elevation = dades[0].features[i].value;
      }
    }

    if (address) {
      contentHtml.innerHTML += `<b>Adreça: </b> ${address.etiqueta} <br>`;
    }
    if (elevation) {
      contentHtml.innerHTML += `<b>Elevació: </b> ${elevation} metres<br><br>`
    }
    for (let j = 0; j < serveisDisponibles.length; j++) {
      if (serveisDisponibles[j] !== 'Geocodificador' && serveisDisponibles[j] !== 'Elevació' && serveisDisponibles[j] !== 'H3 geospatial indexing system') {
        const servei = serveisDisponibles[j];
        const button = document.createElement('button');
        button.textContent = servei;
        button.classList.add('myButtonClass');
        button.addEventListener('click', () => {
          addGeometry(servei, button)
        });
        contentHtml.appendChild(button);
        contentHtml.appendChild(document.createElement('br'));
      }
    }
  }

  hideLoader();
}

function addGeometry(servei, button) {
  console.log('Afegim geometria per al servei:', servei);

  if (map.getLayer('clicked-layer')) {
    map.removeLayer('clicked-layer');
  }
  if (map.getSource('clicked-layer')) {
    map.removeSource('clicked-layer');
  }

  let bbox = new maplibregl.LngLatBounds();

  for (let i = 0; i < copia.length; i++) {
    if (servei === copia[i].id) {
      map.addSource('clicked-layer', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: copia[i].geometry,
          properties: {}
        }
      });

      map.addLayer({
        id: 'clicked-layer',
        type: 'fill',
        source: 'clicked-layer',
        layout: {},
        paint: {
          'fill-color': '#fee899',
          'fill-opacity': 0.8,
        }
      });

      const geometry = copia[i].geometry;

      if (geometry.type === 'Polygon') {
        geometry.coordinates[0].forEach(coordinatePair => {
          bbox.extend(coordinatePair);
        });
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
          polygon[0].forEach(coordinatePair => {
            bbox.extend(coordinatePair);
          });
        });
      }

      const previousProperties = document.querySelectorAll('.layer-properties');
      previousProperties.forEach(element => element.remove());

      const propertiesDiv = document.createElement('div');
      propertiesDiv.classList.add('layer-properties');

      const properties = copia[i].properties;
      for (const [key, value] of Object.entries(properties)) {
        const propertyLine = document.createElement('div');
        propertyLine.textContent = `${key}: ${value}`;
        propertiesDiv.appendChild(propertyLine);
      }

      button.parentNode.insertBefore(propertiesDiv, button.nextSibling);

      // Ressaltar el botó clicat
      const allButtons = document.querySelectorAll('.myButtonClass');
      allButtons.forEach(btn => btn.classList.remove('highlighted-button'));
      button.classList.add('highlighted-button');
    }
  }
  map.fitBounds(bbox, { padding: 200 });
}
function onTextFormSubmit(event) {
  event.preventDefault();
  if (map.getLayer("punts2")) {
    map.removeLayer("punts2").removeSource("punts2");
  }
  const textInput = document.getElementById("textSelector");
  const searchText = textInput.value;
  geocoderRequest(searchText);
  textInput.value = "";
}

async function geocoderRequest(text) {
  const response = await fetch(
    `https://api.icgc.cat/territori/adress/${text}`
  );
  const dades = await response.json();
  if (dades.features) {
    if (!map.getLayer("punts2")) {
      map.addSource("punts2", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dades.features,
        },
      });
      map.addLayer({
        id: "punts2",
        type: "circle",
        source: "punts2",
        paint: {
          "circle-color": "red",
          "circle-opacity": 0.8,
          "circle-radius": 6
        },
      });
    } else {
      map.removeLayer("punts2").removeSource("punts2");
      map.addSource("punts2", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dades.features,
        },
      });
      map.addLayer({
        id: "punts2",
        type: "circle",
        source: "punts2",
        paint: {
          "circle-color": "red",
          "circle-opacity": 0.8,
          "circle-radius": 6
        },
      });
    }
    map.flyTo({
      center: [dades.features[0].geometry.coordinates[0], dades.features[0].geometry.coordinates[1]],
      zoom: 11,
      essential: true
    });
  } else {
    alert(dades);
  }
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  if (map.getLayer("punts2")) {
    map.on("mouseenter", "punts2", function (e) {
      map.getCanvas().style.cursor = "pointer";
      popup.setLngLat(e.features[0].geometry.coordinates).setHTML(
        `Adreça: <b>${e.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${e.features[0].properties.street}</b><br>
      Municipi: <b>${e.features[0].properties.mun}</b><br>
      Codi Postal: <b>${e.features[0].properties.postalcode}</b><br>`
      ).addTo(map);
    });
    map.on("mouseleave", "punts2", function (e) {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }
}

function init() {
  map = new maplibregl.Map({
    container: "map",
    style:
      "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json",
    center: [2.0042, 41.7747],
    zoom: 7,
    attributionControl: false,
    hash: false,
  });
  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  var fullscreenControl = new maplibregl.FullscreenControl();
  map.addControl(fullscreenControl, 'top-right');
  map.on("click", function (e) {
    let lon = e.lngLat.lng;
    let lat = e.lngLat.lat;
    apiConnect(lat, lon, service);
    if (!marker1) {
      marker1 = new maplibregl.Marker({ color: "#FF6E42" })
        .setLngLat([lon, lat])
        .addTo(map);
    } else {
      marker1.remove();
      marker1 = new maplibregl.Marker({ color: "#FF6E42" })
        .setLngLat([lon, lat])
        .addTo(map);
    }
  });
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("infoPanelContent").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("infoPanelContent").style.display = "block";
}

function openPanel() {
  var infoPanel = document.getElementById("infoPanel");
  infoPanel.classList.add("open");
  infoPanel.style.width = "400px"; // Amplada del panell quan està obert
  document.getElementById("openPanel").style.display = "none"; // Amagar el botó d'obrir quan el panell està obert
}

function closePanel() {
  var infoPanel = document.getElementById("infoPanel");
  infoPanel.classList.remove("open");
  infoPanel.style.width = "0px"; // Tancar el panell
  document.getElementById("openPanel").style.display = "block"; // Mostrar el botó d'obrir quan el panell està tancat
}

init();
