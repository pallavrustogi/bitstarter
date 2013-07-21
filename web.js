var express = require('express');
var fs =require('fs');
var app = express.createServer(express.logger());
/*var buffer = new Buffer(30);

fs.readFileSync('index.html', function(err, buffer) {
        if(err) throw err;
    });*/

app.get('/', function(request, response) {
    var buf=fs.readFileSync('./index.html','utf8');
    response.send(buf.toString());
    });
app.get('/about.html', function(request, response){
	var buf=fs.readFileSync('./about.html','utf8');
	response.send(buf.toString());
	});
app.get('/contact.html', function(request, response){
	var buf=fs.readFileSync('./contact.html','utf8');
	response.send(buf.toString());
	});
app.get('/index.html', function(request, response){
	var buf=fs.readFileSync('./index.html','utf8');
	response.send(buf.toString());
	});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
