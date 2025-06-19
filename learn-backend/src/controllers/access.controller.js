'use strict';
const { CREATED } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
    static signup = async (req, res, next) => {
        new CREATED({
            message: "Registered OK",
            metadata: await AccessService.signup(req.body)
        }).send(res)
        // return res.status(201).json(await AccessService.signup(req.body));
    }
}

module.exports = AccessController;