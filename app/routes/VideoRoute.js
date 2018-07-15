const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

module.exports = (io) => {

  router.get('/list', async (req, res, next) => {
    res.send(await VideoController.getVideoObject())
  })

  router.get('/:id', async (req, res, next) => {
    res.send(await VideoController.getVideoObject({_id: req.params.id}))
  })

  router.post('/job/callback', (req, res, next) => {
    io.emit('upload status', 'Finalizado')
    console.log(req.body)
    res.end()
  })

  router.post('/upload', (req, res, next) => {
    res.setTimeout(24 * 60 * 60000, function(){ // Timeout 1 dia para requisições de uploads
      console.log('Request has timed out.');
      res.send(408);
    });
    next()
  },
  VideoController.handleUpload(),
  async (req, res, next) => {
    try{
      const title = req.body.title
      const file = req.file

      const videoObject = await VideoController.create(title, file)
      res.send(videoObject)
    }catch (e) {
      console.log(e)
      res.end()
    }
  })

  router.post('/encode', async (req, res, next) => {
    try{

      io.emit('upload status', 'Encodando')
      const { _id, bucket, key } = req.body
      const encodeResult = await VideoController.handleEncode({ bucket, key })

      let newParams = {
        encode_id : encodeResult.id,
        output_id : encodeResult.outputs[0].id,
        url       : encodeResult.outputs[0].url,
        status    : 'Encodando'
      }

      VideoController.update(_id, newParams)

      res.send({_id})

    }catch (e) {
      console.log('Erro ao tentar encodar')
      console.log(e)
      io.emit('upload status', 'Falha')
      res.send(500)
    }
  })

  return router
}
