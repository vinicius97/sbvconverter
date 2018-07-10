const fs = require('fs')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const clientEncoder = require('zencoder')('fecbaa90d94d27af5d319d20165b8447')

const handleProgress = (job) => {
  clientEncoder.Job.progress(job.id, async (err, data) => {
    await setTimeout(() => console.log(data), 3000)
  })
}

const handleEncode = (filename) => {
  clientEncoder.Job.create({input: `https://s3-sa-east-1.amazonaws.com/sbtfullstack/${filename}`}, function(err, data) {
    if (err) {
      console.log(err)
      return
    }else{
      handleProgress(data)
    }
  });
}

module.exports = {
  handleUploadToS3(){
    const bucketName = 'sbtfullstack'

    fs.readFile('./videoteste.mp4', (err, data) => {
      if (err) {
        throw err;
      }
      const params = {
        Body: data,
        Bucket: bucketName,
        Key: 'VideoTeste.mp4'
      }

      s3.putObject(params, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Dados enviados com sucesso para sbtfullstack/frontend")

          const aclParams = {
            ACL: 'public-read',
            Bucket: bucketName,
            Key: 'VideoTeste.mp4'
          }

          s3.putObjectAcl(aclParams, function (err, data) {
            if (err) {
              console.log(err)
            } else {
              handleEncode(params.Key)
            }
          })
        }
      })
    })
  }
}