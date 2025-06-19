'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();


// init middleware
app.use(morgan('dev'))
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
// require('./db/init.mongodb.lv0')
require('./db/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

//init routes
app.use('/', require('./routes'))


//handle errors

module.exports = app;