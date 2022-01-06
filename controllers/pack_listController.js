const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');
const userModel = require('../models/userModel');

// get list of all packs
router.get('/', async (req, res) => {
    let allPack = await packModel.getAll();
    let firstPack = allPack[0];
    let productsInPack = await pack_itemsModel.getAllByPackId(firstPack.id);

    productsInPack.forEach(product => {
        let productImages = productImageModel.getImagesByProductId(product.id);
        product['images'] = productImages.reduce((allUrls, product) => {
            allUrls.push(product.url);
            return allUrls;
        }, []);
    });

    res.render("pack_list", {
        isPackage: 1,
        packs: allPack,
        packDetail: firstPack,
        productsInPack
    });
});

// get products list of pack by packId
router.get('/:packId', async (req, res) => {
    const packId = req.params.packId;
    let allPack = await packModel.getAll();
    let packDetail = await packModel.getByPackId(packId);
    let productsInPack = await pack_itemsModel.getAllByPackId(packId);

    productsInPack.forEach(product => {
        let productImages = productImageModel.getImagesByProductId(product.id);
        product['images'] = productImages.reduce((allUrls, product) => {
            allUrls.push(product.url);
            return allUrls;
        }, []);
    });

    res.render("pack_list", {
        isPackage: 1,
        packs: allPack,
        packDetail,
        productsInPack
    });
})

// UI for creating new pack
router.get('/create', async (req, res) => {

});

// store new pack
router.post('/store', async (req, res) => {
    
});

// UI for editing a pack
router.get('/:packId/edit', async (req, res) => {

});

// update a pack
router.post('/:packId/update', async (req, res) => {
    
});


module.exports = router;