var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var jsonfile = require('../transactions.json')

var doc = new GoogleSpreadsheet('1IB5pSKdO4a_VdRRYf0vUZFCrv9B8bPaISCrfVvXrZyk');
var sheet;

async.series([
  function setAuth(step) {
    var creds = require('../google-generated-creds.json');
    doc.useServiceAccountAuth(creds, step, function(err) {
      console.log(err)
    });
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      step();
    });
  },
  function managingSheets(step) {

    //sheet.clear(function(err) {
      //console.log(err)

      sheet.setTitle('Transactions', function(err) {
        console.log(err)
        sheet.setHeaderRow(['DATE OPERATION', 'DATE VALEUR', 'LIBELLE', 'MONTANT', 'DEVISE'], function(err) {

          function addRow(record) {
            var date = record.date
            var new_date = date.split("-").reverse().join('/');
            sheet.addRow({
              'DATE OPERATION': new_date,
              'DATE VALEUR': new_date,
              'LIBELLE': record.original_wording,
              'MONTANT': record.value,
              'DEVISE': 'EUR'
            }, function( err ) {
              console.log(index)
              index = index + 1
              if (index >= size_transactions ) {
                step();
              } else {
                addRow(jsonfile.transactions[index]);
              }
            })
          }

          var index = 0
          var size_transactions = jsonfile.transactions.length;
          addRow(jsonfile.transactions[index]);

        });
      });
    //})
  }
]);



