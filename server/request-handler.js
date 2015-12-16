var url = require('url');
var fs = require('fs');
var redis = require('redis');
var client = redis.createClient();

var key = 'data';

module.exports = function(request, response) {
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  var urlObj = url.parse(request.url, true);

  if (request.method === 'GET') {

    // fs.readFile('dataFile.json', 'utf8', function(err, data) {
    //   if (err) throw err;

    //   response.writeHead(statusCode, headers);
    //   response.end(data);

    //   return;
    // });

    client.get(key, function(err, reply) {

      var data = JSON.parse(reply);

      var responseObj = {
        results: data
      };
      
      headers['Content-Type'] = "application/json";

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(responseObj));
    })
  }

  if (request.method === 'POST') {
    var messageData;
    var reqData = '';

    request.on('data', function(data) {
      reqData += data;
    });

    request.on('end', function() {
      response.writeHead(statusCode, headers);

      var responseObj = {
        statusCode: 201,
        success: 'updated successfully'
      }

      response.end(JSON.stringify(responseObj));

      //get data file and load into memory
      //read file

      var _data = JSON.parse(reqData);

      // fs.readFile('dataFile.json', 'utf8', function(err, data) {
      //   if (err) throw err;
      //   messageData = JSON.parse(data);
      //   messageData.results.push(_data);

      //   var strMessageData = JSON.stringify(messageData);

      //   fs.writeFile('dataFile.json', strMessageData, function(err) {
      //     if (err) throw err;
      //     //success
      //   });
      // });

      client.get(key, function(err, reply) {
        var data;
        if (!reply) {
          data = [];
        } else {
          data = JSON.parse(reply);
        }
        data.push(JSON.parse(reqData));
        console.log(data);
        client.set(key, JSON.stringify(data));
      })
    });
  }

  if (request.method === 'OPTIONS') {
    statusCode = 200;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end();
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};