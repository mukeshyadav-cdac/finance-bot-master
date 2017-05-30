
var Datastore = require('nedb');
var async = require('async');
var chainMethods = [findSalary, findBTran, findCTran, findSTran, findHTran, findRTran]
module.exports = function(dbName) {
  var dbPathName = './db/'+ dbName;
  var db = new Datastore({
    filename: dbPathName,
    autoload: true
  });
  db.loadDatabase(function(err) { // Callback is optional
    console.log("db loaded with path ", dbPathName);
    chainMethods.forEach(function(chainMethod) {
      setTimeout(function() {
        chainMethod(db);
    }, 60000)
    });
  });
}

function findSalary(db) {
  db.find({ value: 1 }).sort({amount: 1}).exec(function (err, docs) {
    docs.forEach(function(doc){
      var salaryLabel = doc.label;
      var count = 0;
      db.count({ value: 1, label: salaryLabel }, function (err, count) {
        console.log("count is ->",count);
        if(count === 3) {
          db.find({ value: 1, label: salaryLabel }, function (err, docs) {
            db.update({ value: 1, label: salaryLabel }, { $set: { "category": "salary", } }, { multi: true }, function (err, numReplaced) {
              console.log("****SALARY SEARCH********");
              console.log(err, numReplaced);
            });
          });
        }
      });
    });
  });
}

function findBTran(db) {
  db.find({ value: -1, $or: [{paymentlabel: /PAIEMENT CARTE/}, {paymentlabel: /FRAIS/}] }, function (err, docs) {
    docs.forEach(function(doc) {
      var amt = doc.amount;
      var label = doc.label;
      var sourcelabel = doc.sourcelabel;
      var count = 0;

      db.count({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, function (err, count) {
        if(count === 3) {
          db.find({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, function (err, docs) {
            if(docs[0].month === docs[1].month || docs[0].month === docs[2].month || docs[1].month == docs[2].month) {
              console.log("skipping ");
            } else {
              var dateVar1 = parseInt(docs[0].date) - parseInt(docs[1].date);
              var dateVar2 = parseInt(docs[1].date) - parseInt(docs[2].date);
              console.log(dateVar1, dateVar2);
              if(Math.abs(dateVar1) < 3 && Math.abs(dateVar2) <3) {
                db.update({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, { $set: { "category": "B_trans", } }, { multi: true }, function (err, numReplaced) {
                  console.log("******BTRAN********");
                  console.log(err, numReplaced);
                });
                console.log("****");
              }
              else{
                console.log("too variant");
              }
            }
          });
        }
      });
    });
  });
}

function findCTran(db) {
  db.find({ value: -1 , label: /PRLV SEPA/ }, function (err, docs) {
    var count = 0;
    docs.forEach(function(doc) {
      var label = doc.label;
      console.log("******", label, doc.month);
      db.count({ value: -1, label: label }, function (err, count) {
        console.log(count);
        if(count === 3) {
          db.find({ value: -1, label: label }, function (err, docs) {
            db.update({ value: -1, label: label }, { $set: { "category": "C_trans", } }, { multi: true }, function (err, numReplaced) {
              console.log("*******C TRANS*******");
              console.log(err, numReplaced);
            });
          });
        }
      });
      count++;
    });
  });
}

function findSTran(db) {
  db.find({ value: -1 , label: /VIR/, $not:{label: /VIR SEPA/}}, function (err, docs) {
    var count = 0;
    docs.forEach(function(doc) {
      var amt = doc.amount;
      var lbl = doc.label;
      console.log("****AMOUNT IS **** ",amt, lbl);
      db.count({ value: -1, amount: amt, label: lbl }, function (err, count) {
        console.log(count, lbl);
        if(count === 3) {
          db.find({ value: -1, amount: amt, label: lbl }, function (err, docs) {
            if(docs[0].month === docs[1].month || docs[0].month === docs[2].month || docs[1].month == docs[2].month) {
              console.log("skipping ");
            } else {
              db.update({ value: -1, amount: amt, label: lbl}, { $set: { "category": "S_trans", } }, { multi: true }, function (err, numReplaced) {
                console.log("******S TRANS********");
                console.log(err, numReplaced);
              });
            }
          })
        }
      });
    })
  });
}

function findHTran(db) {
  db.find({ value: -1 , label: /VIR SEPA/ }).sort({"amount" : -1}).exec(function (err, docs) {
    var count = 0;
    docs.forEach(function(doc){
      var amt = doc.amount;
      db.count({ value: -1, amount: amt }, function (err, count) {
        if(count === 3) {
          db.find({ value: -1, amount: amt }, function (err, docs) {
            db.update({ value: -1, amount: amt }, { $set: { "category": "H_trans", } }, { multi: true }, function (err, numReplaced) {
              console.log("******H TRANS********");
              console.log(err, numReplaced);
            });
          })
        }
      });
    })
  });
}

function findRTran(db){
  db.update({ value: -1, category: { $exists: false } }, { $set: { "category": "R_trans", } }, { multi: true }, function (err, numReplaced) {
    console.log("******R TRANS********");
    console.log(err, numReplaced);
  });
}


// function listTrans(dbName) {
//   var thisDB = loadDB(dbName);
//   thisDB.find({ }, function (err, docs) {
//   });
// }

// function listTransByCat(dbName) {
//   var thisDB = loadDB(dbName);
//   var transCat = req.params.cat;
//     thisDB.find({category: transCat }, function (err, docs) {
//       res.json(docs);
//     });
// }

// function loadDB(dbpath, callback) {

//   var dbPathName = dbpath;

//     var db = new Datastore({
//         filename: dbPathName,
//         autoload: true
//     });
//     db.loadDatabase(function(err) { // Callback is optional
//         // Now commands will be executed
//         console.log("db loaded with path ", dbPathName);
//         callback
//     });

//     return db;
// }

// /**
//   Return a list of routes supported by this controller.
//   Map path to function (action)
// */
// module.exports.routes = function routes() {
//   return [
//     {method:'get', path:'/findSalary/:stm', action:findSalary, role:'guest'},
//     {method:'get', path:'/findBTran/:stm', action:findBTran, role:'guest'},
//     {method:'get', path:'/findCTran/:stm', action:findCTran, role:'guest'},
//     {method:'get', path:'/findHTran/:stm', action:findHTran, role:'guest'},
//     {method:'get', path:'/findRTran/:stm', action:findRTran, role:'guest'},
//      {method:'get', path:'/findSTran/:stm', action:findSTran, role:'guest'},
//     {method:'get', path:'/listTrans/:stm', action:listTrans, role:'guest'},
//     {method:'get', path:'/listTransByCat/:stm/:cat', action:listTransByCat, role:'guest'}
//   ]
// }
