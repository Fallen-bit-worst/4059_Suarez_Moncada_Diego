const mongoose = require('mongoose')

async function conectarDB() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB conectado')
}

module.exports = conectarDB
