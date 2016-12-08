(function() {

	var appContact = {
		type : null,

		init: function() {
			this.listeners();
			$('.prenom').html("bla");
			$('.nom').html("blabla");
		},

		listeners: function() {
			$('#btnSendMail').on('click', this.getMailData);
			$(".confirm-class").on("click", this.returnToHome);
		},

		getMailData: function() {
			var idProfile = localStorage.getItem("idProfile");
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
			.fail(appContact.mailNosent);
		},

		mailSent: function() {
			console.log("ajouter alert");
			swal(
				'Super',
				'Votre message a bien été envoyé !'
				)
		},
		mailNoSent : function(){
			swal(
				'Oh je crois que nous avons un souci'
				)
		},
		returnToHome : function(){
			console.log('ça ramène à la home');
		}



	}; 

	appContact.init();


})();