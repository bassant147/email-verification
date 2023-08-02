const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    required: true
  }
});

const Check = mongoose.model('Check', CheckSchema);
module.exports = Check;