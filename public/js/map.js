(function() {

	'use strict';

	var app = {

		map: new L.Map('map',{scrollWheelZoom:false} ),

		dataMarrainage: null,

		init: function() {
			this.initmap();
			this.textHoverCommentFaire();
			this.smoothScrolls();
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

		smoothScrolls: function(){

			$('.smoothconcept').on('click', function() {
				var page = $(this).attr('href');
				var speed = 750;
				$('html, body').animate( { scrollTop: $(page).offset().top - 40}, speed ); 
				return false;
			});


			$('.smoothJoinUs').on('click', function() {
				var page = $(this).attr('href');
				var speed = 750;
				$('html, body').animate( { scrollTop: $(page).offset().top }, speed ); 
				return false;
			});


			$('.smoothCarte').on('click', function() {
				var page = $(this).attr('href');
				var speed = 750;
				$('html, body').animate( { scrollTop: $(page).offset().top - 60}, speed ); 
				return false;
			});

			$('.smoothHeader').on('click', function() {
				var page = $(this).attr('href');
				var speed = 750;
				$('html, body').animate( { scrollTop: $(page).offset().top }, speed ); 
				return false;
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

			this.addMarkers();
		},

		addMarkers: function() {

			$.getJSON("/data",function(data){

				var filleuleIcon = L.icon({
					iconUrl: 'img/filleule.png',
					iconSize: [40,55]
				});

				var marraineIcon = L.icon({
					iconUrl: 'img/marraine.png',
					iconSize: [40,55]
				});

				var duchesses = L.geoJson(data,{
					pointToLayer: function(feature,latlng){
						app.dataMarrainage = data.features;
						if (feature.properties.status === "filleule") {
							var marker = L.marker(latlng,{icon: filleuleIcon});
						} else {
							var marker = L.marker(latlng,{icon: marraineIcon});
						}
						
						//Mustache
						var popUpTemplate = $('#templatePopUpProfile').html();
						var htmlProfile = Mustache.to_html(popUpTemplate, feature.properties);
						marker.bindPopup(htmlProfile);

						$(marker).on('click', function(e) {
							var dataStorage = {
								id: e.currentTarget.feature.properties.id,
								prenom: e.currentTarget.feature.properties.prenom,
								nom: e.currentTarget.feature.properties.nom
							}
							var dataStorage_json = JSON.stringify(dataStorage);
							sessionStorage.setItem("dataStorage", dataStorage_json);
						});
						return marker;
					}
				});

				var clusters = L.markerClusterGroup();
				clusters.addLayer(duchesses);
				app.map.addLayer(clusters);
			});
		},
		//A LIER AVEC CONTACT.JS
		mailSent: function() {
			$('.essai').html('<div class="message">' + '<p>' + 'Votre message est bien parti !' + '</p>' + '</div>');
			$('.message').css(backgroundColor, 'blue');
		}

	}

	$(document).ready(function() {
		app.init();
	});
})();

