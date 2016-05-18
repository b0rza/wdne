var http = require('http');
var url = require('url');
var fs = require('fs');

http
  .createServer(function(req, res) {
    var currentUrl = url.parse(req.url);

    switch(currentUrl.pathname) {
      case '/':
        serveStaticFile(res, '/public/home.html', 'text/html');
        break;
      case '/about':
        serveStaticFile(res, '/public/about.html', 'text/html');
        break;
      case '/img/logo.png':
        serveStaticFile(res, '/public/img/logo.png', 'image/png');
        break;
      default:
        serveStaticFile(res, '/public/notfound.html', 'text/html', 404);
        break;
    }
  })
  .listen(3000)
  .on('listening', function() {
    console.log('Listening!');
  });


function serveStaticFile (res, path, contentType, responseCode) {
  responseCode = responseCode || 200;

  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text-plain' });
      res.end('500 - Error reading file')
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.end(data);
    }
  })
}
