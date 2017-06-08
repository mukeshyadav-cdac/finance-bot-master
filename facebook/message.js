var Client = require('node-rest-client').Client;
var client = new Client();
var config = require('../config');
var messageData = require('./data');

exports.authenticate = function (userData) {
  var postData = {
    userId: userData.userId,
    responseType: 'TEXT',
    responseText: messageData.authenticate
  }

  var request_header = {
    "headers": {
      "Content-Type": "application/json"
    }
  };
  request_header["data"] = postData;

  client.post(config.bot_url + "/workerMessage", request_header, function(data, response) {
  });
}


exports.synchronization = function (userData) {
  var postData = {
    userId: userData.userId,
    responseType: 'TEXT',
    responseText: messageData.synchronization
  }

  var request_header = {
    "headers": {
      "Content-Type": "application/json"
    }
  };
  request_header["data"] = postData;

  client.post(config.bot_url + "/workerMessage", request_header, function(data, response) {
  });
}

exports.patience = function (userData) {
  var postData = {
    userId: userData.userId,
    responseType: 'TEXT',
    responseText: messageData.patience
  }

  var request_header = {
    "headers": {
      "Content-Type": "application/json"
    }
  };
  request_header["data"] = postData;

  client.post(config.bot_url + "/workerMessage", request_header, function(data, response) {
  });
}
