
var map;
var marker1;
let service = "";
let allChecked = true;
let copia;
let selectedService = null; // Definim selectedService globalment
let settings;

// Defineix els valors de padding per a les diferents amplades de pantalla
const smallScreenPadding = { top: 5, bottom: window.innerHeight * 0.5 };
const largeScreenPadding = { top: 100, bottom: 100, left: 300, right: 50 };

export async function onBaseChange() {
  const layerSymbol = getFirstSymbolLayerId(map.getStyle().layers);
  const serveiSelector2 = document.getElementById("serveiSelector2");
  const base = serveiSelector2.value;

  // Guardar les dades de la capa 'clicked-layer' si existeix
  let clickedLayerData = null;
  if (map.getLayer('clicked-layer')) {
    const source = map.getSource('clicked-layer');
    if (source && source._data) {
      clickedLayerData = source._data;
    }
  }

  let styleUrl;
  if (base === 'orto') {
    styleUrl = "https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json";
  } else if (base === 'topo') {
    styleUrl = "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json";
  } else if (base === 'fosc') {
    styleUrl = "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json";
  }

  // Canviar l'estil del mapa
  map.setStyle(styleUrl);

  // Esperar a que el nou estil es carregui completament
  map.once('styledata', () => {
    if (clickedLayerData) {
      // Afegeix la font amb les dades guardades
      if (!map.getSource('clicked-layer')) {
        map.addSource('clicked-layer', {
          type: 'geojson',
          data: clickedLayerData
        });
      }

      // Afegeix la capa 'clicked-layer'
      if (!map.getLayer('clicked-layer')) {
        map.addLayer({
          id: 'clicked-layer',
          type: 'fill',
          source: 'clicked-layer',
          layout: {},
          paint: {
            "fill-color": "#f9f91d",
            "fill-outline-color": "#f9f91d",
            "fill-opacity": 0.5,
          },
        }, layerSymbol);
      }

    }
    addSources().then(function () {
      addTerrain();
    });
  });
}

async function addSources() {
  if (!map.getSource("terrainMapZen")) {
    map.addSource("terrainMapZen", {
      type: "raster-dem",
      url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
      tileSize: 512,
      maxzoom: 14,
    });
  }
}

function addTerrain() {
  try {
    map.setTerrain({
      source: "terrainMapZen",
      exaggeration: 1.5,
    });
  } catch (err) {
    console.log("ERROR addTerrain");
    console.log(err);
  }
}

// Funció per eliminar la geometria del mapa
function removeGeometry() {
  if (map.getLayer('clicked-layer')) {
    map.removeLayer('clicked-layer');
  }
  if (map.getSource('clicked-layer')) {
    map.removeSource('clicked-layer');
  }
}

function highlightGeometry(servei) {
  const layerSymbol = getFirstSymbolLayerId(map.getStyle().layers);
  if (map.getLayer('hovered-layer')) {
    map.removeLayer('hovered-layer');
  }
  if (map.getSource('hovered-layer')) {
    map.removeSource('hovered-layer');
  }

  let bbox = new maplibregl.LngLatBounds();

  for (let i = 0; i < copia.length; i++) {
    if (servei === copia[i].id) {
      map.addSource('hovered-layer', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: copia[i].geometry,
          properties: {}
        }
      });

      map.addLayer({
        id: 'hovered-layer',
        type: 'fill',
        source: 'hovered-layer',
        layout: {},
        paint: {
          "fill-color": "white",
          "fill-opacity": 0.4,

        },
      }, layerSymbol);

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
    }
  }
}

function removeHighlightedGeometry() {
  if (map.getLayer('hovered-layer')) {
    map.removeLayer('hovered-layer');
  }
  if (map.getSource('hovered-layer')) {
    map.removeSource('hovered-layer');
  }
}

