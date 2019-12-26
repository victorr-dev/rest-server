const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripcion es requerida']
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
})

categorySchema.plugin(uniqueValidator, '{PATH} debe de ser único')



module.exports = mongoose.model('category', categorySchema)