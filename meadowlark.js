var express = require('express');
var fortune = require('./lib/fortune.js');

// Config
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 8000);

// Handlebars
var handlebars = require('express-handlebars')
                  .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Tests
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
})

// Home
app.get('/', function(req, res) {
  res.render('home')
})

// About
app.get('/about', function(req, res, next) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
})

// Custom 404 page
app.use(function(err, req, res, next) {
  res.status(404)
     .render('404');
});

// Custom 500 page
app.use(function(req, res) {
  res.status(500)
     .render('500');
});

app.listen(app.get('port'), function() {
  console.log('Started listening!');
});
