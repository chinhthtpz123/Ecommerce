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


//init db
// require('./db/init.mongodb.lv0')
require('./db/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

//init routes
app.get('/', (req, res, next) => {
    const strCompression = 'Hello World';

    return res.status(200).json({
        message: "Welcome to the API",
        metadata: strCompression.repeat(100000)
    })
})


//handle errors

module.exports = app;