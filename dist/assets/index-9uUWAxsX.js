(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();var e,m;let x="",M=!0,g,y=null,b;const T={top:5,bottom:window.innerHeight*.5},$={top:100,bottom:100,left:300,right:50};async function q(){const t=S(e.getStyle().layers),o=document.getElementById("serveiSelector2").value;let s=null;if(e.getLayer("clicked-layer")){const n=e.getSource("clicked-layer");n&&n._data&&(s=n._data)}let r;o==="orto"?r="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json":o==="topo"?r="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json":o==="fosc"&&(r="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json"),e.setStyle(r),e.once("styledata",()=>{if(s){const n=localStorage.getItem("clickedLayerColor")||"#f9f91d";e.getSource("clicked-layer")||e.addSource("clicked-layer",{type:"geojson",data:s}),e.getLayer("clicked-layer")||e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":n,"fill-outline-color":n,"fill-opacity":.5}},t)}o==="topo"?e.setSky({"sky-color":"#a5f0f0","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"}):o==="orto"?e.setSky({"sky-color":"#37709e","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"}):o==="fosc"&&e.setSky({"sky-color":"#232423","sky-horizon-blend":.3,"horizon-color":"#969996","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#383838"}),w().then(function(){_()})})}async function w(){e.getSource("terrainMapZen")||e.addSource("terrainMapZen",{type:"raster-dem",url:"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",tileSize:512,maxzoom:14})}function _(){try{e.setTerrain({source:"terrainMapZen",exaggeration:1.5})}catch(t){console.log("ERROR addTerrain"),console.log(t)}}function C(){e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer")}function j(t){const c=S(e.getStyle().layers);e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer");for(let o=0;o<g.length;o++)t===g[o].id&&(e.addSource("hovered-layer",{type:"geojson",data:{type:"Feature",geometry:g[o].geometry,properties:{}}}),e.addLayer({id:"hovered-layer",type:"fill",source:"hovered-layer",layout:{},paint:{"fill-color":"orange","fill-opacity":.3}},c))}function N(){e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer")}async function P(t,c,o){if(A(),z(),D(),b){for(let l=0;l<b.length;l++){const{id:u,checked:d}=b[l];d===!0?(o!==""&&(o+=","),o+=u):M=!1}o+=",geocoder,elevacions"}M&&(o="all");const s=document.getElementById("infoPanelContent"),n=await(await fetch(`https://api.icgc.cat/territori/${o}/geo/${c}/${t}`)).json();n.responses&&(g=n.responses.features,s.innerHTML="");let i=[],a=null,p=null;if(!n.numResponses||!n.responses)s.innerHTML="S'ha produït un error en processar la sol·licitud. Si us plau, torna-ho a intentar o selecciona un altre punt.",B();else if(n.numResponses<1)s.innerHTML="No hi ha dades sobre el punt seleccionat.";else{for(let l=0;l<n.responses.features.length;l++)i.push(n.responses.features[l].id),n.responses.features[l].id==="Geocodificador"?a=n.responses.features[l].properties:n.responses.features[l].id==="Elevació"&&(p=n.responses.features[l].properties.value);a&&(s.innerHTML+=`<p style='font-size: 1.2em; margin-bottom: 12px'><b>${a.etiqueta}</b> <span style='font-size: 0.65em; color: #8D9596'>(distància: ${a.distancia} km)</span></p>`),p&&(s.innerHTML+=`<b>Coordenades: </b> ${t.toFixed(5)}, ${c.toFixed(5)} <br>`,s.innerHTML+=`<b>Elevació: </b> ${p} metres<br><br>`);for(let l=0;l<i.length;l++)if(i[l]!=="Geocodificador"&&i[l]!=="Elevació"&&i[l]!=="H3 geospatial indexing system"){const u=i[l],d=document.createElement("button");d.textContent=u,d.classList.add("myButtonClass"),d.addEventListener("click",()=>{y=u,k(u,d)}),d.addEventListener("mouseover",()=>{j(u)}),d.addEventListener("mouseout",()=>{N()}),s.appendChild(d),s.appendChild(document.createElement("br"))}i.length>0&&!y?setTimeout(()=>{y=i[0],k(y,s.querySelector(".myButtonClass"))},25):y&&document.querySelectorAll(".myButtonClass").forEach(u=>{u.textContent.includes(y)&&k(y,u)})}B()}function k(t,c){const o=S(e.getStyle().layers);C();const s=document.querySelector(".closeButtonClass");s&&s.parentNode.removeChild(s);let r=new maplibregl.LngLatBounds;for(let a=0;a<g.length;a++)if(t===g[a].id){const p=localStorage.getItem("clickedLayerColor")||"#f9f91d";e.addSource("clicked-layer",{type:"geojson",data:{type:"Feature",geometry:g[a].geometry,properties:{}}}),e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":p,"fill-outline-color":p,"fill-opacity":.5}},o);const l=g[a].geometry;l&&(l.type==="Polygon"?l.coordinates[0].forEach(f=>{r.extend(f)}):l.type==="MultiPolygon"&&l.coordinates.forEach(f=>{f[0].forEach(L=>{r.extend(L)})})),document.querySelectorAll(".layer-properties").forEach(f=>f.remove());const d=document.createElement("div");d.classList.add("layer-properties");const v=g[a].properties;for(const[f,L]of Object.entries(v)){const E=document.createElement("div");E.textContent=`${f}: ${L}`,d.appendChild(E)}const h=document.createElement("button");h.textContent="×",h.classList.add("closeButtonClass"),h.addEventListener("click",()=>{C(),d.remove(),h.remove(),c.classList.remove("highlighted-button")}),d.appendChild(h),c&&(c.parentNode.insertBefore(d,c.nextSibling),c.parentNode.insertBefore(h,c.nextSibling)),document.querySelectorAll(".myButtonClass").forEach(f=>f.classList.remove("highlighted-button")),c.classList.add("highlighted-button")}const i=window.innerWidth<750?T:$;r&&e.fitBounds(r,{padding:i})}function H(){F(),e=new maplibregl.Map({container:"map",style:"https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json",center:[2.0042,41.7747],zoom:7,maxZoom:18,attributionControl:!1,hash:!1,maxPitch:85}),e.on("load",function(){w().then(function(){_()}),e.addControl(new maplibregl.NavigationControl,"top-right"),e.setSky({"sky-color":"#a5f0f0","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"});let t=null;const c=20,o=new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0});e.addControl(o,"top-right");function s(r,n,i,a){const l=(i-r)*Math.PI/180,u=(a-n)*Math.PI/180,d=Math.sin(l/2)*Math.sin(l/2)+Math.cos(r*Math.PI/180)*Math.cos(i*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2);return 6371e3*(2*Math.atan2(Math.sqrt(d),Math.sqrt(1-d)))}o.on("geolocate",function(r){const n=r.coords.longitude,i=r.coords.latitude;if(t&&s(t.lat,t.lon,i,n)<c)return;t={lon:n,lat:i};const a={lngLat:{lng:n,lat:i}};e.fire("click",a)}),e.addControl(new G,"top-right"),e.on("click",function(r){var n=document.getElementById("notification");n&&n.classList.remove("show");let i=r.lngLat.lng,a=r.lngLat.lat;y&&a&&i?(C(),P(a,i,x).then(()=>{document.querySelector(".myButtonClass.highlighted-button")&&k(y,document.querySelector(".myButtonClass.highlighted-button"))})):P(a,i,x);const p=localStorage.getItem("markerColor")||"#ff6e42";m?m.setLngLat([i,a]):m=new maplibregl.Marker({color:p}).setLngLat([i,a]).addTo(e)}),R()})}function S(t){let c="background";for(var o=0;o<t.length;o++)if(t[o].type=="symbol"&&t[o]["source-layer"]!=="contour")return c=t[o].id,c}async function O(t){const o=await(await fetch(`https://api.icgc.cat/territori/adress/${t}`)).json();o.features?(e.getLayer("punts2")?(e.removeLayer("punts2").removeSource("punts2"),e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:o.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})):(e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:o.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})),e.flyTo({center:[o.features[0].geometry.coordinates[0],o.features[0].geometry.coordinates[1]],zoom:11,essential:!0})):alert(o);const s=new maplibregl.Popup({closeButton:!1,closeOnClick:!1});e.getLayer("punts2")&&(e.on("mouseenter","punts2",function(r){e.getCanvas().style.cursor="pointer",s.setLngLat(r.features[0].geometry.coordinates).setHTML(`Adreça: <b>${r.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${r.features[0].properties.nom}</b><br>
      Municipi: <b>${r.features[0].properties.municipi}</b><br>
      Codi Postal: <b>${r.features[0].properties.codi_postal}</b><br>`).addTo(e)}),e.on("mouseleave","punts2",function(r){e.getCanvas().style.cursor="",s.remove()}))}function D(){document.getElementById("loader").style.display="block",document.getElementById("infoPanelContent").style.display="none"}function B(){document.getElementById("loader").style.display="none",document.getElementById("infoPanelContent").style.display="block"}function F(){document.getElementById("mapLoader").style.display="flex"}function R(){document.getElementById("mapLoader").style.display="none"}class G{onAdd(c){return this._map=c,this._container=document.createElement("button"),this._container.className="maplibregl-ctrl pitch-control",this._container.textContent="3D",this._container.onclick=()=>{this._map.getPitch()===0?(this._map.easeTo({pitch:60}),this._container.textContent="2D"):(this._map.easeTo({pitch:0}),this._container.textContent="3D")},this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map=void 0}}function W(){var t=document.getElementById("notification");t&&t.classList.remove("show");var c=document.getElementById("myModal"),o=document.getElementById("configListContainer");c.style.display="block",fetch("https://api.icgc.cat/territori/info").then(n=>n.json()).then(n=>{o.innerHTML="";const i=document.createElement("div"),a=document.createElement("input");a.type="checkbox",a.id="selectAllCheckbox";const p=document.createElement("label");i.id="selectDiv",p.id="selectLabel",p.htmlFor="selectAllCheckbox",p.textContent=" Seleccionar tots",i.appendChild(a),i.appendChild(p),o.appendChild(i),a.addEventListener("change",function(){o.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)').forEach(u=>{u.checked=a.checked})}),n.forEach(l=>{if(l.nomAPI!=="geocoder"&&l.nomAPI!=="elevacions"){const u=document.createElement("div");u.className="config-item";const d=document.createElement("input");d.type="checkbox",d.id=`${l.nomAPI}`,d.name=l.name,d.checked=!0;const v=document.createElement("label");v.htmlFor=`checkbox-${l.nomAPI}`,v.textContent=l.text,u.appendChild(d),u.appendChild(v),o.appendChild(u),d.addEventListener("change",function(){r()})}}),A(),r()}).catch(n=>console.error("Error fetching data:",n));var s=document.getElementsByClassName("close")[0];s.onclick=function(){I(),c.style.display="none"},window.onclick=function(n){n.target==c&&(I(),c.style.display="none")};function r(){const n=o.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)'),i=Array.from(n).every(a=>a.checked);selectAllCheckbox.checked=i}}function I(){const t=document.querySelectorAll('.config-item input[type="checkbox"]'),c=Array.from(t).map(o=>({id:o.id,checked:o.checked}));localStorage.setItem("layerConfig",JSON.stringify(c))}function A(){const t=JSON.parse(localStorage.getItem("layerConfig"));t&&(b=t,t.forEach(c=>{const o=document.getElementById(c.id);o&&(o.checked=c.checked)}))}function z(){var t=document.getElementById("infoPanel");t.classList.add("open"),t.style.width="300px",document.getElementById("openPanel").style.display="none"}function Z(){var t=document.getElementById("infoPanel");t.classList.remove("open"),t.style.width="0px",document.getElementById("openPanel").style.display="block"}function J(){H();const t=document.getElementById("textSelector");t.addEventListener("change",()=>{const o=t.value;O(o)}),document.getElementById("layerConfig").addEventListener("click",()=>{W()})}window.addEventListener("DOMContentLoaded",J);document.getElementById("layerColor").addEventListener("input",t=>{const c=t.target.value;localStorage.setItem("clickedLayerColor",c),U(c)});function U(t){e.getLayer("clicked-layer")&&(e.setPaintProperty("clicked-layer","fill-color",t),e.setPaintProperty("clicked-layer","fill-outline-color",t))}document.getElementById("markerColor").addEventListener("input",t=>{const c=t.target.value;localStorage.setItem("markerColor",c),K(c)});function K(t){if(m){m.setPopup(null);const c=m.getLngLat();m.remove(),m=new maplibregl.Marker({color:t}).setLngLat(c).addTo(e)}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/serviceworker.js").then(t=>{console.log("Service Worker registered with scope:",t.scope)},t=>{console.log("Service Worker registration failed:",t)})});window.closePanel=Z;window.openPanel=z;window.onBaseChange=q;
