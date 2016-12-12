var fs = require('fs');


module.exports = function(req, res) {
	fs.readFile(__dirname + '/dataMarrainage.json', 'utf8', function(err, data){
		if (err) {
			throw err;
		}
		var dataMarrainage = JSON.parse(data);
		res.json(dataMarrainage);
	})
}; 

