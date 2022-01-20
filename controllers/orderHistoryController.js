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

router.get("/", async (req, res) => {
    if (!req.cookies.user)
        res.redirect('/acount/login-id');

    const temp = require('jsonwebtoken').decode(req.cookies.user, true).username;

    const user = await userModel.getByUsername(temp);
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
            listpackage: order.list_package,
            is_paid: (!order.paid_at) ? 0 : 1
        }
        listorder.push(order_item);
    }
    res.render('order/order_history', {
        listorder: listorder
    })
});


module.exports = router;
