const datastore =  require('nedb-promise');
var facebook_message = require('../../facebook/message.js');


async function getCategoryRecord(req, res) {
  var dbPathName = './db/'+ req.body.userId;
  var DB = datastore({
    filename: dbPathName,
    autoload: true
  });
  var doc = await DB.findOne({ category: req.body.category });
  console.log(doc);
  res.status(200).send(doc);
}

function getWeeklyMonthly(req, res) {
  facebook_message.rules({userId: req.body.userId, done: 'rules'});
  res.status(200);
}

module.exports = {
  getCategoryRecord,
  getWeeklyMonthly
}

