var xml2js = require('xml2js');
var fs = require('fs');
var request = require('request');

var url = "http://api.sportsdatallc.org/nhl-test3/games/9a6e608f-d48b-491d-b790-eb06e1f0247b/pbp.xml?api_key=bvzyx3z2w7wnf27s9yfeyk8x";

function readfile()
{
	parser = new xml2js.Parser();
	
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		parser.parseString(body, function (err, result) {
		console.dir(result.game.period[0]);
		});
		};
	
	
	/*fs.readFile( url, function(err, data) { 	
		parser.parseString(data, function (err, result) {
		console.dir(result.game.period[0]);
	    });*/
	});
}


readfile();
