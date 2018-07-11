const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title   : {type:  String},
  url     : {type:  String},
  status  : {type: String, default: 'Enviando'}
});

module.exports = mongoose.model('Video', VideoSchema);