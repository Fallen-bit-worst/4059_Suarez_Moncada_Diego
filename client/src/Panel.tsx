import { useCallback, useEffect, useMemo, useState } from 'react'
import { Boxes, CheckCircle2, CircleAlert, Edit3, Loader2, Package, Plus, RefreshCw, Search, ShoppingBag, Trash2, X } from 'lucide-react'
import { api } from './api'
import ProductoFormulario from './components/ProductoFormulario'
import type { Producto, ProductoEntrada } from './types'

function Panel() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [edicion, setEdicion] = useState<Producto | null>(null)
  const [eliminando, setEliminando] = useState<Producto | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try { setProductos(await api.listar()) }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudieron cargar productos.') }
    finally { setCargando(false) }
  }, [])

  useEffect(() => { void recargar() }, [recargar])
  const categorias = useMemo(() => ['Todas', ...new Set(productos.map(p => p.categoria))], [productos])
  const filtrados = useMemo(() => productos.filter(p => (categoria === 'Todas' || p.categoria === categoria) && `${p.nombre} ${p.marca} ${p.descripcion}`.toLowerCase().includes(busqueda.toLowerCase().trim())), [productos, categoria, busqueda])
  const totalUnidades = productos.reduce((suma, p) => suma + p.stock, 0)
  const valorInventario = productos.reduce((suma, p) => suma + p.stock * p.precio, 0)
  const soles = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n)

  async function guardar(datos: ProductoEntrada) {
    setOcupado(true)
    try {
      if (edicion) await api.actualizar(edicion._id, datos)
      else await api.crear(datos)
      await recargar()
      setMensaje(edicion ? 'Producto actualizado correctamente.' : 'Producto registrado correctamente.')
      setMostrarFormulario(false)
      setEdicion(null)
    } finally { setOcupado(false) }
  }

  async function confirmarEliminacion() {
    if (!eliminando) return
    setOcupado(true)
    try {
      await api.eliminar(eliminando._id)
      await recargar()
      setMensaje('Producto eliminado correctamente.')
      setEliminando(null)
    } catch (e) { setError(e instanceof Error ? e.message : 'Error al eliminar.') }
    finally { setOcupado(false) }
  }

  function nuevo() { setEdicion(null); setMostrarFormulario(true); setMensaje('') }
  function editar(p: Producto) { setEdicion(p); setMostrarFormulario(true); setMensaje('') }
  return <div className="min-h-screen bg-slate-50">
    <div className="bg-violet-700 px-5 py-2.5 text-center text-xs font-bold tracking-wide text-white">AIPIXEL · FIGURAS Y COLECCIONABLES · GESTIÓN DE INVENTARIO</div>
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8"><a href="#inicio" className="text-3xl font-black tracking-tight text-slate-950">AI<span className="text-violet-600">PIXEL</span></a><div className="flex items-center gap-3"><span className="hidden text-sm font-semibold text-slate-500 sm:block">Panel de productos</span><button onClick={nuevo} className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"><Plus size={18}/> Nuevo producto</button></div></div></header>
    <main id="inicio" className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-white sm:px-12"><div className="absolute -right-12 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl"/><div className="relative max-w-2xl"><span className="rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-violet-300">Anime · Gaming · Collectibles</span><h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">Tu colección, bien organizada.</h1><p className="mt-5 max-w-xl leading-8 text-slate-300">Consulta el inventario de AiPixel, administra cada figura y mantén actualizada la información de tus productos en un solo lugar.</p><button onClick={nuevo} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-extrabold text-white hover:bg-violet-500"><Plus size={19}/> Añadir al catálogo</button></div></section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="rounded-xl bg-violet-100 p-3 text-violet-700"><Package/></div><div><p className="text-sm font-semibold text-slate-500">Productos</p><p className="text-3xl font-black">{productos.length}</p></div></div><div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="rounded-xl bg-indigo-100 p-3 text-indigo-700"><Boxes/></div><div><p className="text-sm font-semibold text-slate-500">Unidades en stock</p><p className="text-3xl font-black">{totalUnidades}</p></div></div><div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="rounded-xl bg-fuchsia-100 p-3 text-fuchsia-700"><ShoppingBag/></div><div><p className="text-sm font-semibold text-slate-500">Valor de inventario</p><p className="text-2xl font-black">{soles(valorInventario)}</p></div></div></section>
      <section id="catalogo" className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-violet-600">Inventario AiPixel</p><h2 className="mt-2 text-3xl font-black text-slate-950">Todos los productos</h2><p className="mt-2 text-sm text-slate-500">Registra, consulta, actualiza y organiza tus coleccionables.</p></div><button onClick={() => void recargar()} disabled={cargando} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={17}/> Actualizar lista</button></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search size={19} className="absolute left-4 top-3.5 text-slate-400"/><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por producto, marca o descripción..." className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-violet-500" /></label><select aria-label="Filtrar categoría" value={categoria} onChange={e => setCategoria(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-violet-500">{categorias.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Todas las categorías' : c}</option>)}</select></div>
        {mensaje && <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-5 py-3 font-semibold text-emerald-800" role="status"><span className="flex items-center gap-2"><CheckCircle2 size={19}/>{mensaje}</span><button onClick={() => setMensaje('')} aria-label="Cerrar aviso"><X size={18}/></button></div>}
        {error && <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-red-50 px-5 py-3 font-semibold text-red-800" role="alert"><span className="flex items-center gap-2"><CircleAlert size={19}/>{error}</span><button onClick={() => setError('')} aria-label="Cerrar error"><X size={18}/></button></div>}
        {cargando ? <div className="flex items-center justify-center gap-3 py-20 text-slate-500"><Loader2 className="animate-spin"/> Cargando productos...</div> : filtrados.length === 0 ? <div className="py-20 text-center text-slate-500">No se encontraron productos. Puedes crear uno con “Nuevo producto”.</div> : <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="bg-slate-950 text-white"><th className="rounded-tl-xl px-5 py-4">Producto</th><th className="px-5 py-4">Categoría</th><th className="px-5 py-4">Marca</th><th className="px-5 py-4">Precio</th><th className="px-5 py-4">Stock</th><th className="rounded-tr-xl px-5 py-4 text-right">Acciones</th></tr></thead><tbody>{filtrados.map(p => <tr key={p._id} className="border-b border-slate-100 hover:bg-violet-50/50"><td className="px-5 py-4"><div className="flex items-center gap-4">{p.imagen ? <img src={p.imagen} alt={p.nombre} className="h-14 w-14 rounded-xl bg-slate-100 object-contain"/> : <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 font-black text-violet-600">AP</div>}<div><p className="font-extrabold text-slate-950">{p.nombre}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500" title={p.descripcion}>{p.descripcion}</p></div></div></td><td className="px-5 py-4">{p.categoria}</td><td className="px-5 py-4">{p.marca}</td><td className="px-5 py-4 font-extrabold text-violet-700">{soles(p.precio)}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${p.stock ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{p.stock ? `${p.stock} disponibles` : 'Sin stock'}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => editar(p)} title={`Editar ${p.nombre}`} aria-label={`Editar ${p.nombre}`} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:border-violet-400 hover:text-violet-700"><Edit3 size={17}/></button><button onClick={() => setEliminando(p)} title={`Eliminar ${p.nombre}`} aria-label={`Eliminar ${p.nombre}`} className="rounded-lg border border-slate-200 p-2.5 text-red-600 hover:border-red-300 hover:bg-red-50"><Trash2 size={17}/></button></div></td></tr>)}</tbody></table></div>}
        <div className="mt-5 text-right text-sm font-semibold text-slate-500">Mostrando {filtrados.length} de {productos.length} productos</div>
      </section>
      <footer className="py-7 text-center text-sm text-slate-500">© 2026 AiPixel · Anime & Gaming Store · Lima, Perú</footer>
    </main>
    {mostrarFormulario && <ProductoFormulario producto={edicion} guardar={guardar} cerrar={() => { if (!ocupado) setMostrarFormulario(false) }} ocupado={ocupado}/>}
    {eliminando && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"><div role="alertdialog" aria-modal="true" aria-labelledby="titulo-eliminar" className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><div className="mb-5 inline-flex rounded-full bg-red-50 p-4 text-red-600"><Trash2/></div><h2 id="titulo-eliminar" className="text-2xl font-black">¿Eliminar este producto?</h2><p className="mt-3 text-slate-600">Se eliminará <strong>{eliminando.nombre}</strong> de la base de datos. Esta acción no se puede deshacer.</p><div className="mt-7 flex justify-end gap-3"><button disabled={ocupado} onClick={() => setEliminando(null)} className="rounded-xl border border-slate-200 px-5 py-3 font-bold">Cancelar</button><button disabled={ocupado} onClick={() => void confirmarEliminacion()} className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50">{ocupado ? 'Eliminando...' : 'Sí, eliminar'}</button></div></div></div>}
  </div>
}

export default Panel
