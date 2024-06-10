(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}})();var t,f;let v="all",u;const b=5,L=150;async function E(){const n=document.getElementById("serveiSelector2").value;let r=null;if(t.getLayer("clicked-layer")){const e=t.getSource("clicked-layer");e&&e._data&&(r=e._data)}let s;n==="orto"?s="https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json":n==="topo"?s="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard_general.json":n==="fosc"&&(s="https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json"),t.setStyle(s),t.once("styledata",()=>{r&&(t.getSource("clicked-layer")||t.addSource("clicked-layer",{type:"geojson",data:r}),t.getLayer("clicked-layer")||t.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":"#fee899","fill-opacity":.7}},"water-name-lakeline-z12"))})}async function C(a,n,r){t.getLayer("clicked-layer")&&t.removeLayer("clicked-layer"),t.getSource("clicked-layer")&&t.removeSource("clicked-layer"),h(),B();const e=await(await fetch(`https://api.icgc.cat/territori/${r}/geo/${n}/${a}`)).json();u=e[0].features;const o=document.getElementById("infoPanelContent");o.innerHTML="";let l=[],p=null,d=null;if(e[0].features.length<4)document.getElementById("infoPanelContent").innerHTML="No hi ha dades sobre el punt seleccionat.";else{for(let i=0;i<e[0].features.length;i++)l.push(e[0].features[i].id),e[0].features[i].id==="Geocodificador"?p=e[0].features[i].properties:e[0].features[i].id==="Elevació"&&(console.log("ev",e[0].features[i]),d=e[0].features[i].properties.value);p&&(o.innerHTML+=`<b>Adreça: </b> ${p.etiqueta} <br>`),d&&(o.innerHTML+=`<b>Coordenades: </b> ${a.toFixed(4)}, ${n.toFixed(4)} <br>`,o.innerHTML+=`<b>Elevació: </b> ${d} metres<br><br>`);for(let i=0;i<l.length;i++)if(l[i]!=="Geocodificador"&&l[i]!=="Elevació"&&l[i]!=="H3 geospatial indexing system"){const y=l[i],c=document.createElement("button");c.textContent=y,c.classList.add("myButtonClass"),c.addEventListener("click",()=>{w(y,c)}),o.appendChild(c),o.appendChild(document.createElement("br"))}}S()}function w(a,n){t.getLayer("clicked-layer")&&t.removeLayer("clicked-layer"),t.getSource("clicked-layer")&&t.removeSource("clicked-layer");let r=new maplibregl.LngLatBounds;for(let o=0;o<u.length;o++)if(a===u[o].id){t.addSource("clicked-layer",{type:"geojson",data:{type:"Feature",geometry:u[o].geometry,properties:{}}}),t.addLayer({id:"clicked-layer",type:"fill",source:"clicked-layer",layout:{},paint:{"fill-color":"#fee899","fill-opacity":.7}},"water-name-lakeline-z12");const l=u[o].geometry;l.type==="Polygon"?l.coordinates[0].forEach(c=>{r.extend(c)}):l.type==="MultiPolygon"&&l.coordinates.forEach(c=>{c[0].forEach(g=>{r.extend(g)})}),document.querySelectorAll(".layer-properties").forEach(c=>c.remove());const d=document.createElement("div");d.classList.add("layer-properties");const i=u[o].properties;for(const[c,g]of Object.entries(i)){const m=document.createElement("div");m.textContent=`${c}: ${g}`,d.appendChild(m)}n.parentNode.insertBefore(d,n.nextSibling),document.querySelectorAll(".myButtonClass").forEach(c=>c.classList.remove("highlighted-button")),n.classList.add("highlighted-button")}const e=window.innerWidth<750?b:L;t.fitBounds(r,{padding:e})}async function k(a){const r=await(await fetch(`https://api.icgc.cat/territori/adress/${a}`)).json();r.features?(t.getLayer("punts2")?(t.removeLayer("punts2").removeSource("punts2"),t.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),t.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})):(t.addSource("punts2",{type:"geojson",data:{type:"FeatureCollection",features:r.features}}),t.addLayer({id:"punts2",type:"circle",source:"punts2",paint:{"circle-color":"red","circle-opacity":.8,"circle-radius":6}})),t.flyTo({center:[r.features[0].geometry.coordinates[0],r.features[0].geometry.coordinates[1]],zoom:11,essential:!0})):alert(r);const s=new maplibregl.Popup({closeButton:!1,closeOnClick:!1});t.getLayer("punts2")&&(t.on("mouseenter","punts2",function(e){t.getCanvas().style.cursor="pointer",s.setLngLat(e.features[0].geometry.coordinates).setHTML(`Adreça: <b>${e.features[0].properties.etiqueta}</b><br>
      Carrer: <b>${e.features[0].properties.street}</b><br>
      Municipi: <b>${e.features[0].properties.mun}</b><br>
      Codi Postal: <b>${e.features[0].properties.postalcode}</b><br>`).addTo(t)}),t.on("mouseleave","punts2",function(e){t.getCanvas().style.cursor="",s.remove()}))}function P(){t=new maplibregl.Map({container:"map",style:"https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_fosc.json",center:[2.0042,41.7747],zoom:7,attributionControl:!1,hash:!1}),t.addControl(new maplibregl.NavigationControl,"top-right");var a=new maplibregl.FullscreenControl;t.addControl(a,"top-right"),t.on("click",function(n){let r=n.lngLat.lng,s=n.lngLat.lat;C(s,r,v),f?(f.remove(),f=new maplibregl.Marker({color:"#FF6E42"}).setLngLat([r,s]).addTo(t)):f=new maplibregl.Marker({color:"#FF6E42"}).setLngLat([r,s]).addTo(t)})}function B(){document.getElementById("loader").style.display="block",document.getElementById("infoPanelContent").style.display="none"}function S(){document.getElementById("loader").style.display="none",document.getElementById("infoPanelContent").style.display="block"}function h(){var a=document.getElementById("infoPanel");a.classList.add("open"),a.style.width="300px",document.getElementById("openPanel").style.display="none"}function x(){var a=document.getElementById("infoPanel");a.classList.remove("open"),a.style.width="0px",document.getElementById("openPanel").style.display="block"}function I(){P();const a=document.getElementById("textSelector");a.addEventListener("change",()=>{const n=a.value;k(n)})}window.addEventListener("DOMContentLoaded",I);window.closePanel=x;window.openPanel=h;window.onBaseChange=E;
