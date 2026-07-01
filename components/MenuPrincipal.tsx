'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Bell, ShoppingBag, Flame, Star, Sparkles, Leaf, Plus, Check } from 'lucide-react';
import { CATEGORIES, PRODUCTS, type Product } from '@/lib/menu-data';
import CartDrawer, { type CartItem } from '@/components/CartDrawer';

interface MenuPrincipalProps {
  mesa?: string;
}

const TAG_CONFIG = {
  popular:    { label: 'Popular',    icon: Star,     bg: 'rgba(192,57,43,0.85)',    color: '#fff' },
  premium:    { label: 'Premium',    icon: Sparkles, bg: 'rgba(212,172,13,0.9)',    color: '#000' },
  spicy:      { label: 'Picante',    icon: Flame,    bg: 'rgba(200,80,0,0.85)',     color: '#fff' },
  new:        { label: 'Nuevo',      icon: Sparkles, bg: 'rgba(39,174,96,0.85)',    color: '#fff' },
  vegetarian: { label: 'Veggie',     icon: Leaf,     bg: 'rgba(46,204,113,0.85)',   color: '#fff' },
} as const;

function ProductCard({
  product,
  qtyInCart,
  onAdd,
}: {
  product: Product;
  qtyInCart: number;
  onAdd: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const primaryTag = product.tags[0];
  const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : null;
  const TagIcon = tagCfg?.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.03)',
        border: hovered
          ? '1px solid rgba(212,172,13,0.35)'
          : '1px solid rgba(212,172,13,0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: hovered
          ? '0 20px 60px rgba(192,57,43,0.25), 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,172,13,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(10,5,3,0.9) 0%, rgba(10,5,3,0.1) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(10,5,3,0.85) 0%, transparent 60%)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* Tag badge */}
        {tagCfg && TagIcon && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: tagCfg.bg, color: tagCfg.color }}
          >
            <TagIcon className="w-3 h-3" />
            <span>{tagCfg.label}</span>
          </div>
        )}

        {/* Cart quantity bubble */}
        {qtyInCart > 0 && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#C0392B', color: '#fff', boxShadow: '0 0 12px rgba(192,57,43,0.6)' }}
          >
            {qtyInCart}
          </div>
        )}

        {/* Price over image bottom */}
        <div className="absolute bottom-3 right-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              background: 'rgba(10,5,3,0.85)',
              border: '1px solid rgba(212,172,13,0.4)',
              color: '#D4AC0D',
              backdropFilter: 'blur(8px)',
            }}
          >
            S/ {product.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-white font-semibold text-base leading-snug mb-1.5">{product.name}</h3>
        <p className="text-[#707070] text-xs leading-relaxed flex-1 line-clamp-3">{product.description}</p>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97]"
          style={
            justAdded
              ? {
                  background: 'rgba(39,174,96,0.2)',
                  border: '1px solid rgba(39,174,96,0.5)',
                  color: '#27AE60',
                }
              : {
                  background: hovered
                    ? 'linear-gradient(135deg, #D4AC0D 0%, #B8860B 100%)'
                    : 'linear-gradient(135deg, rgba(212,172,13,0.15) 0%, rgba(184,134,11,0.1) 100%)',
                  border: hovered
                    ? '1px solid transparent'
                    : '1px solid rgba(212,172,13,0.35)',
                  color: hovered ? '#0A0A0A' : '#D4AC0D',
                  boxShadow: hovered ? '0 4px 20px rgba(212,172,13,0.3)' : 'none',
                }
          }
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function MenuPrincipal({ mesa = '1' }: MenuPrincipalProps) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) return prev;
      if (existing.qty <= 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const totalPrice = cart.reduce((acc, i) => {
    const p = PRODUCTS.find((p) => p.id === i.productId);
    return acc + (p?.price ?? 0) * i.qty;
  }, 0);

  const qtyFor = (id: string) => cart.find((i) => i.productId === id)?.qty ?? 0;
  const visibleProducts = PRODUCTS.filter((p) => p.categoryId === activeCat && p.available);

  const scrollToCategory = (catId: string) => {
    setActiveCat(catId);
    categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0A0A0A' }}>

      {/* ── Sticky header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3"
        style={{
          background: 'rgba(8,5,3,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,172,13,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/images/Gemini_Generated_Image_ytneqnytneqnytne-removebg-preview.png"
              alt="Dragon Menu"
              fill
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(192,57,43,0.7))' }}
            />
          </div>
          <div>
            <p className="text-[10px] text-[#D4AC0D] tracking-[0.25em] uppercase leading-none">Dragon Menu</p>
            <p className="text-white text-sm font-semibold leading-tight mt-0.5">
              Mesa{' '}
              <span
                className="px-1.5 py-0.5 rounded text-[#D4AC0D] font-bold text-xs"
                style={{ background: 'rgba(192,57,43,0.25)', border: '1px solid rgba(192,57,43,0.4)' }}
              >
                #{mesa}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-colors"
            style={{ background: 'rgba(212,172,13,0.1)', border: '1px solid rgba(212,172,13,0.25)', color: '#D4AC0D' }}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Llamar</span>
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: totalItems > 0 ? 'rgba(192,57,43,0.25)' : 'rgba(255,255,255,0.06)',
              border: totalItems > 0 ? '1px solid rgba(192,57,43,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: totalItems > 0 ? '#F5F5F5' : '#A0A0A0',
              boxShadow: totalItems > 0 ? '0 0 20px rgba(192,57,43,0.2)' : 'none',
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <>
                <span>{totalItems} plato{totalItems > 1 ? 's' : ''}</span>
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: '#C0392B', color: '#fff', boxShadow: '0 0 10px rgba(192,57,43,0.6)' }}
                >
                  {totalItems}
                </span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Category tabs ─────────────────────────────── */}
      <div
        className="sticky top-[61px] z-20 px-4 py-3 overflow-x-auto"
        style={{
          background: 'rgba(8,5,3,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          scrollbarWidth: 'none',
        }}
      >
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-250"
                style={{
                  background: active ? `${cat.accent}22` : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${cat.accent}55` : '1px solid rgba(255,255,255,0.08)',
                  color: active ? '#F5F5F5' : '#606060',
                  boxShadow: active ? `0 0 20px ${cat.accent}30` : 'none',
                }}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: cat.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────── */}
      <main className="flex-1 px-4 py-6 pb-40">
        {CATEGORIES.map((cat) => {
          const catProducts = PRODUCTS.filter((p) => p.categoryId === cat.id && p.available);
          return (
            <section
              key={cat.id}
              ref={(el) => { categoryRefs.current[cat.id] = el; }}
              className="mb-12 scroll-mt-36"
            >
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${cat.accent}18`, border: `1px solid ${cat.accent}30` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {cat.name}
                  </h2>
                  <p className="text-[#505050] text-xs mt-0.5 tracking-wider uppercase">{cat.subtitle}</p>
                </div>
                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${cat.accent}40, transparent)` }} />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    qtyInCart={qtyFor(product.id)}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ── Floating cart bar ─────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-3 transition-all duration-400"
        style={{
          opacity: totalItems > 0 ? 1 : 0,
          transform: totalItems > 0 ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: totalItems > 0 ? 'auto' : 'none',
          background: 'linear-gradient(to top, rgba(5,3,2,0.98) 60%, transparent)',
        }}
      >
        <button
          onClick={() => setCartOpen(true)}
          className="w-full max-w-lg mx-auto flex items-center justify-between px-5 py-4 rounded-2xl transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(192,57,43,0.95) 0%, rgba(146,43,33,0.95) 100%)',
            border: '1px solid rgba(231,76,60,0.4)',
            boxShadow: '0 8px 40px rgba(192,57,43,0.5), 0 0 0 1px rgba(212,172,13,0.1)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
          }}
        >
          {/* Left: count */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              {totalItems}
            </div>
            <span className="text-white text-sm font-medium">
              {totalItems === 1 ? '1 plato' : `${totalItems} platos`} en pedido
            </span>
          </div>

          {/* Right: total + CTA */}
          <div className="flex items-center gap-3">
            <span className="text-[#FFD700] font-bold text-base">S/ {totalPrice.toFixed(2)}</span>
            <span className="text-white text-sm font-semibold px-3 py-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
              Ver Pedido →
            </span>
          </div>
        </button>
      </div>

      {/* ── Cart drawer ─────────────────────────────────── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        mesa={mesa}
      />
    </div>
  );
}
