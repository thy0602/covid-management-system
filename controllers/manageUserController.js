const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');
const addressModel = require('../models/addressModel');
const paymentLimitModel = require('../models/paymentLimitModel');

const verify = require('../middlewares/verify').verify;

router.use('/', (req, res, next) => {
    if (verify(req, 'manager'))
        next();
    else
        return res.redirect('/');
});

router.post('/setlimit', async (req, res) => {
    console.log(req.body.minium_limit);
    const value = paymentLimitModel.updateValue(req.body.minium_limit);
    res.redirect('/manage?status=true');
})

router.get('/view', async function (req, res) {
    const orderBy = req.query['order-by'];
    let userList;
    switch (orderBy) {
        case 'name-ascending':
            userList = await userModel.getAllUserOrderBy('name', true);
            break;

        case 'name-descending':
            userList = await userModel.getAllUserOrderBy('name', false);
            break;

        case 'serious-status':
            userList = await userModel.getAllUserOrderBy('current_status', true);
            break;

        default:
            userList = await userModel.getAll();
            break;
    }

    const paymentLimit = await paymentLimitModel.getValue();

    let ms = {
        userList: userList,
        isPatient: 1,
        minium_limit: paymentLimit.value
    }
    if (req.query.status) {
        ms.message = 'Update Minimum Limit successfully!';
        ms.msg = () => 'msg_paymentlimit';
    }
    else
        ms.msg = () => 'empty';
    console.log(ms);
    res.render("manage/manageUser", ms);
});

module.exports = router;