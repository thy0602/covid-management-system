const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const datetimeFormatter = require('../utils/datetimeFormatter');
const { moneyFormatter } = require('../utils/moneyFormatter');
const verify = require('../middlewares/verify').verify;

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

router.use('/', (req, res, next) => {
    if (verify(req, 'user'))
        next();
    else
        return res.redirect('/');
});

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
    // if (!req.cookies.user)
    //     res.redirect('/acount/login-id');

    // const user = await userModel.getByUsername(req.cookies.user);
    // console.log(req.cookies.user);

    const order = await orderModel.create({
        id: 5,
        user_id: 1,
        ordered_at: Date.now(),
        paid_at: null,
        total_price: 120000
    });
    res.send(order);
    console.log(req.body);
});


module.exports = router;
