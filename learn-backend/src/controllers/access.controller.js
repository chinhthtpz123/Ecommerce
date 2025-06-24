'use strict';
const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {

    static handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get new tokens',
            metadata: await AccessService.handlerRefreshTokenV2({
                user: req.user,
                refreshToken: req.refreshToken,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    static logout = async(req, res, next) => {
        new SuccessResponse({
            message: "Logout successful",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    static login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login successful",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    static signup = async (req, res, next) => {
        new CREATED({
            message: "Registered OK",
            metadata: await AccessService.signup(req.body)
        }).send(res)
        // return res.status(201).json(await AccessService.signup(req.body));
    }
}

module.exports = AccessController;