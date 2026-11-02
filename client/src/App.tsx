import { useEffect, useState } from 'react'
import { api } from './api'
import Panel from './Panel'

type Usuario = { id: string; nombre: string; correo: string }

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const [registro, setRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('aipixel_token')) { setCargando(false); return }
    api.perfil().then(datos => setUsuario(datos.usuario)).catch(() => sessionStorage.removeItem('aipixel_token')).finally(() => setCargando(false))
  }, [])

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setError('')
    setOcupado(true)
    try {
      const datos = registro ? await api.registrar({ nombre, correo, password }) : await api.ingresar({ correo, password })
      sessionStorage.setItem('aipixel_token', datos.token)
      setUsuario(datos.usuario)
      setPassword('')
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.') }
    finally { setOcupado(false) }
  }

  function salir() {
    sessionStorage.removeItem('aipixel_token')
    setUsuario(null)
  }

  if (cargando) return <div className="flex min-h-screen items-center justify-center bg-slate-50">Cargando...</div>
  if (usuario) return <div><div className="flex items-center justify-end gap-4 bg-slate-950 px-8 py-3 text-sm text-white"><span>{usuario.nombre}</span><button className="rounded-lg border border-white/40 px-4 py-2 hover:bg-white/10" onClick={salir}>Cerrar sesión</button></div><Panel /></div>

  return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12"><div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg sm:p-10"><h1 className="text-3xl font-black text-slate-950">AI<span className="text-violet-600">PIXEL</span></h1><h2 className="mt-8 text-2xl font-bold">{registro ? 'Crear cuenta' : 'Iniciar sesión'}</h2><p className="mt-2 text-sm text-slate-500">Accede al inventario de figuras y coleccionables.</p><form onSubmit={enviar} className="mt-7 space-y-4">{registro && <label className="block text-sm font-semibold">Nombre<input required minLength={2} maxLength={80} value={nombre} onChange={e => setNombre(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/></label>}<label className="block text-sm font-semibold">Correo<input required type="email" value={correo} onChange={e => setCorreo(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/></label><label className="block text-sm font-semibold">Contraseña<input required type="password" minLength={registro ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={ocupado} type="submit" className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white disabled:opacity-60">{ocupado ? 'Procesando...' : registro ? 'Registrarme' : 'Entrar'}</button></form><button onClick={() => { setRegistro(!registro); setError('') }} className="mt-5 w-full text-center text-sm font-semibold text-violet-700">{registro ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}</button></div></main>
}
