'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const middlewares = require('../middlewares/middlewares');

// Sign Up :: First Page (2nd and 3rd on User.js)
router.get('/signup', /* middlewares.requireAnon, */function (req, res, next) {
  console.log(User.schema.path('preferences').caster.enumValues);
  res.render('auth/signup');
});

router.post('/signup', middlewares.requireUserPassSignUp, function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.redirect('/auth/signup');
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        User.create({ username, password: hashedPassword })
          .then((user) => {
            user.save()
              .then(() => {
                req.session.currentUser = user;
                res.redirect('/user/profile/favorites');
                console.log(req.session.currentUser);
              });
          })
          .catch(next);
      }
    })
    .catch(next);
});

// Log In Page
router.get('/login', /* middlewares.requireAnon, */function (req, res, next) {
  res.render('auth/login');
});

router.post('/login', /* middlewares.requireAnon, */function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    console.log('rellena todo los campos');
    return res.redirect('/auth/login');
  };

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log('no existe user');
        return res.redirect('/auth/login');
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/events');
      } else {
        console.log('contraseña erronea');
        return res.render('auth/login');
      }
    })
    .catch(next);
  // .then((user) => {
  //   if (user) {
  //     res.redirect('/auth/login');
  //   } else {
  //     const salt = bcrypt.genSaltSync(saltRounds);
  //     const hashedPassword = bcrypt.hashSync(password, salt);

  //     User.create({ username, password: hashedPassword })
  //       .then((user) => {
  //         user.save()
  //           .then(() => {
  //             req.session.currentUser = user.username;
  //             res.redirect('/events');
  //             console.log('hola ' + req.session.currentUser);
  //           });
  //       })
  //       .catch(next);
  //   }
  // })
  // .catch(next);
});

module.exports = router;
