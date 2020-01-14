const { Router } = require('express')
const path = require('path')
const fs = require('fs')

const routes = Router()
const Usuario = require('../models/user')
const Producto = require('../models/product')

const _pathFilesBase = path.resolve(__dirname, '../../uploads/')

routes.put('/upload/:tipo/:id', async (req, res, next) => {
    const { tipo, id } = req.params
    const tiposValidos = ['producto', 'usuario']
    const validExtensions = ['png', 'jpg', 'gif', 'jpeg']

    if (tiposValidos.indexOf(tipo) < 0) return next(Error(`Tipo no valido, los tipos permitidos son: ${tiposValidos.join(', ')}`))
    if (!req.files) return next(Error('Not files to upload'))

    try {
        const fileToUpload = req.files.imagen

        let nombreCortado = fileToUpload.name.split('.')
        let extension = nombreCortado[nombreCortado.length - 1]

        if (validExtensions.indexOf(extension) < 0) return next(Error(`The file extension is not valid. The valid extensions are ${validExtensions.join(', ')} `))

        let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

        await fileToUpload.mv(`${_pathFilesBase}/${tipo}/${nombreArchivo}`)

        if (tipo === tiposValidos[0]) {
            await updateImgProducto(id, res, nombreArchivo)
        } else {
            await updateImgUsuario(id, res, nombreArchivo)
        }

    } catch (error) {
        return next(new Error(error.message))
    }
})


async function updateImgUsuario(id, res, nombreArchivo) {
    try {
        const userToUpdate = await Usuario.findById(id)
        if (!userToUpdate) {
            deleteFile('usuario', nombreArchivo)
            throw new Error(`User with the id: ${id} not found`)
        }

        deleteFile('usuario', userToUpdate.img)
        userToUpdate.img = nombreArchivo

        const userUpdated = await userToUpdate.save()

        res.send({
            success: true,
            message: `Image upload`,
            usuario: userUpdated
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

async function updateImgProducto(id, res, nombreArchivo) {
    try {
        const productoToUpdate = await Producto.findById(id)
        if (!productoToUpdate) {
            deleteFile('producto', nombreArchivo)
            throw new Error(`Product with the id: ${id} not found`)
        }
        deleteFile('producto', productoToUpdate.img)
        productoToUpdate.img = nombreArchivo
        console.log('pasa por aqui');
        const productoUpdated = await productoToUpdate.save()

        res.send({
            success: true,
            message: `Image upload`,
            producto: productoUpdated
        })
    } catch (error) {
        throw new Error(error.message)
    }

}


function deleteFile(tipo, imagen) {
    let pathImg = `${_pathFilesBase}/${tipo}/${imagen}`
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}
module.exports = routes