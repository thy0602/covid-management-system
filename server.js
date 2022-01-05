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

//session
require('./middlewares/session')(app);
//passport
require('./middlewares/passport')(app);

app.use('/dashboard', require('./controllers/dashboardController'));
app.use('/login', require('./controllers/LoginController'));
app.use('/users', require('./controllers/userController'));
app.use('/userlist', require('./controllers/user_listController'));
app.use('/productlist', require('./controllers/product_listController'));
app.use('/packlist', require('./controllers/pack_listController'));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
