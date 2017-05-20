var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  permanent_token: {
    type: String,
    trim: true
  },

  id_user: {
    type: String,
    trim: true
  },

  id_bank: {
    type: String,
    trim: true
  },

  balance: {
    type: String,
    trim: true
  },

  id: {
    type: String,
    trim: true
  },

  accounts: []


});


var User = mongoose.model('User', userSchema);

module.exports = User;
