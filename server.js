const express = require("express");
const cookieParser = require("cookie-parser");
var path = require('path');

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
app.use('/users', require('./controllers/userController/usersController'));
app.use('/products', require('./controllers/productsController'));
app.use('/packs', require('./controllers/packsController'));
app.use('/order', require('./controllers/orderController'));
app.use('/quarantine-locations', require('./controllers/quarantineLocationsController'));
app.use('/login', require('./controllers/loginController'));
app.use('/order-detail', require('./controllers/orderDetailController'));
app.use('/manage', require('./controllers/manageUserController'));

app.use('/dashboard', require('./controllers/dashboardController'));
app.use('/server-log', require('./controllers/serverLogController'));

app.get("/", (req, res) => {
  if (req.cookies.user)
    res.redirect("/dashboard");
  else
    res.redirect("/account/login-id");
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
