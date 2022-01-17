const express = require("express");
const router = express.Router();

const verify = require("../middlewares/verify").verify;

const serverLog = require("../utils/server_log");

router.use('/', (req, res, next) => {
    if (verify(req, 'admin'))
        next();
    else
        res.redirect('/');
});

router.get("/", async (req, res) => {
  const logs = await serverLog.view_action({ limit: 200 });
  const formattedLogs = [];
  logs.forEach((log) => {
    const array = log.split("|");
    console.log(array);
    formattedLogs.push({
      date: array[0],
      id: array[1],
      action: array[2],
      data: array[3],
    });
  });
  return res.render("server-log", {
    logs: formattedLogs,
  });
});

module.exports = router;
