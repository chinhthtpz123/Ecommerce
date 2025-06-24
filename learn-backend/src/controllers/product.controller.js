'use strict';

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    static createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Product success',
            metadata: await ProductService.createProduct({type: req.body.product_type, payload: req.body})
        }).send(res)
    } 
}

module.exports = ProductController;