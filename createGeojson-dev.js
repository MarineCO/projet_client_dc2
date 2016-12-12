var fs = require('fs');
var axios = require('axios');
var Promise = require('promise');

module.exports = function(req, res) {

	var app = {

		dataJsonDC1: null,
		
		objectGeojson: {
			type: "FeatureCollection",
			features: []
		},

		counter: 0,

		counterMax: null,

		init: function() {
			app.readJsonDC1();
		},

		readJsonDC1: function() {
			fs.readFile(__dirname + '/dataMarrainage.json', 'utf8', function(err, data){
				if (err) {
					throw err;
				}
				app.dataJsonDC1 = JSON.parse(data);
				app.createFeatures();
			})
		},

		createFeatures: function() {
			var len = app.dataJsonDC1.marrainage.length;
			for (var i = 0; i < len; i++) {
				var feature = {
					type: "Feature",
					geometry: { type: "Point", coordinates: [] },
					properties: app.dataJsonDC1.marrainage[i]
				}
				app.objectGeojson.features.push(feature)
				app.counterMax = app.objectGeojson.features.length;
			}
			app.addCoord();
			app.deleteEmails();
		},

		deleteEmails: function() {
			app.objectGeojson.features.map(function(current) {
				delete current.properties.email;
			})
		},

		addCoord: function() {
			app.objectGeojson.features.map(function(current) {
				var cityName = current.properties.ville;
				var urlCoord = "http://nominatim.openstreetmap.org/search.php?q=" + cityName + "&format=json";
				axios.get(urlCoord)
				.then(function(response){
					console.log(response.data[0])
					var lat = response.data[0].lat;
					var lon = response.data[0].lon;
					var coordinates = [lon, lat];
					current.geometry.coordinates = coordinates;
					app.counter++;
					if(app.counter === app.counterMax) {
						app.sendJson();
					}
				})
				.catch(function(error) {
					console.log(error);
				})
			});
		},

		sendJson: function() {
			var stringGeojson = JSON.stringify(app.objectGeojson);
			fs.writeFile('dataGeojson.geojson', stringGeojson, 'utf8', function(err) {
				if (err) {
					console.log(err);
				}
			})
		}

	}

	app.init();

};
