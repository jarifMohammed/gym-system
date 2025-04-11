const express = require('express')
const router = express.Router()
const adminController = require('./admin.controller')
const {verifyToken} = require('../../middleware/auth.middleware')
const checkRole = require('../../middleware/role.middleware')





router.post('/create-schedule',verifyToken,checkRole('admin'),adminController.createSchedule)
router.get('/schedules',verifyToken,checkRole('admin'),adminController.getAdminSchedules)
router.patch('/assign/:scheduleId',verifyToken,checkRole('admin'), adminController.assignTrainer);

module.exports = router