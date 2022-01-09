const express = require("express");
const router = express.Router();
const productModel = require('../models/productModel');

router.get('/', async function(req, res) {
    const orderBy = req.query['order-by'];
    let productList;
    switch (orderBy) {
        case 'name-ascending':
            productList = await productModel.getAllProductOrderBy('name', true);
            break;

        case 'name-descending':
            productList = await productModel.getAllProductOrderBy('name', false);
            break;

        case 'price-ascending':
            productList = await productModel.getAllProductOrderBy('price', true);
            break

        case 'price-descending':
            productList = await productModel.getAllProductOrderBy('price', false);
            break
    
        default:
            productList = await productModel.getProductList();
            break;
    }

    res.render("products/product_list", {
        productList: productList,
        isNecessities: 1
    });
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const response = await productModel.update(id, req.body);
        if (typeof response === 'undefined')
            res.status(500).send("Internal server error");

        res.status(200).send(response);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

module.exports = router;
