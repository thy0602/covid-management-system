const express = require("express");
const router = express.Router();

const covidRecordModel = require("../models/covidRecordModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const packModel = require("../models/packModel");
const productModel = require("../models/productModel");

const orderDetailModel = require("../models/orderDetailModel");

router.get("/", async function (req, res) {
  const totalCases = await userModel.countAll(),
    F0 = await userModel.countByStatus("F0"),
    F1 = await userModel.countByStatus("F1"),
    F2 = await userModel.countByStatus("F2"),
    F3 = await userModel.countByStatus("F3"),
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
      total_price: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(order.total_price),
    };
  });
  
  let totalPackSold = 0;
  packSold.forEach((pack)=>totalPackSold += Number.parseInt(pack.count));
  const formattedPackSold = packSold.map(async(pack) => {
    return {
      ...pack,
      total: totalPackSold,
      percent: 100*Number.parseFloat(pack.count)/Number.parseFloat(totalPackSold),
      pack: await packModel.getByPackId(pack.pack_id),
    };
  });

  let totalProductSold = 0;
  productSold.forEach((product)=>totalProductSold += Number.parseInt(product.count));
  const formattedProductSold = productSold.map(async(product) => {
    return {
      ...product,
      total: totalProductSold,
      percent: 100*Number.parseFloat(product.count)/Number.parseFloat(totalProductSold),
      product: await productModel.getById(product.product_id),
    };
  });

  res.render("dashboard", {
    totalCases: totalCases.count,
    F0: F0.count,
    F1: F1.count,
    F2: F2.count,
    cured: F3.count,
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
