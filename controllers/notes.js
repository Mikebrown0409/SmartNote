const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tag');

async function processTagInput(tagInput, userId) {
  if (!tagInput) return [];
  const tagNames = tagInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
  const tagIds = [];
  for (const name of tagNames) {
    let tag = await Tag.findOne({ name, user: userId });
    if (!tag) {
      tag = await Tag.create({ name, user: userId });
    }
    tagIds.push(tag._id);
  }
  return tagIds;
}

router.get('/', async (req, res) => {
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
  const userTags = await Tag.find({ user: req.user._id });
  res.render('notes/index.ejs', { 
    notes: userNotes, 
    tags: userTags,
    tagFilter,
  });
});

router.get('/new', (req, res) => {
  res.render('notes/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    const tagIds = await processTagInput(req.body.tagInput, req.user._id);
    const newNote = new Note({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      user: req.user._id,
      tags: tagIds
    });
    
    await newNote.save();
    res.redirect('/notes');
  } catch (err) {
    res.redirect('/notes');
  }
});

router.get('/:id', async (req,res) => {
  const note = await Note.findById(req.params.id).populate('tags')
  res.render('notes/show.ejs', {note})
})

router.delete('/:id', async (req,res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.redirect('/notes')
})

router.get('/:id/edit', async (req,res) => {
  const note = await Note.findById(req.params.id).populate('tags');
  res.render('notes/edit.ejs', {note});
})

router.put('/:id', async (req, res) => {
  try {
    const tagIds = await processTagInput(req.body.tagInput, req.user._id);
    const note = await Note.findById(req.params.id);
    note.title = req.body.title.trim();
    note.content = req.body.content.trim();
    note.tags = tagIds;
    
    await note.save();
    res.redirect(`/notes/${req.params.id}`);
  } catch (err) {
    res.redirect('/notes');
  }
});

module.exports = router;