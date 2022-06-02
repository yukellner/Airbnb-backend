const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

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
        criteria.hostId = ObjectId(filterBy.hostId)
    }
    if(filterBy.userId) {
        criteria.userId = ObjectId(filterBy.userId)
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

async function remove(reservationId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('reservation')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reservationId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove reservation ${reservationId}`, err)
        throw err
    }
}



module.exports = {
    query,
    remove,
    add
}


