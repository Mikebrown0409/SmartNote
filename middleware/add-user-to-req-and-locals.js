const User = require('../models/user');

module.exports = async function (req, res, next) {
  req.user = req.session.userId ? await User.findById(req.session.userId) : null;
  res.locals.user = req.user;
  next();
};