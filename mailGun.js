var fs = require('fs');
var config = require('./config.js');

module.exports = function(dataMail) {
	var api_key = config.api_key;
	var domain = config.domain;
	var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

	fs.readFile(__dirname + '/dataMarrainage.json', 'utf8', function(err, data){
		if (err) {
			throw err;
		}
		var dataMarrainage = JSON.parse(data);
		var len = dataMarrainage.marrainage.length;
		console.log(dataMail.body.id);
		for (var i = 0; i < len ;i++) {
			if (dataMarrainage.marrainage[i].id === dataMail.body.id) {
				var data = {
					from: dataMail.body.nameExp + ' <' + dataMail.body.mailExp + '>',
					to: dataMarrainage.marrainage[i].email,
					subject: dataMail.body.mailObj,
					text: dataMail.body.contentMail
				};
				console.log(dataMarrainage.marrainage[i].email);
			};
		}
		mailgun.messages().send(data, function (error, body) {
			console.log(body);
		});
	});
}; 