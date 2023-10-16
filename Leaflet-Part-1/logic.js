let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
});

d3.json(queryUrl).then(function (data) {
  console.log(data);
  createFeatures(data.features);

function chooseColor(depth){
  if (depth < 10) {
    return "#008000";
    } else if (depth < 30) {
        return "#adff2f";
    } else if (depth < 50) {
        return "#ffff00";
    } else if (depth < 70) {
        return "#ffa500";
    } else if (depth < 90) {
        return "#ff4500";
    } else { return "#ff0000";}
}

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

      let markers = {
        radius: feature.properties.mag * 10000,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 1
      }
      return L.circle(latlng,markers);
    }
  }).addTo(myMap);


}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    depth = [-10, 10, 30, 50, 70, 90];
    labels = [];
    for (var i = 0; i < depth.length; i++) {
      labels.push(
        '<i style="background:' + chooseColor(depth[i]) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
      }
      div.innerHTML += labels.join("");
    return div;
  };

  legend.addTo(myMap);
});