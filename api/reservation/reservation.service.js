const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('reservation')
        const reservations = await collection.find(criteria).toArray()
        return reservations
    } catch (err) {
        logger.error('cannot find reservations', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.hostId) {
        criteria.hostId = filterBy.hostId
    }
    if (filterBy.userId) {
        criteria.userId = filterBy.userId
    }

    return criteria
}

async function add(reservation) {
    try {
        const collection = await dbService.getCollection('reservation')
        await collection.insertOne(reservation)
        return reservation
    } catch (err) {
        logger.error('cannot insert reservation', err)
        throw err
    }
}

async function remove(reservation, loggedinUser) {
    try {
        const collection = await dbService.getCollection('reservation')
        const criteria = { _id: '111' }
        if (reservation.userId === loggedinUser._id || reservation.hostId === loggedinUser._id) {
            criteria._id = ObjectId(reservation._id)
        }
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove reservation ${reservation._id}`, err)
        throw err
    }
}


module.exports = {
    query,
    remove,
    add
}

