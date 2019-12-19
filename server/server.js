const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')


const config = require('./config/config')

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))


app.use(morgan('dev'))
app.use(require('./controllers/index'))
app.use(express.static(path.resolve(__dirname,'./public')))
app.use((err, req, res, next) => {
  if (err.message.match(/not found/)) {
    return res.status(404).send({
      success: false,
      error: err.message
    })
  }
  
  res.status(500).send({
    success: false,
    error: err.message
  })
})

mongoose.connect(config.URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('Conexión a la base de datos establecida')
  })

app.listen(config.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${config.PORT}`)
})