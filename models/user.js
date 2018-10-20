const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  preferences: [{
    type: String,
    enum: ['60s', '70s', '80s', 'medieval', 'prehistoric']
  }],
  picture: String,
  description: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
