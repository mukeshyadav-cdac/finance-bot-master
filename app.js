//require our dependencies
const express = require ('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const apis = require('./api');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);

var server;
const app = express ();

app.set('port', (config.PORT || 7000))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use (express.static(__dirname + '/public'));

const userController = require('./controllers/user');
app.get('/about', userController.aboutView);
app.get('/', userController.homeView);
app.post('/', userController.getUserConnection);
app.get('/transactions', userController.transactions);
app.get('/salary', userController.salary);
app.post('/salary', userController.saveSalary);
app.get('/rent', userController.rent);
app.post('/rent', userController.saveRent);
app.use('/', apis);

mongoose.connection
  .once('open', () => {
    server = app.listen(app.get('port'), ()  =>  {
      server.timeout = 3000000000;
      console.log('running on port', app.get('port'))
    });
    console.log('Connected to MongoLab instance.')
  })
  .on('error', error => console.log('Error connecting to MongoLab:', error));
