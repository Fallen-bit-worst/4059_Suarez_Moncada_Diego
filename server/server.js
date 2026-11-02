require('dotenv').config()
const express = require('express')
const cors = require('cors')
const conectarDB = require('./config/database')
const productosRoutes = require('./routes/productosRoutes')
const authRoutes = require('./routes/authRoutes')
const verificar = require('./middlewares/auth')

const app = express()
const permitidos = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim())
app.use(cors({ origin: permitidos }))
app.use(express.json({ limit: '20kb' }))
app.get('/', (req, res) => res.json({ mensaje: 'API AiPixel Integrador' }))
app.use('/api/auth', authRoutes)
app.use('/api/productos', verificar, productosRoutes)
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' }))
app.use((error, req, res, next) => {
  console.error(error.message)
  const codigo = error.name === 'ValidationError' ? 400 : 500
  res.status(codigo).json({ mensaje: codigo === 400 ? 'Datos no válidos.' : 'Error interno del servidor.' })
})

async function iniciar() {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('Configura MONGO_URI y JWT_SECRET (mínimo 32 caracteres)')
    await conectarDB()
    const puerto = Number(process.env.PORT || 3001)
    app.listen(puerto, '::', () => console.log(`Servidor escuchando en el puerto ${puerto}`))
  } catch (error) {
    console.error('No se pudo iniciar:', error.message)
    process.exit(1)
  }
}

iniciar()
