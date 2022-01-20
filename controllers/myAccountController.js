const express = require("express");
const router = express.Router();

const userModel = require("../models/userModel");
const covidRecordModel = require("../models/covidRecordModel");
const relateModel = require("../models/relateModel");
const quarantineLocationModel = require("../models/quarantineLocationModel");
const quarantineLocationRecordModel = require("../models/quarantineLocationRecordModel");

const provinceModel = require("../models/provinceModel");
const districtModel = require("../models/districtModel");
const wardModel = require("../models/wardModel")

router.get("/", async function (req, res) {

  let temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
  if (temp != "admin") {
    const userID = temp;
    const user = await userModel.getByUsername(userID);

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

    const currentChanges = await covidRecordModel.getById(user.id);

    
    const locationChanges = await quarantineLocationRecordModel.getByUserId(user.id);
    let location = [];
    for (let i = 0; i < locationChanges.length; i++){
      const getLocation = await quarantineLocationModel.getByLocationId(locationChanges[i].location_id);
      location.push({
        ...locationChanges[i],
        name: getLocation.name
      })
    }

    const province = await provinceModel.getById(user.province);
    const district = await districtModel.getById(user.district);
    const ward = await wardModel.getById(user.ward);
    let quarantine = user.current_location ? await quarantineLocationModel.getByLocationId(user.current_location) : "";

    res.render("myAccount", { user, relatedUsers, currentChanges, location, province, district, ward, quarantine});
  } else {
    res.render("myAccount");
  }
});

module.exports = router;
