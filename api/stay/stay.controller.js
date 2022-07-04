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
    try {
        var stay = req.body
        stay = await stayservice.add(stay)
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