const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const accountModel = require('../models/accountModel');
const addressModel = require('../models/addressModel');
const covidRecordModel = require('../models/covidRecordModel');
const location = require('../models/quarantineLocationModel');

const verify = require('../middlewares/verify').verify;

router.use('/', (req, res, next) => {
    if (verify(req, 'admin'))
        next();
    else
        return res.redirect('/');
});

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
        isPatient: 1,
        linkAddNew: './new?object=patient'
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
        isSupervisor: 1,
        linkAddNew: './new?object=supervisor'
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

router.get('/new', async (req, res) => {
    let user = await userModel.getAllRoleOrderBy(req.query.object == 'patient' ? 'user' : 'manager');
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
        if (req.query.object == 'patient')
            user = 'ID_001';
        else
            user = 'M_001';
    }
    let province_list = await addressModel.getAll('province');
    if (req.query.object == 'patient') {
        let location_list = await addressModel.getAll('quarantine_location');

        return res.render("users/user_form_admin", {
            province: province_list,
            hidden: '',
            location: location_list,
            username: user,
            rolename: req.query.object,
            required: 'required'
        });
    }
    else {
        return res.render("users/user_form_admin", {
            province: province_list,
            hidden: 'hidden',
            location: [],
            username: user,
            rolename: req.query.object,
            required: ''
        });
    }
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
        role: req.body.username.search('ID_') != -1 ? 'user' : 'manager',
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

    let status = true;
    let lstt = true;

    if (req.query.object == 'patient') {
        let user_id = await userModel.getByUsername(req.body.username);
        status = await covidRecordModel.create({
            covid_status: req.body.covidstt,
            record_time: new Date(),
            user_id: user_id.id,
        });
        const lct = await location.getById(req.body.location);
        const lstt = await location.update({
            id: req.body.location,
            occupancy: lct.occupancy + 1
        })
    }

    if (user && acc && status && lstt) {
        return res.redirect(`./${req.query.object}`);
    }
    res.send({ error: "Can't create user!" });
})

module.exports = router;