'use strict';

const shopModel = require("../models/shop.model");
const { ShopRoles } = require("../constants/shop.constant");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError, NotFoundError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const keyTokenModel = require("../models/keyToken.model");


class AccessService {

    // handle refreshtoken v2
    static handlerRefreshTokenV2 = async ({user, keyStore, refreshToken}) => {
        const { userId, email } = user

        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteById({ userId });
            throw new ForbiddenError(
                "Something wrong happened !! please relogin"
            );
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop not registered");

        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered");

        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );
        // update
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });

        return {
            shop: { userId, email },
            tokens,
        };
    };

    // handler refreshToken
    // static handlerRefreshToken = async (refreshToken) => {
    //     const foundKey = await KeyTokenService.findByRefreshTokenUsed({
    //         refreshToken,
    //     });
    //     if (foundKey) {
    //         const { userId, email } = await verifyJWT(
    //             refreshToken,
    //             foundKey.privateKey
    //         );
    //         console.log("[1]--", userId, email);

    //         await KeyTokenService.deleteById({ userId });
    //         throw new ForbiddenError(
    //             "Something wrong happened !! please relogin"
    //         );
    //     }

    //     const holderKey = await KeyTokenService.findByRefreshToken({
    //         refreshToken,
    //     });
    //     if (!holderKey) throw new AuthFailureError("Shop not registered");

    //     const { userId, email } = await verifyJWT(
    //         refreshToken,
    //         holderKey.privateKey
    //     );
    //     // check userId
    //     const foundShop = await findByEmail({ email });
    //     if (!foundShop) throw new AuthFailureError("Shop not registered");

    //     // generate token
    //     const tokens = await createTokenPair(
    //         { userId, email },
    //         holderKey.publicKey,
    //         holderKey.privateKey
    //     );
    //     // update
    //     await holderKey.updateOne({
    //         $set: {
    //             refreshToken: tokens.refreshToken,
    //         },
    //         $addToSet: {
    //             refreshTokenUsed: refreshToken,
    //         },
    //     });

    //     return {
    //         shop: { userId, email },
    //         tokens,
    //     };
    // };

    // logout
    static logout = async (keyStore) => {
        const keyToken = await KeyTokenService.removeById(keyStore._id);
        console.log("keyStore::", keyToken);
        return keyToken;
    };

    // login
    /*
        1 - check email in dbs
        2 - match password
        3 - create AT and RT and save
        4 - generate tokens
        5 - get data and login 
    */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered");

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authenticaion error");

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({
                field: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };

    // sign up
    static signup = async ({ name, email, password }) => {
        // try {
        // a
        // step 1: check if email already exists
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError("Shop already registered");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [ShopRoles.SHOP],
        });

        if (newShop) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            console.log("tokens::", tokens);

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            });

            if (!keyStore) {
                throw new BadRequestError("Failed to create key token");
            }

            return {
                shop: getInfoData({
                    field: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }

        return {
            code: "xxxx",
            metadata: null,
        };
    };
}

module.exports = AccessService;
