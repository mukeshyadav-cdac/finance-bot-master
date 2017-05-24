var kue = require('kue');
var jobs = kue.createQueue();
var Client = require('node-rest-client').Client;
var config = require('./config');
var client = new Client();
var createGoogleSheet =  require('./controllers/google_spreadsheet.js');

jobs.process('create sheet', function (job, done){
 /* carry out all the job function here */
  console.log('..................................');
  client.post("https://tchokin.biapi.pro/2.0/users/me/connections?expand=accounts", job.data, function ( data, response) {
    var account = data.accounts[0]
    console.log(account.id)
    console.log(job.data)
    var request_header = {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": job.data.headers.Authorization
      }
    };

    request_header["path"] = {"user_id": data.id_user, "id": account.id};
    console.log(request_header);
    setTimeout(function() {
      client.get("https://tchokin.biapi.pro/2.0/users/${user_id}/accounts/${id}/transactions",  request_header, function(data, response) {
        console.log(data)
        createGoogleSheet(data);
      });
    }, 300000)

    console.log('processing started');
  });
 done && done();
});


