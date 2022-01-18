const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');

router.get('/', async function (req, res) {
    const orderBy = req.query['order-by'];
    let userList;
    switch (orderBy) {
        case 'name-ascending':
            userList = await userModel.getAllUserWithLockedOrderBy('name', true);
            break;

        case 'name-descending':
            userList = await userModel.getAllUserWithLockedOrderBy('name', false);
            break;

        case 'serious-status':
            userList = await userModel.getAllUserWithLockedOrderBy('current_status', true);
            break;

        default:
            userList = await userModel.getAllUserWithLockedOrderBy('name', true);
            break;
    }

    res.render("users/user_list_admin", {
        userList: userList,
        isPatient: 1
    });
});

module.exports = router;