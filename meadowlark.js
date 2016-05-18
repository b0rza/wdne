var express = require('express');
var handlebars =
  require('express-handlebars')
  .create({ defaultLayout: 'main' });

var app = express();

app.set('port', process.env.PORT || 8000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

var fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
]

// Home
app.get('/', function(req, res) {
  res.render('home')
})

// About
app.get('/about', function(req, res, next) {
  var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', { fortune: randomFortune });
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
