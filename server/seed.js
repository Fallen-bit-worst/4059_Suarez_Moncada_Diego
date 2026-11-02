require('dotenv').config()
const mongoose = require('mongoose')
const Producto = require('./models/Producto')

const datos = [
  {
    "nombre": "Hatsune Miku Luminasta",
    "categoria": "Figura",
    "marca": "SEGA",
    "precio": 55,
    "stock": 8,
    "descripcion": "Figura de Hatsune Miku de la línea Luminasta",
    "imagen": ""
  },
  {
    "nombre": "Marin Kitagawa Coreful",
    "categoria": "Figura",
    "marca": "TAITO",
    "precio": 60,
    "stock": 6,
    "descripcion": "Figura de Marin Kitagawa de My Dress-Up Darling",
    "imagen": ""
  },
  {
    "nombre": "Rem Relax Time",
    "categoria": "Figura",
    "marca": "Banpresto",
    "precio": 50,
    "stock": 10,
    "descripcion": "Figura de Rem de Re:Zero",
    "imagen": ""
  },
  {
    "nombre": "Makima Noodle Stopper",
    "categoria": "Figura",
    "marca": "FuRyu",
    "precio": 55,
    "stock": 7,
    "descripcion": "Figura de Makima de Chainsaw Man",
    "imagen": ""
  },
  {
    "nombre": "Frieren Luminasta",
    "categoria": "Figura",
    "marca": "SEGA",
    "precio": 65,
    "stock": 5,
    "descripcion": "Figura de Frieren",
    "imagen": ""
  },
  {
    "nombre": "Ai Hayasaka Coreful",
    "categoria": "Figura",
    "marca": "TAITO",
    "precio": 55,
    "stock": 9,
    "descripcion": "Figura de Ai Hayasaka",
    "imagen": ""
  },
  {
    "nombre": "Kurumi Tokisaki AMP",
    "categoria": "Figura",
    "marca": "TAITO",
    "precio": 65,
    "stock": 4,
    "descripcion": "Figura de Kurumi Tokisaki",
    "imagen": ""
  },
  {
    "nombre": "Albedo Relax Time",
    "categoria": "Figura",
    "marca": "Banpresto",
    "precio": 60,
    "stock": 6,
    "descripcion": "Figura de Albedo de Overlord",
    "imagen": ""
  },
  {
    "nombre": "Nami Glitter & Glamours",
    "categoria": "Figura",
    "marca": "Banpresto",
    "precio": 65,
    "stock": 5,
    "descripcion": "Figura de Nami de One Piece",
    "imagen": ""
  },
  {
    "nombre": "Asuna Luminasta",
    "categoria": "Figura",
    "marca": "SEGA",
    "precio": 60,
    "stock": 7,
    "descripcion": "Figura de Asuna de Sword Art Online",
    "imagen": ""
  },
  {
    "nombre": "Gojo Satoru Maximatic",
    "categoria": "Figura",
    "marca": "Banpresto",
    "precio": 55,
    "stock": 8,
    "descripcion": "Figura de Gojo Satoru de Jujutsu Kaisen",
    "imagen": ""
  },
  {
    "nombre": "Sakura Kinomoto Coreful",
    "categoria": "Figura",
    "marca": "TAITO",
    "precio": 60,
    "stock": 6,
    "descripcion": "Figura de Sakura Kinomoto",
    "imagen": ""
  }
]

async function cargar() {
  try {
    if (!process.env.MONGO_URI) throw new Error('Falta MONGO_URI')
    await mongoose.connect(process.env.MONGO_URI)
    const cantidad = await Producto.countDocuments()
    if (cantidad) {
      console.log(`Ya existen ${cantidad} productos. No se insertaron duplicados.`)
    } else {
      await Producto.insertMany(datos)
      console.log('12 productos de demostración insertados.')
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

cargar()
