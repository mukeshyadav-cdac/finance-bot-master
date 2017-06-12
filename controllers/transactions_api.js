var Datastore = require('nedb');
var promiseDatastore = require('nedb-promise');
//var async = require('async');
//var chainMethods = [findSalary, findBTran, findCTran, findSTran, findHTran, findRTran];
console.log("TRANSACTION API LOADED!!");

module.exports = async function(dbName) {
  var dbPathName = './db/'+ dbName;
  var db = promiseDatastore({
    filename: dbPathName,
    autoload: true
  });
  console.log("DATASTORE LOADED FROM TRANSACTION API");
  console.log(db);

  console.log("TRANSCATION API - db loaded with path ", dbPathName);
  //   chainMethods.forEach(function(chainMethod) {
  //     setTimeout(function() {
  //       chainMethod(db);
  //   }, 60000)
  // });
  debugger
  //await Promise.all([findSalaryAsync(db), findBTranAsync(db), findCTranAsync(db), findSTranAsync(db), findHTranAsync(db), findRTranAsync(db)])
  await findSalaryAsync(db);
  await findBTranAsync(db);
  await findCTranAsync(db);
  await findSTranAsync(db);
  await findHTranAsync(db);
  await findRTranAsync(db);

  // db.loadDatabase(function(err) { // Callback is optional
    
  // });
}

// function findSalary(db) {
//   db.find({ value: 1 }).sort({amount: 1}).exec(function (err, docs) {
//     docs.forEach(function(doc){
//       var salaryLabel = doc.label;
//       var count = 0;

//       db.count({ value: 1, label: salaryLabel }, function (err, count) {
//         console.log("count is ->",count);
//         if(count === 3) {
//           db.find({ value: 1, label: salaryLabel }, function (err, docs) {
//             db.update({ value: 1, label: salaryLabel }, { $set: { "category": "salary", } }, { multi: true }, function (err, numReplaced) {
//               console.log("****SALARY SEARCH********");
//               console.log(err, numReplaced);
//             });
//           });
//         }
//       });

//     });
//   });
// }


async function findSalaryAsync(db) {
  debugger
  console.log("IN findSalaryAsync FUNCTION");
  let docs = await db.cfind({ value: 1 }).sort({amount: 1}).exec();
  docs.forEach(async function(doc) {
    var salaryLabel = doc.label;
    //var count = 0;
    let count = await db.count({ value: 1, label: salaryLabel });
    //debugger
    if(count === 3) {
      await db.find({ value: 1, label: salaryLabel });
      let numReplaced = await db.update({ value: 1, label: salaryLabel }, { $set: { "category": "salary", } }, { multi: true });
      console.log(numReplaced);
    }
  });
  console.log("IN findSalaryAsync FUNCTION-----END")
}

// function findBTran(db) {
//   db.find({ value: -1, $or: [{paymentlabel: /PAIEMENT CARTE/}, {paymentlabel: /FRAIS/}] }, function (err, docs) {
//     docs.forEach(function(doc) {
//       var amt = doc.amount;
//       var label = doc.label;
//       var sourcelabel = doc.sourcelabel;
//       var count = 0;

//       db.count({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, function (err, count) {
//         if(count === 3) {
//           db.find({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, function (err, docs) {
//             if(docs[0].month === docs[1].month || docs[0].month === docs[2].month || docs[1].month == docs[2].month) {
//               console.log("skipping ");
//             } else {
//               var dateVar1 = parseInt(docs[0].date) - parseInt(docs[1].date);
//               var dateVar2 = parseInt(docs[1].date) - parseInt(docs[2].date);
//               console.log(dateVar1, dateVar2);
//               if(Math.abs(dateVar1) < 3 && Math.abs(dateVar2) <3) {
//                 db.update({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, { $set: { "category": "B_trans", } }, { multi: true }, function (err, numReplaced) {
//                   console.log("******BTRAN********");
//                   console.log(err, numReplaced);
//                 });
//                 console.log("****");
//               }
//               else{
//                 console.log("too variant");
//               }
//             }
//           });
//         }
//       });
//     });
//   });
// }

async function findBTranAsync(db) {
  debugger
  console.log("IN findBTranAsync FUNCTION")
  let docs = await db.find({ value: -1, $or: [{paymentlabel: /PAIEMENT CARTE/}, {paymentlabel: /FRAIS/}] });
  docs.forEach(async function(doc) {
      var amt = doc.amount;
      var label = doc.label;
      var sourcelabel = doc.sourcelabel;
      //var count = 0;
      let count = await db.count({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] });
      //debugger
      if(count === 3) {
          let documents = await db.find({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] });
          if(documents[0].month === documents[1].month || documents[0].month === documents[2].month || documents[1].month == documents[2].month) {
              console.log("skipping ");
          } else {
            var dateVar1 = parseInt(documents[0].date) - parseInt(documents[1].date);
            var dateVar2 = parseInt(documents[1].date) - parseInt(documents[2].date);
            console.log(dateVar1, dateVar2);
            if(Math.abs(dateVar1) < 3 && Math.abs(dateVar2) <3) {
              let numReplaced = await db.update({ value: -1, amount: amt, $or: [{label: label},{sourcelabel: sourcelabel}] }, { $set: { "category": "B_trans", } }, { multi: true });
              console.log("******BTRAN********");
              console.log(err, numReplaced);
              console.log("****");
            }
            else{
              console.log("too variant");
            }
          }
        }
    });
    console.log("IN findBTranAsync FUNCTION-----END")
}

