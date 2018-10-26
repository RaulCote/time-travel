const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Event = require('../models/event.js');
const middlewares = require('../middlewares/middlewares');
const ObjectId = mongoose.Types.ObjectId;

// Events main page: Explore, Your Events, Create.
router.get('/', middlewares.requireUser, middlewares.notifications, (req, res, next) => {
  res.render('events/index', { messages: req.flash('success') });
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
router.get('/create', middlewares.requireUser, middlewares.notifications, (req, res, next) => {
  res.render('events/create', { messages: req.flash('error') });
});

router.post('/create', middlewares.requireCreatingEvent, (req, res, next) => {
  const event = req.body;
  const userId = req.session.currentUser._id;
  event.owner = userId;

  Event.create(event)
    .then((createdEvent) => {
      createdEvent.attendees.push(ObjectId(userId));
      createdEvent.save();
      req.flash('success', 'Event created succesfully.');
      res.redirect('/events');
    })
    .catch(next);
});

// Edit Event
router.get('/:_id/edit', (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .then((event) => {
      res.render('events/editevent', { event: event });
    })
    .catch(next);
});

router.post('/:_id/edit', middlewares.requireUser, (req, res, next) => {
  const event = req.body;
  const id = req.params._id;
  Event.findByIdAndUpdate(id, event)
    .then(() => {
      res.redirect(`/events/${id}`);
    })
    .catch(next);
});

// Attend an Event
router.post('/:_id/attend', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id;

  Event.findById(eventId)
    .then((event) => {
      event.attendees.push(ObjectId(userId));
      event.save()
        .then(() => {
          req.flash('success', 'Get ready for your Event!');
          res.redirect('/user/profile/events');
        })
        .catch(next);
    })
    .catch(next);
});

// Don't attend an Event

router.post('/:_id/reject', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id;

  Event.findByIdAndUpdate({ _id: eventId }, { $pull: { attendees: ObjectId(userId) } })
    .then((event) => {
      res.redirect(`/events/${eventId}`);
    })
    .catch(next);
});

//  Event.find({ attendees: { $eq: ObjectId(id) } })
// Event.findByIdAndUpdate(query, update)

// Delete Event
router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Event.findById(id)
    .then((event) => {
      res.render('events/deleteevent', { event });
    })
    .catch(next);
});

router.post('/:id/delete', middlewares.requireUser, (req, res, next) => {
  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(() => {
      req.flash('success', 'Evento eliminado correctamente.');
      res.redirect('/events');
    })
    .catch(next);
});

// Event Page
router.get('/:_id', middlewares.requireUser, (req, res, next) => {
  const id = req.params._id;
  const currentUserId = req.session.currentUser._id;

  if (!ObjectId.isValid(id)) {
    return next();
  }

  Event.findById(id)
    .populate('attendees')
    .then((event) => {
      if (!event) {
        return next();
      }
      const amIattendee = event.attendees.some((item) => {
        return item._id == currentUserId;
      });
      return res.render('events/displayEvent', { event, amIattendee });
    })
    .catch(next);
});

module.exports = router;
