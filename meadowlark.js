var express = require('express');
var fortune = require('./lib/fortune.js');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var jqupload = require('jquery-file-upload-middleware');
var credentials = require('./credentials.js');
var cartValidation = require('./lib/cartValidation.js');
var nodemailer = require('nodemailer');

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

// Mailer
var mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: credentials.gmail.user,
    pass: credentials.gmail.password
  }
});

// Cookies and Sessions
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

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

// Send email
app.get('/email', function(req, res) {

  console.log(req.query);

  mailTransport.sendMail({
    from: 'Meadowlar <info@meadowlark.com>',
    to: 'aborzic@extensionengine.com',
    subject: 'Your tour',
    text: req.query.text || 'Generic text'
  }, function(err) {
    if(err){
      console.log('Unable to send email: ' + err);
    }
  });

  res.end('Tried!');
});

app.post('/newsletter', function(req, res){
  var name = req.body.name || '', email = req.body.email || '';

  // input validation
  if(!false) {
    if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid.',
    };

    return res.redirect(303, '/newsletter/archive');
  }

  new NewsletterSignup({ name: name, email: email }).save(function(err){
  if(err) {
    if(req.xhr) return res.json({ error: 'Database error.' });
    req.session.flash = {
      type: 'danger',
      intro: 'Database error!',
      message: 'There was a database error; please try again later.',
    }
    return res.redirect(303, '/newsletter/archive');
  }
  if(req.xhr) return res.json({ success: true });
    req.session.flash = {
      type: 'success',
      intro: 'Thank you!',
      message: 'You have now been signed up for the newsletter.',
    };
    return res.redirect(303, '/newsletter/archive');
  });
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
