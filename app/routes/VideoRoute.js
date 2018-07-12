const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

module.exports = () => {

  router.get('/list', async (req, res, next) => {
    res.send(await VideoController.getVideos())
  })

  router.get('/:id', (req, res, next) => {
    res.end()
  })

  router.post('/notification', (req, res, next) => {
    res.end()
  })

  router.post('/upload', VideoController.handleUpload(), async (req, res, next) => {
    res.send(req.file)
  })

  router.post('/encode', async (req, res, next) => {
    const { bucket, key } = req.body
    const encodedFile = await VideoController.handleEncode({ bucket, key })
    res.send(encodedFile)
  })

  return router
}
