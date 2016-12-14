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

		geo: [
		{ville: "toulouse",
		coord: [1, 1]},
		{ville: "angers",
		coord: [2, 2]}
		],

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
			}
			app.setInitialCounterMax();
			app.deleteEmails();
		},

		setInitialCounterMax: function() {
			app.counterMax = app.objectGeojson.features.length;
			console.log("max = " + app.counterMax);
			app.checkCityInArray();
		},

		deleteEmails: function() {
			app.objectGeojson.features.map(function(current) {
				delete current.properties.email;
			})
		},

		checkCityInArray: function() {
			var current = app.objectGeojson.features[app.counter];
			var cityName = current.properties.ville;
			var cityLow = cityName.toString().toLowerCase();
			var coordinates = false;
			
			var len = app.geo.length;
			for (var i = 0; i < len; i++) {
				if (cityLow === app.geo[i].ville) {
					coordinates = app.geo[i].coord;
				}
			};
			
			app.resultCityInArray(coordinates);
		},

		resultCityInArray: function(coord) {
			var current = app.objectGeojson.features[app.counter];
			if (coord) {
				console.log("les mêmes = " + coord);
				current.geometry.coordinates = coord;
				app.counter++;
				app.nextFeatureOrStop();
			} else {
				console.log("pas les mêmes = " + coord);
				app.lookForCoord()
			}
		},

		lookForCoord: function() {
			var current = app.objectGeojson.features[app.counter];
			var cityName = current.properties.ville;
			var urlCoord = "http://nominatim.openstreetmap.org/search.php?q=" + cityName + "&format=json";
			axios.get(urlCoord)
			.then(function(response){
				if (response.data[0] !== undefined) {
					app.coordFound(response);
				} else {
					app.coordNotFound();
				}
			})
			.catch(function(error) {
				console.log(error);
				app.coordNotFound();
			})
		},

		coordFound: function(response) {
			var current = app.objectGeojson.features[app.counter];
			var lat = response.data[0].lat;
			var lon = response.data[0].lon;
			var coordinates = [lon, lat];
			current.geometry.coordinates = coordinates;
			app.counter++;
			app.nextFeatureOrStop();
		},
		
		coordNotFound: function() {
			var current = app.objectGeojson.features[app.counter];
			var cityNotFoundMessage = "La " + current.properties.status + " " + current.properties.prenom + " " + current.properties.nom + 
			" dont l'id est : '" + current.properties.id + "' et pour laquelle la ville indiquée dans le json est :'" + current.properties.ville + 
			"' ne peut pas être localisée. Elle n'apparaît donc pas dans le fichier Geojson, ni sur la carte du site. Merci de modifier l'information concernant la ville directement au niveau du GoogleSheet lié."						
			console.log(cityNotFoundMessage);
			app.eraseFeature();
		},

		eraseFeature: function() {
			var current = app.objectGeojson.features[app.counter];
			var indexCurrent = app.objectGeojson.features.indexOf(current);
			app.objectGeojson.features.splice(indexCurrent, 1);
			app.counterMax--;
			console.log("new counterMax = " + app.counterMax);
			app.nextFeatureOrStop();
		},

		nextFeatureOrStop: function() {
			console.log(app.counter);
			if (app.counter === app.counterMax) {
				app.sendJson();
			} else {
				console.log("restart");
				setTimeout(app.checkCityInArray, 1200);	
			}
		},
		
		sendJson: function() {
			//res.json(app.objectGeojson);
			console.log("stop");
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
