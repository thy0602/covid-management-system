const express = require("express");
const router = express.Router();

const covidRecordModel = require("../models/covidRecordModel")
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const order_productModel = require("../models/order_productModel");
const order_packModel = require("../models/order_packModel");

router.get("/", async function (req, res) {
  const totalCases = await userModel.countAll(),
    F0 = await userModel.countByStatus("F0"),
    F1 = await userModel.countByStatus("F1"),
    F2 = await userModel.countByStatus("F2"),
    F3 = await userModel.countByStatus("F3"),
    getAll = await covidRecordModel.getAll(),
    orders = await orderModel.getAll(),
    productSold = await order_productModel.getAllGroupByProductId(),
    packSold = await order_packModel.getAllGroupByPackId();

  let userStateUpdate = [];
  for (let i = 0; i < getAll.length; i++) {
    const user = await userModel.getById(getAll[i].user_id);
    const newRecord = {
      ...getAll[i],
      user: user,
    };
    userStateUpdate.push(newRecord);
  }

  orders.forEach(order => ({
    ...order,
    status: paid_at ? 'Pending' : 'Completed'
  }))

  let totalProduct = 0;
  productSold.forEach(product => { totalProduct += product.quantity });
  let products = [];
  for (let i = 0; i < productSold.length; i++) {
    const newRecord = {
      ...productSold[i],
      max: totalProduct,
    };
    products.push(newRecord);
  }

  let totalPack = 0;
  packSold.forEach(pack => { totalPack += pack.quantity });
  let packs = [];
  for (let i = 0; i < packSold.length; i++) {
    const newRecord = {
      ...packSold[i],
      max: totalPack,
    };
    packs.push(newRecord);
  }

  res.render("dashboard", {
    totalCases: totalCases.count,
    F0: F0.count,
    F1: F1.count,
    F2: F2.count,
    cured: F3.count,
    userStateUpdate,
    orders,
    products: {
      list: products,
      total: totalProduct
    },
    packs: {
      list: packs,
      total: totalPack
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
