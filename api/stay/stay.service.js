const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
   
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
      const collection = await dbService.getCollection('stay')
      const stay = await collection.findOne({ _id: stayId })
      return stay
    } catch (err) {
      logger.error(`while finding stay ${stayId}`, err)
      throw err
    }

  }

async function remove(stayId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('stay')
        const criteria = { _id: ObjectId(stayId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}


async function add(stay) {
   
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
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
    getById,
    remove,
    add
}


