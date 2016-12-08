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
			$.post({
				url: '/sendMail',
				method: 'POST',
				data: {nameExp: nameExp, mailExp: mailExp, id: idProfile, mailObj: mailObj, contentMail: contentMail}
			})
			.done(appContact.mailSent())
			.fail();
		},

		mailSent: function() {
			console.log("ajouter alert");
		}


	};

	appContact.init();


})();