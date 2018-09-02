/*
 * Main Application file.
 */

const server = require('./lib/server')
const config = require('./lib/config.js')


if (['http', 'https'].indexOf(config.defaultServer) == -1) {
  console.log('ERROR: Service init failed - invalid config');
  return -1;
}

var port = (config.defaultServer == 'http') ?
            config.httpPort :
            config.httpsPort;

var serverOptions = {
   'keyPath': config.https.keyPath,
   'certPath': config.https.certPath
};

console.log('Starting the App..');
server.init(config.defaultServer, serverOptions, port);
