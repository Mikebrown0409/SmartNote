const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model("Note", noteSchema);
