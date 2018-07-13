const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

module.exports = (io) => {

  router.get('/list', async (req, res, next) => {
    res.send(await VideoController.getVideos())
  })

  router.get('/:id', (req, res, next) => {
    res.end()
  })

  router.post('/job/callback', (req, res, next) => {
    io.emit('upload status', 'Finalizado')
    res.end()
  })

  router.post('/upload', VideoController.handleUpload(), (req, res, next) => {
    res.end()
  })

  router.post('/encode', async (req, res, next) => {
    try{

      io.emit('upload status', 'Encodando')
      const { bucket, key } = req.body
      await VideoController.handleEncode({ bucket, key })

    }catch (e) {
      io.emit('upload status', 'Falha')
    }finally {
      res.end()
    }
  })

  return router
}
