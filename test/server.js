
var net = require('net');
var x = 0;

setTimeout(function() {

  //
  // start sending some silly metrics to the server.
  //
  //x += random()*9;
  x=x+10;

  var client = net.connect({ port: 9099 }, function() {
    
    setInterval(function() {

      client.write(JSON.stringify({ key: 'hello',   value: Math.random()*x }) + '\n' );
      client.write(JSON.stringify({ key: 'goodbye', value: Math.random()*x }) + '\n' );
      client.write(JSON.stringify({ key: 'ohai', value: Math.random()*x }) + '\n' );
      client.write(JSON.stringify({ key: 'neat-stuff', value: Math.random()*x }) + '\n' );

    }, 150);
  });

}, 1000);
