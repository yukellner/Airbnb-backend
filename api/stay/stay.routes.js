const express = require('express')
const {log} = require('../../middlewares/logger.middleware')
const {addStay, getStays, deleteStay, getStayById} = require('./stay.controller')
const router = express.Router()

router.get('/', getStays)
router.get('/:id', getStayById)
router.post('/',  log, addStay)
router.delete('/:id' , deleteStay)
module.exports = router