const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoSchema = new Schema({
  bucket    : {type: String},
  encode_id : {type: String},
  filename  : {type: String},
  key       : {type: String},
  output_id : {type: String},
  title     : {type: String},
  url       : {type: String},
  input     : {type: String},
  status    : {type: String, default: 'Enviando'},
  uid       : {type: String}
})

module.exports = mongoose.model('VideoModel', VideoSchema)