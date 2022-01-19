const express = require("express");
const router = express.Router();
const userModel = require('../../models/userModel');
const accountModel = require('../../models/accountModel');
const addressModel = require('../../models/addressModel');
const covidRecordModel = require('../../models/covidRecordModel');
const location = require('../../models/quarantineLocationModel');

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
    let user = await userModel.getAllRoleOrderBy('user');
    if (user.length != 0) {
        user = user[user.length - 1].username;
        const regex = /[^\D0]+/g;
        let i = 0;
        let head = user.slice(user.search(regex));
        console.log(head);
        if ((head.length == 1 && head[0] == '9') || (head[1] == '9' && head[0] == '9'))
            i = -1
        user = user.slice(0, user.search(regex) + i) + (parseInt(user.slice(3)) + 1);
    } else {
        if (req.query.role == 'user')
            user = 'ID_001';
    }
    let province_list = await addressModel.getAll('province');
    let location_list = await addressModel.getAll('quarantine_location');

    return res.render("users/user_form", {
        province: province_list,
        location: location_list,
        username: user
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

    const acc = await accountModel.create({
        username: req.body.username,
        role: 'user',
        is_deleted: false,
        is_locked: false
    })
    const user = await userModel.create({
        name: req.body.name,
        username: req.body.username,
        year_of_birth: req.body.yob,
        address: req.body.street,
        identity_number: req.body.indentity,
        current_status: req.body.covidstt,
        current_location: req.body.location,
        province: req.body.province,
        district: req.body.district,
        ward: req.body.ward
    });

    let user_id = await userModel.getByUsername(req.body.username);
    const status = await covidRecordModel.create({
        covid_status: req.body.covidstt,
        record_time: new Date(),
        user_id: user_id.id,
    });
    const lct = await location.getById(req.body.location);
    const lstt = await location.update({
        id: req.body.location,
        occupancy: lct.occupancy + 1
    })

    if (user && acc && status && lstt) {
        return res.redirect('./');
    }
    res.send({ error: "Can't create user!" });
})

router.use('/', require('./userController'))

module.exports = router;
