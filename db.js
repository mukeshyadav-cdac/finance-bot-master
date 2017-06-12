var kue = require('kue');
var jobs = kue.createQueue();
var Client = require('node-rest-client').Client;
var httpClient = require('node-rest-client-promise').Client();
var config = require('./config');
var client = new Client();
var moment = require('moment');
var bankDB =  require('./controllers/bank_db.js');
var format = 'YYYY-MM-DD';
var facebook_message = require('./facebook/message.js')

console.log("db.js LOADED AND READY TO FIRE!");
jobs.process('create db', function (job, done) {
  console.log("DB CREATION INITIATED IN THE JOB")
  debugger

  const fetchTransactions = (request_header) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        debugger
        httpClient.getPromise("https://tchokin.biapi.pro/2.0/users/${user_id}/accounts/${id}/transactions", request_header)
        .then((response) => {
          debugger
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        })
      }, 300000);
    });
  }

  httpClient.postPromise("https://tchokin.biapi.pro/2.0/users/me/connections?expand=accounts", job.data)
  .then((response) => {
    const data = response.data;
    debugger
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
    console.log("About to query the api for transactions!")
    console.log(request_header);
    facebook_message.authenticate({userId: job.data.data.facebook_id});
    setTimeout(function() {
      facebook_message.synchronization({userId: job.data.data.facebook_id});
      setTimeout(function() {
        facebook_message.patience({userId: job.data.data.facebook_id});
      }, 4000);
    }, 4000);
    return request_header;
  })
  .then((request_header) => {
    return fetchTransactions(request_header);
  })
  .then(async (response) => {
      console.log("TRANSACTIONS RETURNED!!!!")
      console.log(response.data);
      debugger
      await bankDB(response.data, (job.data.data.facebook_id || 'Random'));
      debugger
      done && done();
  })
  .catch((err) => {
    debugger
    done && done(err)
  });
});
