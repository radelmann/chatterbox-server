  /* Import node's http module: */
var express = require('express');
var app = express();
var handleRequest = require('./request-handler.js');

//var http = require("http");

// route all root dir requests to 
// ../client/client/
app.use('/', express.static('../client/client/'));

app.get('/messages', handleRequest);

app.post('/messages', handleRequest);

var port = 3000;

var ip = "127.0.0.1";

console.log("Listening on http://" + ip + ":" + port);
app.listen(port, ip);