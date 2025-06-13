'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const { db: { host, port, name } } = require('../configs/config.mongodb');
const stringConnection = `mongodb://${host}:${port}/${name}`;

console.log(`Connecting to MongoDB at ${stringConnection}`);

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(stringConnection).then(_ => {
            console.log('MongoDb connected successfully')
            countConnect();
        })
        .catch(err => console.log('Error connecting to MongoDb'));
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance;
    }
}

const initDb = Database.getInstance();
module.exports = initDb;