const express = require('express');
const router = express.Router();
const VideoRoute = require('./routes/VideoRoute')

/* GET home page. */
router.use('/video', VideoRoute);

module.exports = router;
