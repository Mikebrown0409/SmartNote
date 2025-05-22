const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: { user: 1, name: 1 }, unique: true }
  ]
});

module.exports = mongoose.model("Tag", tagSchema);