'use strict';

const shopModel = require("../models/shop.model");
const { ShopRoles } = require("../constants/shop.constant");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");


class AccessService {

    static signup = async ({name, email, password}) => {
        try {
            // step 1: check if email already exists
            const holderShop = await shopModel.findOne({email}).lean();
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Email already exists',
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [ShopRoles.SHOP]
            })

            if(newShop) {
                const accessTokenKey = crypto.randomBytes(64).toString('hex');
                const refreshTokenKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    accessTokenKey,
                    refreshTokenKey
                })

                if(!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'Failed to create key token',
                    }
                }

                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    accessTokenKey,
                    refreshTokenKey
                );
                console.log('tokens::', tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ field: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 'xxxx',
                metadata: null,
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;
