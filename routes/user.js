const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const middlewares = require('../middlewares/middlewares');
const Event = require('../models/event.js');
const ObjectId = mongoose.Types.ObjectId;
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Second step from Sign In
router.get('/profile/favorites', middlewares.requireUser, (req, res, next) => {
  console.log('Profile favorites');
  res.render('user/profile/favorites');
});

router.post('/profile/favorites', middlewares.requirePreferences, (req, res, next) => {
  const preferences = req.body.preferences;
  let user = req.session.currentUser;

  User.findById(user._id)
    .then((addtouser) => {
      addtouser.preferences = preferences;
      addtouser.save()
        .then(() => {
          console.log('adding favorite eras');
          console.log(addtouser.preferences);
          res.redirect('/user/profile');
        })
        .catch(next);
    });
});

// Third step from Sign In
router.get('/profile', middlewares.requireUser, (req, res, next) => {
  res.render('user/profile/profile');
});

router.post('/profile', (req, res, next) => {
  const description = req.body.description;
  const email = req.body.email;
  let user = req.session.currentUser;

  if (!description || !email) {
    console.log('rellena todos los campos');
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
          console.log(addtouser.description);
          console.log(addtouser.email);
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
      console.log(event);
      console.log(req.flash);
      res.render('user/profile/your-events', { event });
    })
    .catch(next);
});

router.post('/profile/events', (req, res, next) => {
//   User.findById(id)
//   .populate('favorites')
//   .then((user) => {
//     console.log('user', user);
//     res.render('auth/profile', { user })
//   })
//   .catch(next);
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
  // User.findById(id)
  //   .then((user) => {
  //     res.render('user/profile/me', { user });
  //   })
    .catch(next);
});

// Edit your profile

router.get('/profile/me/edit', (req, res, next) => {
  const id = req.session.currentUser._id;
  User.findById(id)
    .then((user) => {
      res.render('user/profile/editprofile', { user: user });
    })
    .catch(next);
});

router.post('/me/edit', middlewares.requireUser, (req, res, next) => {
  const user = req.body;
  const id = req.params._id;
  User.findByIdAndUpdate(id, user)
    .then(() => {
      res.redirect(`user/profile/me`);
    })
    .catch(next);
});

module.exports = router;
