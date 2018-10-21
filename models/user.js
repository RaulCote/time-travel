const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;
const eras = ['60s', '70s', '80s', 'medieval', 'prehistoric'];

const userSchema = new Schema({
  username: String,
  password: String,
  preferences: [{
    type: String,
    enum: eras
  }],
  picture: String,
  description: String,
  email: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
