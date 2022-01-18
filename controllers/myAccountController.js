const express = require("express");
const router = express.Router();

const userModel = require("../models/userModel");
const covidRecordModel = require("../models/covidRecordModel");
const relateModel = require("../models/relateModel");

router.get("/", async function (req, res) {
  if (req.cookies.user != "admin") {
    const userID = req.cookies.user;

    const user = await userModel.getByUsername(userID);
    console.log(user)

    let relatedUserIds = await relateModel.getById_1(user.id);
    relatedUserIds = relatedUserIds.concat(
      await relateModel.getById_2(user.id)
    );
    const relatedUsers = [];
    for (let i = 0; i < relatedUserIds.length; i++) {
      const relateUser = await userModel.getById(
        relatedUserIds[i].user_id2 == user.id
          ? relatedUserIds[i].user_id1
          : relatedUserIds[i].user_id2
      );
      relatedUsers.push(relateUser);
    }

    console.log(relatedUsers)

    const currentChanges = await covidRecordModel.getById(user.id);

    res.render("myAccount", { user, relatedUsers, currentChanges });
  } else {
    res.render("myAccount");
  }
});

module.exports = router;
