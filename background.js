var kue = require('kue');
var jobs = kue.createQueue();
var Client = require('node-rest-client').Client;
var config = require('./config');
var client = new Client();
var createGoogleSheet =  require('./controllers/google_spreadsheet.js');

var  moment = require('moment');
var format = 'YYYY-MM-DD';

jobs.process('create sheet', function (job, done){
 /* carry out all the job function here */
  console.log('..................................');
  client.post("https://tchokin.biapi.pro/2.0/users/me/connections?expand=accounts", job.data, function ( data, response) {
    var account = data.accounts[0]
    console.log("user account id is "+account.id);
    //console.log(job.data)
    var request_header = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": job.data.headers.Authorization
      }
    };

    var max_date = moment().format(format);
    var min_date = moment().subtract(3, 'months').format(format);
    request_header["path"] = {"user_id": data.id_user, "id": account.id};
    request_header["data"] = {"min_date": min_date, "max_date": max_date};
    console.log("sending request headers to the backend ");
    setTimeout(function() {
      client.get("https://tchokin.biapi.pro/2.0/users/${user_id}/accounts/${id}/transactions",  request_header, function(data, response) {
        console.log("LOGGING IN and FETCHING DATA");
        createDB(data);
      });
    }, 300000)

    console.log('processing started');
  });
 done && done();
});


