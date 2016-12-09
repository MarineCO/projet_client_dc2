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
			this.textHoverCommentFaire();
		},

		textHoverCommentFaire: function() {
			$('.filleule1').hover(function() {
				$('.divFilleule').html("<h4>1. Je crée mon profil</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>");
			});
			$('.filleule2').hover(function() {
				$('.divFilleule').html("<h4>2. Je m'inscris sur Facebook</h4><p>Voluptate aperiam, tempora nemo dicta debitis dignissimos, velit ullam maxime nobis.</p>");
			});
			$('.filleule3').hover(function() {
				$('.divFilleule').html("<h4>3. Je contacte une marraine</h4><p>Consequatur, maxime doloremque quos nihil, possimus et accusamus autem blanditiis laboriosam!</p>");
			});
			$('.marraine1').hover(function() {
				$('.divMarraine').html("<h4>1. Je crée mon profil</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>");
			});
			$('.marraine2').hover(function() {
				$('.divMarraine').html("<h4>2. Je m'inscris sur Facebook</h4><p>Voluptate aperiam, tempora nemo dicta debitis dignissimos, velit ullam maxime nobis.</p>");
			});
			$('.marraine3').hover(function() {
				$('.divMarraine').html("<h4>3. Je contacte une filleule</h4><p>Consequatur, maxime doloremque quos nihil, possimus et accusamus autem blanditiis laboriosam!</p>");
			});
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

