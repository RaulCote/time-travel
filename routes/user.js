const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Second step from Sign In
router.get('/profile/favorites', function (req, res, next) {
  console.log('Profile favorites');
  res.render('user/profile/favorites');
});

// Third step from Sign In
router.get('/profile', (req, res, next) => {
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
        .catch((error) => {
          console.log(error);
        });
    });
});

module.exports = router;
