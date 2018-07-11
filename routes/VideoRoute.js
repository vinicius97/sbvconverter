const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

router.get('/list', (req, res, next) => {
  res.end()
})

router.get('/video', (req, res, next) => {
  res.end()
})

router.post('/upload', VideoController.handleUploadToS3(), async (req, res) => {
  res.end()
})

module.exports = router;
