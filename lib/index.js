var http = require('http');
var net = require('net');
var url = require('url');
var fs = require('fs');
var createCache = require('levelup');
var path = require('path');

var es = require('event-stream');

var st = require('st')
var WebSocketServer = require('ws').Server;
var WebSocket = require('./websocket');

var staticHandler = st({
  path: path.join(__dirname, '..', 'public'),
  url: '/',
  index: 'index.html'
});

module.exports = function(ports) {

  ports = ports || {};

  ports.http = ports.http || 80;
  ports.tcp = ports.tcp || 9099;

  var location = path.join(__dirname, 'cache');

  createCache(location, { encoding: 'json' }, function(error, cache) {

    var tcpserver = net.createServer(function(socket) {

      socket
        .pipe(es.split())
        .pipe(es.parse())
        .pipe(cache.createWriteStream())
    });

    tcpserver.listen(ports.tcp, function() {
      console.log('tcp server listening on %d', ports.tcp);
    });

    var httpserver = http.createServer(staticHandler);
    var wss = new WebSocketServer({ 
      server: httpserver.listen(ports.http, function() {
        console.log('http server listening on %d', ports.http);
      }) 
    });

    wss.on('connection', function(ws) {

      var websocket = new WebSocket(ws);

      cache.createKeyStream()
        .on('data', function(key) {
          cache.get(key, function (err, value) {
            if (!err) send(key, value);
          });
        })
        .on('end', function() {
          cache.on('put', send);
        })

      function send(key, value) {
        var response = JSON.stringify({ key : key, value : value });
        websocket.write(response);
      }

    });
  });
};
