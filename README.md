## basic mapicgc-gl-js viewer

  * Basic mapicgc-gl-js viewer
  * Vanilla JS + Vite

### Mapicgc-gl-js documentation

  * https://openicgc.github.io/mapicgc-doc/

### To install

```bash
git clone https://github.com/OpenICGC/basic-mapicgc-gl-js-viewer-js.git

cd /basic-mapicgc-gl-js-viewer-js

npm install
npm run build
npm run serve

```



### Javascript

```javascript

import { Map, Config } from "mapicgc-gl-js";
//import * as mapicgcgl from  "mapicgc-gl-js";

async function initMap() {
  try {
    const data = await Config.getConfigICGC();
    const map = new Map({
      container: "map",
      style: data.Styles.LIGHT,
      center: [1.808, 41.618],
      zoom: 10,
      maxZoom: 19,
      hash: true,
      pitch: 0,
    });
    map.on("load", () => {
      //GEOCODER
      map.addGeocoderICGC();
      //CONTROLS
      map.addGeolocateControl(
        {
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        },
        "bottom-right"
      );
      map.addExportControl({}, "top-right");
      map.addFullscreenControl({}, "top-right");
      map.addTerrainICGC(data.Terrains.ICGC5M, "bottom-right");
    });
  } catch (err) {
    console.error(err);
  }
}

initMap();

```