const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', index: true },
  nombre: { type: String, required: true, trim: true, maxlength: 120 },
  categoria: { type: String, required: true, trim: true, maxlength: 70 },
  marca: { type: String, required: true, trim: true, maxlength: 70 },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
  descripcion: { type: String, required: true, trim: true, maxlength: 300 },
  imagen: { type: String, default: '' }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Producto', productoSchema)
