const { Router } = require('express')

const router = Router()

router.get('/usuario', (req, res, next) => {
    res.json('getUsuario')
})

router.post('/usuario', (req, res, next) => {
    let body = req.body;
    res.json(body)
})

router.put('/usuario/:id', (req, res, next) => {
    let id = req.params.id
    res.json({
        id
    })
})

router.delete('/usuario', (req, res, next) => {
    res.json('deleteUsuario')
})

module.exports = router