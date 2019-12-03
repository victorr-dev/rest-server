const express = require('express')
const morgan = require('morgan')

const config = require('../config/config') 

const app = express()

app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'))

app.get('/usuario', (req, res, next) => {
    res.json('getUsuario')
})

app.post('/usuario', (req, res, next) => {
    let body = req.body;
    res.json(body)
})

app.put('/usuario/:id', (req, res, next) => {
    let id = req.params.id
    res.json({
        id
    })
})

app.delete('/usuario', (req, res, next) => {
    res.json('deleteUsuario')
})

app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${config.PORT}`, config.MESSAGE)
})