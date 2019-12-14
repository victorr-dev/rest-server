const {
    Router
} = require('express')
const router = Router()
const Usuario = require('../models/user')
const { verificaToken, verificaAdminRole } = require('../middlewares/auth')

router.get('/usuario', verificaToken, async (req, res, next) => {

    const limite = Number(req.query.limite) || 5
    const desde = Number(req.query.desde) || 0

    try {
        const usuarios = await Usuario.find({ estado: true }, 'name email img estado')
            .skip(desde)
            .limit(limite)
        const totalUsers = await Usuario.count({ estado: true })
        res.json({
            success: true,
            totalUsers,
            count: usuarios.length,
            users: usuarios
        })
    } catch (error) {
        return next(new Error(error.message))
    }
})

router.post('/usuario', [verificaToken, verificaAdminRole], async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const usuario = new Usuario({
        name,
        email,
        role
    })

    try {
        usuario.password = await usuario.encryptPassword(password)
        const usuarioDb = await usuario.save()
        res.json({
            success: true,
            user: usuarioDb
        })
    } catch (error) {

        if (error.code) {
            return next(new Error(error.message))
        } else {
            const errores = Object.keys(error.errors)
            let messages = []
            errores.forEach(element => {
                messages.push(error.errors[element].message)
            });
            return next(new Error(messages))
        }
    }

})

router.put('/usuario/:id', [verificaToken, verificaAdminRole], async (req, res, next) => {
    let id = req.params.id
    const usuario = {
        name,
        email,
        img,
        role,
        estado
    } = req.body

    try {
        let result = await Usuario.findByIdAndUpdate(id, usuario, {
            new: true,
            runValidators: true
        })
        return res.json({
            success: true,
            usuario: result
        })
    } catch (error) {
        return next(new Error(error.message))
    }
})

router.delete('/usuario/:id', [verificaToken, verificaAdminRole], async (req, res, next) => {
    const {
        id
    } = req.params

    try {
        //Borrar de la base de datos
        //let usuarioDelete = await Usuario.findByIdAndRemove(id)

        //Actualizar el estado
        let usuarioDelete = await Usuario.findByIdAndUpdate(id, {
            estado: false
        }, {
            new: true
        })

        if (!usuarioDelete) {
            return next(new Error('User not found'))
        }

        res.json({
            success: true,
            usurio: usuarioDelete
        })
    } catch (error) {
        return next(error.message)
    }
})

module.exports = router