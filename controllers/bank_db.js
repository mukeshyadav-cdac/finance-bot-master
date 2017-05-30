var Datastore = require('nedb');
var apiCall = require('./transactions_api.js');

module.exports = function(jsonfile, name) {
  var dbPathName = './db/'+ name;

  var db = new Datastore({
    filename: dbPathName,
    autoload: true
  });

  db.loadDatabase(function(err) {
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

    db.insert(dictPositives, function(err, posDoc) {
      db.insert(dictNegatives, function(err, newDoc) {
        console.log("inserted document");
        apiCall(name);
      });
    });
  });
}

