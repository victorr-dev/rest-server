const { Router } = require('express')
const { CLIENT_ID } = require('../config/config')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const { createToken } = require('../utils')


const route = Router()
const Usuario = require('../models/user')
const { CADUCIDAD_TOKEN, SEED } = require('../config/config')


route.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    try {

        const userDb = await Usuario.findOne({ email })
        if (!userDb) return next(Error('User not found'))
        const result = await userDb.comparePassword(password)

        if (!result) return next(Error('Password error'))

        const token = createToken(userDb)

        res.send({
            success: true,
            usuario: userDb,
            token
        })

    } catch (error) {
        return new next(Error(error.message))
    }
})

//Configuraciones de google 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:

    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


route.post('/google', async (req, res, next) => {
    const { idtoken } = req.body
    try {
        const googleUser = await verify(idtoken)
        const result = await Usuario.findOne({ email: googleUser.email })
        if (result) {
            if (!result.google) {
                res.status(400).send({
                    success: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                })
            } else {
                const token = createToken(result)
                res.send({
                    success: true,
                    usuario: result,
                    token
                })
            }
        } else {
            //Si el usuario no existe en la base de datos
            const usuario = new Usuario({
                name: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google : true,
                password: ':)'
            })


            const newUser = await usuario.save()
            const token = createToken(newUser)
            res.send({
                success: true,
                usuario: newUser,
                token
            })
        }

    } catch (error) {
        return next(Error(error.message))
    }

})
module.exports = route