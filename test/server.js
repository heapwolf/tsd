
var net = require('net');

var net = require('net');
var x = 10;
var client = net.connect({ port: 9099 }, function() {

  function write(json) {
    client.write(JSON.stringify(json) + '\n');
  }
  
  setInterval(function() {

    x += x;

    write({ key: 'hello',   value: Math.random() * x });
    write({ key: 'goodbye', value: Math.random() * x });
    write({ key: 'ohai', value: Math.random() * x });
    write({ key: 'neat-stuff', value: Math.random() * x });

  }, 150);

});
