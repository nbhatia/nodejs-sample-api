/*
 *  App config
 */

var environments = {};

var httpsServerOptions = {
   'keyPath': './../https/key.pem',
   'certPath': './../https/cert.pem'
};

environments.production = {
  httpPort: 80,
  httpsPort: 443,
  defaultServer: 'https',
  https: httpsServerOptions
};

environments.staging = {
  httpPort: 8080,
  httpsPort: 5000,
  defaultServer: 'http',
  https: httpsServerOptions
};



var env = process.env.NODE_ENV;
env = typeof(env) == 'string' ? env:'';

module.exports = typeof(environments[env]) != 'undefined' ?
                        environments[env]:
                        environments.staging;
