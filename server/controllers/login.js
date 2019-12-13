const {Router} = require('express')

const jwt = require('jsonwebtoken')

const route = Router()
const Usuario = require('../models/user')
const {CADUCIDAD_TOKEN,SEED} = require('../config/config')


route.post('/login', async (req, res, next) => {
    const { email, password } = req.body
     try {
        
        const userDb = await Usuario.findOne({email})
        if(!userDb) return next(Error('User not found'))
        const result = await userDb.comparePassword(password)
        
        if(!result) return next(Error('Password error'))

        const token =jwt.sign({
            usuario: userDb
        },SEED, { expiresIn: CADUCIDAD_TOKEN })

        res.send({
            success: true,
            usuario: userDb,
            token
        })

    } catch (error) {
        return new next(Error(error.message))
    }
})


module.exports = route