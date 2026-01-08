'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ActiveFiltersProps {
  empresas: Array<{ id: string; nombre: string }>;
  categorias: Array<{ id: string; nombre: string }>;
}

export default function ActiveFilters({ empresas, categorias }: ActiveFiltersProps) {
  const searchParams = useSearchParams();
  const empresaId = searchParams.get('empresa');
  const categoriaId = searchParams.get('categoria');

  const empresaSeleccionada = empresas.find(e => e.id === empresaId);
  const categoriaSeleccionada = categorias.find(c => c.id === categoriaId);

  const hasFilters = empresaId || categoriaId;

  if (!hasFilters) return null;

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">Filtros aplicados:</span>
        
        {empresaSeleccionada && (
          <Link
            href={`/?categoria=${categoriaId || ''}`}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Empresa: {empresaSeleccionada.nombre}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        )}
        
        {categoriaSeleccionada && (
          <Link
            href={`/?empresa=${empresaId || ''}`}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Categoría: {categoriaSeleccionada.nombre}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        )}
        
        {(empresaId || categoriaId) && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
          >
            Limpiar todos
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}