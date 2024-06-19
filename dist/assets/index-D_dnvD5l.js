(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();var e,m;let P="",M=!0,g,y=null,v;const j={top:5,bottom:window.innerHeight*.5},q={top:100,bottom:100,left:300,right:50};async function A(){const t=k(e.getStyle().layers),r=document.getElementById("serveiSelector2").value;let c=null;if(e.getLayer("clicked-layer")){const n=e.getSource("clicked-layer");n&&n._data&&(c=n._data)}let o;r==="orto"?o="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json":r==="topo"?o="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json":r==="fosc"&&(o="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json"),e.setStyle(o),e.once("styledata",()=>{if(c){const n=localStorage.getItem("clickedLayerColor")||"#f9f91d";e.getSource("clicked-layer")||e.addSource("clicked-layer",{type:"geojson",data:c}),e.getLayer("clicked-layer")||e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":n,"fill-outline-color":n,"fill-opacity":.5}},t)}x().then(function(){_()})})}async function x(){e.getSource("terrainMapZen")||e.addSource("terrainMapZen",{type:"raster-dem",url:"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",tileSize:512,maxzoom:14})}function _(){try{e.setTerrain({source:"terrainMapZen",exaggeration:1.5})}catch(t){console.log("ERROR addTerrain"),console.log(t)}}function b(){e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer")}function N(t){const i=k(e.getStyle().layers);e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer");for(let r=0;r<g.length;r++)t===g[r].id&&(e.addSource("hovered-layer",{type:"geojson",data:{type:"Feature",geometry:g[r].geometry,properties:{}}}),e.addLayer({id:"hovered-layer",type:"fill",source:"hovered-layer",layout:{},paint:{"fill-color":"orange","fill-opacity":.3}},i))}function H(){e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer")}async function w(t,i,r){if(T(),$(),R(),v){for(let s=0;s<v.length;s++){const{id:p,checked:d}=v[s];d===!0?(r!==""&&(r+=","),r+=p):M=!1}r+=",geocoder,elevacions"}M&&(r="all");const c=document.getElementById("infoPanelContent"),n=await(await fetch(`https://api.icgc.cat/territori/${r}/geo/${i}/${t}`)).json();n.responses&&(g=n.responses.features,c.innerHTML="");let a=[],l=null,u=null;if(!n.numResponses||!n.responses)c.innerHTML="S'ha produït un error en processar la sol·licitud. Si us plau, torna-ho a intentar o selecciona un altre punt.",B();else if(n.numResponses<1)c.innerHTML="No hi ha dades sobre el punt seleccionat.";else{for(let s=0;s<n.responses.features.length;s++)a.push(n.responses.features[s].id),n.responses.features[s].id==="Geocodificador"?l=n.responses.features[s].properties:n.responses.features[s].id==="Elevació"&&(u=n.responses.features[s].properties.value);l&&(c.innerHTML+=`<b>Adreça: </b> ${l.etiqueta} <br>`),u&&(c.innerHTML+=`<b>Coordenades: </b> ${t.toFixed(4)}, ${i.toFixed(4)} <br>`,c.innerHTML+=`<b>Elevació: </b> ${u} metres<br><br>`);for(let s=0;s<a.length;s++)if(a[s]!=="Geocodificador"&&a[s]!=="Elevació"&&a[s]!=="H3 geospatial indexing system"){const p=a[s],d=document.createElement("button");d.textContent=p,d.classList.add("myButtonClass"),d.addEventListener("click",()=>{y=p,L(p,d)}),d.addEventListener("mouseover",()=>{N(p)}),d.addEventListener("mouseout",()=>{H()}),c.appendChild(d),c.appendChild(document.createElement("br"))}a.length>0&&!y?setTimeout(()=>{y=a[0],L(y,c.querySelector(".myButtonClass"))},25):y&&document.querySelectorAll(".myButtonClass").forEach(p=>{p.textContent.includes(y)&&L(y,p)})}B()}function L(t,i){const r=k(e.getStyle().layers);b();const c=document.querySelector(".closeButtonClass");c&&c.parentNode.removeChild(c);let o=new maplibregl.LngLatBounds;for(let l=0;l<g.length;l++)if(t===g[l].id){const u=localStorage.getItem("clickedLayerColor")||"#f9f91d";e.addSource("clicked-layer",{type:"geojson",data:{type:"Feature",geometry:g[l].geometry,properties:{}}}),e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":u,"fill-outline-color":u,"fill-opacity":.5}},r);const s=g[l].geometry;s&&(s.type==="Polygon"?s.coordinates[0].forEach(f=>{o.extend(f)}):s.type==="MultiPolygon"&&s.coordinates.forEach(f=>{f[0].forEach(C=>{o.extend(C)})})),document.querySelectorAll(".layer-properties").forEach(f=>f.remove());const d=document.createElement("div");d.classList.add("layer-properties");const S=g[l].properties;for(const[f,C]of Object.entries(S)){const E=document.createElement("div");E.textContent=`${f}: ${C}`,d.appendChild(E)}const h=document.createElement("button");h.textContent="×",h.classList.add("closeButtonClass"),h.addEventListener("click",()=>{b(),d.remove(),h.remove(),i.classList.remove("highlighted-button")}),d.appendChild(h),i&&(i.parentNode.insertBefore(d,i.nextSibling),i.parentNode.insertBefore(h,i.nextSibling)),document.querySelectorAll(".myButtonClass").forEach(f=>f.classList.remove("highlighted-button")),i.classList.add("highlighted-button")}const a=window.innerWidth<750?j:q;o&&e.fitBounds(o,{padding:a})}function O(){e=new maplibregl.Map({container:"map",style:"https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json",center:[2.0042,41.7747],zoom:7,maxZoom:18,attributionControl:!1,hash:!1}),e.on("load",function(){x().then(function(){_()}),e.addControl(new maplibregl.NavigationControl,"top-right");let t=null;const i=20,r=new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0});e.addControl(r,"top-right");function c(o,n,a,l){const s=(a-o)*Math.PI/180,p=(l-n)*Math.PI/180,d=Math.sin(s/2)*Math.sin(s/2)+Math.cos(o*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(p/2)*Math.sin(p/2);return 6371e3*(2*Math.atan2(Math.sqrt(d),Math.sqrt(1-d)))}r.on("geolocate",function(o){const n=o.coords.longitude,a=o.coords.latitude;if(t&&c(t.lat,t.lon,a,n)<i)return;t={lon:n,lat:a};const l={lngLat:{lng:n,lat:a}};e.fire("click",l)}),e.addControl(new D,"top-right"),e.on("click",function(o){var n=document.getElementById("notification");n&&n.classList.remove("show");let a=o.lngLat.lng,l=o.lngLat.lat;y&&l&&a?(b(),w(l,a,P).then(()=>{document.querySelector(".myButtonClass.highlighted-button")&&L(y,document.querySelector(".myButtonClass.highlighted-button"))})):w(l,a,P);const u=localStorage.getItem("markerColor")||"#ff6e42";m?m.setLngLat([a,l]):m=new maplibregl.Marker({color:u}).setLngLat([a,l]).addTo(e)})})}function k(t){let i="background";for(var r=0;r<t.length;r++)if(t[r].type=="symbol"&&t[r]["source-layer"]!=="contour")return i=t[r].id,i}async function F(t){const r=await(await fetch(`https://api.icgc.cat/territori/adress/${t}`)).json();r.features?(e.getLayer("punts2")?(e.removeLayer("punts2").removeSource("punts2"),e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})):(e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})),e.flyTo({center:[r.features[0].geometry.coordinates[0],r.features[0].geometry.coordinates[1]],zoom:11,essential:!0})):alert(r);const c=new maplibregl.Popup({closeButton:!1,closeOnClick:!1});e.getLayer("punts2")&&(e.on("mouseenter","punts2",function(o){e.getCanvas().style.cursor="pointer",c.setLngLat(o.features[0].geometry.coordinates).setHTML(`Adreça: <b>${o.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${o.features[0].properties.nom}</b><br>
      Municipi: <b>${o.features[0].properties.municipi}</b><br>
      Codi Postal: <b>${o.features[0].properties.codi_postal}</b><br>`).addTo(e)}),e.on("mouseleave","punts2",function(o){e.getCanvas().style.cursor="",c.remove()}))}function R(){document.getElementById("loader").style.display="block",document.getElementById("infoPanelContent").style.display="none"}function B(){document.getElementById("loader").style.display="none",document.getElementById("infoPanelContent").style.display="block"}class D{onAdd(i){return this._map=i,this._container=document.createElement("button"),this._container.className="maplibregl-ctrl pitch-control",this._container.textContent="3D",this._container.onclick=()=>{this._map.getPitch()===0?(this._map.easeTo({pitch:60}),this._container.textContent="2D"):(this._map.easeTo({pitch:0}),this._container.textContent="3D")},this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map=void 0}}function G(){var t=document.getElementById("notification");t&&t.classList.remove("show");var i=document.getElementById("myModal"),r=document.getElementById("configListContainer");i.style.display="block",fetch("https://api.icgc.cat/territori/info").then(o=>o.json()).then(o=>{r.innerHTML="",o.forEach(n=>{if(n.nomAPI!=="geocoder"&&n.nomAPI!=="elevacions"){const a=document.createElement("div");a.className="config-item";const l=document.createElement("input");l.type="checkbox",l.id=`${n.nomAPI}`,l.name=n.name,l.checked=!0;const u=document.createElement("label");u.htmlFor=`checkbox-${n.nomAPI}`,u.textContent=n.text,a.appendChild(l),a.appendChild(u),r.appendChild(a)}}),T()}).catch(o=>console.error("Error fetching data:",o));var c=document.getElementsByClassName("close")[0];c.onclick=function(){I(),i.style.display="none"},window.onclick=function(o){o.target==i&&(I(),i.style.display="none")}}function I(){const t=document.querySelectorAll('.config-item input[type="checkbox"]'),i=Array.from(t).map(r=>({id:r.id,checked:r.checked}));localStorage.setItem("layerConfig",JSON.stringify(i))}function T(){const t=JSON.parse(localStorage.getItem("layerConfig"));t&&(v=t,t.forEach(i=>{const r=document.getElementById(i.id);r&&(r.checked=i.checked)}))}function $(){var t=document.getElementById("infoPanel");t.classList.add("open"),t.style.width="300px",document.getElementById("openPanel").style.display="none"}function W(){var t=document.getElementById("infoPanel");t.classList.remove("open"),t.style.width="0px",document.getElementById("openPanel").style.display="block"}function z(){O();const t=document.getElementById("textSelector");t.addEventListener("change",()=>{const r=t.value;F(r)}),document.getElementById("layerConfig").addEventListener("click",()=>{G()})}window.addEventListener("DOMContentLoaded",z);document.getElementById("layerColor").addEventListener("input",t=>{const i=t.target.value;localStorage.setItem("clickedLayerColor",i),Z(i)});function Z(t){e.getLayer("clicked-layer")&&(e.setPaintProperty("clicked-layer","fill-color",t),e.setPaintProperty("clicked-layer","fill-outline-color",t))}document.getElementById("markerColor").addEventListener("input",t=>{const i=t.target.value;localStorage.setItem("markerColor",i),J(i)});function J(t){if(m){m.setPopup(null);const i=m.getLngLat();m.remove(),m=new maplibregl.Marker({color:t}).setLngLat(i).addTo(e)}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/serviceworker.js").then(t=>{console.log("Service Worker registered with scope:",t.scope)},t=>{console.log("Service Worker registration failed:",t)})});window.closePanel=W;window.openPanel=$;window.onBaseChange=A;