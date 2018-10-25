const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  name: String,
  description: String,
  picture: String,
  era: { type: String,
    enum: ['Contemporary History', 'Late Modern Period', 'Early Modern Period', 'Middle Ages', 'Classical Era', 'Prehistory']
  },
  date: Date,
  // location: {
  //   lat: String,
  //   long: String
  // },
  attendees: [{
    type: ObjectId,
    ref: 'User'
  }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
