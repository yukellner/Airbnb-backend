const logger = require('../../services/logger.service')
const stayservice = require('./stay.service')

async function getStays(req, res) {
    try {
        const stays = await stayservice.query(req.query)
        return res.send(stays)
    } catch (err) {
        logger.error('Cannot get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

async function getStayById(req, res) {
    try {
      const stayId = req.params.id
      console.log(stayId)
      const stay = await stayservice.getById(stayId)
      res.send(stay)
    } catch (err) {
      logger.error('Failed to get toy', err)
      res.status(500).send({ err: 'Failed to get toy' })
    }
  }

async function deleteStay(req, res) {
    try {
        const deletedCount = await stayservice.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove stay' })
        }
    } catch (err) {
        logger.error('Failed to delete stay', err)
        res.status(500).send({ err: 'Failed to delete stay' })
    }
}


async function addStay(req, res) {

    console.log('im inside addstay in beckend', req)

    // var loggedinUser = authService.validateToken(req.cookies.loginToken)
    // console.log('req',req.body)
 
    try {
        var stay = req.body
        // stay.byUserId = loggedinUser._id
        stay = await stayservice.add(stay)
        
        // prepare the updated stay for sending out
        // stay.aboutUser = await userService.getById(stay.aboutUserId)
        
        // Give the user credit for adding a stay
        // var user = await userService.getById(stay.byUserId)
        // user.score += 10
        // loggedinUser.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // stay.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)


        // socketService.broadcast({type: 'stay-added', data: stay, userId: stay.byUserId})
        // socketService.emitToUser({type: 'stay-about-you', data: stay, userId: stay.aboutUserId})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(stay)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

module.exports = {
    getStays,
    getStayById,
    deleteStay,
    addStay
}