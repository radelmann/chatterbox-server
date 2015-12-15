/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var fs = require('fs');

var data = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  //console.log("request method " + request.method);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  var urlObj = url.parse(request.url, true);

  if (urlObj.pathname === '/messages') {
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
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;