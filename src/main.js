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
