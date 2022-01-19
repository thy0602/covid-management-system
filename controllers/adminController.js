const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');

router.get('/patient', async function (req, res) {
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
router.get('/supervisor', async function (req, res) {
    const orderBy = req.query['order-by'];
    let userList;
    switch (orderBy) {
        case 'name-ascending':
            userList = await userModel.getAllManagerWithLockedOrderBy('name', true);
            break;

        case 'name-descending':
            userList = await userModel.getAllManagerWithLockedOrderBy('name', false);
            break;

        case 'serious-status':
            userList = await userModel.getAllManagerWithLockedOrderBy('current_status', true);
            break;

        default:
            userList = await userModel.getAllManagerWithLockedOrderBy('name', true);
            break;
    }

    res.render("users/user_list_admin", {
        userList: userList,
        isSupervisor: 1
    });
});

router.post('/lock', async (req, res) => {
    console.log(req.body.userId);
    let account = await accountModel.getByUsername(req.body.userId);
    let entity = {
        username: req.body.userId,
        password: account.password,
        role: account.role,
        is_deleted: account.is_deleted,
        is_locked: !account.is_locked
    }
    try {
        let result = await accountModel.updateByUsername(req.body.userId, entity);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log("Error post /packs/new: ", error);
        res.status(400).send(error);
    }
});

module.exports = router;