# NAME
stshttp(3)

# SYNOPSIS
Spin up a quick server to visualize time series data.

# USAGE
Deadly simple. just specify where you want it and what keys it should care about.

```js
var tsd = require('tsd');

tsd({
  http: 80,
  tcp: 9099
});
```

Start pumping data into it.
```js
var net = require('net');
var x = 10;
var client = net.connect({ port: 9099 }, function() {
  
  setInterval(function() {

    x += x;

    client.write(JSON.stringify({ key: 'a', value: Math.random() * x }) + '\n' );
    client.write(JSON.stringify({ key: 'b', value: Math.random() * x }) + '\n' );
    client.write(JSON.stringify({ key: 'c', value: Math.random() * x }) + '\n' );
    client.write(JSON.stringify({ key: 'd', value: Math.random() * x }) + '\n' );

  }, 150);
});
```

![Loqui](/screenshot.png)

# TODO
This is a work in progress. Pull requests welcome.

 - Provide a way to flush the cache.
 - 
