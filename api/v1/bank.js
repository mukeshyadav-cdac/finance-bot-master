const datastore =  require('nedb-promise');

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

module.exports = {
  getCategoryRecord
}
