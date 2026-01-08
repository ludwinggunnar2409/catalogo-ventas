export type Empresa = {
  id: string;
  nombre: string;
  descripcion: string | null;
  whatsapp_contacto: string;
  is_active: boolean;
  created_at: string;
};

export type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  is_active: boolean;
  created_at: string;
};

export type Producto = {
  id: string;
  empresa_id: string;
  categoria_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  comision_interna: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relaciones (opcionales, se pueden cargar con joins)
  empresa?: Empresa;
  categoria?: Categoria;
  imagen_url: string | null;
};



// TIPOS PARA EL CARRITO
export type CartItem = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  nombre: string;
  empresa_nombre: string;
  empresa_whatsapp: string;
};

export type CartState = {
  items: CartItem[];
  total: number;
  cantidadTotal: number;
};

export type CartContextType = {
  cart: CartState;
  addToCart: (producto: Producto) => void;
  removeFromCart: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
};

// Tipos para filtros
export type FilterState = {
  empresaId?: string;
  categoriaId?: string;
  searchQuery?: string;
};

export type FilterOption = {
  id: string;
  label: string;
  count: number;
};
