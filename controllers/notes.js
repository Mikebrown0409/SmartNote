const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Note = require('../models/note');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const note = require('../models/note');

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

// router.use(async (req,res,next) => {
//     const currentUser = await User.findById(req.session.user._id);
//     req.currentUser = currentUser;
//     next();
// })

// index after login
router.get('/',  async (req, res) => {
  const userNotes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.render('notes/index.ejs', { notes: userNotes });
});

// Get /new
router.get('/new', async (req, res) => {
  // const tags = await Tag.find({}); - for tag implementation once we get notes working
  res.render('notes/new.ejs')
});

// CREATE
// POST /notes
router.post('/', async (req,res) => {
  try {
    const newNote = new Note(req.body)
    newNote.user = req.user._id;
    await newNote.save();
    res.redirect('/notes');
  } catch (err) {
    console.log('not good, errrrrr')
    res.redirect('/notes')
  }
})

//SHOW
// GET /notes/:id
router.get('/:id', async (req,res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/show.ejs', {note})
})

// DELETE
// delete/:id
router.delete('/:id', async (req,res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.redirect('/notes')
})

//EDIT
// GET /notes/:id/edit
router.get('/:id/edit', async (req,res) => {
  const note = await Note.findById(req.params.id)
  res.render('notes/edit.ejs', {note});
})

// UPDATE
// POST /notes/:id
router.put('/:id', async (req,res) => {
  const note = await Note.findById(req.params.id);
  note.title = req.body.title;
  note.content = req.body.content;
  await note.save();
  res.redirect(`/notes/${req.params.id}`)
})

module.exports = router;