var express = require("express");
var router = express.Router();
var commitsByRepo = require("../data/commits.json")

/* GET home page. */
router.get("/", function (req, res, next) {
  const locals = {
    commitsByRepo,
    req
  };

  res.render("index", locals);
});

module.exports = router;
