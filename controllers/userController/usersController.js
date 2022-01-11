const express = require("express");
const router = express.Router();
const userModel = require('../../models/userModel');
const accountModel = require('../../models/accountModel');

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

    res.render("users/user_list", {
        userList: userList,
        isPatient: 1
    });
});

// UI for creating new user
router.get('/create', async (req, res) => {

});

// store new user
router.post('/store', async (req, res) => {

});

router.get('/new', async (req, res) => {
    let user = await userModel.getAllUserOrderBy("username", true);
    user = user[user.length - 1].username;
    const regex = /[^\D0]+/g;
    user = user.slice(0, user.search(regex)) + (parseInt(user.slice(3)) + 1);
    res.render("users/user_form", {
        username: user
    });
})

router.post('/new', async (req, res) => {

    console.log(req.body);
    const accuser = await accountModel.create({
        username: req.body.username,
        role: 'user',
        is_deleted: false
    });
    const entity = {
        name: req.body.name,
        username: req.body.username,
        year_of_birth: req.body.yob,
        address: req.body.address,
        max_basket: req.body.maxbasket,
        basket_timelimit: req.body.baskettimeltd,
        current_status: null,
        current_location: null
    }
    const user = await userModel.create(entity);
    res.send(user);
})

router.use('/', require('./userController'))

module.exports = router;
