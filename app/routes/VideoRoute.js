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
    res.end()
  })

  router.post('/upload', VideoController.handleUpload(), (req, res, next) => {
    const title = req.body.title
    const file = req.file
    VideoController.create(title, file)
    res.send(file)
  })

  router.post('/encode', async (req, res, next) => {
    try{

      io.emit('upload status', 'Encodando')
      const { bucket, key } = req.body
      const encodeResult = await VideoController.handleEncode({ bucket, key })

      let newParams = {
        encode_id : encodeResult.id,
        output_id : encodeResult.outputs[0].id,
        url       : encodeResult.outputs[0].url,
        status    : 'Encodando'
      }

      VideoController.update(newParams)

    }catch (e) {
      io.emit('upload status', 'Falha')
    }finally {
      res.end()
    }
  })

  return router
}
