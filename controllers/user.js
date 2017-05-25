var Client = require('node-rest-client').Client;
var config = require('../config');
var client = new Client();
var kue = require('kue');
var jobs = kue.createQueue();

function createSheet (data){
	var job = jobs.create('create sheet', data)
	job
	  .on('complete', function (){
	  	console.log('Job', job.id, 'with name', job.data, 'is    done');
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

/**
 * Get Home Page
 */

exports.homeView = (req, res) => {
	beforeRequest(function(){
		client.get("https://tchokin.biapi.pro/2.0/banks?expand=fields", request_header, function(data, response) {
			console.log(data);
			res.render('pages/index', {
				title: 'Finance Bot',
				error: 'no',
				bank_list: data
			});
		});
	});
};

exports.getUserConnection = (req, res) => {
	beforeRequest(function() {
	request_header["data"] =  {
	    "id_bank" : req.body.bankId,
	    "login" : req.body.login,
	    "password" : req.body.password
	  }
		createSheet(request_header)
		res.redirect('/transactions')
	});
}

exports.transactions = (req, res) => {
	res.render('pages/accounts', {
		title: 'Finance Accounts',
		error: 'no'
	});
}

/**
 * Get About Page
 */
exports.aboutView = (req, res) => {
  res.render('pages/about', {
    title: 'About Us'
  });
};
