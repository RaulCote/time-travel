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
    console.log('rellena todo los campos');
    return res.redirect('/auth/signup');
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
  requireUser,
  requireAnon,
  requireUserPassSignUp,
  requirePreferences
};
