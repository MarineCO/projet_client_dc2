var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var fs = require('fs');

var app = express();
var sendMail = require('./mailGun.js');

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	res.send('index.html');
});

app.get('/data', function(req, res) {
	fs.readFile(__dirname + '/dataGeo.geojson', 'utf8', function(err, data){
		if (err) {
			throw err;
		}
		var dataMarrainage = JSON.parse(data);
		res.json(dataMarrainage);
	});
});

app.post('/sendMail', sendMail);

app.listen(2929, function(){
	console.log('Ca marche sur ce port')

});




