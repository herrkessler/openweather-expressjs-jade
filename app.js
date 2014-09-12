// Requires
// -------------------------

var express = require('express');
var app = express();
var sass = require("node-sass");
var buildify = require('buildify');
var neat = require('node-neat');
var request = require('request');

// Settings
// -------------------------

app.set('view engine', 'jade');

// Paths
// -------------------------

var jsPath = "/js/scripts/";

// JSON Data
// -------------------------

var weatherData = 0;

// SASS
// -------------------------

app.use(
  sass.middleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    includePaths: neat.includePaths,
    // outputStyle: 'compressed',
    debug: true
  })
);

// JS
// -------------------------

 buildify()
   .load(jsPath + 'all.js')
   .concat([jsPath + 'jquery.js', jsPath + 'app.js'])
   .save('/public/js/all.js');
   // .uglify()
   // .save('../distribution/output.min.js');

// Static
// -------------------------

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));

// Routes
// -------------------------

app.get('/', function(req, res) {

  request('http://api.openweathermap.org/data/2.5/forecast/daily?id=6430983&units=metric', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      weatherData = JSON.parse(body);
      res.render('index', {weather: weatherData});
      console.log(weatherData);
    }
  });
});

// Server
// -------------------------

app.listen(3000);
