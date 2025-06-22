'use strict';

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     shopId: userId,
            //     publicKey,
            //     privateKey 
            // })

            //level xxx
            const filter = {shopId: userId}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static findById = async ({ userId }) => {
        return await keyTokenModel.findOne({ shopId: new Types.ObjectId(userId)}).lean()
    }

    static removeById = async (_id) => {
        return await keyTokenModel.deleteOne({_id: new Types.ObjectId(_id)})
    }

    static findByRefreshTokenUsed = async ({ refreshToken }) => {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async ({ refreshToken }) => {
        return await keyTokenModel.findOne({refreshToken})
    }

    static deleteById = async ({ userId }) => {
        return await keyTokenModel.findOneAndDelete({ shopId: new Types.ObjectId(userId)})
    }

    
}

module.exports = KeyTokenService;