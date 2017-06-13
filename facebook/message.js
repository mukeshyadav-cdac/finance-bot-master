var Client = require('node-rest-client').Client;
var client = new Client();
var config = require('../config');
var messageData = require('./data');
var Datastore = require('nedb');
var promiseDatastore = require('nedb-promise');

function setTextData(userData, messageType) {
  var postData = {
    userId: userData.userId,
    responseType: 'TEXT',
    responseText: messageData[messageType]
  };
  var request_header = {
    "headers": {
      "Content-Type": "application/json"
    }
  };
  request_header["data"] = postData;
  return request_header;
}

function setButtonWebview(userData, messageType) {

}


exports.authenticate = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'authenticate'), function(data, response) {
  });
}

exports.synchronization = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'synchronization'), function(data, response) {
  });
}

exports.patience = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'patience'), function(data, response) {
  });
}

exports.okDone = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'okDone'), function(data, response) {
  });
}

exports.saleryPreOne = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'saleryPreOne'), function(data, response) {
  });
}

exports.saleryPreTwo = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'saleryPreTwo'), function(data, response) {
  });
}

exports.salary = function (userData) {
  var dbPathName = './db/'+ userData.userId;

  console.log(dbPathName)
  var db = new Datastore({
    filename: dbPathName,
    autoload: true
  });

  db.findOne({ category: 'salary' }, function(err, doc) {
    console.log(doc)
    var postData = {
      userId: userData.userId,
      responseType: 'BUTTON_WEBVIEW',
      responseAttachment: [{
        "title": doc.amount + ' ' + doc.paymentlabel,
        "subtitle": doc.date + '/' + doc.month,
        "buttons": [
          {
            "type": "postback",
            "title": 'Confirm',
            "payload": userData.salaryPayload
          },
          {
            "type": "web_url",
            "url": userData.url + '?' + userData.userId,
            "title": userData.webTitle,
            "webview_height_ratio": "tall"
          }
        ]
      }]
    }
    var request_header = {
      "headers": {
        "Content-Type": "application/json"
      }
    };
    request_header["data"] = postData;
    console.log(request_header);
    client.post(config.bot_url + "/workerMessage", request_header, function(data, response) {
    });
  });


}
