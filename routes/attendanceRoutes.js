const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getAttendanceByStaff,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance records with filters
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *         description: Filter by shift
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *         description: Filter by staff ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Present, Absent, Leave, Half-Day]
 *         description: Filter by attendance status
 *     responses:
 *       200:
 *         description: List of attendance records with grouped data
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Mark attendance for a staff member
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       200:
 *         description: Attendance updated (if already exists)
 *       404:
 *         description: Staff not found
 *
 * /api/attendance/bulk:
 *   post:
 *     summary: Mark bulk attendance for multiple staff members
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendanceRecords:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Bulk attendance marked successfully
 *       400:
 *         description: Invalid request
 *
 * /api/attendance/staff/{staffId}:
 *   get:
 *     summary: Get attendance history for specific staff
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for range
 *     responses:
 *       200:
 *         description: Staff attendance history with statistics
 *       404:
 *         description: Staff not found
 *
 * /api/attendance/{id}:
 *   put:
 *     summary: Update attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Leave, Half-Day]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       404:
 *         description: Attendance record not found
 *   delete:
 *     summary: Delete attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       404:
 *         description: Attendance record not found
 */

// Attendance routes
router.route('/')
  .get(getAttendance)
  .post(markAttendance);

router.post('/bulk', markBulkAttendance);

router.route('/:id')
  .put(updateAttendance)
  .delete(deleteAttendance);

router.get('/staff/:staffId', getAttendanceByStaff);

module.exports = router;
