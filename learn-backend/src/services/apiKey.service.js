'use strict';

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('node:crypto');

const findById = async (key) => {
    try {
        // const newKey = await apiKeyModel.create({key: crypto.randomBytes(64).toString('hex'), permissions: ['0000']})
        // console.log('newKey::', newKey);
        const objectKey = await apiKeyModel.findOne({key, status: true}).lean();
        return objectKey ? objectKey : null;
    } catch (error) {
        
    }
}

module.exports = {
    findById
}