const express = require('express');
const router = express.Router()
const VideoController = require('../controllers/VideoController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  VideoController.handleUploadToS3()
  res.end('Video');
});

module.exports = router;
