const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  staffId: {
    type: String,
    required: [true, 'Please add a staff ID'],
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true,
  },
  shift: {
    type: String,
    required: [true, 'Please add shift details'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Staff', staffSchema);
