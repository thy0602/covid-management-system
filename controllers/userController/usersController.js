const express = require("express");
const router = express.Router();
const userModel = require('../../models/userModel');
const accountModel = require('../../models/accountModel');
const addressModel = require('../../models/addressModel');

const verify = require('../../middlewares/verify').verify;

router.use('/', (req, res, next) => {
    if (verify(req, 'admin') || verify(req, 'manager'))
        next();
    else
        return res.redirect('/');
});

router.get('/', async function (req, res) {
    const orderBy = req.query['order-by'];
    let userList;
    switch (orderBy) {
        case 'name-ascending':
            userList = await userModel.getAllPatientOrderBy('name', true);
            break;

        case 'name-descending':
            userList = await userModel.getAllPatientOrderBy('name', false);
            break;

        case 'serious-status':
            userList = await userModel.getAllPatientOrderBy('current_status', true);
            break;

        default:
            userList = await userModel.getAllPatientOrderBy('name', true);
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
    let user = await userModel.getAllRoleOrderBy(req.query.role);
    if (user.length != 0) {
        user = user[user.length - 1].username;
        const regex = /[^\D0]+/g;
        let i = 0;
        if (parseInt(user.slice(3)) + 1 > 9)
            i = -1
        user = user.slice(0, user.search(regex) + i) + (parseInt(user.slice(3)) + 1);
    } else {
        if (req.query.role == 'user')
            user = 'ID_001';
        else
            user = 'M_001';
    }

    let province_list = await addressModel.getAll('province');

    return res.render("users/user_form", {
        province: province_list,
        username: user,
        rolename: req.query.role
    });
})

router.get('/getRegion', async (req, res) => {
    let child_list = await addressModel.getChild(req.query.tableChild, req.query.tableParent, req.query.name);
    if (!child_list) {
        return res.status(401).send({ error: "Empty" });
    }
    res.status(200).send({ success: true, list: child_list });

});

router.post('/new', async (req, res) => {

    const entity = {
        name: req.body.name,
        username: req.body.username,
        year_of_birth: req.body.yob,
        address: req.body.street,
        identity_number: req.body.indentity,
        // max_basket: req.body.maxbasket,
        // basket_timelimit: req.body.baskettimeltd,
        current_status: null,
        current_location: null,
        province: req.body.province,
        district: req.body.district,
        ward: req.body.ward
    }
    const acc = await accountModel.create({
        username: req.body.username,
        role: req.body.username.search('ID_') != -1 ? 'user' : 'manager',
        is_deleted: false,
        is_locked: false
    })
    const user = await userModel.create(entity);
    if (user && acc) {
        return res.redirect('./');
    }
    res.send({ error: "Can't create user!" });
})

router.use('/', require('./userController'))

module.exports = router;
