(function() {

	var appContact = {

		dataProfile: null,

		init: function() {
			var dataStorage_json = sessionStorage.getItem("dataStorage");
			var dataStorage = JSON.parse(dataStorage_json);
			appContact.dataProfile = dataStorage;
			$('.prenom').html(appContact.dataProfile.prenom);
			$('.nom').html(appContact.dataProfile.nom);
			this.listeners();
			appContact.toHide();
		},

		listeners: function() {
			$('#btnSendMail').on('click', this.getMailData);

		},

		getMailData: function() {
			var idProfile = appContact.dataProfile.id;
			console.log(idProfile);
			var nameExp = $('#nameExp').val();
			var mailExp = $('#mailExp').val();
			var mailObj = $('#mailObj').val();
			var contentMail = $('#contentMail').val();

			if($.trim(mailExp).length == 0 || nameExp == "" || mailObj == "" || contentMail == "") {
				$('.error').html('<p>' + 'Vous n\'avez pas rempli tous les champs' + '</p>')
				$('#hide').show();
				event.preventDefault();
			}
			else if (!appContact.validateEmail(mailExp)) {
				$('.error').html('<p>' + 'Votre mail n\'est pas valide'+ '</p>')
				$('#hide').show();
			}
			else {
				appContact.reset();
				$.post({
					url: '/sendMail',
					method: 'POST',
					data: {nameExp: nameExp, mailExp: mailExp, id: idProfile, mailObj: mailObj, contentMail: contentMail}
				})
				.done(appContact.mailSent())
				.fail(appContact.mailNoSent());
			}
		},

		validateEmail: function(mailExp) {
			var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
			if (filter.test(mailExp)) {
				return true;
			}
			else {
				return false;
			}
		},

		mailSent: function() {
			$('#hide').show();
			$('.success').html('<p>' + 'Votre message est bien parti !' + '</p>' + '<a href="/" id="home" class="ui red inverted button joinBtn">' + 'Retour' + '</a>');
		},

		mailNoSent: function() {
			console.log('mail non envoyé');
		},

		toHide : function(){
			$('#hide').hide();
		},

		reset: function() {
			$('#error').html('');
		}
	};

	appContact.init();

})();