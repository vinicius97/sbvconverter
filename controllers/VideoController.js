const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const clientEncoder = require('zencoder')('fecbaa90d94d27af5d319d20165b8447')
const bucketName = 'sbtfullstack'

const handleMoveEncodedToS3 = (job) => {
  clientEncoder.Job.details(job.id, async (err, data) => {
    const outputData = data.job.output_media_files
    console.log('Detalhes do job OK')
  })
}

const handleEncode = (filename) => {
  clientEncoder.Job.create({input: `https://s3-sa-east-1.amazonaws.com/${bucketName}/${filename}`}, function(err, data) {
    if (err) {
      console.log(err)
    }else{
      handleMoveEncodedToS3(data)
    }
  });
}

module.exports = {
  handleUploadToS3(videofile){
    fs.readFile(videofile, (err, data) => {
      if (err) {
        throw err;
      }
      const params = {
        Body: data,
        Bucket: bucketName,
        Key: 'VideoTeste.mp4'
      }

      s3.putObject(params, (err) => {
        if (err) {
          console.log(err)
        } else {
          const aclParams = {
            ACL: 'public-read',
            Bucket: bucketName,
            Key: 'VideoTeste.mp4'
          }

          s3.putObjectAcl(aclParams, (err, data) => {
            if (err) {
              console.log(err)
            } else {
              //handleEncode(params.Key) TODO IMPLEMENTAR ENCODE DOS VÍDEOS
            }
          })
        }
      })
    })
  }
}