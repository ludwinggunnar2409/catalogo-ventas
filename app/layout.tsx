import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import { CartProvider } from "@/components/Cart/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketCat - Catálogo Premium",
  description: "Catálogo minimalista de productos exclusivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-white py-8 mt-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MC</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-900">MarketCat</span>
                      <span className="ml-2 text-xs text-gray-500 font-medium">Premium</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Catálogo exclusivo. Todos los productos son propiedad de sus respectivas marcas.
                  </p>
                  <div className="flex gap-6">
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                      Términos
                    </a>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                      Privacidad
                    </a>
                    <a href="mailto:info@ejemplo.com" className="text-sm text-gray-500 hover:text-gray-700">
                      Contacto
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}