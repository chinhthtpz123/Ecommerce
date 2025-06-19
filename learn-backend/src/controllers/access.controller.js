'use strict';
const AccessService = require('../services/access.service');

class AccessController {
    static signup = async (req, res, next) => {
        try {
            console.log(`[P]::signup::req.body`, req.body);
            /*
                200 OK
                201 Created

            */
            return res.status(201).json(await AccessService.signup(req.body));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AccessController;