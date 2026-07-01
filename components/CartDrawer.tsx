'use client';

import { X, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/menu-data';

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  mesa: string;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  onAdd,
  onRemove,
  onClear,
  mesa,
}: CartDrawerProps) {
  const enriched = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as (CartItem & { product: (typeof PRODUCTS)[number] })[];

  const total = enriched.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const itemCount = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.7)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
        style={{
          background: 'rgba(12,8,6,0.98)',
          border: '1px solid rgba(212,172,13,0.25)',
          borderBottom: 'none',
          boxShadow: '0 -20px 80px rgba(0,0,0,0.8)',
          maxHeight: '80vh',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(212,172,13,0.3)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(212,172,13,0.12)' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4AC0D]" />
            <div>
              <p className="text-white font-semibold text-base">Tu Pedido</p>
              <p className="text-[#808080] text-xs">Mesa #{mesa} · {itemCount} {itemCount === 1 ? 'plato' : 'platos'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cart.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#E74C3C] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <X className="w-4 h-4 text-[#A0A0A0]" />
            </button>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {enriched.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-10 h-10 text-[#303030] mx-auto mb-3" />
              <p className="text-[#505050] text-sm">Tu pedido está vacío.</p>
              <p className="text-[#404040] text-xs mt-1">Agrega platos desde el menú.</p>
            </div>
          ) : (
            enriched.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,172,13,0.1)' }}
              >
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-tight truncate">{product.name}</p>
                  <p className="text-[#D4AC0D] text-xs mt-0.5">S/ {product.price} c/u</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRemove(product.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                    style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.4)' }}
                  >
                    −
                  </button>
                  <span className="text-white font-semibold text-sm w-5 text-center">{qty}</span>
                  <button
                    onClick={() => onAdd(product.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                    style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.4)' }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-white text-sm font-semibold w-14 text-right shrink-0">
                  S/ {product.price * qty}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {enriched.length > 0 && (
          <div className="px-6 pb-8 pt-4" style={{ borderTop: '1px solid rgba(212,172,13,0.12)' }}>
            {/* Price breakdown */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#808080] text-sm">Subtotal</span>
              <span className="text-white text-sm">S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#808080] text-sm">Servicio (10%)</span>
              <span className="text-white text-sm">S/ {(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-white font-semibold">Total</span>
              <span className="text-[#D4AC0D] font-bold text-lg">S/ {(total * 1.1).toFixed(2)}</span>
            </div>

            <button
              className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                boxShadow: '0 8px 30px rgba(192,57,43,0.4)',
              }}
            >
              <span>Confirmar Pedido</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-center text-[#505050] text-xs mt-3">
              Un mesero confirmará tu pedido en instantes
            </p>
          </div>
        )}
      </div>
    </>
  );
}
