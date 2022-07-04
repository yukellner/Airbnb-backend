const express = require('express')
const {log} = require('../../middlewares/logger.middleware')
const {addReservation, getReservations, deleteReservation} = require('./reservation.controller')
const router = express.Router()

router.get('/', getReservations)
router.post('/',  log, addReservation)
router.delete('/' , deleteReservation)
module.exports = router

