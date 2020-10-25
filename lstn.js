#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

module.exports = function(){

	// clone arguments
	var args = [];
	for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

	// first argument is server
	var server = args.shift();
	
	// check for socket
	switch (typeof args[0]) {
		case "string":

			// resolve socket path
			var socketpath = path.resolve(args[0]);
			
			// check for mode override
			var mode = (args.length > 1 && typeof args[1] === "number" && args[1] > 0 && args[1] <= 511) ? args.splice(1,1).pop() : 0x1c0; // 0o700
			
			// check for callback; invent callback
			var fn = (typeof args[args.length-1] === "function") ? args.pop() : function(err){ if (err) throw err; };
			
			(function(next){
				// check if socket file exists
				fs.exists(socketpath, function(x){
					if (!x) return next();

					// unlink existing socket file
					fs.unlink(socketpath, function(err){
						if (err) return fn(err);
						next();
					});
				});
			})(function(){
				
				// add own callback to change socket mode to 0777
				args.push(function(err){
					if (err) return fn(err);
					fs.chmod(socketpath, mode, fn);
				});
				
				server.listen.apply(server, args);
				
			});
			
			return server;
			
		break;
		default:
			// not sa socket, so simply call listen()
			return server.listen.apply(server, args);
		break;
	}
};
