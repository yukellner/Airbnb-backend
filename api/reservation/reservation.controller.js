const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const reservationservice = require('./reservation.service')

async function getReservations(req, res) {
    try {
        const reservations = await reservationservice.query(req.query)
        return res.send(reservations)
    } catch (err) {
        logger.error('Cannot get reservations', err)
        res.status(500).send({ err: 'Failed to get reservations' })
    }
}

async function deleteReservation(req, res) {
    try {
        const deletedCount = await reservationservice.remove(req.params.id)
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

    // var loggedinUser = authService.validateToken(req.cookies.loginToken)
    // console.log('req',req.body)
 
    try {
        var reservation = req.body
        // reservation.byUserId = loggedinUser._id
        reservation = await reservationservice.add(reservation)
        
        // prepare the updated reservation for sending out
        // reservation.aboutUser = await userService.getById(reservation.aboutUserId)
        
        // Give the user credit for adding a reservation
        // var user = await userService.getById(reservation.byUserId)
        // user.score += 10
        // loggedinUser.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // reservation.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)


        // socketService.broadcast({type: 'reservation-added', data: reservation, userId: reservation.byUserId})
        // socketService.emitToUser({type: 'reservation-about-you', data: reservation, userId: reservation.aboutUserId})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

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