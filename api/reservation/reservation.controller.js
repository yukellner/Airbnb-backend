const logger = require('../../services/logger.service')
const authService = require('../auth/auth.service')
const reservationservice = require('./reservation.service')

async function getReservations(req, res) {
    try {
        const reservations = await reservationservice.query(req.query)
        return res.send(reservations)   
    } catch (err) {
        res.status(500).send({ err: 'Failed to get reservations' })
    }
}

async function deleteReservation(req, res) {
   
    var loggedInUseer = authService.validateToken(req.cookies.loginToken)
    try {
        const deletedCount = await reservationservice.remove(req.body, loggedInUseer)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove reservation' })
        }
    } catch (err) {
        logger.error('Failed to delete reservation', err)
        res.status(500).send({ err: 'Failed to delete reservation' })
    }
}


async function addReservation(req, res) {
    
    try {
        var loggedinUser = authService.validateToken(req.cookies.loginToken)
        var reservation = req.body
        reservation = await reservationservice.add(reservation)
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)
        res.send(reservation)
    } catch (err) {
        console.log(err)
        logger.error('Failed to add reservation', err)
        res.status(500).send({ err: 'Failed to add reservation' })
    }
}

module.exports = {
    getReservations,
    deleteReservation,
    addReservation
    
}