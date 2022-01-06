const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');
const userModel = require('../models/userModel');

// get list of all packs
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
    const orderBy = req.query['order-by'];

    let allPack = await packModel.getAll();
    let packDetail = await packModel.getByPackId(packId);
    let productsInPack;

    switch (orderBy) {
        case 'name-ascending':
            productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, 'name', true);
            break;

        case 'name-descending':
            productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, 'name', false);
            break;

        case 'price-ascending':
            productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, 'price', true);
            break

        case 'price-descending':
            productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, 'price', false);
            break
    
        default:
            productsInPack = await pack_itemsModel.getAllProductByPackId(packId);
            break;
    }

    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }

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