const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');

// get list of all packs
router.get('/', async (req, res) => {
    try {
        let allPack = await packModel.getAll();
        // console.log('get /packlist allPack:', allPack);
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
    
        res.render("packs/pack_list", {
            isPackage: 1,
            packs: allPack,
            packDetail: firstPack,
            productsInPack
        });
    } catch (error) {
        res.status(404).send(error);
    }
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

    res.render("packs/pack_list", {
        isPackage: 1,
        packs: allPack,
        packDetail,
        productsInPack
    });
})

// UI for creating new pack
router.get('/new', async (req, res) => {

});

// store new pack
router.post('/new', async (req, res) => {
    
});

// UI for editing a pack
router.get('/:packId/edit', async (req, res) => {
    const packId = req.params.packId;

    // get all products in this pack
    let packDetail = await packModel.getByPackId(packId);
    console.log('get /packs/:id/edit packDetail: ', packDetail);
    let productsInPack = await pack_itemsModel.getAllProductByPackId(packId);;
    for (const product of productsInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }
    // console.log('get /packs/:id/edit productsInPack: ', productsInPack);

    // get all other products in database that are not in this packs
    let productsNotInPack = await pack_itemsModel.getAllProductNotInPack(packId);
    // console.log('get /packs/:id/edit productsNotInPack: ', productsNotInPack);
    for (const product of productsNotInPack) {
        let productImages = await productImageModel.getImagesByProductId(product.id);
        // console.log('get /packlist productImages:', productImages);
        product['images'] = productImages.reduce((allUrls, productImage) => {
            allUrls.push(productImage.url);
            return allUrls;
        }, []);
    }

    res.render("packs/pack_edit", {
        // name: "Gói thực phẩm",
        // packs: allPack,
        packDetail,
        productsInPack,
        productsNotInPack
    });
});

// update a pack
router.post('/:packId/edit', async (req, res) => {
    let packId = req.params.packId;
    let products = req.body.products;
    let packDetail = req.body.packDetail;
    // console.log('post /packs/:packId/edit packId: ', packId);
    // console.log('post /packs/:packId/edit products: ', products);
    console.log('post /packs/:packId/edit packDetail: ', packDetail);

    try {
        let result = await packModel.updateByPackId(packId, packDetail);
        console.log('post /packs/:packId/edit update result: ', result);
        result = await pack_itemsModel.deleteAllByPackId(packId);
        // console.log('post /packs/:packId/edit delete result: ', result);
        result = await pack_itemsModel.add(products);
        // console.log('post /packs/:packId/edit insert result: ', result);
        res.json(result);
    } catch (error) {
        console.log('Error post /packs/:packId/edit: ', error);
        res.status(400).send(error);
    }
});


module.exports = router;
