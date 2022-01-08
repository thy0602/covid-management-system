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

app.use('/account', require('./controllers/accountController'));
app.use('/users', require('./controllers/usersController'));
app.use('/products', require('./controllers/productsController'));
app.use('/packs', require('./controllers/packsController'));
app.use('/order', require('./controllers/orderController'));
app.use('/quarantine-locations', require('./controllers/quarantineLocationsController'));

app.use('/dashboard', require('./controllers/dashboardController'));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
