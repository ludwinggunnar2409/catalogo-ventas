import type { Empresa } from "@/types/database";

interface CompanyHeaderProps {
  empresa: Empresa;
  productCount: number;
}

export default function CompanyHeader({ empresa, productCount }: CompanyHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border">
              <span className="font-bold text-blue-600">
                {empresa.nombre.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{empresa.nombre}</h2>
              <p className="text-gray-600">{empresa.descripcion}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {empresa.whatsapp_contacto}
            </span>
            <span>•</span>
            <span>{productCount} productos</span>
          </div>
        </div>
        
        <button className="hidden md:inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-9 px-4 rounded-lg">
          Ver todos
        </button>
      </div>
      
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}