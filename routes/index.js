const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/middlewares');

/* GET home page. */
router.get('/', middlewares.requireAnon, function (req, res, next) {
  res.render('index');
});

module.exports = router;
