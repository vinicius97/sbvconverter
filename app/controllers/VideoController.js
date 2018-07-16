const VideoModel = require('../models/VideoModel')
const { createJob } = require('../services/ZencoderService')

module.exports = {
  async create(title, fileDetails, key, cb) {
    try{
      let params = {
        bucket  : fileDetails.Bucket,
        title   : title,
        filename: title + key,
        key     : key,
        url     : '',
        input   : fileDetails.Location,
        status  : '',
      }

      let video = new VideoModel(params)
      let videoObject = video
      await video.save((err) => {
        if (err) {
          console.log('Erro ao salvar parametros do vídeo', err)
          videoObject = null
        }else{
          console.log('created video object: ', videoObject)
        }
      })

      return cb(videoObject)

    }catch (e) {
      return null
    }

  },
  async update(id, params) {
    VideoModel.findByIdAndUpdate(
      id,
      params,
      {new: true},
      (err) => {
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

  async handleEncode({ bucket, input, key }) {
    const jobResult = await createJob({input, bucket, key})

    return jobResult.data
  }
}