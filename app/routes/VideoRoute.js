const express = require('express')

const VideoController = require('../controllers/VideoController')
const router = express.Router()

module.exports = (io) => {

  router.use('/events', (req, res, next) => {
    io.on('upload', () => {
      console.log('Upload socket')
    })
  })

  router.get('/list', (req, res, next) => {
    res.end()
  })

  router.get('/video', (req, res, next) => {
    res.end()
  })

  router.post('/upload', async (req, res, next) => {
    socket.emit('upload status', 'enviando')
    await VideoController.handleUpload()
  }, (req, res) => {
    socket.emit('upload status', 'encodando')
    res.end()
  })

}
