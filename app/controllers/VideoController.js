const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const multer  = require('multer')
const multerS3 = require('multer-s3')

const VideoModel = require('../models/VideoModel')
const { createJob } = require('../services/ZencoderService')

const create = async (params) => {
  let Video = new VideoModel(params)
  return await Video.save((err) => {
    if (err) {
      console.log(err)
    }
  })
}

const update = async (filename, params) => {
  /*VideoModel.findOneAndUpdate({filename}, {...params}, {new: true}, (err, video) => {
    if(err)
      console.log(err)
  })*/
}


module.exports = {
  getVideos() {
    return VideoModel.find({}, (err, videos) => videos)
  },
  handleUpload() {
    const filename = `${Date.now().toString()}.mp4`

    create({
      title   : filename,
      filename: filename,
      url     : '',
      status  : ''
    })

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