// Modifica la funció apiConnect per afegir els esdeveniments mouseover i mouseout
async function apiConnect(lat, lon, service) {
  loadConfig();
  openPanel();
  showLoader();

  for (let i = 0; i < settings.length; i++) {
    const { id, checked } = settings[i];

    if (checked === true) {
      if (service !== '') {
        service += ',';
      }
      service += id;
    } else {
      allChecked = false;
    }
  }
  service += ',geocoder,elevacions'

  if (allChecked) {
    service = 'all';
  }
  //console.log('valor service', service)
  const response = await fetch(`https://api.icgc.cat/territori/${service}/geo/${lon}/${lat}`);
  const dades = await response.json();

  copia = dades.responses.features;
  const contentHtml = document.getElementById("infoPanelContent");
  contentHtml.innerHTML = '';

  let serveisDisponibles = [];
  let address = null;
  let elevation = null;

  if (dades.numResponses < 2) {
    document.getElementById("infoPanelContent").innerHTML = "No hi ha dades sobre el punt seleccionat.";
  } else {
    for (let i = 0; i < dades.responses.features.length; i++) {
      serveisDisponibles.push(dades.responses.features[i].id)
      if (dades.responses.features[i].id === 'Geocodificador') {
        address = dades.responses.features[i].properties;
      } else if (dades.responses.features[i].id === 'Elevació') {
        elevation = dades.responses.features[i].properties.value;
      }
    }
    if (address) {
      contentHtml.innerHTML += `<b>Adreça: </b> ${address.etiqueta} <br>`;
    }
    if (elevation) {
      contentHtml.innerHTML += `<b>Coordenades: </b> ${lat.toFixed(4)}, ${lon.toFixed(4)} <br>`
      contentHtml.innerHTML += `<b>Elevació: </b> ${elevation} metres<br><br>`
    }
    for (let j = 0; j < serveisDisponibles.length; j++) {
      if (serveisDisponibles[j] !== 'Geocodificador' && serveisDisponibles[j] !== 'Elevació' && serveisDisponibles[j] !== 'H3 geospatial indexing system') {
        const servei = serveisDisponibles[j];
        const button = document.createElement('button');
        button.textContent = servei;
        button.classList.add('myButtonClass');
        button.addEventListener('click', () => {
          selectedService = servei; // Emmagatzemem el servei seleccionat
          addGeometry(servei, button);
        });
        button.addEventListener('mouseover', () => {
          highlightGeometry(servei);
        });
        button.addEventListener('mouseout', () => {
          removeHighlightedGeometry();
        });
        contentHtml.appendChild(button);
        contentHtml.appendChild(document.createElement('br'));
      }
    }

    // Seleccionem el primer servei per defecte només si tenim serveis disponibles
    if (serveisDisponibles.length > 0 && !selectedService) {
      setTimeout(() => {
        // console.log(serveisDisponibles)
        selectedService = serveisDisponibles[0];
        addGeometry(selectedService, contentHtml.querySelector('.myButtonClass'));
      }, 25);
    } else if (selectedService) {
      // Selecciona tots els elements amb la classe .myButtonClass
      let elements = document.querySelectorAll('.myButtonClass');

      // Recorre cada element i comprova si conté el text seleccionat
      elements.forEach(element => {
        if (element.textContent.includes(selectedService)) {
          // Si el text coincideix, crida la funció addGeometry amb aquest element
          addGeometry(selectedService, element);
        }
      });
    }
  }
  hideLoader();
}

function addGeometry(servei, button) {
  const layerSymbol = getFirstSymbolLayerId(map.getStyle().layers);
  removeGeometry(); // Elimina la geometria anterior abans d'afegir la nova
  const previousCloseButton = document.querySelector('.closeButtonClass');
  if (previousCloseButton) {
    previousCloseButton.parentNode.removeChild(previousCloseButton);
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
          "fill-color": "#f9f91d",
          "fill-outline-color": "#f9f91d",
          "fill-opacity": 0.5,
        },
      }, layerSymbol);

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
      const closeButton = document.createElement('button');
      closeButton.textContent = '×'; // Caràcter 'x' per representar tancar
      closeButton.classList.add('closeButtonClass');
      closeButton.addEventListener('click', () => {
        removeGeometry();
        propertiesDiv.remove(); // Elimina les propietats
        closeButton.remove(); // Elimina el botó de tancar

        // Treure la selecció del botó
        button.classList.remove('highlighted-button');
      });
      propertiesDiv.appendChild(closeButton);
      button.parentNode.insertBefore(propertiesDiv, button.nextSibling);
      button.parentNode.insertBefore(closeButton, button.nextSibling);

      // Ressaltar el botó clicat
      const allButtons = document.querySelectorAll('.myButtonClass');
      allButtons.forEach(btn => btn.classList.remove('highlighted-button'));
      button.classList.add('highlighted-button');
    }
  }

  const screenWidth = window.innerWidth;
  const padding = screenWidth < 750 ? smallScreenPadding : largeScreenPadding;

  map.fitBounds(bbox, { padding: padding });
}

function initMap() {
  map = new maplibregl.Map({
    container: "map",
    style:
      "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json",
    center: [2.0042, 41.7747],
    zoom: 7,
    maxZoom: 18,
    attributionControl: false,
    hash: false,
  });
  map.on('load', function () {
    addSources().then(function () {
      addTerrain();
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    var fullscreenControl = new maplibregl.FullscreenControl();
    map.addControl(fullscreenControl, 'top-right');
    map.addControl(new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: false
    }), 'top-right');
    map.addControl(new PitchControl(), 'top-right');
    map.on("click", function (e) {
      var notification = document.getElementById("notification");
      if (notification) {
        notification.classList.remove("show");
      }
      let lon = e.lngLat.lng;
      let lat = e.lngLat.lat;
      if (selectedService) {
        removeGeometry(); // Elimina la geometria abans de cridar a apiConnect
        apiConnect(lat, lon, service).then(() => {
          addGeometry(selectedService, document.querySelector(`.myButtonClass.highlighted-button`));
        });
      } else {
        apiConnect(lat, lon, service);
      }
      if (!marker1) {
        marker1 = new maplibregl.Marker({ color: "#FF6E42" })
          .setLngLat([lon, lat])
          .addTo(map);
      } else {
        marker1.setLngLat([lon, lat]);
      }
    });
  });
}

