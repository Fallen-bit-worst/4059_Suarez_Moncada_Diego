const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 80 },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  clave: { type: String, required: true }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Usuario', usuarioSchema)
