const express = require("express");
const router = express.Router();
const packModel = require('../models/packModel');
const pack_itemsModel = require('../models/pack_itemsModel');
const productImageModel = require('../models/productImageModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');

router.get("/history", async (req, res) => {
    if (!req.cookies.user)
        res.redirect('/acount/login-id');

    const user = await userModel.getByUsername(req.cookies.user);
    const orders = await orderModel.getOrderHistory(user.id);
    console.log(orders);

    //giả sử lấy được n
    let listorder = [];
    let n = 3;
    let stt = ['paid', 'unpaid'];
    for (let i = 0; i < 3; i++) {
        let statusrandom = stt[Math.round(Math.random() * 1)];
        let color;
        if (statusrandom === 'paid')
            color = 'success';
        else
            color = 'warning';
        let orderid = {
            id: `00${i + 1}`,
            time: `0${i + 1}/01/2022`,
            status: statusrandom,
            status_color: (statusrandom == 'paid') ? 'success' : 'warning',
            total: Math.round(Math.random() * 100000),
            disable: (statusrandom == 'paid') ? 'disabled' : '',
            colorbtnpayment: (statusrandom == 'paid') ? 'secondary' : 'success',
            listpackage: [{ catepack: '#3', namepack: 'Gói test' }, { catepack: '#2', namepack: 'Gói vệ sinh' }, { catepack: '#1', namepack: 'Gói thực phẩm' }]
        }
        listorder[i] = orderid;
    }
    console.log(listorder);
    res.render('order/order_history', {
        listorder: listorder
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
