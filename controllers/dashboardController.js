const express = require("express");
const router = express.Router();

const covidRecordModel = require("../models/covidRecordModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const packModel = require("../models/packModel");
const productModel = require("../models/productModel");

const orderDetailModel = require("../models/orderDetailModel");

router.get("/", async function (req, res) {
  let from = "today";
  if (req.query.from)
    from = req.query.from;
  if (!req.cookies.user)
    return res.redirect('/account/login-id');

  let logOnUser = { name: 'Admin' };
  let temp = require('jsonwebtoken').decode(req.cookies.user, true).username;
  if (temp != 'admin') {
    if (temp[0] == 'M')
      logOnUser = { name: temp };
    else
      logOnUser = await userModel.getByUsername(temp);
  }

  let fromDate = new Date();
  switch (from) {
    case "lastweek":
      fromDate = new Date(fromDate.setDate(fromDate.getDate() - 7))
      break;
    case "lastmonth":
      fromDate = new Date(fromDate.setDate(fromDate.getDate() - 30))
      break;
    case "lastyear":
      fromDate = new Date(fromDate.setDate(fromDate.getDate() - 365))
      break;
  }


  const totalCases = await userModel.getAll(),
    totalCasesSwitched = await covidRecordModel.getAllFromDate(fromDate),
    F0 = await userModel.getByStatus("F0"),
    F0_switched = await covidRecordModel.getStatusFromDate(fromDate, "F0"),
    F1 = await userModel.getByStatus("F1"),
    F1_switched = await covidRecordModel.getStatusFromDate(fromDate, "F1"),
    F2 = await userModel.getByStatus("F2"),
    F2_switched = await covidRecordModel.getStatusFromDate(fromDate, "F2"),
    cured = await userModel.getByStatus("cured"),
    getAll = await covidRecordModel.getAll(),
    orders = await orderModel.getAll(),
    productSold = await orderDetailModel.getGroupByProduct(),
    packSold = await orderDetailModel.getGroupByPack();

  let userStateUpdate = [];
  for (let i = 0; i < getAll.length; i++) {
    const user = await userModel.getById(getAll[i].user_id);
    const newRecord = {
      ...getAll[i],
      user: user,
    };
    userStateUpdate.push(newRecord);
  }

  const formattedOrders = orders.map((order) => {
    return {
      ...order,
      ordered_at: new Date(order.ordered_at).toLocaleString(),
      total_price: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(order.total_price),
    };
  });

  let totalPackSold = 0;
  packSold.forEach((pack) => totalPackSold += Number.parseInt(pack.count));
  const formattedPackSold = packSold.map(async (pack) => {
    return {
      ...pack,
      total: totalPackSold,
      percent: 100 * Number.parseFloat(pack.count) / Number.parseFloat(totalPackSold),
      pack: await packModel.getByPackId(pack.pack_id),
    };
  });

  let totalProductSold = 0;
  productSold.forEach((product) => totalProductSold += Number.parseInt(product.count));
  const formattedProductSold = productSold.map(async (product) => {
    return {
      ...product,
      total: totalProductSold,
      percent: 100 * Number.parseFloat(product.count) / Number.parseFloat(totalProductSold),
      product: await productModel.getById(product.product_id),
    };
  });

  res.render("dashboard", {
    from,
    user: logOnUser,
    totalCases: totalCases.length,
    totalCasesSwitched: totalCasesSwitched.length,
    F0: F0.length,
    F0_switched: F0_switched.length,
    F1: F1.length,
    F1_switched: F1_switched.length,
    F2: F2.length,
    F2_switched: F2_switched.length,
    cured: cured.length,
    userStateUpdate,
    orders: formattedOrders,
    products: {
      list: await Promise.all(formattedProductSold),
      total: totalProductSold,
    },
    packs: {
      list: await Promise.all(formattedPackSold),
      total: totalPackSold,
    },
  });
});
router.get("/statistic", async function (req, res) {
  const fromDate = req.query.date;

  const data = await covidRecordModel.getCasesFromDate(fromDate);
  if (data) {
    res.status(200).json(data[0]);
  } else {
    res.status(401).json(data[0]);
  }
});

module.exports = router;
