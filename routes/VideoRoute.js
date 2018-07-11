const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/list', (req, res, next) => {
  res.end()
})

router.post('/upload', upload.single('video'), async (req, res) => {
  let done = await VideoController.handleUploadToS3(req.file)
  res.end()
})

module.exports = router;
