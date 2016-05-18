var http = require('http');
var url = require('url');

http.createServer(function(req, res) {
  var currentUrl = url.parse(req.url);

  switch(currentUrl.pathname) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Homepage');
      break;
    case '/about':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('About');
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      break;
  }
}).listen(3000);
