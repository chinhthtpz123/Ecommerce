'use strict';

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

class ProductFactory {
    async createProduct(payload) {
        throw new BadRequestError('Invaild product type') 
    }
}

class Product {
    constructor({product_name, product_description,product_thumb,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
        this.product_name = product_name
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_thumb = product_thumb
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct() {
        return await product.create(this)
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('create new Clothing error')
        
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newClothing = await electronic.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('create new electronic error')
        
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Product error')
        
        return newProduct;
    }
}


class ClothingFactory extends ProductFactory {
    async createProduct(payload) {
        return new Clothing(payload).createProduct()
    }
}

class ElectronicFactory extends ProductFactory {
    async createProduct(payload) {
        return new Electronic(payload).createProduct()
    }
}


class ProductService {
    static async createProduct({ type, payload }) {
        const factoryClass = PRODUCT_MODEL[type];
        if (!factoryClass) throw new BadRequestError("Invaild request");

        const factory = new factoryClass()
        return factory.createProduct(payload);
    };
}

const PRODUCT_MODEL = {
    "Electronics": ElectronicFactory,
    "Clothing": ClothingFactory,
}; 

module.exports = ProductService;