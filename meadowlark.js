var express = require('express');
var fortune = require('./lib/fortune.js');

// Config
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

// Handlebars
var handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

function getWeatherData(){
  return {
    locations: [
      {
        name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
      },
      {
        name: 'Bend',
        forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)',
      },
      {
        name: 'Manzanita',
        forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
        weather: 'Light Rain',
        temp: '55.0 F (12.8 C)',
      },
    ],
  }
}

app.use(function(req, res, next) {
  res.locals.partials = res.locals.partials || {};
  res.locals.partials.weather = getWeatherData();
  next();
})

// Tests
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

// Home
app.get('/', function(req, res) {
  res.render('home');
});

// About
app.get('/about', function(req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

// Tours
app.get('/tours/hood-river', function(req, res) {
  res.render('tours/hood-river');
});
app.get('/tours/oregon-coast', function(req, res) {
  res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function(req, res) {
  res.render('tours/request-group-rate');
});

// Nursery Rhyme
app.get('/nursery-rhyme', function(req, res) {
  res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res) {
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck'
  });
})

// Custom 404 page
app.use(function(req, res, next) {
  res.status(404)
     .render('404');
});

// Custom 500 page
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500)
     .render('500');
});

app.listen(app.get('port'), function() {
  console.log('Started listening!');
});
