// app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        ✅ Tailwind v3 Funcionando
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <p className="text-gray-700">
          Si ves colores, sombras y gradientes, Tailwind v3 está funcionando.
        </p>
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Botón de prueba
        </button>
      </div>
    </div>
  );
}