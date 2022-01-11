const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const productImageModel = require("../models/productImageModel");

const multer = require("../middlewares/multer");
const fs = require("fs");

router.get("/", async function (req, res) {
  const orderBy = req.query["order-by"];
  let productList;
  switch (orderBy) {
    case "name-ascending":
      productList = await productModel.getAllProductOrderBy("name", true);
      break;

    case "name-descending":
      productList = await productModel.getAllProductOrderBy("name", false);
      break;

    case "price-ascending":
      productList = await productModel.getAllProductOrderBy("price", true);
      break;

    case "price-descending":
      productList = await productModel.getAllProductOrderBy("price", false);
      break;

    default:
      productList = await productModel.getProductList();
      break;
  }

  res.render("products/product_list", {
    productList: productList,
    isNecessities: 1,
  });
});

router.use("/:id", async function (req, res, next) {
  const product = await productModel.getById(req.params.id);
  if (product) {
    req.product = product;
    next();
  } else {
    res.redirect("/products");
  }
});

router.get("/:id/view", async (req, res) => {
  const product = req.product;
  const image = await productImageModel.getImagesByProductId(req.params.id);

  res.render("products/product_details", {
    product,
    thumbnail: image[0],
    image: image.slice(1, image.length),
  });
});

router.get("/:id/edit", async (req, res) => {
  const product = req.product;
  const image = await productImageModel.getImagesByProductId(req.params.id);

  res.render("products/product_edit", {
    product,
    image: image,
  });
});

const upload = multer.array("fileUp", 5);
router.post("/:id/upload", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) res.status(400).send(err.message);

    // Everything went fine and save document in DB here.
    for (let i = 0; i < req.files.length; i++) {
      await productImageModel.insert({
        product_id: req.params.id,
        url: `img/products/${req.files[i].filename}`,
      });
    }
    //reload the page
    res.redirect(req.get("referer"));
  });
});

router.delete("/:id/edit", async (req, res) => {
  try {
    await productImageModel.deleteByUrl(req.body.imagePath);
    fs.unlinkSync("./public/" + req.body.imagePath);
    //reload the page
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await productModel.update(req.body);
    if (typeof response === "undefined")
      res.status(500).send("Internal server error");

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
