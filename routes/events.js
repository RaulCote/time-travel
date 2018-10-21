const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

router.get('/', (req, res, next) => {
  console.log('Router from events');
  res.render('events/index');
});

module.exports = router;
