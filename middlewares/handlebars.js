const exphbs = require("express-handlebars");
var express_handlebars_sections = require("express-handlebars-sections");

module.exports = (app) => {
  const hbs = exphbs.create({
    defaultLayout: "mainLayout",
    extname: "hbs",
    helpers: {
      ifStr(s1, s2, options) {
        if (s1 === s2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  });
  express_handlebars_sections(hbs);
  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");
  app.set("views", "./views");
};