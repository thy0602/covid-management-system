const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');

router.get('/', async function(req, res) {
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

// UI for editing a user
router.get('/:userId/edit', async (req, res) => {

});

// update a pack
router.post('/:userId/update', async (req, res) => {
    
});


module.exports = router;
