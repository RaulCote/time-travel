var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Second step from Sign In
router.get('/profile/favorites', function (req, res, next) {
  console.log('Profile favorites');
  res.render('user/profile/favorites');
});

module.exports = router;
