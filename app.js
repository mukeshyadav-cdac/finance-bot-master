//require our dependencies
const express = require ('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express ();
const port = 5000;
//const mongoose = require('mongoose');
const config = require('./config');
//var connection = connect();

/**
 * Controllers (route handlers).
 */
const userController = require('./controllers/user');

/**
 * Express configuration.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/about', userController.aboutView);
app.get('/', userController.homeView);
app.post('/', userController.getUserConnection);
app.get('/transactions', userController.transactions);


//set static files (css, images, etc) location
app.use (express.static(__dirname + '/public'));

// connection
//   .on('error', console.log)
//   .on('disconnected', connect)
//   .once('open', listen);

//start the server


function listen () {
  var server = app.listen (port, function () {
    console.log('app started on port ' + port);
  });

  server.timeout = 6000000 ;
}

var server = app.listen (port, function () {
  console.log('app started on port ' + port);
});


// function connect () {
//   var connection = mongoose.connect(config.db).connection;
//   return connection;
// }
