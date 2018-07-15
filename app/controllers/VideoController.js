const AWS = require('aws-sdk')
const awsCredentials = require('../../config.json').aws
AWS.config.accessKeyId = awsCredentials.accessKeyId
AWS.config.secretAccessKey = awsCredentials.secretAccessKey

const s3 = new AWS.S3({signatureVersion: 'v2'})
const multer  = require('multer')
const multerS3 = require('multer-s3')

const VideoModel = require('../models/VideoModel')
const { createJob } = require('../services/ZencoderService')

module.exports = {
  async create(title, file) {
    try{
      let params = {
        bucket  : file.bucket,
        title   : title,
        filename: title + file.key,
        key     : file.key,
        url     : '',
        input   : file.location,
        status  : '',
      }

      let video = new VideoModel(params)
      let videoObject = video
      await video.save((err) => {
        if (err) {
          console.log('Erro ao salvar parametros do vídeo', err)
          videoObject = null
        }
      })

      return videoObject

    }catch (e) {
      return null
    }

  },
  async update(id, params) {
    VideoModel.findByIdAndUpdate(
      id,
      params,
      {new: true},
      (err, videoObject) => {
        // Handle any possible database errors
        if (err){
          return res.status(500).send(err);
        }
      }
    )
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
    try{
      return multer({
        storage: multerS3({
          s3,
          bucket: 'sbtfullstack',
          metadata: (req, file, cb) => {
            cb(null, { fieldName: req.body.key });
          },
          key: (req, file, cb) => {
            cb(null, req.body.key)
          }
        })
      }).single('video')
    }catch (e){
      console.log(e)
      return null
    }
  },
  async handleEncode({ bucket, key }) {
    const input = `https://s3-sa-east-1.amazonaws.com/${bucket}/${key}`
    const jobResult = await createJob({input, bucket, key})

    return jobResult.data
  }
}