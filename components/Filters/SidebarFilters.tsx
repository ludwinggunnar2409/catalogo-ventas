// app/components/SidebarFilters.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Empresa, Categoria, Producto } from '@/types/database';

interface SidebarFiltersProps {
  empresas: Empresa[];
  categorias: Categoria[];
  productos: Producto[]; // ← AHORA RECIBE PRODUCTOS
  productosCount: number;
}

export default function SidebarFilters(props: SidebarFiltersProps) {
  return (
    <Suspense fallback={null}>
      <SidebarFiltersContent {...props} />
    </Suspense>
  );
}

function SidebarFiltersContent({ empresas, categorias, productos, productosCount }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [empresaId, setEmpresaId] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sincronizar con URL
  useEffect(() => {
    setEmpresaId(searchParams.get('empresa') || '');
    setCategoriaId(searchParams.get('categoria') || '');
  }, [searchParams]);

  // Aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (empresaId) params.set('empresa', empresaId);
    if (categoriaId) params.set('categoria', categoriaId);
    router.push(`/?${params.toString()}`);
    setIsMobileOpen(false);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setEmpresaId('');
    setCategoriaId('');
    router.push('/');
    setIsMobileOpen(false);
  };

  // ✅ CONTADORES REALES (sobre los productos que ya tienes)
  const getEmpresaCount = (empresaId: string) =>
    productos.filter(p => p.empresa_id === empresaId).length;

  const getCategoriaCount = (categoriaId: string) =>
    productos.filter(p => p.categoria_id === categoriaId).length;

  return (
    <>
      {/* Botón para móvil */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-white shadow-lg hover:bg-gray-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </button>

      {/* Overlay móvil */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 z-50 md:z-auto
          h-full md:h-auto w-full md:w-64
          bg-white border-r border-gray-200
          transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          md:block overflow-y-auto
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{productosCount}</span> productos
            </div>
          </div>

          {/* Empresas */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Empresa</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="empresa"
                  checked={!empresaId}
                  onChange={() => setEmpresaId('')}
                  className="h-4 w-4 text-gray-900"
                />
                <span className="text-sm text-gray-700">Todas las empresas</span>
                <span className="ml-auto text-xs text-gray-500">{productosCount}</span>
              </label>

              {empresas.map(empresa => (
                <label key={empresa.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="empresa"
                    value={empresa.id}
                    checked={empresaId === empresa.id}
                    onChange={(e) => setEmpresaId(e.target.value)}
                    className="h-4 w-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">{empresa.nombre}</span>
                  <span className="ml-auto text-xs text-gray-500">{getEmpresaCount(empresa.id)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categoría</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="categoria"
                  checked={!categoriaId}
                  onChange={() => setCategoriaId('')}
                  className="h-4 w-4 text-gray-900"
                />
                <span className="text-sm text-gray-700">Todas las categorías</span>
                <span className="ml-auto text-xs text-gray-500">{productosCount}</span>
              </label>

              {categorias.map(categoria => (
                <label key={categoria.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="categoria"
                    value={categoria.id}
                    checked={categoriaId === categoria.id}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="h-4 w-4 text-gray-900"
                  />
                  <span className="text-sm text-gray-700">{categoria.nombre}</span>
                  <span className="ml-auto text-xs text-gray-500">{getCategoriaCount(categoria.id)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={applyFilters}
              className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Aplicar filtros
            </button>

            <button
              onClick={clearFilters}
              disabled={!empresaId && !categoriaId}
              className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}