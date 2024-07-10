(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(r){if(r.ep)return;r.ep=!0;const c=n(r);fetch(r.href,c)}})();var e,v;let _="",A=!0,h,g=null,S;const O={top:5,bottom:window.innerHeight*.5},D={top:100,bottom:100,left:300,right:50};async function R(){const o=document.getElementById("serveiSelector2").value;let n=null;if(e.getLayer("clicked-layer")){const r=e.getSource("clicked-layer");r&&r._data&&(n=r._data)}let s;o==="orto"?s="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json":o==="topo"?s="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json":o==="fosc"&&(s="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json"),e.setStyle(s),e.once("styledata",()=>{const r=B(e.getStyle().layers),c=localStorage.getItem("clickedLayerColor")||"#f9f91d";n&&(e.getSource("clicked-layer")||e.addSource("clicked-layer",{type:"geojson",data:n}),e.getLayer("clicked-layer")||e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":c,"fill-outline-color":c,"fill-opacity":.5}},r)),o==="topo"?e.setSky({"sky-color":"#a5f0f0","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"}):o==="orto"?e.setSky({"sky-color":"#37709e","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"}):o==="fosc"&&e.setSky({"sky-color":"#232423","sky-horizon-blend":.3,"horizon-color":"#969996","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#383838"}),j().then(function(){q()})})}async function j(){e.getSource("terrainMapZen")||e.addSource("terrainMapZen",{type:"raster-dem",url:"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",tileSize:512,maxzoom:14})}function q(){try{e.setTerrain({source:"terrainMapZen",exaggeration:1.5})}catch(t){console.log("ERROR addTerrain"),console.log(t)}}function w(){e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer")}function W(t){const o=B(e.getStyle().layers);e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer");for(let n=0;n<h.length;n++)t===h[n].id&&(e.addSource("hovered-layer",{type:"geojson",data:{type:"Feature",geometry:h[n].geometry,properties:{}}}),e.addLayer({id:"hovered-layer",type:"fill",source:"hovered-layer",layout:{},paint:{"fill-color":"orange","fill-opacity":.3}},o))}function G(){e.getLayer("hovered-layer")&&e.removeLayer("hovered-layer"),e.getSource("hovered-layer")&&e.removeSource("hovered-layer")}async function T(t,o,n){if(H(),N(),U(),S){for(let l=0;l<S.length;l++){const{id:u,checked:d}=S[l];d===!0?(n!==""&&(n+=","),n+=u):A=!1}n+=",geocoder,elevacions"}A&&(n="all");const s=document.getElementById("infoPanelContent"),c=await(await fetch(`https://api.icgc.cat/territori/${n}/geo/${o}/${t}`)).json();c.responses&&(h=c.responses.features,s.innerHTML="");let i=[],a=null,p=null;if(!c.numResponses||!c.responses)s.innerHTML="S'ha produït un error en processar la sol·licitud. Si us plau, torna-ho a intentar o selecciona un altre punt.",z();else if(c.numResponses<1)s.innerHTML="No hi ha dades sobre el punt seleccionat.";else{for(let l=0;l<c.responses.features.length;l++)i.push(c.responses.features[l].id),c.responses.features[l].id==="Geocodificador"?a=c.responses.features[l].properties:c.responses.features[l].id==="Elevació"&&(p=c.responses.features[l].properties.value);a&&(s.innerHTML+=`<p style='font-size: 1.2em; margin-bottom: 12px'><b>${a.etiqueta}</b> <span style='font-size: 0.65em; color: #8D9596'>(distància: ${a.distancia} km)</span></p>`),p&&(s.innerHTML+=`<b>Coordenades: </b> ${t.toFixed(5)}, ${o.toFixed(5)} <br>`,s.innerHTML+=`<b>Elevació: </b> ${p} metres<br><br>`);for(let l=0;l<i.length;l++)if(i[l]!=="Geocodificador"&&i[l]!=="Elevació"&&i[l]!=="Malla hexagonal H3"){const u=i[l],d=document.createElement("button");d.textContent=u,d.classList.add("myButtonClass"),d.addEventListener("click",()=>{g=u,E(u,d)}),d.addEventListener("mouseover",()=>{W(u)}),d.addEventListener("mouseout",()=>{G()}),s.appendChild(d),s.appendChild(document.createElement("br"))}i.length>0&&!g?setTimeout(()=>{g=i[0],E(g,s.querySelector(".myButtonClass"))},25):g&&document.querySelectorAll(".myButtonClass").forEach(u=>{u.textContent.includes(g)&&E(g,u)})}z()}function E(t,o){const n=B(e.getStyle().layers);w();const s=document.querySelector(".closeButtonClass");s&&s.parentNode.removeChild(s);let r=new maplibregl.LngLatBounds;for(let a=0;a<h.length;a++)if(t===h[a].id){const p=localStorage.getItem("clickedLayerColor")||"#f9f91d",l=document.createElement("div");if(l.classList.add("layer-properties"),t==="Vèrtex xarxa utilitària"){const C=h[a].features,y={type:"FeatureCollection",features:C};e.addSource("clicked-layer",{type:"geojson",data:y}),e.addLayer({id:"clicked-layer",type:"circle",source:"clicked-layer",paint:{"circle-radius":8,"circle-color":p}});const m=["Codi_ICC","Municipi","distance_km"];C.forEach((k,F)=>{const L=k.geometry.coordinates;L&&L.length===2&&typeof L[0]=="number"&&typeof L[1]=="number"&&r.extend(L);const x=k.properties;if(x){const M=document.createElement("div");M.textContent=`Feature ${F+1}`,M.style.fontWeight="bold",l.appendChild(M),m.forEach(I=>{if(x[I]!==void 0){const P=document.createElement("div");P.textContent=`${I}: ${x[I]}`,l.appendChild(P)}}),l.appendChild(document.createElement("br"))}})}else{const f=h[a].geometry;if(f){e.addSource("clicked-layer",{type:"geojson",data:{type:"Feature",geometry:f,properties:{}}}),e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":p,"fill-outline-color":p,"fill-opacity":.5}},n),f.type==="Polygon"?f.coordinates[0].forEach(y=>{y&&y.length===2&&typeof y[0]=="number"&&typeof y[1]=="number"&&r.extend(y)}):f.type==="MultiPolygon"&&f.coordinates.forEach(y=>{y[0].forEach(m=>{m&&m.length===2&&typeof m[0]=="number"&&typeof m[1]=="number"&&r.extend(m)})});const C=h[a].properties;if(C)for(const[y,m]of Object.entries(C)){const k=document.createElement("div");k.textContent=`${y}: ${m}`,l.appendChild(k)}}}document.querySelectorAll(".layer-properties").forEach(f=>f.remove());const d=document.createElement("button");d.textContent="×",d.classList.add("closeButtonClass"),d.addEventListener("click",()=>{w(),l.remove(),d.remove(),o.classList.remove("highlighted-button")}),l.appendChild(d),o&&(o.parentNode.insertBefore(l,o.nextSibling),o.parentNode.insertBefore(d,o.nextSibling)),document.querySelectorAll(".myButtonClass").forEach(f=>f.classList.remove("highlighted-button")),o.classList.add("highlighted-button")}const i=window.innerWidth<750?O:D;r.isEmpty()||e.fitBounds(r,{padding:i})}function Z(){K(),e=new maplibregl.Map({container:"map",style:"https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json",center:[2.0042,41.7747],zoom:7,maxZoom:18,attributionControl:!1,hash:!1,maxPitch:85}),e.on("load",function(){j().then(function(){q()}),e.addControl(new maplibregl.NavigationControl,"top-right"),e.setSky({"sky-color":"#a5f0f0","sky-horizon-blend":.3,"horizon-color":"#e1e3e3","horizon-fog-blend":.9,"fog-ground-blend":.85,"fog-color":"#c5d6d6"});let t=null;const o=20,n=new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0});e.addControl(n,"top-right");function s(r,c,i,a){const l=(i-r)*Math.PI/180,u=(a-c)*Math.PI/180,d=Math.sin(l/2)*Math.sin(l/2)+Math.cos(r*Math.PI/180)*Math.cos(i*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2);return 6371e3*(2*Math.atan2(Math.sqrt(d),Math.sqrt(1-d)))}n.on("geolocate",function(r){const c=r.coords.longitude,i=r.coords.latitude;if(t&&s(t.lat,t.lon,i,c)<o)return;t={lon:c,lat:i};const a={lngLat:{lng:c,lat:i}};e.fire("click",a)}),e.addControl(new Q,"top-right"),e.on("click",function(r){var c=document.getElementById("notification");c&&c.classList.remove("show");let i=r.lngLat.lng,a=r.lngLat.lat;g&&a&&i?(w(),T(a,i,_).then(()=>{document.querySelector(".myButtonClass.highlighted-button")&&E(g,document.querySelector(".myButtonClass.highlighted-button"))})):T(a,i,_);const p=localStorage.getItem("markerColor")||"#ff6e42";v?v.setLngLat([i,a]):v=new maplibregl.Marker({color:p}).setLngLat([i,a]).addTo(e)}),V()})}function B(t){let o="background";for(var n=0;n<t.length;n++)if(t[n].type=="symbol")return o=t[n].id,o}async function J(t){const n=await(await fetch(`https://api.icgc.cat/territori/adress/${t}`)).json();n.features?(e.getLayer("punts2")?(e.removeLayer("punts2").removeSource("punts2"),e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:n.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})):(e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:n.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})),e.flyTo({center:[n.features[0].geometry.coordinates[0],n.features[0].geometry.coordinates[1]],zoom:11,essential:!0})):alert(n);const s=new maplibregl.Popup({closeButton:!1,closeOnClick:!1});e.getLayer("punts2")&&(e.on("mouseenter","punts2",function(r){e.getCanvas().style.cursor="pointer",s.setLngLat(r.features[0].geometry.coordinates).setHTML(`Adreça: <b>${r.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${r.features[0].properties.nom}</b><br>
      Municipi: <b>${r.features[0].properties.municipi}</b><br>
      Codi Postal: <b>${r.features[0].properties.codi_postal}</b><br>`).addTo(e)}),e.on("mouseleave","punts2",function(r){e.getCanvas().style.cursor="",s.remove()}))}function U(){document.getElementById("loader").style.display="block",document.getElementById("infoPanelContent").style.display="none"}function z(){document.getElementById("loader").style.display="none",document.getElementById("infoPanelContent").style.display="block"}function K(){document.getElementById("mapLoader").style.display="flex"}function V(){document.getElementById("mapLoader").style.display="none"}class Q{onAdd(o){return this._map=o,this._container=document.createElement("button"),this._container.className="maplibregl-ctrl pitch-control",this._container.textContent="3D",this._container.onclick=()=>{this._map.getPitch()===0?(this._map.easeTo({pitch:60}),this._container.textContent="2D"):(this._map.easeTo({pitch:0}),this._container.textContent="3D")},this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map=void 0}}function X(){var t=document.getElementById("notification");t&&t.classList.remove("show");var o=document.getElementById("myModal"),n=document.getElementById("configListContainer");o.style.display="block",fetch("https://api.icgc.cat/territori/info").then(c=>c.json()).then(c=>{n.innerHTML="";const i=document.createElement("div"),a=document.createElement("input");a.type="checkbox",a.id="selectAllCheckbox";const p=document.createElement("label");i.id="selectDiv",p.id="selectLabel",p.htmlFor="selectAllCheckbox",p.textContent=" Seleccionar tots",i.appendChild(a),i.appendChild(p),n.appendChild(i),a.addEventListener("change",function(){n.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)').forEach(u=>{u.checked=a.checked})}),c.forEach(l=>{if(l.nomAPI!=="geocoder"&&l.nomAPI!=="elevacions"){const u=document.createElement("div");u.className="config-item";const d=document.createElement("input");d.type="checkbox",d.id=`${l.nomAPI}`,d.name=l.name,d.checked=!0;const b=document.createElement("label");b.htmlFor=`checkbox-${l.nomAPI}`,b.textContent=l.text,u.appendChild(d),u.appendChild(b),n.appendChild(u),d.addEventListener("change",function(){r()})}}),H(),r()}).catch(c=>console.error("Error fetching data:",c));var s=document.getElementsByClassName("close")[0];s.onclick=function(){$(),o.style.display="none"},window.onclick=function(c){c.target==o&&($(),o.style.display="none")};function r(){const c=n.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)'),i=Array.from(c).every(a=>a.checked);selectAllCheckbox.checked=i}}function $(){const t=document.querySelectorAll('.config-item input[type="checkbox"]'),o=Array.from(t).map(n=>({id:n.id,checked:n.checked}));localStorage.setItem("layerConfig",JSON.stringify(o))}function H(){const t=JSON.parse(localStorage.getItem("layerConfig"));t&&(S=t,t.forEach(o=>{const n=document.getElementById(o.id);n&&(n.checked=o.checked)}))}function N(){var t=document.getElementById("infoPanel");t.classList.add("open"),t.style.width="300px",document.getElementById("openPanel").style.display="none"}function Y(){var t=document.getElementById("infoPanel");t.classList.remove("open"),t.style.width="0px",document.getElementById("openPanel").style.display="block"}function ee(){Z();const t=document.getElementById("textSelector");t.addEventListener("change",()=>{const n=t.value;J(n)}),document.getElementById("layerConfig").addEventListener("click",()=>{X()})}window.addEventListener("DOMContentLoaded",ee);document.getElementById("layerColor").addEventListener("input",t=>{const o=t.target.value;localStorage.setItem("clickedLayerColor",o),te(o)});function te(t){e.getLayer("clicked-layer")&&(e.setPaintProperty("clicked-layer","fill-color",t),e.setPaintProperty("clicked-layer","fill-outline-color",t))}document.getElementById("markerColor").addEventListener("input",t=>{const o=t.target.value;localStorage.setItem("markerColor",o),oe(o)});function oe(t){if(v){v.setPopup(null);const o=v.getLngLat();v.remove(),v=new maplibregl.Marker({color:t}).setLngLat(o).addTo(e)}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/serviceworker.js").then(t=>{console.log("Service Worker registered with scope:",t.scope)},t=>{console.log("Service Worker registration failed:",t)})});window.closePanel=Y;window.openPanel=N;window.onBaseChange=R;
