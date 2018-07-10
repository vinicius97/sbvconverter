const fs = require('fs')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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
        Key: "VideoTeste.mp4",
      }

      s3.putObject(params, function (err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log("Dados enviados com sucesso para sbtfullstack/frontend")
        }
      })
    })
  }
}