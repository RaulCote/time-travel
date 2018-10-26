const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const middlewares = require('../middlewares/middlewares');
const Event = require('../models/event.js');
const ObjectId = mongoose.Types.ObjectId;

// User Index
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Second step from Sign In
router.get('/profile/favorites', middlewares.requireUser, middlewares.notifications, (req, res, next) => {
  res.render('user/profile/favorites', { messages: req.flash('error') });
});

router.post('/profile/favorites', middlewares.requirePreferences, (req, res, next) => {
  const preferences = req.body.preferences;
  let user = req.session.currentUser;

  User.findById(user._id)
    .then((addtouser) => {
      addtouser.preferences = preferences;
      addtouser.save()
        .then(() => {
          res.redirect('/user/profile');
        })
        .catch(next);
    });
});

// Third step from Sign In
router.get('/profile', middlewares.requireUser, middlewares.notifications, (req, res, next) => {
  res.render('user/profile/profile', { messages: req.flash('error') });
});

router.post('/profile', (req, res, next) => {
  const description = req.body.description;
  const email = req.body.email;
  let user = req.session.currentUser;

  if (!description || !email) {
    req.flash('error', 'Fill in all required entry fields.');
    return res.redirect('/user/profile');
  }

  // To save new data on a current user.
  // 1) Call the user. 2) FindbyID. 3) Save data.

  User.findById(user._id)
    .then((addtouser) => {
      addtouser.description = description;
      addtouser.email = email;
      addtouser.save()
        .then(() => {
          req.flash('success', `Welcome to TimeTravel ${user.username}!`);
          res.redirect('/events');
        })
        .catch(next);
    });
});

// Your Events page

router.get('/profile/events', middlewares.notifications, middlewares.requireUser, (req, res, next) => {
  const id = req.session.currentUser._id;

  Event.find({ attendees: { $eq: ObjectId(id) } })
    .then((event) => {
      res.render('user/profile/your-events', { event });
    })
    .catch(next);
});

// Your profile page

router.get('/profile/me', middlewares.requireUser, (req, res, next) => {
  const id = req.session.currentUser._id;
  const promiseUser = User.findById(id);
  const promiseAttendingEvents = Event.find({ attendees: id });

  Promise.all([promiseUser, promiseAttendingEvents])
    .then((results) => {
      const data = {
        user: results[0],
        events: results[1]
      };
      res.render('user/profile/me', data);
    })
    .catch(next);
});

// Edit your profile

router.get('/profile/me/edit', middlewares.notifications, (req, res, next) => {
  const id = req.session.currentUser._id;
  User.findById(id)
    .then((user) => {
      res.render('user/profile/editprofile', { messages: req.flash('error'), user: user });
    })
    .catch(next);
});

router.post('/me/edit', middlewares.requireUser, middlewares.requireEditProfile, (req, res, next) => {
  const userinfo = req.body;
  const id = req.session.currentUser._id;

  User.findByIdAndUpdate(id, userinfo)
    .then(() => {
      res.redirect('/user/profile/me');
    })
    .catch(next);
});

module.exports = router;
