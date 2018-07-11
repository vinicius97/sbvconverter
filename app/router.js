const express = require('express');
const router = express.Router();
const VideoRoute = require('./routes/VideoRoute')

module.exports = (io) => {

  router.use('/video', VideoRoute(io));

}
