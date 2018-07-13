const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoSchema = new Schema({
  encode_id : {type: String},
  output_id : {type: String},
  title     : {type: String},
  url       : {type: String},
  input     : {type: String},
  status    : {type: String, default: 'Enviando'}
})

module.exports = mongoose.model('VideoModel', VideoSchema)