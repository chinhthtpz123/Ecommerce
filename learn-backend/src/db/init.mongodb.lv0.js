'use strict';

const mongoose = require('mongoose');

const stringConnection = "mongodb://localhost:27017/ShopBE";

mongoose.connect(stringConnection).then(_ => console.log('MongoDb connected successsfully'))
.catch(err => {
    console.error('Error connecting to MongoDb', err);
})

if(1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true})
}

module.exports = mongoose;