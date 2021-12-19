const express = require("express");
const cookieParser = require("cookie-parser");

const port = 3001;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./middlewares/handlebars")(app);
app.use(express.static(__dirname + "/public"));

// app.use('/account', require('./controllers/accountController'));
// app.use('/transaction', require('./controllers/transactionRecordController'));

app.get("/", (req, res) => {
  res.render("dashboard", {
  });
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
