var fs = require('fs');
var config = require('./config.js');

module.exports = function(req, res) {
	var api_key = config.api_key;
	var domain = config.domain;
	var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
	var content = req.body

	fs.readFile(__dirname + config.route_acces_json, 'utf8', function(err, data){
		if (err) {
			throw err;
		}
		var dataMarrainage = JSON.parse(data);
		var len = dataMarrainage.marrainage.length;
		console.log(content.id);

		for (var i = 0; i < len; i++) {
			if (dataMarrainage.marrainage[i].id === content.id) {
				var data = {
					from: content.nameExp + ' <' + content.mailExp + '>',
					to: dataMarrainage.marrainage[i].email,
					bcc: content.mailExp,
					subject: content.mailObj,
					text: content.contentMail
				};
				console.log(dataMarrainage.marrainage[i].email);
			};
		}
		mailgun.messages().send(data, function (error, body) {
			console.log(error);
			console.log(body);
			res.send('contact.js');
		});
	});
}; 