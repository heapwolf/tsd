# NAME
tsd-web(3)

# SYNOPSIS
Spin up a quick server to visualize time series data.

# USAGE
Deadly simple. just specify where you want it and what keys it should care about.

```js
var tsd = require('tsd-web');

tsd({
  http: 80,
  tcp: 9099
});
```

Write some dummy data to the socket (LINE DELIMITED!).
```js
var net = require('net');
var x = 0;
var client = net.connect({ port: 9099 }, function() {

  function write(json) {
    client.write(JSON.stringify(json) + '\n');
  }
  
  setInterval(function() {

    x++;

    write({ key: 'hello',   value: (Math.random() + x) / 50 });
    write({ key: 'goodbye', value: (Math.random() + x) / 20 });
    write({ key: 'ohai', value: 1000 });
    write({ key: 'neat-stuff', value: (Math.random() + x) / 10 });

  }, 150);

});
```

# WUT?
![screenshot](/screenshot.png)

# TODO
This is a work in progress. Pull requests welcome.

 - Provide a way to flush the cache.
