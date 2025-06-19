'use strict';

const shopModel = require("../models/shop.model");
const { ShopRoles } = require("../constants/shop.constant");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");


class AccessService {

    static signup = async ({name, email, password}) => {
        // try {
        // a
            // step 1: check if email already exists
        const holderShop = await shopModel.findOne({email}).lean();
        if (holderShop) {
            throw new BadRequestError('Shop already registered')
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [ShopRoles.SHOP]
        })
        
        if(newShop) {
            const accessTokenKey = crypto.randomBytes(64).toString("hex");
            const refreshTokenKey = crypto.randomBytes(64).toString("hex");

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                accessTokenKey,
                refreshTokenKey,
            });

            if (!keyStore) {
                throw new BadRequestError("Failed to create key token");
            }

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                accessTokenKey,
                refreshTokenKey
            );
            console.log("tokens::", tokens);

            return {
                shop: getInfoData({
                    field: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }
        
        return {
            code: 'xxxx',
            metadata: null
        }
    }
}

module.exports = AccessService;
