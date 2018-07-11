const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

router.get('/list', async (req, res, next) => {
  res.send(await VideoController.getVideos())
})

router.get('/video', (req, res, next) => {
  res.end()
})

router.post('/upload', VideoController.handleUploadToS3(), (req, res, next) => {
  res.send('Encodando')
})

module.exports = router;
