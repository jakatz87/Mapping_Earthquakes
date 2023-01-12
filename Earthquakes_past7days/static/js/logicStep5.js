// // Add GeoJSON data.
// let sanFranAirport =
// {"type":"FeatureCollection","features":[{
//     "type":"Feature",
//     "properties":{
//         "id":"3469",
//         "name":"San Francisco International Airport",
//         "city":"San Francisco",
//         "country":"United States",
//         "faa":"SFO",
//         "icao":"KSFO",
//         "alt":"14",
//         "tz-offset":"-8",
//         "dst":"A",
//         "tz":"America/Los_Angeles"},
//         "geometry":{
//             "type":"Point",
//             "coordinates":[-122.375,37.61899948120117]}}
// ]};

// // Grabbing our GeoJSON data.
// L.geoJSON(sanFranAirport, {
//     onEachFeature: function(feature, layer) {
//         console.log(layer);
//         layer.bindPopup("<h2>Airport code: "+layer.feature.properties.faa+"</h2><hr><h3>Airport name: "+layer.feature.properties.name+"</h3>");
//     }
// }).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let baseMaps= {
    "Streets": streets,
    "Satellite": satelliteStreets
};

// create overlay map variables to later include in the d3 and GeoJson sections
let earthquakes = new L.layerGroup();

// Give the overlay map a checkmark option title
let overlays = {
    Earthquakes : earthquakes
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})
// Pass our map layers into our layers control and add the layers control to the map. The overlay map is the second element
L.control.layers(baseMaps, overlays, {
    collapsed: false
}).addTo(map);

// Accessing the airport GeoJSON URL
let quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a function to style the circle Markers
function styleInfo (feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
    function getRadius (magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    };
    function getColor (magnitude) {
        if (magnitude > 5) {
            return "#ea2c2c";
        }
        if (magnitude >4) {
            return "#ea822c";
        }
        if (magnitude >3) {
            return "#ee9c00";
        }
        if (magnitude >2) {
            return "#eecc00";
        }
        if (magnitude >1) {
            return "#d4ee00";
        }
        return "#98ee00";
    };
}
// Grabbing our GeoJSON data.
d3.json(quakes).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    // Change the marker to a circle marker
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    // in the d3, use the styleInfo function for the style
    style: styleInfo,
    // Create the Popup with another function inside the d3
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
    // Reference the overlay map variables from above
  }).addTo(earthquakes);
    earthquakes.addTo(map);
    // Create the map legend
    let legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function () {
        let div = L.DomUtil.create ("div", "info legend");
        const magnitudes = [0,1,2,3,4,5];
        const colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];
        for (var i=0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
            "<i style = 'background: " + colors[i] + "'></i> " +
            magnitudes[i] + (magnitudes[i+1] ? "&ndash;" + magnitudes[i+1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(map);
});

    // {
    //     style: myStyle,
    //     // Add the pop up markers
    //     onEachFeature: function(feature, layer) {
    //         layer.bindPopup("<h2>Airline: "+feature.properties.airline+"</h2><hr><h3>Destination: "+feature.properties.dst+"</h3>");
    //         }
    //   })