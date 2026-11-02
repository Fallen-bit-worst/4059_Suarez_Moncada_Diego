import type { Producto, ProductoEntrada } from './types'

const base = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

async function solicitar<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...(sessionStorage.getItem('aipixel_token') ? { Authorization: `Bearer ${sessionStorage.getItem('aipixel_token')}` } : {}), ...opciones?.headers }
    })
  } catch {
    throw new Error('No hay conexión con el servidor. Comprueba el backend y la configuración de CORS.')
  }
  const datos: unknown = await respuesta.json()
  if (!respuesta.ok) {
    if (datos && typeof datos === 'object' && 'mensaje' in datos && typeof datos.mensaje === 'string') throw new Error(datos.mensaje)
    throw new Error(`Error HTTP ${respuesta.status}`)
  }
  return datos as T
}

export const api = {
  registrar: (datos: { nombre: string; correo: string; password: string }) => solicitar<{ token: string; usuario: { id: string; nombre: string; correo: string } }>('/api/auth/registro', { method: 'POST', body: JSON.stringify(datos) }),
  ingresar: (datos: { correo: string; password: string }) => solicitar<{ token: string; usuario: { id: string; nombre: string; correo: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify(datos) }),
  perfil: () => solicitar<{ usuario: { id: string; nombre: string; correo: string } }>('/api/auth/perfil'),
  listar: () => solicitar<Producto[]>('/api/productos'),
  crear: (datos: ProductoEntrada) => solicitar<Producto>('/api/productos', { method: 'POST', body: JSON.stringify(datos) }),
  actualizar: (id: string, datos: ProductoEntrada) => solicitar<Producto>(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (id: string) => solicitar<{ mensaje: string }>(`/api/productos/${id}`, { method: 'DELETE' })
}
