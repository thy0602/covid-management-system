const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');

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

// get products list of pack by packId
router.get('/:packId', async (req, res) => {
    const packId = req.params.packId;

    let allPack = await packModel.getAll();
    let packDetail = await packModel.getByPackId(packId);
    let productsInPack = await pack_itemsModel.getAllProductByPackId(packId);

    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }

    res.render("order/order", {
        isPackage: 1,
        packs: allPack,
        packDetail,
        productsInPack
    });
})

router.get('/', async (req, res) => {
    let allPack = await packModel.getAll();
    console.log('get /packlist allPack:', allPack);
    let firstPack = allPack[0];
    let productsInPack = await pack_itemsModel.getAllProductByPackId(firstPack.id);

    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }
    // console.log('get /packlist productsInPack:', productsInPack);

    res.render("order/order", {
        isPackage: 1,
        packs: allPack,
        packDetail: firstPack,
        productsInPack
    });
});


module.exports = router;
