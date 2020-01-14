const {Schema, model} = require('mongoose')


const productSchema = new Schema({
    name:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    priceUnit: {
        type: Number,
        required: [true, 'El precio es requerido']
    },
    description: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        required: false,
    },
    available:{
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'category', required: true
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'user'
    }
})

module.exports = model('product', productSchema)