const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');
const addressModel = require('../models/addressModel');

const verify = require('../middlewares/verify').verify;

// router.use('/', (req, res, next) => {
//     if (verify(req, 'admin')||verify(req,'manager'))
//         next();
//     else
//         return res.redirect('/');
// });

router.get('/setlimit', async (req, res) => {
    res.render('manage/manageUser');
});

router.post('/setlimit', async (req, res) => {
    console.log(req.body.minium_limit);
    res.render('manage/manageUser');
})

router.get('/', async function (req, res) {
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

    res.render("manage/manageUser", {
        userList: userList,
        isPatient: 1
    });
});

module.exports = router;