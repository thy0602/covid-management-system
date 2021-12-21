const express = require("express");
const cookieParser = require("cookie-parser");

const port = 3001;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./middlewares/handlebars")(app);
app.use(express.static(__dirname + "/public"));

//session
require('./middlewares/session')(app);
//passport
require('./middlewares/passport')(app);

// app.use('/account', require('./controllers/accountController'));
app.use('/dashboard', require('./controllers/dashboardController'));
app.use('/login', require('./controllers/LoginController'));

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
