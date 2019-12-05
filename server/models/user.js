const mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    name:{
        type: String,
        required:  [ true, 'El nombre es requerido' ]
    },
    email: {
        type: String,
        required: [true, 'El email es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['USER_ROLE', 'ADMIN_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', userSchema)