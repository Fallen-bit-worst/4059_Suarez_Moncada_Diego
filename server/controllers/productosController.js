const mongoose = require('mongoose')
const Producto = require('../models/Producto')

function validarProducto(datos) {
  const texto = (campo, maximo) => typeof datos[campo] === 'string' && datos[campo].trim().length > 0 && datos[campo].trim().length <= maximo
  if (!texto('nombre', 120) || !texto('categoria', 70) || !texto('marca', 70) || !texto('descripcion', 300)) return 'Completa todos los campos de texto.'
  if (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio) || datos.precio < 0) return 'El precio debe ser un número mayor o igual a cero.'
  if (!Number.isInteger(datos.stock) || datos.stock < 0) return 'El stock debe ser un entero mayor o igual a cero.'
  if (datos.imagen !== undefined && (typeof datos.imagen !== 'string' || datos.imagen.length > 500)) return 'La imagen debe ser una URL de hasta 500 caracteres.'
  if (datos.imagen && !/^https:\/\//i.test(datos.imagen)) return 'La URL de la imagen debe usar HTTPS.'
  return null
}

const seleccionar = ({ nombre, categoria, marca, precio, stock, descripcion, imagen = '' }) => ({
  nombre: nombre.trim(), categoria: categoria.trim(), marca: marca.trim(),
  precio, stock, descripcion: descripcion.trim(), imagen: imagen.trim()
})

exports.listar = async (req, res, next) => {
  try {
    const productos = await Producto.find({ usuario: req.usuarioId }).sort({ createdAt: -1 })
    res.json(productos)
  } catch (error) { next(error) }
}

exports.obtener = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido.' })
    const producto = await Producto.findOne({ _id: req.params.id, usuario: req.usuarioId })
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' })
    res.json(producto)
  } catch (error) { next(error) }
}

exports.crear = async (req, res, next) => {
  try {
    const mensaje = validarProducto(req.body)
    if (mensaje) return res.status(400).json({ mensaje })
    const producto = await Producto.create({ ...seleccionar(req.body), usuario: req.usuarioId })
    res.status(201).json(producto)
  } catch (error) { next(error) }
}

exports.actualizar = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido.' })
    const mensaje = validarProducto(req.body)
    if (mensaje) return res.status(400).json({ mensaje })
    const producto = await Producto.findOneAndUpdate({ _id: req.params.id, usuario: req.usuarioId }, seleccionar(req.body), { new: true, runValidators: true })
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' })
    res.json(producto)
  } catch (error) { next(error) }
}

exports.eliminar = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ mensaje: 'ID inválido.' })
    const producto = await Producto.findOneAndDelete({ _id: req.params.id, usuario: req.usuarioId })
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' })
    res.json({ mensaje: 'Producto eliminado correctamente.' })
  } catch (error) { next(error) }
}
