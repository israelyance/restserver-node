require('../config/config')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'))



mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, res) => {
        if (err) {
            console.log('Error al conectar')
            throw err
        }

        console.log('BBDD online')
    })
mongoose.set('useCreateIndex', true);



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT)
})