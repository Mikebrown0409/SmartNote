const User = require('../models/user');

module.exports = async function (req, res, next) {
  // Add the user doc to req.user if logged in
  req.user = req.session.userId ? await User.findById(req.session.userId) : null;
  // Add the user doc to res.locals so that we can access user in our templates
  res.locals.user = req.user;
  next();
};