export async function onTextFormSubmit(event) {
  event.preventDefault();
  if (map.getLayer("punts2")) {
    map.removeLayer("punts2").removeSource("punts2");
  }
  const textInput = document.getElementById("textSelector");
  const searchText = textInput.value;
  geocoderRequest(searchText);
  textInput.value = "";
}

export function getFirstSymbolLayerId(layers) {
  let layer = "background";
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type == "symbol" && layers[i]["source-layer"] !== "contour") {
      layer = layers[i].id;
      return layer;
    }
  }
}

export async function geocoderRequest(text) {
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
      Carrer: <b>${e.features[0].properties.nom}</b><br>
      Municipi: <b>${e.features[0].properties.municipi}</b><br>
      Codi Postal: <b>${e.features[0].properties.codi_postal}</b><br>`
      ).addTo(map);
    });
    map.on("mouseleave", "punts2", function (e) {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("infoPanelContent").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("infoPanelContent").style.display = "block";
}

// Crear una classe per al control de pitch
class PitchControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('button');
    this._container.className = 'maplibregl-ctrl pitch-control';
    this._container.textContent = '3D';
    this._container.onclick = () => {
      if (this._map.getPitch() === 0) {
        this._map.easeTo({ pitch: 60 });
        this._container.textContent = '2D';
      } else {
        this._map.easeTo({ pitch: 0 });
        this._container.textContent = '3D';
      }
    };
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

function mapSettings() {
  var notification = document.getElementById("notification");
  if (notification) {
    notification.classList.remove("show");
  }

  var modal = document.getElementById("myModal");
  var configListContainer = document.getElementById("configListContainer");

  modal.style.display = "block";

  // Fer el fetch i omplir la llista d'elements
  fetch('https://api.icgc.cat/territori/info')
    .then(response => response.json())
    .then(data => {
      configListContainer.innerHTML = ''; // Netejar el contingut anterior
      data.forEach(item => {
        if (item.nomAPI !== 'geocoder' && item.nomAPI !== 'elevacions') {
          const listItem = document.createElement('div');
          listItem.className = 'config-item';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `${item.nomAPI}`;
          checkbox.name = item.name;
          checkbox.checked = true; // Marcar el checkbox per defecte
          const label = document.createElement('label');
          label.htmlFor = `checkbox-${item.nomAPI}`;
          label.textContent = item.text;
          listItem.appendChild(checkbox);
          listItem.appendChild(label);
          configListContainer.appendChild(listItem);
        }
      });
      loadConfig(); // Carregar la configuració després de crear els elements
    })
    .catch(error => console.error('Error fetching data:', error));

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    saveConfig(); // Guardar la configuració quan es tanqui el modal
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      saveConfig(); // Guardar la configuració quan es tanqui el modal
      modal.style.display = "none";
    }
  }
}

// Funció per guardar la configuració dels checkboxes a localStorage
function saveConfig() {
  const checkboxes = document.querySelectorAll('.config-item input[type="checkbox"]');
  const config = Array.from(checkboxes).map(checkbox => ({
    id: checkbox.id,
    checked: checkbox.checked
  }));
  localStorage.setItem('layerConfig', JSON.stringify(config));
}

// Funció per carregar la configuració dels checkboxes des de localStorage
function loadConfig() {
  const config = JSON.parse(localStorage.getItem('layerConfig'));
  if (config) {
    settings = config;
    config.forEach(item => {
      const checkbox = document.getElementById(item.id);
      if (checkbox) {
        checkbox.checked = item.checked;
      }
    });
  }
}


export function openPanel() {
  var infoPanel = document.getElementById("infoPanel");
  infoPanel.classList.add("open");
  infoPanel.style.width = "300px"; // Amplada del panell quan està obert
  document.getElementById("openPanel").style.display = "none"; // Amagar el botó d'obrir quan el panell està obert
}

export function closePanel() {
  var infoPanel = document.getElementById("infoPanel");
  infoPanel.classList.remove("open");
  infoPanel.style.width = "0px"; // Tancar el panell
  document.getElementById("openPanel").style.display = "block"; // Mostrar el botó d'obrir quan el panell està tancat
}
export function init() {
  initMap();

  const textInput = document.getElementById("textSelector");
  textInput.addEventListener('change', () => {
    const searchText = textInput.value;
    geocoderRequest(searchText);
  });
  const settings = document.getElementById("layerConfig");
  settings.addEventListener('click', () => {
    mapSettings();
  })
}

// Executar la funció d'inicialització una vegada que tota la pàgina estigui carregada
window.addEventListener('DOMContentLoaded', init);
