'use strict';

const shopModel = require("../models/shop.model");

class ShopService {
    static findByEmail = async({ email, select = {
        name: 1, password: 2, email: 1, status: 1, roles: 1
    } }) => {
        return await shopModel.findOne({email}).select(select).lean()
    }
}

module.exports = ShopService;