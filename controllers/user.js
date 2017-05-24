var Client = require('node-rest-client').Client;
var config = require('../config');
var client = new Client();
var User = require('../models/user');
var kue = require('kue');
var jobs = kue.createQueue();

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

exports.getUserConnection = (req, res) => {
	beforeRequest(function() {
	request_header["data"] =  {
	    "id_bank" : req.body.bankId,
	    "login" : req.body.login,
	    "password" : req.body.password
	  }
		createSheet(request_header)

		res.render('pages/accounts', {
			title: 'Finance Accounts',
			error: 'no'
		});
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

/**
 * POST /
 * Post Search Term.
 */

 exports.getUserDetail = (req, res, next) => {
 	client.get("https://tchokin.biapi.pro/2.0/users/429/accounts/26/transactions", request_header, function(data, response) {
 		console.log(data);
 		res.render('pages/index', {
 		    title: 'Finance Bot- TRa',
 		    error: 'no',
 		    bank_list: data
 		 });
 	});
 }

exports.getTempToken = (req, res, next) => {


	client_id = req.body.id2;
	client_secret = req.body.password;

	// console.log("client_id : " + client_id);
	// console.log("client_secret : " + client_secret);

	var Client = require('node-rest-client').Client;
	var client = new Client();

	var auth_token = "init";
	var access_token = "init";

	var args1 = {
		data: {
			test: "hello"
		},
		headers: {"Content-Type": "application/x-www-form-urlencoded"}
	};

	client.post("https://tchokin.biapi.pro/2.0/auth/init", args1, function (data, response) {
		auth_token = data.auth_token;
		//console.log("auth_token: " + auth_token);

		var args2 = {
			data: {
				client_id: client_id,
				client_secret: client_secret,
				code: auth_token
			},
			headers: {"Content-Type": "application/x-www-form-urlencoded"}
		};

		client.post("https://tchokin.biapi.pro/2.0/auth/token/access", args2, function (data1, response) {
			if(data1.error != undefined) {
				console.log("Invalid Client! Please recheck your credential!");
				return res.render('pages/index', {
				   title: 'Finance Bot',
				   error: data1.error
				});
			}

			var args3 = {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": "Bearer 5edIL7xUk/kYgAR9+tAF1AX/wuUbySCSZ3KCXpuf4yp0yUKJRjrlvKp6TzEojcRtZqn5Wr+mJqylsmEaZaRlXBC/f5zldjf4HpKNb26NqGjcyAewK2Sapy1y6DPDPOm7"
				}
			};

			client.get("https://tchokin.biapi.pro/2.0/users/me/connections/47/accounts", args3, function(data2, response) {
				console.log(data2);
				res.render('pages/processToken', {
					title: 'Bank Data',
					bankdata: JSON.stringify(data2)
				});
			});

		});

	});
};
