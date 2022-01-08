const express = require("express");
const router = express.Router();

const userModel = require("../../models/userModel");
const covidRecordModel = require("../../models/covidRecordModel");
const relateModel = require("../../models/relateModel")

router.get('/:id/view', async (req,res)=>{
    const user = await userModel.getById(req.params.id)
    
    const relatedUserIds = await relateModel.getById(req.params.id);
    const relatedUsers = [];
    for (let i = 0; i < relatedUserIds.length; i++){
        const relateUser = await userModel.getById(relatedUserIds[i].user_id2);
        relatedUsers.push(relateUser)
    }

    const currentChanges = await covidRecordModel.getById(req.params.id);
    
    res.render('users/user_details',
        {user,relatedUsers,currentChanges}
    );
})


module.exports = router;