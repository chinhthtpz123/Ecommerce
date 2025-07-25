'use strict';

const { Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    shopId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'Shop',
    },
    privateKey: {
        type: String, required: true,
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshTokenUsed: {
        type: Array, default: [] // nhung RT da duoc su dung
    },
    refreshToken:{
        type: String, required: true
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);