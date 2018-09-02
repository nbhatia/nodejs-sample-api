/*
 * Main file
 */

// dependencies
const http          = require('http');
const https         = require('https');
const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const routers       = require('./routers')
const fs            = require('fs');
const path          = require('path');
/*
const url           = require('url');
const config        = require('./config');
*/

var server = {};
//server.server = {};

server.init = function(serverType, serverOptions, port) {
  if (typeof(serverType) == 'string' && ['http', 'https'].indexOf(serverType) > -1) {
    if (serverType == 'http') {
      server.server = http.createServer(function (req, res) {
        server.handleReq(req, res);
      });
    } else { //https
      var httpsServerOptions = {};
      try {
        httpsServerOptions = {
          'key': fs.readFileSync(path.join(__dirname,serverOptions.keyPath)),
          'cert': fs.readFileSync(path.join(__dirname,serverOptions.certPath))
        };
      } catch(e) {
        console.log('failed to init https: '+e.message);
        return;
      };

      server.server = https.createServer(httpsServerOptions, function (req, res) {
        server.handleReq(req, res);
      });
    }
  }
  else {
    console.log('don\'t know how to start '+serverType+' server');
    return;
  }

  if (typeof(server.server) != 'undefined') {
       var serverToInit = server.server;
       serverToInit.listen(port, function () {
         console.log(serverType +' server started on port: '+port)
       });
     } else {
       console.log('INIT failed: invalid server type');
     }
};

server.handleReq = function (req, res) {
  var decoder = new StringDecoder('utf-8');
  var parsedUrl = url.parse(req.url, true);

  var input = {
    'parsedUrl' : parsedUrl,
    'path'      : parsedUrl.pathname,
    'query'     : parsedUrl.query,
    'method'    : req.method,
    'headers'   : req.headers
  }

  req.on('data', function (data) {
    req.payload += decoder.write(data);
  });

  req.on('end', function () {
    // handle the reqest for the given uri
    var trimmedPath = input.path.replace(/^\/+|\/+$/g, '');
    var handler = typeof(routers[trimmedPath]) != 'undefined' ? routers[trimmedPath]:handleNotFound;

    handler(input, function(statusCode, payload) {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        payload = typeof(payload) == 'object' ? payload : {};
        resStr = JSON.stringify(payload);

        res.setHeader('content-type', 'application/json')
        res.writeHead(statusCode);
        res.end(resStr);
        console.log('Request handled..!!');
    });
    function handleNotFound(input, callback) {
      callback(false, 'nothing to handle')
    }

  });
};

module.exports = server;
