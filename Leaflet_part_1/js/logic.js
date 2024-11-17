var map = L.map('map').setView([19.8116, -77.0391], 2);


L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="https://opentopomap.org/copyright">OpenTopoMap</a> contributors'
}).addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('Magnitude: ' + feature.properties.mag + 
                                 '<br>Depth: ' + feature.geometry.coordinates[2] + ' km');
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getMagnitudeSize(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);
    });


var specificCoordinates = [
    { coords: [-77.0391, 19.8116, 14], mag: 5.0, depth: 14 },
    { coords: [153.3201, -4.7021, 51.891], mag: 6.5, depth: 51.891 }
];

specificCoordinates.forEach(function(location) {
    var latlng = [location.coords[1], location.coords[0]];
    L.circleMarker(latlng, {
        radius: getMagnitudeSize(location.mag),
        fillColor: getColor(location.depth),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('Specific Location<br>Magnitude: ' + location.mag + 
                             '<br>Depth: ' + location.depth + ' km');
});


function getMagnitudeSize(magnitude) {
    return magnitude * 4;
}


function getColor(depth) {
    return depth > 100 ? 'red' :
           depth > 50  ? 'yellow' :
           depth > 20  ? 'orange' :
                         'green';
}


var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 20, 50, 100],
        labels = [];
        div.innerHTML += '<h4>Depth (km)</h4>';
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(map);