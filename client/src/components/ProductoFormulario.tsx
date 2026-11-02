import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Producto, ProductoEntrada } from '../types'

const vacio: ProductoEntrada = { nombre: '', categoria: 'Figura', marca: '', precio: 0, stock: 0, descripcion: '', imagen: '' }
type Props = { producto: Producto | null; guardar: (datos: ProductoEntrada) => Promise<void>; cerrar: () => void; ocupado: boolean }

export default function ProductoFormulario({ producto, guardar, cerrar, ocupado }: Props) {
  const [datos, setDatos] = useState<ProductoEntrada>(vacio)
  const [error, setError] = useState('')
  useEffect(() => {
    setDatos(producto ? { nombre: producto.nombre, categoria: producto.categoria, marca: producto.marca, precio: producto.precio, stock: producto.stock, descripcion: producto.descripcion, imagen: producto.imagen } : vacio)
    setError('')
  }, [producto])
  function actualizar(campo: keyof ProductoEntrada, valor: string) {
    setDatos(actual => ({ ...actual, [campo]: campo === 'precio' || campo === 'stock' ? Number(valor) : valor }))
  }
  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!datos.nombre.trim() || !datos.categoria.trim() || !datos.marca.trim() || !datos.descripcion.trim()) return setError('Completa todos los campos obligatorios.')
    if (!Number.isFinite(datos.precio) || datos.precio < 0 || !Number.isInteger(datos.stock) || datos.stock < 0) return setError('Revisa los valores de precio y stock.')
    if (datos.imagen && !/^https:\/\//i.test(datos.imagen)) return setError('La URL de la imagen debe comenzar con https://')
    setError('')
    try { await guardar(datos) } catch (e) { setError(e instanceof Error ? e.message : 'Error al guardar.') }
  }
  const campos: { key: keyof ProductoEntrada; titulo: string; tipo?: string; ancho?: string }[] = [
    { key: 'nombre', titulo: 'Nombre del producto', ancho: 'sm:col-span-2' },
    { key: 'categoria', titulo: 'Categoría' }, { key: 'marca', titulo: 'Marca' },
    { key: 'precio', titulo: 'Precio (S/)', tipo: 'number' }, { key: 'stock', titulo: 'Stock', tipo: 'number' }
  ]
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !ocupado) cerrar() }}>
    <div role="dialog" aria-modal="true" aria-label={producto ? 'Editar producto' : 'Nuevo producto'} className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-violet-600">AiPixel / Inventario</p><h2 className="mt-2 text-2xl font-black text-slate-900">{producto ? 'Editar producto' : 'Registrar producto'}</h2></div><button disabled={ocupado} onClick={cerrar} aria-label="Cerrar" className="rounded-xl p-2 hover:bg-slate-100"><X size={22}/></button></div>
      <form onSubmit={enviar} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{campos.map(c => <label key={c.key} className={`text-sm font-semibold text-slate-700 ${c.ancho || ''}`}><span>{c.titulo}</span><input required min={c.tipo === 'number' ? 0 : undefined} step={c.key === 'precio' ? '0.01' : c.tipo === 'number' ? '1' : undefined} maxLength={c.key === 'nombre' ? 120 : c.tipo === 'number' ? undefined : 70} type={c.tipo || 'text'} value={datos[c.key]} onChange={e => actualizar(c.key, e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500" /></label>)}</div>
        <label className="block text-sm font-semibold text-slate-700">Descripción<textarea required maxLength={300} rows={3} value={datos.descripcion} onChange={e => actualizar('descripcion', e.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"/></label>
        <label className="block text-sm font-semibold text-slate-700">URL de imagen (opcional)<input type="url" maxLength={500} value={datos.imagen} onChange={e => actualizar('imagen', e.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500" /></label>
        {error && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        <div className="flex justify-end gap-3 pt-2"><button disabled={ocupado} type="button" onClick={cerrar} className="rounded-xl border border-slate-200 px-5 py-3 font-bold hover:bg-slate-50">Cancelar</button><button disabled={ocupado} type="submit" className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-700 disabled:opacity-50">{ocupado ? 'Guardando...' : producto ? 'Guardar cambios' : 'Registrar producto'}</button></div>
      </form>
    </div>
  </div>
}
