const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        // var stays = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()
        // stays = stays.map(stay => {
        //     stay.byUser = { _id: stay.byUser._id, fullname: stay.byUser.fullname }
        //     stay.aboutUser = { _id: stay.aboutUser._id, fullname: stay.aboutUser.fullname }
        //     delete stay.byUserId
        //     delete stay.aboutUserId
        //     return stay
        // })

        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }

}

async function remove(stayId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('stay')
        // remove only if user is owner/admin
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
    console.log('stay',stay)
    try {
        const stayToAdd = {
            // byUserId: ObjectId(stay.byUserId),
            // aboutUserId: ObjectId(stay.aboutUserId),
            // txt: stay.txt
            stay
            // name: stay.name
        }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd
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
    remove,
    add
}


