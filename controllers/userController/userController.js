const express = require("express");
const router = express.Router();

const userModel = require("../../models/userModel");
const covidRecordModel = require("../../models/covidRecordModel");
const relateModel = require("../../models/relateModel");

const provinceModel = require("../../models/provinceModel")
const districtModel = require("../../models/districtModel")
const wardModel = require("../../models/wardModel")
const quarantineLocationModel = require("../../models/quarantineLocationModel")

router.use("/:id", async function (req, res, next) {
  const user = await userModel.getById(req.params.id);
  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect("/users");
  }
});

router.get("/:id/view", async (req, res) => {
  const user = req.user;

  let relatedUserIds = await relateModel.getById_1(user.id);
  relatedUserIds = relatedUserIds.concat(await relateModel.getById_2(user.id));
  const relatedUsers = [];
  for (let i = 0; i < relatedUserIds.length; i++) {
    const relateUser = await userModel.getById(relatedUserIds[i].user_id2 == user.id ? relatedUserIds[i].user_id1 : relatedUserIds[i].user_id2);
    relatedUsers.push(relateUser);
  }

  const currentChanges = await covidRecordModel.getById(req.params.id);
  res.render("users/user_details", { user, relatedUsers, currentChanges  });
});

router.get("/:id/edit", async (req, res) => {
  let provinces = await provinceModel.getAll();
  let districts = await districtModel.getByProvinceId(req.user.province);
  let wards = await wardModel.getByDistrictId(req.user.district);
  let quarantines =  await quarantineLocationModel.getAll();
  quarantines = quarantines.filter(q => q.occupancy != q.capacity);

  const user = {
    ...req.user, 
    current_location: req.user.current_location!=null ? {id: req.user.current_location, name: quarantines.find(quarantine => quarantine.id == req.user.current_location).name} : "",
    province: {id: req.user.province, name: provinces.find(province => province.id == req.user.province).name},
    district:  {id: req.user.district, name:districts.find(district => district.id == req.user.district).name},
    ward: {id: req.user.ward, name: wards.find(ward => ward.id == req.user.ward).name},
  }
  
  if (req.user.current_location != null){
    quarantines = quarantines.filter(quarantine => quarantine.id != req.user.current_location)
  }
  
  provinces = provinces.filter(province => province.id != req.user.province)
  districts = districts.filter(district => district.id != req.user.district)
  wards = wards.filter(ward => ward.id != req.user.ward)

  res.render("users/user_edit", { user, provinces, districts, wards,quarantines });
});

//recursion for related update
const updateAllRelated = async (updatedUser) => {
  // get all related id
  let relatedUserIds = await relateModel.getById_1(updatedUser.id);
  relatedUserIds = relatedUserIds.concat(await relateModel.getById_2(updatedUser.id));

  for (let i = 0; i < relatedUserIds.length; i++) {
    //get the user of given ID
    const relatedUser = await userModel.getById(relatedUserIds[i].user_id2 == updatedUser.id ? relatedUserIds[i].user_id1 : relatedUserIds[i].user_id2);
    let newRelatedUser;
    //check user current status, if f2 then update follow updatedUser
    if (relatedUser.current_status == "F2") {
      //update all F2 user
      newRelatedUser = {
        ...relatedUser,
        current_status: updatedUser.current_status == "F0" ? "F1" : "cured",
      };
      await userModel.update(newRelatedUser);
      await covidRecordModel.create({
        covid_status: newRelatedUser.current_status,
        record_time: new Date(),
        user_id: newRelatedUser.id,
      });
    }
  }
};

router.post("/:id/edit", async (req, res) => {
  const result = await userModel.update(req.body);

  if (req.user.current_location != req.body.current_location) {
    //location changes, update location
    
    let oldLocation = await quarantineLocationModel.getById(Number.parseInt(req.user.current_location));
    oldLocation = {
      ...oldLocation,
      occupancy: oldLocation.occupancy-1,
    }

    await quarantineLocationModel.update(oldLocation)
    let newLocation = await quarantineLocationModel.getById(Number.parseInt(req.body.current_location));
    newLocation = {
      ...newLocation,
      occupancy: newLocation.occupancy +1,
    }
    await quarantineLocationModel.update(newLocation)
  }
  if (req.user.current_status != req.body.current_status) {
    //status changes, apply new record
    const newCovidRecord = await covidRecordModel.create({
      covid_status: req.body.current_status,
      record_time: new Date(),
      user_id: req.user.id,
    });



    //update related
    if (req.user.current_status == "F1") {
      await updateAllRelated(result[0]);
    }
  }
  if (result[0]) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

module.exports = router;
