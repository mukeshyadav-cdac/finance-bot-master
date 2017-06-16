var ASYNC   = require('async');
var Datastore = require('nedb');

module.exports =  function(userId, _callback) {
  var dbPathName = './db/'+ userId;
  var thisDB = new Datastore({ filename: dbPathName, autoload: true });
  thisDB.loadDatabase(function(err) {
    var totalRTrans = 0;
    var totalSTrans = 0;
    var totalBTrans = 0;
    var totalCTrans = 0;
    var totalHTrans = 0;
    var totalSalary = 0;
    var finalRes = [];
    thisDB.find({ category: "R_trans" }, function (err, docs) {
      console.log("r trans search");
      ASYNC.forEachSeries(docs, function(doc, callback) {
        console.log(doc.category);
        totalRTrans = totalRTrans + Math.abs(doc.amount);
        callback();
      }, function(err) {
        console.log(err);
        finalRes["r_transactions"] = totalRTrans;
        thisDB.find({ category: "S_trans" }, function (err, docs) {
          console.log("here");
          ASYNC.forEachSeries(docs, function(doc, callback) {
            console.log(doc.category);
            totalSTrans = totalSTrans + Math.abs(doc.amount);
            callback();
          }, function(err) {
            console.log(err);
            finalRes["s_transactions"] = totalSTrans;
            thisDB.find({ category: "B_trans" }, function (err, docs) {
              console.log("here");
              ASYNC.forEachSeries(docs, function(doc, callback) {
                console.log(doc.category);
                totalBTrans = totalBTrans + Math.abs(doc.amount);
                callback();
              }, function(err) {
                console.log(err);
                finalRes["b_transactions"] = totalBTrans;
                thisDB.find({ category: "C_trans" }, function (err, docs) {
                  console.log("here");
                  ASYNC.forEachSeries(docs, function(doc, callback) {
                    console.log(doc.category);
                    totalCTrans = totalCTrans + Math.abs(doc.amount);
                    callback();
                  }, function(err) {
                    console.log(err);
                    finalRes["c_transactions"] = totalCTrans;
                    thisDB.find({ category: "H_trans" }, function (err, docs) {
                      console.log("here");
                      ASYNC.forEachSeries(docs, function(doc, callback) {
                        console.log(doc.category);
                        totalHTrans = totalHTrans + Math.abs(doc.amount);
                        callback();
                      }, function(err) {
                        console.log(err);
                        finalRes["h_transactions"] = totalHTrans;
                        thisDB.find({ category: "salary" }, function (err, docs) {
                          console.log("salary compute");
                          ASYNC.forEachSeries(docs, function(doc, callback) {
                            console.log(doc.category);
                            totalSalary = totalSalary + Math.abs(doc.amount);
                            callback();
                          }, function(err) {
                            console.log(err);
                            finalRes["salary"] = totalSalary;
                            var tmp = finalRes["c_transactions"];
                            console.log(tmp);
                            var BCH = finalRes["b_transactions"] + finalRes["c_transactions"] + finalRes["h_transactions"];
                            console.log(BCH);
                            var spendable = finalRes["salary"] - BCH - finalRes["c_transactions"];
                            console.log(spendable);
                            var weeklySpendable = spendable / 4;
                            _callback({
                              b_transactions: finalRes["b_transactions"],
                              c_transactions: finalRes["c_transactions"],
                              h_transactions: finalRes["h_transactions"],
                              monthly_spendable: spendable,
                              weekly_spendable: weeklySpendable
                            });
                          });
                        }); //salary loop closed
                      });
                    }); //third loop closed
                  });
                }); //fourth loop closed
              });
            }); //third loop closed
          });
        }); //second loop closed
      });    //outermost loop  closed
    });
  });
}


