const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const packModel = require("../models/packModel");
const pack_itemsModel = require("../models/pack_itemsModel");
const productImageModel = require("../models/productImageModel");
const stringSimilarity = require("string-similarity");

// Render UI for creating new pack
router.get("/new", async (req, res) => {
    try {
        let allProducts = await productModel.getProductList();
        // console.log('get /packs/new allProduct: ', allProducts);
        res.render("packs/pack_create", {
            allProducts,
        });
    } catch (error) {
        console.log("Error get /packs/new: ", error);
        res.status(404).send(error);
    }
});

// Store new pack
router.post("/new", async (req, res) => {
    let products = req.body.products;
    let packDetail = req.body.packDetail;
    console.log('post /packs/:packId/edit products: ', products);
    console.log('post /packs/:packId/edit packDetail: ', packDetail);

    try {
        let result = await packModel.add(packDetail);
        // console.log("post /packs/:packId/edit insert pack result: ", result);

        for (const product of products) {
            product["pack_id"] = result.id;
        }
        // console.log("post /packs/:packId/edit products: ", products);

        result = await pack_itemsModel.add(products);
        // console.log("post /packs/:packId/edit insert pack_items result: ", result);
        res.json(result);
    } catch (error) {
        console.log("Error post /packs/new: ", error);
        res.status(400).send(error);
    }
});

