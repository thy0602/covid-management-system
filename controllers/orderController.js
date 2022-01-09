const express = require("express");
const router = express.Router();

router.get("/history", (req, res) => {
    res.render('order/order_history', {
        id: "001",
        time: "08/11/2000",
        status_color: "warning",
        status: "unpaid",
        catepack: "#2",
        namepack: "Gói ăn dọng",
        total: "100.000"
    })
});

module.exports = router;
