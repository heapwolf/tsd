# NAME
tsd-web(3)

# SYNOPSIS
Spin up a quick server to visualize time series data.

# USAGE
Deadly simple. just specify where you want it and what keys it should care about.

```js
var tsd = require('tsd-web');

tsd({
  ports: {
    http: 80,
    tcp: 9099
  },
  keys: ['hello', 'goodbye', 'ohai', 'neat-stuff']
});
```

Write some dummy data to the socket (LINE DELIMITED!).
```js
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
```

# WUT?
![screenshot](/screenshot.png)

# TODO
This is a work in progress. Pull requests welcome.

 - Provide a way to flush the cache.
