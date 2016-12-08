(function() {

	'use strict';

	var app = {

		map: new L.Map('map',{scrollWheelZoom:false}),

		marker: null,

		dataMarrainage: [],

		markers: L.markerClusterGroup(),

		init: function() {
			this.initmap();
			this.getDataCityMarrainage();
		},

		initmap: function() {
			var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
			var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 18, attribution: osmAttrib});

			app.map.setView(new L.LatLng(46, 2),6);
			app.map.addLayer(osm);
			
			app.map.on('focus', function() { 
				app.map.scrollWheelZoom.enable();
			});
			app.map.on('blur', function() {
				app.map.scrollWheelZoom.disable();
			});
		},

		getDataCityMarrainage: function() {
			$.ajax('/data')
			.done(this.ajaxDone)
			.fail(this.ajaxFail);
		},
		
		ajaxDone: function(response) {
			app.dataMarrainage = response.marrainage;

			for (var i= 0; i < app.dataMarrainage.length; i++) {
				var status = app.dataMarrainage[i].status;
				var cityName = app.dataMarrainage[i].ville;
				var idProfile = app.dataMarrainage[i].id;
				app.getDataCoord(cityName, status, idProfile);
			} 
		},

		ajaxFail: function() {
			console.log('erreur');
		},

		getDataCoord: function(cityName, status, idProfile) {
			var urlCoord = "http://nominatim.openstreetmap.org/search.php?q=" + cityName + "&format=json";
			var data = $.ajax(urlCoord)
			.done(function(data){
				app.createMarker(data, status, idProfile);
			})
			.fail(app.creatMarkerFail);
		},

		createMarker: function(data, status, idProfile) {
			var lat = data[0].lat;
			var lon = data[0].lon;

			var mapIcon = L.icon ({
				iconUrl: 'img/' + status +'.png',
				iconSize: [40, 55],
				className: idProfile
			});

			app.addMarker(lat, lon, mapIcon);

		}, 

		creatMarkerFail: function() {
			console.log('erreur ajout marker Marraine');
		},

		addMarker: function(lat, lon, statusIcon) {
			app.marker = L.marker([lat, lon], {icon: statusIcon})
			.addTo(app.map)
			app.markers.addLayer(app.marker);
			app.map.addLayer(app.markers);

			app.listenersMarkers();
		},

		listenersMarkers: function() {
			app.marker.on('click', function(e){
				var idOnClick = e.target.options.icon.options.className;
				var len = app.dataMarrainage.length;
				for (var i = 0; i < len; i++) {
					if (app.dataMarrainage[i].id === idOnClick) {
						var popUpTemplate = $('#templatePopUpProfile').html();
						var htmlProfile = Mustache.to_html(popUpTemplate, app.dataMarrainage[i]);
						app.marker.bindPopup(htmlProfile);
						var latlng = e.latlng;
						app.marker.openPopup(latlng);

						//sessionStorage
						var dataStorage = {
							id: idOnClick,
							prenom: app.dataMarrainage[i].prenom,
							nom: app.dataMarrainage[i].nom
						}
						var dataStorage_json = JSON.stringify(dataStorage);
						sessionStorage.setItem("dataStorage", dataStorage_json);
					}
				}
			});
		}
	}

	$(document).ready(function() {
		app.init();
	});
})();

