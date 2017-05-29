var kue = require('kue');
var jobs = kue.createQueue();
var Client = require('node-rest-client').Client;
var config = require('./config');
var client = new Client();
var moment = require('moment');
var bankDB =  require('./controllers/bank_db.js');
var format = 'YYYY-MM-DD';

jobs.process('create db', function (job, done){
  client.post("https://tchokin.biapi.pro/2.0/users/me/connections?expand=accounts", job.data, function (data, response) {
    var account = data.accounts[0]
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
    console.log(request_header);
    setTimeout(function() {
      client.get("https://tchokin.biapi.pro/2.0/users/${user_id}/accounts/${id}/transactions",  request_header, function(data, response) {
        console.log(data)
        bankDB(data, job.data.userName);
      });
    }, 300000)

    console.log('processing started');
  });
 done && done();
});
