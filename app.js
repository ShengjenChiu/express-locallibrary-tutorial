var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware chain
app.use('/', catalogRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//import mongoose module
const mongoose = require("mongoose");

//import environmental variables
require('dotenv').config();


//encode password
const adminPassword = encodeURIComponent(process.env.ADMIN_PASSWORD);

//setup default mongoose connection
//note: must include "local_library" before the "?" mark.
const mongodbURL = `mongodb+srv://shengchiu:${adminPassword}@cluster0.49zwhi5.mongodb.net/local_library?retryWrites=true&w=majority`;
mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true });


//Get the default connection
const db = mongoose.connection;


//Bind connection to error event
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// console.log("after db.on()");

module.exports = app;
