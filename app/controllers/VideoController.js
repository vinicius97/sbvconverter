const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const multer  = require('multer')
const multerS3 = require('multer-s3')

const VideoModel = require('../models/VideoModel')
const { createJob } = require('../services/ZencoderService')

module.exports = {
  async create(title, file) {

    let params = {
      title   : title,
      filename: file.key,
      url     : '',
      input   : file.location,
      status  : ''
    }

    let video = new VideoModel(params)
    return await video.save((err) => {
      if (err) {
        console.log('Erro ao salvar parametros do vídeo', err)
      }
    })
  },
  async update(params) {
    VideoModel.findOneAndUpdate({filename: params.filename}, params, {new: true}, (err, object) => {
      if(err){
        console.log(err)
      }else{
        console.log('Atualizado com sucesso', object)
      }
    })
  },

  async getVideoObject(query = {}) {
    try{
      return await VideoModel.find(query, (err, videos) => videos)
    }catch (e) {
      console.log(e)
      return null
    }
  },

  handleUpload() {
    const filename = `${Date.now().toString()}.mp4`

    return multer({
      storage: multerS3({
        s3,
        bucket: 'sbtfullstack',
        metadata: (req, file, cb) => {
          cb(null, { fieldName: filename });
        },
        key: (req, file, cb) => {
          cb(null, filename)
        }
      })
    }).single('video')
  },
  async handleEncode({bucket, key}) {
    const input = `https://s3-sa-east-1.amazonaws.com/${bucket}/${key}`
    const jobResult = await createJob({input, bucket, key})

    return jobResult.data
  }
}