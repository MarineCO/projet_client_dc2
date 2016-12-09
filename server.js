var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var fs = require('fs');

var app = express();
var getData = require('./getDataJson.js');
var sendMail = require('./mailGun.js');

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res){
	res.send('index.html');
});

app.get('/data', getData);

app.post('/sendMail', sendMail);

app.listen(2929, function(){
	console.log('Ca marche sur ce port')
});

function redirect(){
	$('a #home').click()
		res.send('/');
	
}