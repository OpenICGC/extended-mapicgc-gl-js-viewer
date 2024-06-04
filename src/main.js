import { Map, Config } from "mapicgc-gl-js";
//import * as mapicgcgl from  "mapicgc-gl-js";
let ortoOpacity = 1;

let oldOrto = null;

async function initMap() {
  try {
    const data = await Config.getConfigICGC();
    const map = new Map({
      container: "map",
      style: data.Styles.ORTO,
      center: [1.808, 41.618],
      zoom: 10,
      maxZoom: 19,
      hash: true,
      pitch: 0,
    });

    map.on("load", () => {
      map.addGeocoderICGC();

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
      map.addMouseCoordControl(["bottom-right"]);

      let basemapsicgc = [
        data.Styles.ORTO,
        data.Styles.TOPO,
        data.Styles.DARK,
        data.Styles.GEOLOGY,
      ];
      map.addBasemapsICGC(basemapsicgc);

      const baseMapItems = document.getElementsByClassName("basemap-item");
      Array.from(baseMapItems).forEach((item) => {
        item.addEventListener("click", basemapSelect);
      });

      function basemapSelect() {
        if (oldOrto) {
          setTimeout(() => {
            map.addImageLayerICGC(menuItems[oldOrto], `ortoexample${oldOrto}`, {
              type: "raster",
              layout: {
                visibility: "visible",
              },
              paint: {
                "raster-opacity": ortoOpacity,
              },
              layerPosition: "labels",
            });
          }, 2000);
        }
      }
      const menuItems = data.Layers.Orto;

      const menuSelect = document.getElementById("menuSelect");

      for (const key in menuItems) {
        if (menuItems.hasOwnProperty(key)) {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = key;
          menuSelect.appendChild(option);
        }
      }

      menuSelect.addEventListener("change", (event) => {
        const layers = map.getStyle().layers;
        layers.forEach((layer) => {
          if (layer.id.startsWith("ortoexample")) {
            map.removeLayer(layer.id);

            if (map.getSource(layer.id)) {
              map.removeSource(layer.id);
            }
          }
        });
        const selectedValue = event.target.value;
        if (selectedValue) {
          console.log("ooooo", ortoOpacity);
          map.addImageLayerICGC(
            menuItems[selectedValue],
            `ortoexample${selectedValue}`,
            {
              type: "raster",
              layout: {
                visibility: "visible",
              },
              paint: {
                "raster-opacity": ortoOpacity,
              },
              layerPosition: "labels",
            }
          );

          oldOrto = selectedValue;
        }
      });

      var slider = document.getElementById("myRange");

      slider.oninput = function () {
        if (oldOrto) {
          try {
            let op = parseInt(this.value) / 100;
            map.setPaintProperty(`ortoexample${oldOrto}`, "raster-opacity", op);

            ortoOpacity = op;
          } catch (error) {}
        }
      };
    });
  } catch (err) {
    console.error(err);
  }
}

initMap();
