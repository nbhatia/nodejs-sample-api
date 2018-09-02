/*
 * Route Handlers
 */

router = {
  'hello': handle_hello,
}

function handle_hello(data, callback) {
  console.log('handling hello request');
  var name = typeof(data.query.name) != 'undefined' ? data.query.name:'friend';
  var resp = {
    welcomeMsg : 'Hello '+name+'!!, Welcome to the Masterclass..'
  };
  callback(200, resp);
}

module.exports = router;
