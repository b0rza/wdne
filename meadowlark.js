var express = require('express');
var handlebars =
  require('express-handlebars')
  .create({ defaultLayout: 'main' });

var app = express();

app.set('port', process.env.PORT || 8000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// Home
app.get('/', function(req, res) {
  res.render('home')
})

// About
app.get('/about', function(req, res, next) {
  res.render('about')
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
