var fs = require('fs');
var axios = require('axios');

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
				app.counterMax = app.objectGeojson.features.length - 1;
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
			var current = app.objectGeojson.features[app.counter];
			var cityName = current.properties.ville;
			var urlCoord = "http://nominatim.openstreetmap.org/search.php?q=" + cityName + "&format=json";
			axios.get(urlCoord)
			.then(function(response){
				if (response.data[0] === undefined) {
					app.coordNotFound();
				} else {
					app.coordFound(response);
				}
			})
			.catch(function(error) {
				console.log(error);
			})
		},

		coordNotFound: function() {
			var current = app.objectGeojson.features[app.counter];
			var cityNotFoundMessage = "La " + current.properties.status + " " + current.properties.prenom + " " + current.properties.nom + 
			" dont l'id est : '" + current.properties.id + "' et pour laquelle la ville indiquée dans le json est :'" + current.properties.ville + 
			"' ne peut pas être localisée. Elle n'apparaît donc pas dans le fichier Geojson, ni sur la carte du site. Merci de modifier l'information concernant la ville directement au niveau du GoogleSheet lié."						
			console.log(cityNotFoundMessage);
			// Effacer le profil de l'objet pour geojson
			var indexCurrent = app.objectGeojson.features.indexOf(current);
			app.objectGeojson.features.splice(indexCurrent, 1);
			if (app.counter === app.counterMax) {
				app.sendJson();
			} else {
				setTimeout(app.addCoord, 1200);	
			}
		},

		coordFound: function(response) {
			var current = app.objectGeojson.features[app.counter];
			var lat = response.data[0].lat;
			var lon = response.data[0].lon;
			var coordinates = [lon, lat];
			current.geometry.coordinates = coordinates;
			app.counter++;
			console.log(app.counter);
			if(app.counter === app.counterMax) {
				app.sendJson();
			} else {
				setTimeout(app.addCoord, 1200);	
			}
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
