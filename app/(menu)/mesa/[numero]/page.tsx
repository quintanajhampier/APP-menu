'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Bell, ChevronRight, Flame, Star, Droplets, Coffee, CreditCard, MessageCircle, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props { params: { numero: string } }

// ── Mock data (mirrors lib/menu-data for this standalone route) ─
const CATS = [
  { id: 'wok',             name: 'Al Wok',       icon: '🔥' },
  { id: 'sopas',           name: 'Sopas',         icon: '🍜' },
  { id: 'acompañamientos', name: 'Acompañamientos',icon: '🥟' },
  { id: 'bebidas',         name: 'Bebidas',       icon: '🍵' },
];

const PRODUCTS = [
  { id: 'w-01', name: 'Chaufa Imperial Dragon',  price: 52, category: 'wok',             tags: ['popular','premium'], image: 'https://images.pexels.com/photos/1707917/pexels-photo-1707917.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Arroz al wok con langostinos, calamar y pulpo. La estrella de la casa.' },
  { id: 'w-02', name: 'Chaufa de Pollo Especial', price: 32, category: 'wok',             tags: ['popular'],           image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Pollo marinado 24h, wok al fuego vivo con poro y huevo.' },
  { id: 'w-03', name: 'Aeropuerto Dragon Gold',   price: 45, category: 'wok',             tags: ['premium'],           image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Chaufa y tallarín juntos con lomo fino y camarones.' },
  { id: 's-01', name: 'Sopa Wantán Imperial',     price: 28, category: 'sopas',           tags: ['popular'],           image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Caldo dorado con wantanes de cerdo y camarón.' },
  { id: 's-02', name: 'Sopa Fuchifu Clásica',     price: 26, category: 'sopas',           tags: [],                    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Caldo de res con rábano y fideos de celofán.' },
  { id: 's-03', name: 'Caldo Mariscos Imperial',  price: 35, category: 'sopas',           tags: ['premium'],           image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Bisque con langostinos, conchas y calamares.' },
  { id: 's-04', name: 'Sopa Wontán Picante',      price: 27, category: 'sopas',           tags: ['spicy'],            image: 'https://images.pexels.com/photos/5848478/pexels-photo-5848478.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Caldo de ajo y ajonjolí con wontanes y aceite de chile.' },
  { id: 'a-01', name: 'Wantán Frito (8 pzs)',     price: 18, category: 'acompañamientos', tags: ['popular'],           image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Crujientes, rellenos de cerdo y camarón.' },
  { id: 'a-02', name: 'Siu Mai al Vapor (6 pzs)', price: 22, category: 'acompañamientos', tags: ['premium'],           image: 'https://images.pexels.com/photos/6646069/pexels-photo-6646069.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Al vapor con cerdo, gambas y huevas de tobiko.' },
  { id: 'a-03', name: 'Arroz Blanco Jazmín',      price: 8,  category: 'acompañamientos', tags: ['vegetarian'],         image: 'https://images.pexels.com/photos/1350197/pexels-photo-1350197.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Arroz de jazmín tailandés al vapor, perfumado y esponjoso.' },
  { id: 'a-04', name: 'Pan Chino Bao (4 pzs)',    price: 16, category: 'acompañamientos', tags: ['new'],                image: 'https://images.pexels.com/photos/5409013/pexels-photo-5409013.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Bollitos al vapor rellenos de char siu.' },
  { id: 'b-01', name: 'Chicha Morada Premium',    price: 12, category: 'bebidas',         tags: ['popular'],           image: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Maíz morado con canela, clavo y piña.' },
  { id: 'b-02', name: 'Té de Jazmín Ceremonial',  price: 18, category: 'bebidas',         tags: ['premium'],           image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Tetera de porcelana para dos.' },
  { id: 'b-03', name: 'Limonada de Maracuyá',      price: 14, category: 'bebidas',         tags: [],                    image: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Maracuyá fresco, limón y un toque de menta.' },
  { id: 'b-04', name: 'Cerveza Tsingtao',          price: 16, category: 'bebidas',         tags: [],                    image: 'https://images.pexels.com/photos/1267358/pexels-photo-1267358.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Lager china ligera, perfecta para acompañar.' },
];

const SERVICES = [
  { type: 'water',     label: 'Pedir Agua',    icon: Droplets,      color: '#3498DB', message: 'Solicita agua para la mesa' },
  { type: 'condiment', label: 'Más Cremas',    icon: Coffee,        color: '#F39C12', message: 'Solicita más cremas/salsas' },
  { type: 'waiter',    label: 'Llamar Mozo',   icon: Bell,          color: '#E74C3C', message: 'Llamada al mesero' },
  { type: 'bill',      label: 'Pedir Cuenta',  icon: CreditCard,    color: '#D4AC0D', message: 'Solicita la cuenta' },
] as const;

export default function MesaPage({ params }: Props) {
  const mesaNum = decodeURIComponent(params.numero);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cart, setCart]           = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen]   = useState(false);
  const [svcOpen, setSvcOpen]     = useState(false);
  const [sentSvc, setSentSvc]     = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const addToCart    = (id: string) => setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  const removeFromCart = (id: string) => setCart((p) => { const n = { ...p }; n[id] > 1 ? n[id]-- : delete n[id]; return n; });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => acc + (PRODUCTS.find((p) => p.id === id)?.price ?? 0) * qty, 0);
  const visible    = activeCat ? PRODUCTS.filter((p) => p.category === activeCat) : PRODUCTS;

  const sendServiceRequest = async (type: string, message: string) => {
    setSentSvc(type);
    await supabase.from('service_requests').insert({ table_number: parseInt(mesaNum) || 1, type, message, status: 'open' });
    setTimeout(() => { setSentSvc(null); setSvcOpen(false); }, 1800);
  };

  const confirmOrder = async () => {
    if (!totalItems || orderLoading) return;
    setOrderLoading(true);
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = PRODUCTS.find((pr) => pr.id === id)!;
      return { name: p.name, qty, price: p.price };
    });
    await supabase.from('orders').insert({ table_number: parseInt(mesaNum) || 1, status: 'pending', items, subtotal: totalPrice, total: +(totalPrice * 1.1).toFixed(2), notes: '' });
    setCart({});
    setCartOpen(false);
    setOrderSent(true);
    setOrderLoading(false);
    setTimeout(() => setOrderSent(false), 4000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,172,13,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <Image src="/images/Gemini_Generated_Image_ytneqnytneqnytne-removebg-preview.png" alt="Dragon" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(192,57,43,0.7))' }} />
          </div>
          <div>
            <p className="text-[10px] text-[#D4AC0D] tracking-widest uppercase">Dragon Menu</p>
            <p className="text-white text-sm font-semibold">Mesa <span className="px-1.5 py-0.5 rounded text-[#D4AC0D] font-bold text-xs" style={{ background: 'rgba(192,57,43,0.3)', border: '1px solid rgba(192,57,43,0.5)' }}>#{mesaNum}</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSvcOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs" style={{ background: 'rgba(212,172,13,0.1)', border: '1px solid rgba(212,172,13,0.3)', color: '#D4AC0D' }}>
            <Bell className="w-3.5 h-3.5" /><span className="hidden sm:inline">Servicios</span>
          </button>
          <button onClick={() => setCartOpen(!cartOpen)} className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: totalItems > 0 ? 'rgba(192,57,43,0.25)' : 'rgba(255,255,255,0.06)', border: totalItems > 0 ? '1px solid rgba(192,57,43,0.5)' : '1px solid rgba(255,255,255,0.1)', color: '#F5F5F5' }}>
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && <><span>{totalItems}</span><span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#C0392B', color: '#fff' }}>{totalItems}</span></>}
          </button>
        </div>
      </header>

      {/* Order sent confirmation */}
      {orderSent && (
        <div className="fixed top-20 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.4)', backdropFilter: 'blur(12px)' }}>
          <Check className="w-5 h-5 text-[#27AE60]" />
          <div>
            <p className="text-white text-sm font-semibold">Pedido confirmado</p>
            <p className="text-[#808080] text-xs">La cocina ya recibió tu pedido. Te avisamos cuando esté listo.</p>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 min-w-max">
          {[{ id: null, name: 'Todos', icon: '✨' }, ...CATS].map((cat) => (
            <button key={String(cat.id)} onClick={() => setActiveCat(cat.id as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={activeCat === cat.id ? { background: 'linear-gradient(135deg,#C0392B,#922B21)', color: '#fff', boxShadow: '0 0 20px rgba(192,57,43,0.4)' } : { background: 'rgba(255,255,255,0.05)', color: '#808080', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span>{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pb-36 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {visible.map((p) => (
          <div key={p.id} className="rounded-2xl overflow-hidden group transition-all duration-200 hover:-translate-y-1" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(212,172,13,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div className="relative h-44 overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(10,5,3,0.85),transparent 55%)' }} />
              <div className="absolute top-2 left-2 flex gap-1">
                {p.tags.includes('popular') && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(192,57,43,0.85)', color: '#fff' }}><Star className="w-3 h-3" /> Popular</span>}
                {p.tags.includes('premium') && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(212,172,13,0.9)', color: '#000' }}>Premium</span>}
              </div>
              <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-sm font-bold" style={{ background: 'rgba(10,5,3,0.85)', color: '#D4AC0D', border: '1px solid rgba(212,172,13,0.35)', backdropFilter: 'blur(6px)' }}>S/ {p.price}</span>
            </div>
            <div className="p-4">
              <p className="text-white font-semibold text-base mb-1">{p.name}</p>
              <p className="text-[#606060] text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>
              {cart[p.id] ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(p.id)} className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center" style={{ background: 'rgba(192,57,43,0.3)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.5)' }}>−</button>
                    <span className="text-white font-semibold w-4 text-center">{cart[p.id]}</span>
                    <button onClick={() => addToCart(p.id)} className="w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center" style={{ background: 'rgba(192,57,43,0.3)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.5)' }}>+</button>
                  </div>
                  <span className="text-[#D4AC0D] text-sm font-bold">S/ {p.price * cart[p.id]}</span>
                </div>
              ) : (
                <button onClick={() => addToCart(p.id)} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg,rgba(212,172,13,0.15),rgba(184,134,11,0.1))', border: '1px solid rgba(212,172,13,0.35)', color: '#D4AC0D' }}>
                  + Agregar <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      {totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-3" style={{ background: 'linear-gradient(to top,rgba(5,3,2,0.98) 60%,transparent)' }}>
          <button onClick={() => setCartOpen(true)} className="w-full max-w-lg mx-auto flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg,rgba(192,57,43,0.95),rgba(146,43,33,0.95))', border: '1px solid rgba(231,76,60,0.4)', boxShadow: '0 8px 40px rgba(192,57,43,0.5)', display: 'flex' }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>{totalItems}</span>
              <span className="text-white text-sm font-medium">{totalItems === 1 ? '1 plato' : `${totalItems} platos`}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#FFD700] font-bold">S/ {totalPrice.toFixed(2)}</span>
              <span className="text-white text-sm font-semibold px-3 py-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>Ver Pedido →</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <div className="fixed inset-0 z-40">
          <div onClick={() => setCartOpen(false)} className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 flex flex-col gap-4" style={{ background: 'rgba(12,7,4,0.98)', border: '1px solid rgba(212,172,13,0.2)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">Tu Pedido — Mesa #{mesaNum}</p>
              <button onClick={() => setCartOpen(false)}><X className="w-5 h-5 text-[#606060]" /></button>
            </div>
            <div className="space-y-2">
              {Object.entries(cart).map(([id, qty]) => {
                const p = PRODUCTS.find((x) => x.id === id)!;
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt={p.name} />
                    <div className="flex-1"><p className="text-white text-sm font-medium">{p.name}</p><p className="text-[#D4AC0D] text-xs">S/ {p.price}</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(id)} className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(192,57,43,0.3)', color: '#E74C3C' }}>−</button>
                      <span className="text-white w-4 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => addToCart(id)} className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(192,57,43,0.3)', color: '#E74C3C' }}>+</button>
                    </div>
                    <span className="text-white text-sm font-bold w-14 text-right">S/ {p.price * qty}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,172,13,0.15)' }}>
              <span className="text-white font-semibold">Total: <span className="text-[#D4AC0D]">S/ {(totalPrice * 1.1).toFixed(2)}</span></span>
              <button onClick={confirmOrder} disabled={orderLoading} className="px-6 py-2.5 rounded-full text-white text-sm font-semibold disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#C0392B,#922B21)', boxShadow: '0 6px 20px rgba(192,57,43,0.4)' }}>
                {orderLoading ? 'Enviando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Services panel ────────────────────────────── */}
      {svcOpen && (
        <div className="fixed inset-0 z-40">
          <div onClick={() => setSvcOpen(false)} className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6" style={{ background: 'rgba(12,7,4,0.98)', border: '1px solid rgba(212,172,13,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-semibold text-base">Servicios de mesa</p>
                <p className="text-[#606060] text-xs mt-0.5">Mesa #{mesaNum} · El mesero será notificado</p>
              </div>
              <button onClick={() => setSvcOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <X className="w-4 h-4 text-[#808080]" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px my-4" style={{ background: 'rgba(212,172,13,0.15)' }} />

            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(({ type, label, icon: Icon, color, message }) => {
                const sent = sentSvc === type;
                return (
                  <button key={type} onClick={() => sendServiceRequest(type, message)} disabled={!!sentSvc}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all active:scale-[0.96] disabled:pointer-events-none"
                    style={{ background: sent ? `${color}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${sent ? color : 'rgba(255,255,255,0.08)'}40`, boxShadow: sent ? `0 0 20px ${color}30` : 'none' }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      {sent ? <Check className="w-6 h-6" style={{ color }} /> : <Icon className="w-6 h-6" style={{ color }} />}
                    </div>
                    <span className="text-white text-sm font-medium text-center">{sent ? '¡Enviado!' : label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[#404040] text-xs mt-5">
              Las solicitudes llegan directamente al mozo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