// Render UI for editing a pack
router.get("/:packId/edit", async (req, res) => {
    const packId = req.params.packId;

    try {
        // get all products in this pack
        let packDetail = await packModel.getByPackId(packId);
        console.log("get /packs/:id/edit packDetail: ", packDetail);
        let productsInPack = await pack_itemsModel.getAllProductByPackId(packId);
        // add image url to products
        for (const product of productsInPack) {
            let productImages = await productImageModel.getImagesByProductId(product.id);
            product["images"] = productImages.reduce((allUrls, productImage) => {
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
            product["images"] = productImages.reduce((allUrls, productImage) => {
                allUrls.push(productImage.url);
                return allUrls;
            }, []);
        }

        res.render("packs/pack_edit", {
            packDetail,
            productsInPack,
            productsNotInPack,
        });
    } catch (error) {
        console.log("Error get /packs/:packId/edit: ", error);
        res.status(404).send(error);
    }
});

// Update a pack
router.post("/:packId/edit", async (req, res) => {
    let packId = req.params.packId;
    let products = req.body.products;
    let packDetail = req.body.packDetail;
    console.log('post /packs/:packId/edit packId: ', packId);
    // console.log('post /packs/:packId/edit products: ', products);
    console.log("post /packs/:packId/edit packDetail: ", packDetail);

    try {
        let result = await packModel.updateByPackId(packId, packDetail);
        console.log("post /packs/:packId/edit update result: ", result);
        result = await pack_itemsModel.deleteAllByPackId(packId);
        // console.log('post /packs/:packId/edit delete result: ', result);
        result = await pack_itemsModel.add(products);
        // console.log('post /packs/:packId/edit insert result: ', result);
        res.json(result);
    } catch (error) {
        console.log("Error post /packs/:packId/edit: ", error);
        res.status(400).send(error);
    }
});

router.post("/:packId/delete", async (req, res) => {
    const packId = req.params.packId;

    try {
        // soft delete
        let result = await packModel.updateByPackId(packId, {
            is_deleted: true,
        });
        console.log("post /packs/:packId/edit delete result: ", result);
        res.json(result);
    } catch (error) {
        console.log("Error post /packs/:packId/delete: ", error);
        res.status(400).send(error);
    }
});

// search pack by name
router.post('/search', async (req, res) => {
    const searchStr = req.body.searchStr;

    try {
        let allPacks = await packModel.getAll();
        let filterdPacks = [];
        
        // get packs with similarity higher then threshold
        for (const pack of allPacks) {
            let similarity = stringSimilarity.compareTwoStrings(searchStr, pack.name);
            console.log(`get /packs/search ${pack.name} - ${similarity} `);
            if (similarity > 0.2) {
                filterdPacks.push(pack);
            }
        }
        
        if (filterdPacks.length > 0) {
            let packId = filterdPacks[0].id;
            let packDetail = await packModel.getByPackId(packId);
            let productsInPack = await pack_itemsModel.getAllProductByPackId(
                packId
            );

            for (const product of productsInPack) {
                let productImages = await productImageModel.getImagesByProductId(
                    product.id
                );
                // console.log('get /packlist productImages:', productImages);
                product["images"] = productImages.reduce((allUrls, productImage) => {
                    allUrls.push(productImage.url);
                    return allUrls;
                }, []);
            }

            console.log('get /packs/search filterdPacks:', filterdPacks);
            res.render("packs/pack_list", {
                isSearch: 1,
                isPackage: 1,
                packs: filterdPacks,
                packDetail,
                productsInPack,
            });
        } else {
            res.render("packs/pack_list", {
                isSearch: 1,
                isPackage: 1,
                // packs: null,
                // packDetail,
                // productsInPack,
            });
        }
        

    } catch (error) {
        console.log("Error post /packs/search: ", error);
        res.status(400).send(error);
    }
});

// get products list of pack by packId
router.get("/:packId", async (req, res) => {
    const packId = req.params.packId;
    // const orderBy = req.query["order-by"];

    try {
        // let allPack = await packModel.getAll();
        let packDetail = await packModel.getByPackId(packId);
        let productsInPack = await pack_itemsModel.getAllProductByPackId(packId);

        // switch (orderBy) {
        //     case "name-ascending":
        //         productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy( packId, "name", true);
        //         break;

        //     case "name-descending":
        //         productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, "name", false);
        //         break;

        //     case "price-ascending":
        //         productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, "price", true);
        //         break;

        //     case "price-descending":
        //         productsInPack = await pack_itemsModel.getAllProductByPackIdOrderBy(packId, "price", false);
        //         break;

        //     default:
        //         productsInPack = await pack_itemsModel.getAllProductByPackId(packId);
        //         break;
        // }

        for (const product of productsInPack) {
            let productImages = await productImageModel.getImagesByProductId(
                product.id
            );
            // console.log('get /packlist productImages:', productImages);
            product["images"] = productImages.reduce((allUrls, productImage) => {
                allUrls.push(productImage.url);
                return allUrls;
            }, []);
        }

        console.log('get /packs/:packId packDetail: ', packDetail);
        console.log('get /packs/:packId productsInPack: ', productsInPack);
        
        res.json({
            packDetail,
            packItems: productsInPack
        });

        // res.render("packs/pack_list", {
        //     isPackage: 1,
        //     packs: allPack,
        //     packDetail,
        //     productsInPack,
        // });
    } catch (error) {
        console.log("Error get /packs/:packId: ", error);
        res.status(404).send(error);
    }
});

// get list of all packs
router.get("/", async (req, res) => {
    let packId = req.query['show-detail'];

    try {
        let allPack = await packModel.getAll();
        // console.log('get /packlist allPack:', allPack);
        if (!packId) {
            packId = allPack[0].id;
        }

        let packDetail = await packModel.getByPackId(packId);
        let productsInPack = await pack_itemsModel.getAllProductByPackId(
            packId
        );

        for (const product of productsInPack) {
            let productImages = await productImageModel.getImagesByProductId(
                product.id
            );
            // console.log('get /packlist productImages:', productImages);
            product["images"] = productImages.reduce((allUrls, productImage) => {
                allUrls.push(productImage.url);
                return allUrls;
            }, []);
        }
        
        console.log('get /packlist packDetail:', packDetail);
        console.log('get /packlist productsInPack:', productsInPack);

        res.render("packs/pack_list", {
            isPackage: 1,
            packs: allPack,
            packDetail,
            productsInPack,
        });
    } catch (error) {
        console.log("Error get /packs: ", error);
        res.status(404).send(error);
    }
});

module.exports = router;