// function findCTran(db) {
//   db.find({ value: -1 , label: /PRLV SEPA/ }, function (err, docs) {
//     var count = 0;
//     docs.forEach(function(doc) {
//       var label = doc.label;
//       console.log("******", label, doc.month);
//       db.count({ value: -1, label: label }, function (err, count) {
//         console.log(count);
//         if(count === 3) {
//           db.find({ value: -1, label: label }, function (err, docs) {
//             db.update({ value: -1, label: label }, { $set: { "category": "C_trans", } }, { multi: true }, function (err, numReplaced) {
//               console.log("*******C TRANS*******");
//               console.log(err, numReplaced);
//             });
//           });
//         }
//       });
//       count++;
//     });
//   });
// }

async function findCTranAsync(db) {
  console.log("IN findCTranAsync FUNCTION")
  debugger
  let docs = await db.find({ value: -1 , label: /PRLV SEPA/ });
  var counter = 0;
    docs.forEach(async function(doc) {
      var label = doc.label;
      console.log("******", label, doc.month);
      let count = await db.count({ value: -1, label: label });
      //debugger
      console.log(count);
      if(count === 3) {
        await db.find({ value: -1, label: label });
        let numReplaced = await db.update({ value: -1, label: label }, { $set: { "category": "C_trans", } }, { multi: true });
        console.log("*******C TRANS*******");
        console.log(err, numReplaced);
      }
      counter++;
    });
    console.log("IN findCTranAsync FUNCTION-----END")
}

// function findSTran(db) {
//   db.find({ value: -1 , label: /VIR/, $not:{label: /VIR SEPA/}}, function (err, docs) {
//     var count = 0;
//     docs.forEach(function(doc) {
//       var amt = doc.amount;
//       var lbl = doc.label;
//       console.log("****AMOUNT IS **** ",amt, lbl);
//       db.count({ value: -1, amount: amt, label: lbl }, function (err, count) {
//         console.log(count, lbl);
//         if(count === 3) {
//           db.find({ value: -1, amount: amt, label: lbl }, function (err, docs) {
//             if(docs[0].month === docs[1].month || docs[0].month === docs[2].month || docs[1].month == docs[2].month) {
//               console.log("skipping ");
//             } else {
//               db.update({ value: -1, amount: amt, label: lbl}, { $set: { "category": "S_trans", } }, { multi: true }, function (err, numReplaced) {
//                 console.log("******S TRANS********");
//                 console.log(err, numReplaced);
//               });
//             }
//           })
//         }
//       });
//     })
//   });
// }

async function findSTranAsync(db) {
  console.log("IN findSTranAsync FUNCTION")
  debugger
  let docs = await db.find({ value: -1 , label: /VIR/, $not:{label: /VIR SEPA/}});
  //var count = 0;
  docs.forEach(async function(doc) {
    var amt = doc.amount;
    var lbl = doc.label;
    console.log("****AMOUNT IS **** ",amt, lbl);
    let count = await db.count({ value: -1, amount: amt, label: lbl });
    console.log(count, lbl);
    //debugger
    if(count === 3) {
      let documents = await db.find({ value: -1, amount: amt, label: lbl });
      if(documents[0].month === documents[1].month || documents[0].month === documents[2].month || documents[1].month == documents[2].month) {
          console.log("skipping ");
      } else {
        let numReplaced = await db.update({ value: -1, amount: amt, label: lbl}, { $set: { "category": "S_trans", } }, { multi: true });
        console.log("******S TRANS********");
        console.log(err, numReplaced);
      }
    }
  });
  console.log("IN findSTranAsync FUNCTION-----END")
}

// function findHTran(db) {
//   db.find({ value: -1 , label: /VIR SEPA/ }).sort({"amount" : -1}).exec(function (err, docs) {
//     var count = 0;
//     docs.forEach(function(doc){
//       var amt = doc.amount;
//       db.count({ value: -1, amount: amt }, function (err, count) {
//         if(count === 3) {
//           db.find({ value: -1, amount: amt }, function (err, docs) {
//             db.update({ value: -1, amount: amt }, { $set: { "category": "H_trans", } }, { multi: true }, function (err, numReplaced) {
//               console.log("******H TRANS********");
//               console.log(err, numReplaced);
//             });
//           })
//         }
//       });
//     })
//   });
// }

async function findHTranAsync(db) {
  console.log("IN findHTranAsync FUNCTION")
  debugger
  let docs = await db.cfind({ value: -1 , label: /VIR SEPA/ }).sort({"amount" : -1}).exec();
  //var count = 0;
  docs.forEach(async function(doc){
    var amt = doc.amount;
    let count = await db.count({ value: -1, amount: amt });
    //debugger
    if(count === 3) {
      await db.find({ value: -1, amount: amt });
      let numReplaced = await db.update({ value: -1, amount: amt }, { $set: { "category": "H_trans", } }, { multi: true });
      console.log("******H TRANS********");
      console.log(err, numReplaced);
    }
  });
  console.log("IN findHTranAsync FUNCTION-----END")
}

// function findRTran(db){
//   db.update({ value: -1, category: { $exists: false } }, { $set: { "category": "R_trans", } }, { multi: true }, function (err, numReplaced) {
//     console.log("******R TRANS********");
//     console.log(err, numReplaced);
//   });
// }

async function findRTranAsync(db){
  console.log("IN findRTranAsync FUNCTION")
  debugger
  let numReplaced = await db.update({ value: -1, category: { $exists: false } }, { $set: { "category": "R_trans", } }, { multi: true });
  console.log("******R TRANS********");
  console.log(numReplaced);
  console.log("IN findRTranAsync FUNCTION-----END")
}