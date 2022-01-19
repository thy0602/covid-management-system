const accountModel = require('../models/accountModel');
const router = require('express').Router();
const orderModel = require('../models/orderModel');
const verify = require('../middlewares/verify').verify;

router.get('/unpaid-orders', async (req, res) => {
    const orders = await orderModel.getUnpaidOrders();
    //console.log(orders);
    return res.status(200).send(orders);
});

router.put('/:id/urgent', async (req, res) => {
    try {
        const id = req.params.id;
        if (typeof id == 'undefined')
            return res.status(200).send({ success: false });
        const response = await orderModel.markIsUrgent(id);
        console.log(response);
        return res.status(200).send({ success: true });
    } catch (e) {
        console.log(e);
        res.status(200).send({ success: false });
    }
    
});

module.exports = router;
