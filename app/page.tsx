export const dynamic = 'force-dynamic'

import { 
  getEmpresasActivas, 
  getCategoriasActivas, 
  getProductosFiltrados,
  getProductosCountByEmpresa,
  getProductosCountByCategoria 
} from "@/lib/database";
import CompanyHeader from "@/components/CompanyHeader";
import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/Filters/SidebarFilters";
import ActiveFilters from "@/components/Filters/ActiveFilters";

interface PageProps {
  searchParams: {
    empresa?: string;
    categoria?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const empresaId = searchParams.empresa;
  const categoriaId = searchParams.categoria;
  
  // Obtener datos
  const empresas = await getEmpresasActivas();
  const categorias = await getCategoriasActivas();
  
  // Obtener productos con filtros
  const productos = await getProductosFiltrados({
    empresaId,
    categoriaId
  });
  
  // Contar productos totales (sin filtros)
  const todosProductos = await getProductosFiltrados();
  const totalProductos = todosProductos.length;

  // Agrupar productos por empresa (solo si no hay filtro de empresa)
  const productosPorEmpresa: Record<string, typeof productos> = {};
  
  if (!empresaId) {
    productos.forEach(producto => {
      if (!productosPorEmpresa[producto.empresa_id]) {
        productosPorEmpresa[producto.empresa_id] = [];
      }
      productosPorEmpresa[producto.empresa_id].push(producto);
    });
  }

  // Obtener conteos para filtros
  const empresasConCount = await Promise.all(
    empresas.map(async (empresa) => ({
      ...empresa,
      count: await getProductosCountByEmpresa(empresa.id)
    }))
  );

  const categoriasConCount = await Promise.all(
    categorias.map(async (categoria) => ({
      ...categoria,
      count: await getProductosCountByCategoria(categoria.id)
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header principal */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {empresaId 
              ? `Productos de ${empresas.find(e => e.id === empresaId)?.nombre || 'la empresa'}`
              : 'Catálogo Premium'}
          </h1>
          <p className="text-gray-600">
            {productos.length} {productos.length === 1 ? 'producto' : 'productos'} disponibles
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="md:w-64 flex-shrink-0">
            <SidebarFilters 
              empresas={empresasConCount}
              categorias={categoriasConCount}
              productosCount={totalProductos}
            />
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Filtros activos */}
            <ActiveFilters 
              empresas={empresas}
              categorias={categorias}
            />

            {/* Si hay filtro de empresa, mostrar productos planos */}
            {empresaId ? (
              <>
                <div className="mb-8">
                  <CompanyHeader 
                    empresa={empresas.find(e => e.id === empresaId)!}
                    productCount={productos.length}
                  />
                </div>
                
                {productos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productos.map(producto => (
                      <ProductCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                    <p className="text-gray-500">
                      No se encontraron productos con los filtros seleccionados.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Si no hay filtro de empresa, mostrar agrupado */
              <div className="space-y-12">
                {Object.entries(productosPorEmpresa).map(([empresaId, productosEmpresa]) => {
                  const empresa = empresas.find(e => e.id === empresaId);
                  if (!empresa) return null;
                  
                  return (
                    <section key={empresaId}>
                      <CompanyHeader 
                        empresa={empresa}
                        productCount={productosEmpresa.length}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosEmpresa.map(producto => (
                          <ProductCard key={producto.id} producto={producto} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// LuiPV2409.*