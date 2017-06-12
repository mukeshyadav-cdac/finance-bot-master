var Client = require('node-rest-client').Client;
var config = require('../config');
var client = new Client();
var kue = require('kue');
var jobs = kue.createQueue();
var facebook_message = require('../facebook/message.js');

require('../db');


function createDB (data){
	var job = jobs.create('create db', data)
	job
	  .on('complete', function (){

	      facebook_message.authenticate({userId: job.data.data.facebook_id});
	  	console.log('Job', job.id, 'with name', job.data, 'is    done -- sent tofb');
	  })
	  .on('failed', function (){
	   	console.log('Job', job.id, 'with name', job.data, 'has  failed');
	  });
	 job.save();
}

var request_header = {
	headers: {
		"Content-Type": "application/json",
	}
};

function beforeRequest(callback) {
	client.post("https://tchokin.biapi.pro/2.0/auth/init", function(data, response) {
		request_header["headers"]["Authorization"] = "Bearer " + data.auth_token;
		callback()
	});
}

exports.homeView = (req, res) => {
	var facebook_id = req.query.userId
	beforeRequest(function(){
		client.get("https://tchokin.biapi.pro/2.0/banks?expand=fields", request_header, function(data, response) {
			console.log(data);
			res.render('pages/index', {
				title: 'Finance Bot',
				error: 'no',
				bank_list: data,
				facebook_id: facebook_id
			});
		});
	});
};

exports.getUserConnection = (req, res) => {
	beforeRequest(function() {
		request_header["data"] =  {
	    "id_bank" : req.body.bankId,
	    "login" : req.body.login,
	    "password" : req.body.password,
	    "facebook_id": req.body.facebook_id || 'Random'
	  }
	  console.log(req.body);
		createDB(request_header);
		res.redirect('/transactions')
	});
}

exports.transactions = (req, res) => {
	res.render('pages/accounts', {
		title: 'Finance Accounts',
		error: 'no'
	});
}

exports.aboutView = (req, res) => {
  res.render('pages/about', {
    title: 'About Us'
  });
};
