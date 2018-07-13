const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const routes = require('./app/routes')

mongoose.connect('mongodb://admin:00admin@ds141320.mlab.com:41320/associapp-db1')
app.io = require('socket.io')();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use('/', routes(app.io))

module.exports = app