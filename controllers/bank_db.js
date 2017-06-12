var Datastore = require('nedb');
var promiseDatastore = require('nedb-promise');
var apiCall = require('./transactions_api.js');

console.log("bank_db.js LOADED AND READY TO FIRE!");
module.exports = async function(jsonfile, name) {
  console.log("BANK DB CREATION INITIATED!")
  debugger
  var dbPathName = './db/'+ name;

  // var db = new Datastore({
  //   filename: dbPathName,
  //   autoload: true
  // });
  var db = promiseDatastore({
    filename: dbPathName,
    autoload: true
  });
  console.log("BANK DB LOADED...");
  console.log(db);

  console.log("db loaded with path ", dbPathName);
  var index = 0;
  var dictPositives = [];
  var dictNegatives = [];
  var size_transactions = 0

  if( jsonfile.transactions && jsonfile.transactions.length ) {
    var size_transactions = jsonfile.transactions.length;
  } else {
    console.log('no data');
  }
  debugger
  for(index = 0; index <jsonfile.transactions.length; index++ ) {
    var record = jsonfile.transactions[index];
    var montant = record.value;
    var label = record.original_wording;
    var labelArr = label.split(/[0-9]+/);
    var finalArr = labelArr.filter(function(entry) { return entry.trim() != ''; });
    var paymentLabel = finalArr[0];
    var sourceLabel = finalArr[1];
    var date = record.date
    var doc = {};

    if (montant > 0) {
      doc = {
        month: date.split("-")[1],
        date: date.split("-")[2],
        label: label,
        paymentlabel: paymentLabel,
        sourcelabel: sourceLabel,
        amount: montant,
        value: 1
      };
      console.log(doc);
      dictPositives.push(doc);
    } else {
      doc = {
        month: date.split("-")[1],
        date: date.split("-")[2],
        label: label,
        paymentlabel: paymentLabel,
        sourcelabel: sourceLabel,
        amount: montant,
        value: -1
      };
      dictNegatives.push(doc);
    }
  }
  debugger
  await Promise.all([db.insert(dictPositives), db.insert(dictNegatives)])
  // await db.insert(dictPositives);
  // await db.insert(dictNegatives);
  await apiCall(name);

  // db.insert(dictPositives, function(err, posDoc) {
  //   console.log("db pushed")
  //   db.insert(dictNegatives, function(err, newDoc) {
  //     console.log("inserted document");
  //     apiCall(name);
  //   });
  // });
}

