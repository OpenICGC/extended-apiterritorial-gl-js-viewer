(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();var e,g;let E="all",m;const k={top:5,bottom:window.innerHeight*.5},w=150;async function B(){const o=C(e.getStyle().layers),r=document.getElementById("serveiSelector2").value;let i=null;if(e.getLayer("clicked-layer")){const n=e.getSource("clicked-layer");n&&n._data&&(i=n._data)}let t;r==="orto"?t="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json":r==="topo"?t="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json":r==="fosc"&&(t="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json"),e.setStyle(t),e.once("styledata",()=>{i&&(e.getSource("clicked-layer")||e.addSource("clicked-layer",{type:"geojson",data:i}),e.getLayer("clicked-layer")||e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":"#f9f91d","fill-outline-color":"#f9f91d","fill-opacity":.5}},o)),b().then(function(){L()})})}async function b(){e.getSource("terrainMapZen")||e.addSource("terrainMapZen",{type:"raster-dem",url:"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",tileSize:512,maxzoom:14})}function L(){try{e.setTerrain({source:"terrainMapZen",exaggeration:1.5})}catch(o){console.log("ERROR addTerrain"),console.log(o)}}function P(){e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer")}async function x(o,a,r){e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer"),S(),_();const t=await(await fetch(`https://api.icgc.cat/territori/${r}/geo/${a}/${o}`)).json();m=t[0].features;const n=document.getElementById("infoPanelContent");n.innerHTML="";let c=[],s=null,u=null;if(t[0].features.length<4)document.getElementById("infoPanelContent").innerHTML="No hi ha dades sobre el punt seleccionat.";else{for(let l=0;l<t[0].features.length;l++)c.push(t[0].features[l].id),t[0].features[l].id==="Geocodificador"?s=t[0].features[l].properties:t[0].features[l].id==="Elevació"&&(u=t[0].features[l].properties.value);s&&(n.innerHTML+=`<b>Adreça: </b> ${s.etiqueta} <br>`),u&&(n.innerHTML+=`<b>Coordenades: </b> ${o.toFixed(4)}, ${a.toFixed(4)} <br>`,n.innerHTML+=`<b>Elevació: </b> ${u} metres<br><br>`);for(let l=0;l<c.length;l++)if(c[l]!=="Geocodificador"&&c[l]!=="Elevació"&&c[l]!=="H3 geospatial indexing system"){const p=c[l],f=document.createElement("button");f.textContent=p,f.classList.add("myButtonClass"),f.addEventListener("click",()=>{M(p,f)}),n.appendChild(f),n.appendChild(document.createElement("br"))}}$()}function M(o,a){const r=C(e.getStyle().layers);e.getLayer("clicked-layer")&&e.removeLayer("clicked-layer"),e.getSource("clicked-layer")&&e.removeSource("clicked-layer");const i=document.querySelector(".closeButtonClass");i&&i.parentNode.removeChild(i);let t=new maplibregl.LngLatBounds;for(let s=0;s<m.length;s++)if(o===m[s].id){e.addSource("clicked-layer",{type:"geojson",data:{type:"Feature",geometry:m[s].geometry,properties:{}}}),e.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":"#f9f91d","fill-outline-color":"#f9f91d","fill-opacity":.5}},r);const u=m[s].geometry;u.type==="Polygon"?u.coordinates[0].forEach(d=>{t.extend(d)}):u.type==="MultiPolygon"&&u.coordinates.forEach(d=>{d[0].forEach(h=>{t.extend(h)})}),document.querySelectorAll(".layer-properties").forEach(d=>d.remove());const p=document.createElement("div");p.classList.add("layer-properties");const f=m[s].properties;for(const[d,h]of Object.entries(f)){const v=document.createElement("div");v.textContent=`${d}: ${h}`,p.appendChild(v)}const y=document.createElement("button");y.textContent="×",y.classList.add("closeButtonClass"),y.addEventListener("click",()=>{P(),p.remove(),y.remove()}),p.appendChild(y),a.parentNode.insertBefore(p,a.nextSibling),a.parentNode.insertBefore(y,a.nextSibling),document.querySelectorAll(".myButtonClass").forEach(d=>d.classList.remove("highlighted-button")),a.classList.add("highlighted-button")}const c=window.innerWidth<750?k:w;e.fitBounds(t,{padding:c})}function C(o){let a="background";for(var r=0;r<o.length;r++)if(o[r].type=="symbol"&&o[r]["source-layer"]!=="contour")return a=o[r].id,a}async function I(o){const r=await(await fetch(`https://api.icgc.cat/territori/adress/${o}`)).json();console.log("dades",r),r.features?(e.getLayer("punts2")?(e.removeLayer("punts2").removeSource("punts2"),e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})):(e.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),e.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})),e.flyTo({center:[r.features[0].geometry.coordinates[0],r.features[0].geometry.coordinates[1]],zoom:11,essential:!0})):alert(r);const i=new maplibregl.Popup({closeButton:!1,closeOnClick:!1});e.getLayer("punts2")&&(e.on("mouseenter","punts2",function(t){e.getCanvas().style.cursor="pointer",i.setLngLat(t.features[0].geometry.coordinates).setHTML(`Adreça: <b>${t.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${t.features[0].properties.nom}</b><br>
      Municipi: <b>${t.features[0].properties.municipi}</b><br>
      Codi Postal: <b>${t.features[0].properties.codi_postal}</b><br>`).addTo(e)}),e.on("mouseleave","punts2",function(t){e.getCanvas().style.cursor="",i.remove()}))}function T(){e=new maplibregl.Map({container:"map",style:"https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json",center:[2.0042,41.7747],zoom:7,maxZoom:18,attributionControl:!1,hash:!1}),e.on("load",function(){b().then(function(){L()}),e.addControl(new maplibregl.NavigationControl,"top-right");var o=new maplibregl.FullscreenControl;e.addControl(o,"top-right"),e.addControl(new maplibregl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!1}),"top-right"),e.on("click",function(a){let r=a.lngLat.lng,i=a.lngLat.lat;x(i,r,E),g?(g.remove(),g=new maplibregl.Marker({color:"#FF6E42"}).setLngLat([r,i]).addTo(e)):g=new maplibregl.Marker({color:"#FF6E42"}).setLngLat([r,i]).addTo(e)})})}function _(){document.getElementById("loader").style.display="block",document.getElementById("infoPanelContent").style.display="none"}function $(){document.getElementById("loader").style.display="none",document.getElementById("infoPanelContent").style.display="block"}function S(){var o=document.getElementById("infoPanel");o.classList.add("open"),o.style.width="300px",document.getElementById("openPanel").style.display="none"}function j(){var o=document.getElementById("infoPanel");o.classList.remove("open"),o.style.width="0px",document.getElementById("openPanel").style.display="block"}function F(){T();const o=document.getElementById("textSelector");o.addEventListener("change",()=>{const a=o.value;I(a)})}window.addEventListener("DOMContentLoaded",F);window.closePanel=j;window.openPanel=S;window.onBaseChange=B;
