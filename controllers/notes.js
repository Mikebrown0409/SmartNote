const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Note = require('../models/note');
const Tag = require('../models/tag');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');
const note = require('../models/note');

// Helper function to handle tags
async function processTagInput(tagInput, userId) {
  if (!tagInput) return [];
  // Split the comma-separated input and trim whitespace
  const tagNames = tagInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
  
  const tagIds = [];
  
  // Process each tag
  for (const name of tagNames) {
    // Try to find existing tag for this user
    let tag = await Tag.findOne({ name, user: userId });
    
    // If tag doesn't exist, create it
    if (!tag) {
      tag = await Tag.create({ name, user: userId });
    }
    
    tagIds.push(tag._id);
  }
  
  return tagIds;
}

// index after login
router.get('/', async (req, res) => {
  // Check if filtering by tag
  const filter = { user: req.user._id };
  let tagFilter = null;
  
  if (req.query.tag) {
    tagFilter = req.query.tag;
    const tag = await Tag.findOne({ name: tagFilter, user: req.user._id });
    if (tag) {
      filter.tags = tag._id;
    }
  }
  
  const userNotes = await Note.find(filter)
    .populate('tags')
    .sort({ updatedAt: -1 });
    
  // Get all user tags for the filter menu
  const userTags = await Tag.find({ user: req.user._id });
  
  res.render('notes/index.ejs', { 
    notes: userNotes, 
    tags: userTags,
    tagFilter,
  });
});

// Get /new
router.get('/new', (req, res) => {
  res.render('notes/new.ejs');
});

// CREATE
// POST /notes
router.post('/', async (req, res) => {
  try {
    // Process tags
    const tagIds = await processTagInput(req.body.tagInput, req.user._id);
    
    // Create note
    const newNote = new Note({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      user: req.user._id,
      tags: tagIds
    });
    
    await newNote.save();
    res.redirect('/notes');
  } catch (err) {
    console.log('Error creating note:', err);
    res.redirect('/notes');
  }
});

//SHOW
// GET /notes/:id
router.get('/:id', async (req,res) => {
  const note = await Note.findById(req.params.id).populate('tags')
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
  const note = await Note.findById(req.params.id).populate('tags');
  res.render('notes/edit.ejs', {note});
})

// UPDATE
// POST /notes/:id
router.put('/:id', async (req, res) => {
  try {
    // Process tags
    const tagIds = await processTagInput(req.body.tagInput, req.user._id);
    
    const note = await Note.findById(req.params.id);
    note.title = req.body.title.trim();
    note.content = req.body.content.trim();
    note.tags = tagIds;
    
    await note.save();
    res.redirect(`/notes/${req.params.id}`);
  } catch (err) {
    console.log('Error updating note:', err);
    res.redirect('/notes');
  }
});

module.exports = router;