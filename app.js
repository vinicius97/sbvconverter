const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const routes = require('./app/routes')
const config = require('./config.json')

mongoose.connect(config.db)
app.io = require('socket.io')()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use('/', routes(app.io))

module.exports = app