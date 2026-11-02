export interface Producto {
  _id: string
  nombre: string
  categoria: string
  marca: string
  precio: number
  stock: number
  descripcion: string
  imagen: string
  createdAt: string
  updatedAt: string
}

export type ProductoEntrada = Pick<Producto, 'nombre' | 'categoria' | 'marca' | 'precio' | 'stock' | 'descripcion' | 'imagen'>
