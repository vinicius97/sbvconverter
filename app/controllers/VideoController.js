const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const multer  = require('multer')
const multerS3 = require('multer-s3')

const VideoModel = require('../models/VideoModel')
const clientEncoder = require('zencoder')('fecbaa90d94d27af5d319d20165b8447')
const bucket = 'sbtfullstack'

const handleMoveEncodedToS3 = (job) => {
  clientEncoder.Job.details(job.id, async (err, data) => {
    const outputData = data.job.output_media_files
    console.log('Detalhes do job OK')
  })
}

const handleEncode = (filename) => {
  clientEncoder.Job.create({input: `https://s3-sa-east-1.amazonaws.com/${bucket}/${filename}`}, function(err, data) {
    if (err) {
      console.log(err)
    }else{
      handleMoveEncodedToS3(data)
    }
  });
}

const createVideo = async (params) => {
  let Video = new VideoModel(params);
  return await Video.save(function (err) {
    if (err) {
      console.log(err)
    }
  });
}

module.exports = {
  getVideos: () => {
    return VideoModel.find({}, (err, videos) => videos)
  },
  handleUpload(){
    const filename = `${Date.now().toString()}.mp4`

    createVideo({
      title   : filename,
      url     : 'http://youtube.com',
      status  : 'Finalizado'
    })

    return multer({
      storage: multerS3({
        s3,
        bucket,
        acl: 'public-read',
        metadata: function (req, file, next) {
          next(null, { fieldName: file.fieldname });
        },
        key: function (req, file, next) {
          next(null, filename)
        }
      })
    }).single('video')
  }
}