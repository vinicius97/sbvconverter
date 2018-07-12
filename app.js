const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const io = require('socket.io')();
const mongoose = require('mongoose');

const indexRouter = require('./app/router');

const app = express();

mongoose.connect('mongodb://admin:00admin@ds141320.mlab.com:41320/associapp-db1')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter(io));

module.exports = app;
