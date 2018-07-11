const express = require('express')
const VideoController = require('../controllers/VideoController')
const router = express.Router()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/list', (req, res, next) => {
  VideoController.handleUploadToS3(req.file)
})

router.post('/upload', upload.single(), (req, res, next) => {
  VideoController.handleUploadToS3(req.file)
})

module.exports = router;
