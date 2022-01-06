const express = require("express");
const router = express.Router();
const productModel = require('../models/productModel');

router.get('/', async function(req, res) {
    const productList = await productModel.getProductList();

    res.render("products/product_list", {
        productList: productList,
        isNecessities: 1
    });
})

module.exports = router;
