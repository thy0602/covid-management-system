const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const productImageModel = require("../models/productImageModel");
const verify = require("../middlewares/verify").verify;

const multer = require("../middlewares/multer");
const fs = require("fs");

const jwt = require('jsonwebtoken');
const secretKey = 'ThisIsASecretKey';
const stringSimilarity = require("string-similarity");

router.use('/', (req, res, next) => {
  if (!verify(req, 'user'))
    next();
  else
    return res.redirect('/');
});
router.get("/", async function (req, res) {
  // var decoded = jwt.verify(req.cookies.jwt, secretKey);
  // console.log("DECODED: ", decoded); // bar
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
      productList = await productModel.getAllProductOrderBy("name", true);
      break;
  }

  res.render("products/product_list", {
    productList: productList,
    isNecessities: 1,
  });
});

router.get("/new", async (req, res) => {
  const id = req.query.id;
  if (id) {
    const product = await productModel.getById(id);
    if (typeof product === "undefined")
      return res.redirect('/products/new');

    return res.render("products/product_new", {
      product,
      isSubmitProduct: true
    });
  }

  res.render("products/product_new", {
    isSubmitProduct: false
  });
});

// Search pack by name (json)
router.post('/search', async (req, res) => {
  const searchStr = req.body.searchStr;

  try {
      let productList = await productModel.getAllProductOrderBy("name", true);
      let filterdProducts = [];
      
      // get proeucts with similarity higher then threshold
      for (const product of productList) {
          let similarity = stringSimilarity.compareTwoStrings(searchStr, product.name.toLowerCase());
          if (similarity > 0.1) {
              product['similarity'] = similarity;
              filterdProducts.push(product);
          }
      }
      
      filterdProducts.sort((a, b) => (a.similarity < b.similarity) ? 1 : -1)
      console.log('get /products/search filterdProducts:', filterdProducts);
      //res.json(filterdPacks.slice(0, 5));
      res.status(200).send(filterdProducts);
  } catch (error) {
      console.log("Error post /products/search: ", error);
      res.status(400).send(error);
  }
});

router.get('/get-all', async (req, res) => {
  try {
      let productList = await productModel.getAllProductOrderBy("name", true);

      res.status(200).send(productList);
  } catch (error) {
      console.log("Error get products/get-all: ", error);
      res.status(400).send(error);
  }
});

router.get('/filter', async (req, res) => {
  const price = req.query.price;
  try {
      let productList = await productModel.filterByPrice(parseInt(price));

      res.status(200).send(productList);
  } catch (error) {
      console.log("Error get products/filter: ", error);
      res.status(400).send(error);
  }
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

router.delete("/:id", async function (req, res, next) {
  try {
    const response = await productModel.update({id: req.params.id, is_deleted: true});
    console.log(response);
    if (typeof response === "undefined")
      res.status(500).send("Internal server error");

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
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
  const id = req.params.id
  upload(req, res, async function (err) {
    if (err) res.status(400).send(err.message);

    // Everything went fine and save document in DB here.
    for (let i = 0; i < req.files.length; i++) {
      await productImageModel.insert({
        product_id: id,
        url: `img/products/${req.files[i].filename}`,
      });
    }

    if (req.query.post)
      return res.redirect(`/products/${id}/view`);

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
    const response = await productModel.update(req.body);
    if (typeof response === "undefined")
      res.status(500).send("Internal server error");

    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/", async (req, res) => {
  const response = await productModel.create(req.body);
  console.log(response);
  const id = response.id;
  res.redirect(`/products/new?id=${id}`);
});

module.exports = router;
