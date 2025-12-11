const express = require('express');
const router = express.Router();
const {
  getStaffs,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect } = require('../middleware/auth');

// Protect all staff routes with authentication
router.route('/').get(protect, getStaffs).post(protect, createStaff);

router.route('/:id').get(protect, getStaff).put(protect, updateStaff).delete(protect, deleteStaff);

module.exports = router;
