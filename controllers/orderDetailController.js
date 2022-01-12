const express = require("express");
const router = express.Router();
const orderDetailModel = require("../models/orderDetailModel");

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const pack_id = req.query.pack_id;
    try {
        const response = await orderDetailModel.getPackItemsByOrderIdAndPackId(id, pack_id);
        if (typeof response === "undefined")
        res.status(500).send("Internal server error");

        res.status(200).send(response);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

module.exports = router;
