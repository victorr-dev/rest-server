const { Router } = require('express')
const { verificaToken } = require('../middlewares/auth')
const Product = require('../models/product')
const route = Router()

route.post('/product', verificaToken, async (req, res, next) => {
    const {
        name,
        priceUnit,
        description,
        available,
        category } = req.body
    const user = req.usuario._id

    try {
        const newProduct = Product({
            name,
            priceUnit,
            description,
            available,
            category,
            user
        })

        const result = await newProduct.save()

        res.send({
            success: true,
            product: result
        })

    } catch (error) {
        return next(Error(error.message))
    }

})

route.get('/product', async (req, res, next) => {
    const limite = Number(req.query.limite) || 5
    const desde = Number(req.query.desde) || 0

    try {
        const products = await Product.find()
                                    .populate('category', 'description')
                                    .populate('user', 'name email')
                                    .skip(desde)
                                    .limit(limite)
        if(!products || products.length === 0) return next(Error('Products not found'))

        res.send({
            success: true,
            products
        })

    } catch (error) {
        return next(Error(error.message))
    }
})

route.get('/product/:id', verificaToken , async (req, res, next) => {
    const { id } = req.params

    try {
        const product = await Product.findById(id)
                                    .populate('category', 'description')
                                    .populate('user', 'name email')
        if(!product) return next(Error('Product not found'))

        res.send({
            success:true,
            product
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

route.get('/product/buscar/:termino', async(req, res, next)=>{
    const {termino} = req.params
    const regex = RegExp(termino, 'i')
    try {
        const products = await Product.find({name: regex})
        if(products.length === 0) return next(Error('Products not found'))
        res.send({
            success:true,
            products
        })

    } catch (error) {
        return next(Error(error.message))
    }
})

route.put('/product/:id',verificaToken ,async (req, res, next) => {
    const {id} = req.params
    const product = {
        name,
        description,
        available,
        category
    } = req.body

    product.user = req.usuario._id
    product.priceUnit= Number(req.body.priceUnit)
    try {
        const result = await Product.findByIdAndUpdate(id, product,{ new: true, runValidators:true})

        res.send({
            success: true,
            product: result
        })

    } catch (error) {
        return next(Error(error.message))
    }


})

route.delete('/product/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const result = await Product.findByIdAndRemove(id)
        if(!result) return next(Error('Id not found'))

        res.send({
            success:true,
            product: result
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

module.exports = route
