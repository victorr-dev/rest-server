const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const apiUser = require('./controllers/user')

const config = require('../config/config') 

const app = express()

app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'))
app.use(apiUser)


mongoose.connect('mongodb+srv://admin:admin@cluster0-ufbbq.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser:true, useUnifiedTopology: true}, (err)=>{
    if(err){
        console.error(err)
        process.exit(1)
    }
    console.log('Conexión a la base de datos establecida')
})

app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${config.PORT}`)
})