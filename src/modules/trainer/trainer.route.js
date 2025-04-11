const express = require('express')
const router = express.Router()
const trainerController = require('./trainer.controller')

const {verifyToken} = require('../../middleware/auth.middleware')
const checkRole = require('../../middleware/role.middleware')



router.get('/my-schedules',verifyToken,checkRole('trainer'), trainerController.mySchedules)

module.exports = router