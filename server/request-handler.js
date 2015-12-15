var url = require('url');
var fs = require('fs');

var data = [];

module.exports = function(request, response) {
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  var urlObj = url.parse(request.url, true);

  if (request.method === 'GET') {

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);

    var returnObj = {
      results: data
    };

    response.end(JSON.stringify(returnObj));
    return;
  }

  if (request.method === 'POST') {
    var reqData = '';

    request.on('data', function(data) {
      reqData += data;
    });

    request.on('end', function() {
      var _data = JSON.parse(reqData);
      data.push(_data);

      console.log(_data);

      //read file
      fs.readFile('dataFile.json', function (err, data) {
        if (err) throw err;
        
        JSON.parse

      });
      //parse to js object

      //push _data to js object
      //stringify js object
      //write back to file


      response.writeHead(statusCode, headers);
      var responseObj = {
        statusCode: 201,
        success: 'updated successfully'
      }


      response.end(JSON.stringify(responseObj));
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