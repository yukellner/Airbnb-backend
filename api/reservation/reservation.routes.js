const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addReservation, getReservations, deleteReservation} = require('./reservation.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getReservations)
router.post('/',  log, addReservation)
router.delete('/:id' , deleteReservation)
// , requireAuth
module.exports = router