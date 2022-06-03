const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addReservation, getReservations, deleteReservation} = require('./reservation.controller')
const router = express.Router()

router.get('/', getReservations)
router.post('/',  log, addReservation)
router.delete('/' ,requireAuth, deleteReservation)
module.exports = router

