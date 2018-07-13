const express = require('express')
const router = express.Router()
const VideoRoute = require('./routes/VideoRoute')

module.exports = (io) => {

  router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    io.on('connection', function (client){

      console.log('conexão bem sucedida')

    });

    next();
  });

  router.use('/video', VideoRoute(io));

  return router
}
