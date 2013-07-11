var express = require('express');
var fs =require('fs');
var app = express.createServer(express.logger());
var buffer;
fs.readFile('index.html', function(err, data) {
        if(err) throw err;
    buffer = new Buffer(data,"utf-8");});

app.get('/', function(request, response) {
    response.send(buffer.toString);
    });

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
