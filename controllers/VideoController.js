const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = {
  handleUploadToS3(){
    const bucketName = 'sbtfullstack'
    const bucket = new AWS.S3({
      Bucket: bucketName,
    });

    const params = {
      Body: 'Javascript',
      Bucket: bucketName,
      Key: "exampleobject",
      ServerSideEncryption: "AES256",
      Tagging: "key1=value1&key2=value2"
    }

    s3.putObject(params, function(err, data) {
      if(err){
        console.log(err)
      }else{
        console.log("Dados enviados com sucesso para sbtfullstack/frontend")
      }
    })
  }
}