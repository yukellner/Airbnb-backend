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

async function remove(reservation,loggedinUser) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { loggedinUser } = store

        console.log('loggedinUser._id', loggedinUser._id)
        console.log('reservation.userId', reservation.userId)
        const collection = await dbService.getCollection('reservation')
        const criteria = {}
        // remove only if user is host/guest
        if (reservation.userId === loggedinUser._id || reservation.hostId === loggedinUser._id) {
            console.log('im here')
            criteria._id = ObjectId(reservation._id) 
        }

        
        // const criteria = _buildCriteriaForRemoveReservation(reservationId, loggedinUser)
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


// "62989b0dd6fa28283453a04d"  mongo

