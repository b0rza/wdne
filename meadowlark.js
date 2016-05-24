var express = require('express');
var fortune = require('./lib/fortune.js');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var jqupload = require('jquery-file-upload-middleware');
var credentials = require('./credentials.js');

// Config
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

// Handlebars
var handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Cookies
app.use(require('cookie-parser')(credentials.cookieSecret));

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
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Newsletter
app.get('/newsletter', function(req, res) {
  res.render('newsletter', { csrf: 'dummy csrf' });
});

app.post('/process', function(req, res) {
  if (req.xhr || req.accepts('json,html') === 'json') {
    res.send({ success: true });
  } else {
    res.redirect(303, '/thank-you')
  }
});

// Contest
app.get('/contest/vacation-photo', function(req, res) {
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if(err) return res.redirect(303, '/error');
    console.log('received fields: ');
    console.log(fields);
    console.log('received params: ');
    console.log(req.params);
    res.redirect(303, '/thank-you');
  })
})

// Tests
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

// Home
app.get('/', function(req, res) {
  res.cookie('monster', 'nom nom', { path: '/about' });
  res.cookie('signed_monster', 'nom nom', { signed: true });

  console.log(req.cookies);
  console.log(req.signedCookies);
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
});

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
