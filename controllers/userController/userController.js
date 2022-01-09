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

router.get('/:id/edit', async (req,res)=>{
    const user = await userModel.getById(req.params.id)
    if (user)
        res.render('users/user_edit', {user});
    else
        res.redirect('/users')
})

router.post('/:id/edit', async (req,res)=>{
    const result = await userModel.update(req.body);
    if (result[0]){
        res.status(200).send();
    } else {
        res.status(401).send();
    }
})


module.exports = router;