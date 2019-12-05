const { Router } = require('express')
const Usuario = require('../models/user')

const router = Router()

router.get('/usuario', (req, res, next) => {
    res.json('getUsuario')
})

router.post('/usuario',async (req, res, next) => {
    const {name, email, password, role  } = req.body;

    let usuario = new Usuario({
        name,
        email,
        password,
        role
    })

    try {
        const usuarioDb = await usuario.save()
        res.json({
            success: true,
            user: usuarioDb
        })
    } catch (error) {
      
        const errores = Object.keys(error.errors)
        let messages = []
        errores.forEach(element => {
            messages.push(error.errors[element].message)
        });
        return next(new Error(messages))
    }
    
})

router.put('/usuario/:id', (req, res, next) => {
    let id = req.params.id
    res.json({
        id
    })
})

router.delete('/usuario', (req, res, next) => {
    res.json('deleteUsuario')
})

module.exports = router