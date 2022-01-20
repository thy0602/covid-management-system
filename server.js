const express = require("express");
const cookieParser = require("cookie-parser");
var path = require('path');

//handle https
const fs = require("fs");
var https = require('https');

const port = 3001;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./middlewares/handlebars")(app);
// app.use(express.static(__dirname + "/public"));
app.use(express.static(path.resolve('./public')));
//passport
require('./middlewares/session')(app);
//passport
require('./middlewares/passport')(app);

app.use('/account', require('./controllers/accountController'));
app.use('/myAccount', require('./controllers/myAccountController'));
app.use('/users', require('./controllers/userController/usersController'));
app.use('/products', require('./controllers/productsController'));
app.use('/packs', require('./controllers/packsController'));
app.use('/orders', require('./controllers/orderController'));
app.use('/order-history', require('./controllers/orderHistoryController'));
app.use('/quarantine-locations', require('./controllers/quarantineLocationsController'));
app.use('/login', require('./controllers/loginController'));
app.use('/order-detail', require('./controllers/orderDetailController'));
app.use('/manage', require('./controllers/manageUserController'));
app.use('/admin', require('./controllers/adminController'));
app.use('/area', require('./controllers/areaController'));


app.use('/dashboard', require('./controllers/dashboardController'));
app.use('/server-log', require('./controllers/serverLogController'));
app.use('/api/authenticate', require('./controllers/api/authenticateController'));
app.use('/api/payment-limit', require('./controllers/api/paymentLimitController'));
app.use('/api/manage', require('./controllers/manageController'));

app.get("/", (req, res) => {
  if (req.cookies.user)
    res.redirect("/dashboard");
  else
    res.redirect("/account/login-id");
});

var privateKey  = fs.readFileSync(__dirname+'/secret-key/CA/localhost/localhost.decrypted.key');
var certificate = fs.readFileSync(__dirname+'/secret-key/CA/localhost/localhost.crt');

var options = {
  key: privateKey,
  cert: certificate
};

var server = https.createServer(options, app);
server.listen(port, function () {
  console.log('HTTPS Express server is up on port ' + port);
});
