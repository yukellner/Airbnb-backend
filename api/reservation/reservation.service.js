const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria',criteria)
        const collection = await dbService.getCollection('reservation')
        console.log('collection',collection)
        console.log('collection',collection)
        
        const reservations = await collection.find(criteria).toArray()
        console.log('reservations',reservations)

        return reservations
    } catch (err) {
        logger.error('cannot find reservations', err)
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


async function add(reservation) {
    console.log('reservation',reservation)
    try {
        const reservationToAdd = {
            // byUserId: ObjectId(reservation.byUserId),
            // aboutUserId: ObjectId(reservation.aboutUserId),
            // txt: reservation.txt
            reservation
            // name: reservation.name
        }
        const collection = await dbService.getCollection('reservation')
        await collection.insertOne(reservationToAdd)
        return reservationToAdd
    } catch (err) {
        logger.error('cannot insert reservation', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.location) {
        const locationCriteria = { $regex: filterBy.location, $options: 'i' }
        criteria.$or = [
            {
                'address.country': locationCriteria
            },
            {
                'address.city': locationCriteria
            },
            {
                'name': locationCriteria
            }
        ]
    }
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


