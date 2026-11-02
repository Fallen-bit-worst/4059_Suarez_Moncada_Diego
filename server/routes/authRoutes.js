const express = require('express')
const controller = require('../controllers/authController')
const verificar = require('../middlewares/auth')
const router = express.Router()
router.post('/registro', controller.registrar)
router.post('/login', controller.ingresar)
router.get('/perfil', verificar, controller.perfil)
module.exports = router
