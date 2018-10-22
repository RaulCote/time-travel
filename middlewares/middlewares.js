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
    req.flash('error', 'Cumplimenta todos los campos.');
    res.redirect('/auth/signup');
  } else {
    next();
  }
};

function requireUserPassLogIn (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    req.flash('error', 'Cumplimenta todos los campos.');
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
    console.log('rellena los campos');
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
  requirePreferences
};
