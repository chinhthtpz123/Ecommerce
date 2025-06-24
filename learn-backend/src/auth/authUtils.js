'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: 'x-rtoken-id'
};
 
const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // access token 
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '1h',
        })

        // refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7d',
        })

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if(err) {
                console.error('Access token verification failed:', err);
            } else {
                console.log('decoded::', decoded);
            }
        })

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error creating token pair:', error);
        throw error;
    }
}

/*
    check authenticaiton 
    1 - check userId missing
    2 - get accessToken
    3 - verify accessToken
    4 - check userId in db
    5 - check keyStore with userId
    6 - OK all -> return next()
*/ 

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invaild request')

    const keyStore = await KeyTokenService.findById({ userId })
    if(!keyStore) throw new NotFoundError('Not found keyStore')
    
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invaild request')
    
    try {
        const decoded = await JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decoded.userId) throw new AuthFailureError('Invaild userId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invaild Request')
    
    const foundKey = await KeyTokenService.findById({ userId })
    if(!foundKey) throw new NotFoundError('Not found key token')
    
    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if(refreshToken) {
        try {
            const decoded = await verifyJWT(refreshToken, foundKey.privateKey);
            if (userId !== decoded.userId)
                throw new AuthFailureError("Invaild userId");
            req.keyStore = foundKey;
            req.refreshToken = refreshToken;
            req.user = decoded;
            return next();
        } catch (error) {
            throw error
        } 
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invaild request");

    try {
        const decoded = await JWT.verify(accessToken, foundKey.publicKey);
        if (userId !== decoded.userId)
            throw new AuthFailureError("Invaild userId");
        req.keyStore = foundKey;
        req.user = decoded
        return next();
    } catch (error) {
        throw error;
    }
})


const verifyJWT = async (token, secretKey) => {
    return await JWT.verify(token, secretKey)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}