const express = require('express');
const router = express.Router();
const blogs = require('../data/essays.json')

router.get("/blog", function (req, res, next) {
  const locals = {
    blogs,
    req,
  }
  res.render("blog", locals);
});

module.exports = router;
