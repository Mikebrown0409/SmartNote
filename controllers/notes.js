const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Note = require('../models/note');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
// router.use(ensureLoggedIn);

// ALL paths start with '/notes'

// index action
// GET /notes
// Example of a non-protected route
// router.get('/', (req, res) => {
//   res.send('List of all notes - not protected');
// });


// GET /notes/new
// Example of a protected route

// index after login
router.get('/', (req, res) => {
  res.render('notes/index.ejs')
});

router.get('/new', ensureLoggedIn, (req, res) => {
  res.send('Create a ');
});

module.exports = router;