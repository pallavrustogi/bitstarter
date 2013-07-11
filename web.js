var express = require('express');
var fs =require('fs');
var app = express.createServer(express.logger());
var buffer = new Buffer(30);
fs.readFile('index.html', function(err, data) {
        if(err) throw err;
    buffer.write(data,"utf-8");});

app.get('/', function(request, response) {
    response.send(buffer.toString);
    });

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
