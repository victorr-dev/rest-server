const {Router} = require('express')
const {verificaToken, verificaAdminRole} = require('../middlewares/auth')

const route = Router()
const Category = require('../models/category')

route.post('/category',verificaToken, async(req, res, next)=>{
    const {description} = req.body
    const {_id:user} =req.usuario;

    const category = new Category({
        description,
        user
    })

    try {
        const created = await category.save()
        res.send({
            success:true,
            category: created
        })
    } catch (error) {
        return next(Error(error.message))        
    }
})

route.get('/category',verificaToken, async (req,res,next)=>{
    try {
        const categories = await Category.find({}).sort('description').populate('user', 'name email')
        if(categories.length === 0) return next(Error('Categories not found'))

        res.send({
            success: true,
            categories
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

route.get('/category/:id',verificaToken, async (req,res,next)=>{
    const { id } = req.params 
    try {
        const categorie = await Category.findById(id)
        if(!categorie) return next(Error('Categories not found'))

        res.send({
            success: true,
            categorie
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

route.put('/category/:id', verificaToken, async(req,res,next)=>{
    const category = { description } = req.body
    const {id } = req.params
    try {
        const categoryUpdate = await Category.findByIdAndUpdate(id, category, {new:true, runValidators: true})
        res.send({
            success: true,
            category: categoryUpdate
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

route.delete('/category/:id', [verificaToken], async(req, res, next) =>{
    const {id} = req.params
    try {
        const categoryDeleted = await Category.findByIdAndRemove(id)

        if(!categoryDeleted){
            return next(Error('Id not found'))
        }
        res.send({
            success: true,
            categoryDeleted
        })
    } catch (error) {
        return next(Error(error.message))
    }
})

module.exports = route
