const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const cabecera = req.headers.authorization || ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : ''
  if (!token) return res.status(401).json({ mensaje: 'Debes iniciar sesión.' })
  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    req.usuarioId = datos.id
    next()
  } catch {
    res.status(401).json({ mensaje: 'Sesión inválida o vencida.' })
  }
}
