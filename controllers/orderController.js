const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');
const orderModel = require('../models/orderModel');
const orderDetailModel = require("../models/orderDetailModel");
const userModel = require('../models/userModel');
const datetimeFormatter = require('../utils/datetimeFormatter');
const { moneyFormatter } = require('../utils/moneyFormatter');
const verify = require('../middlewares/verify').verify;

router.use('/', (req, res, next) => {
    if (verify(req, 'user'))
        next();
    else
        return res.redirect('/');
});

router.put('/paid', async (req, res) => {
    let ids = req.body.ids;
    console.log("ids: ", ids);

    ids = ids.map((id) => {
        return parseInt(id);
    });
    console.log("ids: ", ids);
    try {
        if (typeof ids == 'undefined')
            return res.status(200).send({ success: false });
        const response = await orderModel.markPaid(ids);
        console.log("Mark paid:", response);
        return res.status(200).send({ success: true });
    } catch (e) {
        return res.status(200).send({ success: false });
    }
});

router.post('/total_price', async (req, res) => {
    const ids = req.body.ids;
    if (typeof ids === 'undefined') {
        res.status(200).send({ amount: 0 });
    }

    const response = await orderModel.getTotalPriceByIds(ids);
    res.status(200).send({ amount: response });
});

router.get('/unpaid_prices', async (req, res) => {
    const temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
    const user = await userModel.getByUsername(temp);
    const response = await orderModel.getUnpaidTotalPrice(user.id);
    return res.status(200).send({ amount: response });
});

// get products list of pack by packId
router.get('/:packId', async (req, res) => {
    const packId = req.params.packId;

    let allPack = await packModel.getAll();
    let packDetail = await packModel.getByPackId(packId);
    let productsInPack = await pack_itemsModel.getAllProductByPackId(packId);

    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }

    res.render("order/order", {
        isPackage: 1,
        packs: allPack,
        packDetail,
        productsInPack
    });
})

router.get('/', async (req, res) => {
    let allPack = await packModel.getAll();
    console.log('get /packlist allPack:', allPack);
    let firstPack = allPack[0];
    let productsInPack = await pack_itemsModel.getAllProductByPackId(firstPack.id);

    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }
    // console.log('get /packlist productsInPack:', productsInPack);

    res.render("order/order", {
        isPackage: 1,
        packs: allPack,
        packDetail: firstPack,
        productsInPack
    });
});

router.post('/create', async (req, res) => {
    if (!req.cookies.user)
        res.redirect('/acount/login-id');

    let temp = require('jsonwebtoken').decode(req.cookies.jwt, true).username;
    const user = await userModel.getByUsername(temp);


    let list = req.body.list;
    let totalPrice = 0;
    for (const order_pack of list) {
        for (const order_detail of order_pack.productList) {
            totalPrice += parseInt(order_detail.boughtPrice);
        }
    }
    // console.log("Total Price is: ", totalPrice);
    let order = {
        user_id: user.id,
        paid_at: null,
        total_price: totalPrice
    }
    let orderDetailList = [];

    try {
        let result = await orderModel.create(order);

        for (const order_pack of list) {
            for (const order_detail of order_pack.productList) {
                orderDetailList.push({
                    'order_id': result.id,
                    'pack_id': order_pack.id,
                    'product_id': order_detail.productId,
                    'quantity': order_detail.quantity,
                    'bought_price': order_detail.boughtPrice
                });
            }
        }

        // console.log("Order Detail List is: ", orderDetailList);

        result = await orderDetailModel.create(orderDetailList);
        // console.log("post /packs/:packId/edit insert pack_items result: ", result);
        res.json(result);
    } catch (error) {
        console.log("Error post /packs/new: ", error);
        res.status(400).send(error);
    }
});


module.exports = router;
