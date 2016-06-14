# lstn

`lstn` makes it more straightforward to listen on unix sockets by deleting old sockets when present and setting the mode of the created socket file.

## Usage

lstn(server, socket[, mode][, callback]);

``` javascript

// Instead of
server.listen("/path/to/socket.sock", function(err){ /* ... */ });

// do it like this
var lstn = require("lstn");

lstn(server, "/path/to/socket.sock", 0o777, function(err){ /* ... */ })

```

When you use `port` and `hostname` arguments instead, they just get passed through.
