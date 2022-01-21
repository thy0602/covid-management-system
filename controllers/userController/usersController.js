const express = require("express");
const router = express.Router();
const userModel = require('../../models/userModel');
const accountModel = require('../../models/accountModel');
const addressModel = require('../../models/addressModel');
const provinceModel = require('../../models/provinceModel');
const districtModel = require('../../models/districtModel');
const wardModel = require('../../models/wardModel');
const covidRecordModel = require('../../models/covidRecordModel');
const location = require('../../models/quarantineLocationModel');
const quarantineLocation = require('../../models/quarantineLocationModel');
const location_record = require('../../models/quarantineLocationRecordModel')
const serverLog = require("../../utils/server_log");
const searchFilter = require('../../utils/searchFilter');

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
    
    for (let index = 0; index < userList.length; index++) {
        let province = await provinceModel.getByProvinceId(userList[index].province);
        let district = await districtModel.getByDistrictId(userList[index].district);
        let ward = await wardModel.getByWardId(userList[index].ward);
        userList[index].address += ", " + ward[0].name + ", " + district[0].name + ", " + province[0].name;
    }
    for (let index = 0; index < userList.length; index++) {
        if(userList[index].current_location != null)
        {
            let locationName = await quarantineLocation.getById(userList[index].current_location);
            userList[index].current_location = locationName.name;
        }
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

    const ls = await location_record.add({
        user_id: user_id.id,
        location_id: req.body.location,
        record_time: new Date()
    })

    if (user && acc && status && lstt && ls) {
        serverLog.log_action({
            sender_id: require('jsonwebtoken').decode(req.cookies.user, true).username,
            action: 'Create new patient',
            data: req.body.username,
            date: new Date()
        });

        return res.redirect('./');
    }
    res.send({ error: "Can't create user!" });
})

router.delete("/:id", async function (req, res, next) {
    let user = await userModel.getById(req.params.id);
    try {
      const response = await accountModel.update(user.username,{username: user.username, is_deleted: true});
      console.log(response);
      if (typeof response === "undefined")
        res.status(500).send("Internal server error");
  
      res.status(200).send(response);
      serverLog.log_action({
        sender_id: require('jsonwebtoken').decode(req.cookies.user, true).username,
        action: `Delete user`,
        data: user.username,
        date: new Date()
    });
    } catch (e) {
      res.status(400).send(e.message);
    }
});

// search user by name
router.post('/search', async (req, res) => {
    const searchStr = req.body.searchStr;
    console.log('post /users/search searchStr: ', searchStr);

    try {
        let allUsers = await userModel.getAll();
        console.log('post /users/search allUsers: ', allUsers);
        let filterdUser = searchFilter.filter(allUsers, searchStr, 'name');
        console.log('post /users/search filterdUser: ', filterdUser);
        res.render("users/user_list", {
            userList: filterdUser,
            isPatient: 1
        });
    } catch (error) {
        console.log('Error post /users/search: ', error);
    }
    // res.redirect('/');
});

router.use('/', require('./userController'))

module.exports = router;
