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

function preprocess(order) {
    return {
        order_id: order.order_id,
        ordered_at: order.ordered_at,
        paid_at: order.paid_at,
        total_price: order.total_price,
        user_id: order.user_id,
        list_package: [
            {
                pack_id: order.pack_id,
                name: order.name
            }
        ]
    }
}

router.get("/history", async (req, res) => {
    if (!req.cookies.user)
        res.redirect('/acount/login-id');

    const user = await userModel.getByUsername(req.cookies.user);
    const orders = await orderModel.getOrderHistory(user.id);

    let processed_orders = [];
    if (orders.length > 0) {
        processed_orders.push(preprocess(orders[0]));
    }

    for (let i = 1; i < orders.length; i++) {
        if (orders[i].order_id == processed_orders[processed_orders.length - 1].order_id) {
            processed_orders[processed_orders.length - 1].list_package.push({
                pack_id: orders[i].pack_id,
                name: orders[i].name
            });
            continue;
        }

        processed_orders.push(preprocess(orders[i]));
    }
    // console.log("PROCESSED_ORDERS: ", processed_orders);

    let listorder = [];
    for (let order of processed_orders) {
        let order_item = {
            order_id: order.order_id,
            ordered_at: datetimeFormatter.getDayMonthYear(order.ordered_at),
            status: (!order.paid_at) ? "unpaid" : "paid",
            status_color: (!order.paid_at) ? 'warning' : 'success',
            total_price: moneyFormatter(order.total_price),
            disable: (!order.paid_at) ? '' : 'disabled',
            colorbtnpayment: (!order.paid_at) ? 'success' : 'secondary',
            listpackage: order.list_package
        }
        listorder.push(order_item);
    }
    res.render('order/order_history', {
        listorder: listorder
    })
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

    const user = await userModel.getByUsername(req.cookies.user);

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
