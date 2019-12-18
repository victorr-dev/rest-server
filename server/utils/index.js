const jwt = require('jsonwebtoken')

const {SEED, CADUCIDAD_TOKEN} = require('../config/config')

const createToken = (user) => {
    return jwt.sign({
        usuario: user
    }, SEED, { expiresIn: CADUCIDAD_TOKEN })
}

module.exports = {
    createToken
}