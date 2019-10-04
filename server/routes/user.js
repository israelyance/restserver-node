const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user')


const app = express()



app.get('/usuario', function (req, res) {
let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    User.find({estado: true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    count: conteo
                })
            })
        })
})


app.post('/usuario', function (req, res) {
    let body = req.body

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    // console.log(user)

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        userDB.password = null

        res.json({
            ok: true,
            user: userDB
        })
    })

    // user.save()
    //     .then((userDB) => {
    //         console.log('Guardado correctamente', userDB)
    //         res.json({
    //             ok: true,
    //             user: userDB
    //         })
    //     })
    //     .catch((err) => console.log(err))
})


app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    let opts = {
        new: true,
        runValidators: true
    }

    User.findByIdAndUpdate(id, body, opts, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})


app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id

    let changeState = {
        estado: false
    }

    User.findByIdAndUpdate(id, changeState, {new: true}, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    })
})


module.exports = app