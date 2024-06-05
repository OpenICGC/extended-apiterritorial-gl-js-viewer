## extended-apiterritorial-gl-js-viewer

  * Maplibre-gl-js viewer including some API Territorial features
  * Vanilla JS + Vite

### API Territorial documentation

  * https://github.com/OpenICGC/api-territorial-docs

### To install

```bash
git clone https://github.com/OpenICGC/extended-apiterritorial-gl-js-viewer.git

cd /extended-apiterritorial-gl-js-viewer

npm install
npm run dev - //development
npm run build - //build 4 production

```



### API Connection (main.js)

```javascript

let service = "all"; //you can choose specific services (comma separated)

 map.on("click", function (e) {
    let lon = e.lngLat.lng;
    let lat = e.lngLat.lat;
    apiConnect(lat, lon, service);
 });

async function apiConnect(lat, lon, service) {
  
  const response = await fetch(`https://api.icgc.cat/territori/${service}/geo/${lon}/${lat}`);
 
 const dades = await response.json();
 
 //Do anything with dades (geojson)
 

}

```