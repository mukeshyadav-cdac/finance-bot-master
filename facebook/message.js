var Client = require('node-rest-client').Client;
var client = new Client();
var config = require('../config');
var messageData = require('./data');
var rules = require('../controllers/rules.js');


function setTextData(userData, messageType) {
  var postData = {
    userId: userData.userId,
    responseType: 'TEXT',
    responseText: messageData[messageType],
    done: userData.done || false
  };
  var request_header = {
    "headers": {
      "Content-Type": "application/json"
    }
  };
  request_header["data"] = postData;
  return request_header;
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

exports.salaryConfirm = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'salaryConfirm'), function(data, response) {
  });
}

exports.rentConfirm = function (userData) {
  client.post(config.bot_url + "/workerMessage", setTextData(userData, 'rentConfirm'), function(data, response) {
  });
}

exports.rules = function(userData) {
  var data = setTextData(userData, 'rules');
  rules(data.userId, function(rulesData) {
    data["data"].responseText = "Weekly Spendable: " + rulesData.weekly_spendable.toString()  + ", Monthly Spendable: " + rulesData.monthly_spendable.toString();
    client.post(config.bot_url + "/workerMessage", data, function(data, response) {
    });
  });
}
