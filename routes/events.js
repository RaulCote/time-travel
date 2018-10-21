const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Event = require('../models/event.js');
const ObjectId = mongoose.Types.ObjectId;

// Events main page: Explore, Your Events, Create.
router.get('/', (req, res, next) => {
  res.render('events/index');
});

// Events Explore Page
router.get('/explore', (req, res, next) => {
  res.render('events/explore');
});

router.get('/create', (req, res, next) => {
  res.render('events/create');
});

router.post('/create', (req, res, next) => {
  const event = req.body;
  const userId = req.session.currentUser._id;
  event.owner = userId;

  Event.create(event)
    .then(() => {
      res.redirect('/events');
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
