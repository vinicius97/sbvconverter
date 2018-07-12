const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const multer  = require('multer')
const multerS3 = require('multer-s3')

const VideoModel = require('../models/VideoModel')
const clientEncoder = require('zencoder')('fecbaa90d94d27af5d319d20165b8447')

const createVideo = async (params) => {
  let Video = new VideoModel(params);
  return await Video.save((err) => {
    if (err) {
      console.log(err)
    }
  });
}

module.exports = {
  getVideos() {
    return VideoModel.find({}, (err, videos) => videos)
  },
  handleUpload() {
    const filename = `${Date.now().toString()}.mp4`

    createVideo({
      title   : filename,
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
    await clientEncoder.Job.create({input: `https://s3-sa-east-1.amazonaws.com/${bucket}/${key}`}, (err, data) => {
      if (err) {
        console.log(err)
        return null
      }else{
        return data
      }
    });
  }
}