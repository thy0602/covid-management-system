const express = require("express");
const router = express.Router();

const districtModel = require("../models/districtModel"),
    wardModel = require("../models/wardModel");

router.get('/district', async function (req, res) {
    if (req.query){
        if (req.query.province_id){
            return res.status(200).json(await districtModel.getByProvinceId(req.query.province_id));
        }
    }
    res.status(401).send("Invalid Province ID!")
})

router.get('/ward', async function (req, res) {
    if (req.query){
        if (req.query.district_id){
            return res.status(200).json(await wardModel.getByDistrictId(req.query.district_id));
        }
    }
    res.status(401).send("Invalid District ID!")
})

module.exports = router;