const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    delete user.password
    user._id = user._id.toString()
    return user
}
    

async function signup(user) {
    const saltRounds = 10
    // const userExist = await userService.getByUsername(username)
    // if (userExist) return Promise.reject('Username already taken')
    user.password = await bcrypt.hash(user.password, saltRounds)
    return userService.add(user)
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))    
}

function validateToken(loginToken) {
    try {
        console.log('validate');
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch(err) {
        console.log('Invalid login token')
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}