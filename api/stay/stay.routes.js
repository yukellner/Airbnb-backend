const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addStay, getStays, deleteStay} = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStays)
router.post('/',  log, addStay)
router.delete('/:id' , deleteStay)
// , requireAuth
module.exports = router