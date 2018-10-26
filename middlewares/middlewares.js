function notifications (req, res, next) {
  // We extract the messages separately cause we call req.flash() we'll clean the object flash.
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
};

function requireUser (req, res, next) {
  const user = req.session.currentUser;

  if (!user) {
    return res.redirect('/auth/login');
  } else {
    next();
  }
};

function requireUserPassSignUp (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    req.flash('error', 'Fill in all required entry fields.');
    res.redirect('/auth/signup');
  } else {
    next();
  }
};

function requireCreatingEvent (req, res, next) {
  const event = req.body;

  if (!event.name || !event.description || !event.era || !event.date) {
    req.flash('error', 'Fill in all required entry fields.');
    res.redirect('/events/create');
  } else {
    next();
  };
};

function requireEditProfile (req, res, next) {
  const userinfo = req.body;

  if (!userinfo.preferences || !userinfo.description) {
    req.flash('error', 'Fill in all required entry fields.');
    return res.redirect('/user/profile/me/edit');
  } else {
    next();
  };
};

function requireUserPassLogIn (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    req.flash('error', 'Fill in all required entry fields.');
    return res.redirect('/auth/login');
  } else {
    next();
  }
};

function requireAnon (req, res, next) {
  const user = req.session.currentUser;

  if (user) {
    return res.redirect('/events');
  } else {
    next();
  }
};

function requirePreferences (req, res, next) {
  const preferences = req.body.preferences;

  if (!preferences) {
    req.flash('error', 'Fill in all required entry fields.');
    return res.redirect('/user/profile/favorites');
  } else {
    next();
  }
};

module.exports = {
  notifications,
  requireUser,
  requireAnon,
  requireUserPassSignUp,
  requireUserPassLogIn,
  requirePreferences,
  requireEditProfile,
  requireCreatingEvent
};
