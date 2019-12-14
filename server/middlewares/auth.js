const jwt = require('jsonwebtoken')
const {SEED} = require('../config/config')
const verificaToken = async (req, res, next) => {
    const TOKEN = req.get('token')
    try {
        const decode = jwt.verify(TOKEN, SEED)
        req.usuario = decode.usuario
        next()
    } catch (error) {
        return next(Error(error.message))
    }
}

const verificaAdminRole = (req, res , next) =>{
    const { role } = req.usuario;
    if(role === 'ADMIN_ROLE'){
        next()
    }else{
        return next(Error('El usuario no es administrador'))
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}