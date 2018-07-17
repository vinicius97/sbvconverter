const express = require('express')
const VideoController = require('../controllers/VideoController')
const AWSService = require('../services/AWSS3Service')
const router = express.Router()

module.exports = (io) => {

  router.get('/list', async (req, res, next) => {
    res.send(await VideoController.getVideoObject())
  })

  router.get('/:id', async (req, res, next) => {
    res.send(await VideoController.getVideoObject({_id: req.params.id}))
  })

  router.post('/job/callback', (req, res, next) => {
    const { url } = req.body.output
    const key = url.split('_')[1].split('.')[0]
    io.emit('upload status '+key, 'Finalizado')

    console.log(key, 'Emitted')

    res.end()
  })

  router.post('/upload', (req, res, next) => {
    res.setTimeout(24 * 60 * 60000, function(){ // Timeout 1 dia para requisições de uploads
      console.log('Time out na requisição de upload')
      res.send(408);
    });
    next()
  },
  AWSService.upload.single('video'),
  async (req, res) => {
    try{
      const { title, key } = req.body
      const video = req.file

      await AWSService.uploadToS3(video, key, async (fileDetails) => {
        await VideoController.create(title, fileDetails, key, (videoObject) => {
          res.send(videoObject)
        })
      })

    }catch (e) {
      console.log(e)
      io.emit('upload status '+req.body.key, 'Falha')
      res.send(null).end(500)
    }
  })

  router.post('/encode', async (req, res, next) => {
    try{
      const { _id, bucket, input, key } = req.body

      io.emit('upload status '+key, 'Encodando')
      const encodeResult = await VideoController.handleEncode({ bucket, input, key })

      let newParams = {
        encode_id : encodeResult.id,
        output_id : encodeResult.outputs[0].id,
        url       : encodeResult.outputs[0].url,
        status    : 'Encodando',
      }

      VideoController.update(_id, newParams)

      res.send({_id})

    }catch (e) {
      console.log('Erro ao tentar encodar')
      console.log(e)
      io.emit('upload status '+req.body.key, 'Falha')
      res.send(500)
    }
  })

  return router
}
