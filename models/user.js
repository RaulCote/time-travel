const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  password: String,
  preferences: [{
    type: String,
    enum: ['Contemporary History', 'Late Modern Period', 'Early Modern Period', 'Middle Ages', 'Classical Era', 'Prehistory']
  }],
  picture: String,
  description: String,
  email: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
