const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  user_pseudo: {type: String, required: true},
  text: { type: String, required: true }
});

module.exports = mongoose.model('Message', messageSchema);