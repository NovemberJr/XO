var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.', {
  cache: 0
});

function start(route, handle) {
	function accept(req, res) {
		//res.writeHead(200, {"Content-Type": "text/plain"});
		var pathname = url.parse(req.url).pathname;
		var query = url.parse(req.url, true).query;

		route(handle, pathname, query, res);
		
		if (req.url == '/chat.json') {
		// искусственная задержка для наглядности
			setTimeout(function() {
		file.serve(req, res);
		}, 2000);
		} else {
		file.serve(req, res);
		}
	}
	
	http.createServer(accept).listen(8080);
	console.log('Server has started');
}

exports.start = start;
