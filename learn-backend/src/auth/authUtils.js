'use strict';

const JWT = require('jsonwebtoken');
 
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

module.exports = {
    createTokenPair
}