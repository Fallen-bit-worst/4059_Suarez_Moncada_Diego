const express = require('express')
const controller = require('../controllers/productosController')
const router = express.Router()

router.get('/', controller.listar)
router.get('/:id', controller.obtener)
router.post('/', controller.crear)
router.put('/:id', controller.actualizar)
router.delete('/:id', controller.eliminar)

module.exports = router
