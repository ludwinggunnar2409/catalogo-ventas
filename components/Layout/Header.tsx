'use client';

import CartButton from '@/components/Cart/CartButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              MC
            </div>
            <span className="font-bold text-gray-900">MarketLui</span>
          </div>

          <CartButton />
        </div>
      </div>
    </header>
  );
}
