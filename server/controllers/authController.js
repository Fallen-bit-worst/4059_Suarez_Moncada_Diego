const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h', algorithm: 'HS256' })
}

exports.registrar = async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body || {}
    if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.trim().length > 80 || typeof correo !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || typeof password !== 'string' || password.length < 8 || password.length > 72) {
      return res.status(400).json({ mensaje: 'Revisa tu nombre, correo y contraseña (mínimo 8 caracteres).' })
    }
    const email = correo.trim().toLowerCase()
    if (await Usuario.exists({ correo: email })) return res.status(409).json({ mensaje: 'Este correo ya está registrado.' })
    const clave = await bcrypt.hash(password, 12)
    const usuario = await Usuario.create({ nombre: nombre.trim(), correo: email, clave })
    const token = generarToken(usuario)
    res.status(201).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ mensaje: 'Este correo ya está registrado.' })
    next(error)
  }
}

exports.ingresar = async (req, res, next) => {
  try {
    const { correo, password } = req.body || {}
    if (typeof correo !== 'string' || typeof password !== 'string') return res.status(400).json({ mensaje: 'Ingresa correo y contraseña.' })
    const usuario = await Usuario.findOne({ correo: correo.trim().toLowerCase() })
    if (!usuario || !(await bcrypt.compare(password, usuario.clave))) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' })
    res.json({ token: generarToken(usuario), usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } })
  } catch (error) { next(error) }
}

exports.perfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('nombre correo')
    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no disponible.' })
    res.json({ usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } })
  } catch (error) { next(error) }
}
