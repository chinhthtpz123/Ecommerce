'use strict';

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const checkApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers[HEADER.API_KEY]?.toString()
        if(!apiKey) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Forbidden: Api key is required'
            })
        }

        // check if api key exists in db
        const objKey = await findById(apiKey);
        if(!objKey) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'Forbidden: Invalid Api key'
            })
        }

        req.objKey = objKey;
        next();
    } catch (error) {
        
    }
}


const permissions = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                code: 'xxxx',
                message: 'permission denied'
            });
        }
        console.log('req.objKey.permissions::', req.objKey.permissions);
        const validPermissions = req.objKey.permissions.includes(permission);
        if(!validPermissions) {
            return res.status(403).json({
                code: 'xxxx',
                message: 'permission denied'
            })
        }
        return next();
    }
}

module.exports = {
    checkApiKey,
    permissions,
}