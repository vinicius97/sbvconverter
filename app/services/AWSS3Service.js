const fs = require('fs')
const multer = require('multer')
const AWS = require('aws-sdk')
const awsCredentials = require('../../config.json').aws
AWS.config.accessKeyId = awsCredentials.accessKeyId
AWS.config.secretAccessKey = awsCredentials.secretAccessKey

const s3Stream = require('s3-upload-stream')(new AWS.S3())

module.exports = {
  upload: multer({ dest: 'uploads/' }),
  async uploadToS3(file, key, cb) {

    const read = fs.createReadStream(file.path)
    const upload = s3Stream.upload({
      ACL: 'public-read',
      Bucket: 'sbtfullstack',
      Key: key
    });

    console.log({
      ACL: 'public-read',
      Bucket: 'sbtfullstack',
      Key: key
    })

    upload.maxPartSize(5971520)
    upload.concurrentParts(1)

    upload.on('error', function (error) {
      console.log(error)
    })

    upload.on('part', function (details) {
      console.log(details)
    })

    upload.on('uploaded', cb)

    read.pipe(upload)
  }
}