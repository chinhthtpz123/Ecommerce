'use strict';

const { Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'apiKey';
const COLLECTIONS_NAME = 'apiKeys';

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permissions:{
        type:[String],
        required:true,
        enum: ['0000', '1111', '2222'], // Example permissions
    },
}, {
    collection: COLLECTIONS_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);