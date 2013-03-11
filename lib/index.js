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

module.exports = function(opts) {

  opts = opts || {};

  opts.keys = opts.keys || [];
  opts.ports = opts.ports || {};
  opts.ports.http = opts.ports.http || 80;
  opts.ports.tcp = opts.ports.tcp || 9099;

  var location = path.join(__dirname, 'cache');

  createCache(location, { encoding: 'json' }, function(error, cache) {

    var tcpserver = net.createServer(function(socket) {

      socket
        .pipe(es.split())
        .pipe(es.parse())
        .pipe(cache.createWriteStream())
    });

    tcpserver.listen(opts.ports.tcp, function() {
      console.log('tcp server listening on %d', opts.ports.tcp);
    });

    var httpserver = http.createServer(staticHandler);
    var wss = new WebSocketServer({ 
      server: httpserver.listen(opts.ports.http, function() {
        console.log('http server listening on %d', opts.ports.http);
      }) 
    });

    wss.on('connection', function(ws) {

      var websocket = new WebSocket(ws);

      websocket.write(JSON.stringify({ metrics: opts.keys }));

      websocket.on('data', function(message) {
        try { message = JSON.parse(message); } catch($) {}
        if (message.key) {
          cache.get(message.key, function(err, value) {
            if (!err) {
              var response = JSON.stringify({ key: message.key, value: value });
              websocket.write(response);
            }
          })
        }
      });

    });
  });
};
