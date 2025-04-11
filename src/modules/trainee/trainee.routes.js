const express = require('express');

const { verifyToken } = require('../../middleware/auth.middleware');
const checkRole = require('../../middleware/role.middleware');
const scheduleController = require('./schedule.controller');
const traineeController = require('./trainee.controller');
const router = express.Router();

router.get('/all',verifyToken,checkRole('trainee'),scheduleController.getAvailableSchedules);
router.get('/profile',verifyToken,checkRole('trainee'),traineeController.getProfile);
router.put('/updateProfile',verifyToken,checkRole('trainee'),traineeController.updateProfile);
// Route to book a schedule
router.post('/:scheduleId/book', verifyToken,checkRole('trainee'),traineeController.bookSchedule);
router.delete('/schedule/:scheduleId',verifyToken,checkRole('trainee'), traineeController.cancelBooking);
module.exports = router;