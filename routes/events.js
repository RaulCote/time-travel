const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Event = require('../models/event.js');
const middlewares = require('../middlewares/middlewares');
const ObjectId = mongoose.Types.ObjectId;

// Events main page: Explore, Your Events, Create.
router.get('/', middlewares.requireUser, middlewares.notifications, (req, res, next) => {
  res.render('events/index');
});

// Events Explore Page
router.get('/explore', middlewares.requireUser, (req, res, next) => {
  Event.find()
    .then((event) => {
      res.render('events/explore', { event });
    })
    .catch((error) => {
      next(error);
    });
});

// Events Create Page
router.get('/create', middlewares.requireUser, (req, res, next) => {
  res.render('events/create');
});

router.post('/create', (req, res, next) => {
  const event = req.body;
  const userId = req.session.currentUser._id;
  event.owner = userId;

  Event.create(event)
    .then((createdEvent) => {
      createdEvent.attendees.push(ObjectId(userId));
      createdEvent.save();
      // req.flash('success', 'Evento creado correctamente.');
      res.redirect('/events');
    })
    .catch((error) => {
      console.log(error);
    });
});

// Edit Event
router.get('/:_id/edit', (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .then((event) => {
      res.render('events/editevent', { event: event });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/:_id/edit', middlewares.requireUser, (req, res, next) => {
  const event = req.body;
  const id = req.params._id;
  Event.findByIdAndUpdate(id, event)
    .then(() => {
      res.redirect(`/events/${id}`);
    })
    .catch(error => {
      console.log(error);
    });
});

// Adding on a Event attendee
router.post('/:_id/attend', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id;

  Event.findById(eventId)
    .then((event) => {
      console.log('Antes del push:' + event);
      event.attendees.push(ObjectId(userId));
      event.save()
        .then(() => {
          console.log(event);
          req.flash('success', '¡Asistencia confirmada! ¡Prepárate!');
          res.redirect('/user/profile/events');
        })
        .catch(next);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Delete Event
router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then((event) => {
      res.render('events/deleteevent', { event });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/delete', middlewares.requireUser, (req, res, next) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(() => {
      req.flash('success', 'Evento eliminado correctamente.');
      res.redirect('/events');
    })
    .catch(error => {
      console.log(error);
    });
});

// Event Page
router.get('/:_id', middlewares.requireUser, (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .populate('attendees')
    .then((event) => {
      res.render('events/displayEvent', { event });
    })
    .catch(error => {
      next(error);
      console.log('Error finding Event ID', error);
    });
});

module.exports = router;
