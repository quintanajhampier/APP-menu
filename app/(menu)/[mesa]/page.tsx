'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Bell, Flame, Star, Sparkles, Leaf,
  Plus, Check, Droplets, CreditCard, X, Package,
  ChefHat, CheckCircle2,
} from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';

interface Props { params: { mesa: string } }

// ── Category map ────────────────────────────────────────────
const CATEGORIES = [
  { id: 'wok',             name: 'Al Wok',          icon: '🔥', accent: '#E74C3C' },
  { id: 'sopas',           name: 'Sopas Imperiales', icon: '🍜', accent: '#F39C12' },
  { id: 'acompañamientos', name: 'Acompañamientos',  icon: '🥟', accent: '#D4AC0D' },
  { id: 'bebidas',         name: 'Bebidas',           icon: '🍵', accent: '#27AE60' },
];

// Fallback static menu when Supabase has no rows yet
const STATIC_PRODUCTS: Product[] = [
  { id: 'w-01', name: 'Chaufa Imperial Dragon',  description: 'Arroz al wok con langostinos, calamar y pulpo. La estrella de la casa.', price: 52, category_id: 'wok', image_url: 'https://images.pexels.com/photos/1707917/pexels-photo-1707917.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular','premium'], available: true, created_at: '', updated_at: '' },
  { id: 'w-02', name: 'Chaufa de Pollo Especial', description: 'Tiernos trozos de pollo marinados 24 horas, wok al fuego vivo.', price: 32, category_id: 'wok', image_url: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular'], available: true, created_at: '', updated_at: '' },
  { id: 'w-03', name: 'Aeropuerto Dragon Gold',   description: 'Chaufa y tallarín juntos con lomo fino y camarones.', price: 45, category_id: 'wok', image_url: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['premium','popular'], available: true, created_at: '', updated_at: '' },
  { id: 'w-04', name: 'Tallarin Saltado con Res', description: 'Fideos de arroz wok con lomo fino, tomate y sillao dulce.', price: 38, category_id: 'wok', image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular','spicy'], available: true, created_at: '', updated_at: '' },
  { id: 's-01', name: 'Sopa Wantán Imperial',     description: 'Caldo dorado de pollo con wantanes de cerdo y camarón.', price: 28, category_id: 'sopas', image_url: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular'], available: true, created_at: '', updated_at: '' },
  { id: 's-02', name: 'Sopa Fuchifu Clásica',     description: 'Caldo de res con rábano, fideos de celofán y huevo pochado.', price: 26, category_id: 'sopas', image_url: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=600', tags: [], available: true, created_at: '', updated_at: '' },
  { id: 's-03', name: 'Caldo Mariscos Imperial',  description: 'Bisque con langostinos, conchas y calamares.', price: 35, category_id: 'sopas', image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['premium','new'], available: true, created_at: '', updated_at: '' },
  { id: 'a-01', name: 'Wantán Frito (8 pzs)',     description: 'Crujientes, rellenos de cerdo y camarón con salsa agridulce.', price: 18, category_id: 'acompañamientos', image_url: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular'], available: true, created_at: '', updated_at: '' },
  { id: 'a-02', name: 'Siu Mai al Vapor (6 pzs)', description: 'Empanadillas al vapor con cerdo, gambas y huevas de tobiko.', price: 22, category_id: 'acompañamientos', image_url: 'https://images.pexels.com/photos/6646069/pexels-photo-6646069.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['premium','popular'], available: true, created_at: '', updated_at: '' },
  { id: 'a-03', name: 'Arroz Blanco Jazmín',      description: 'Arroz de jazmín tailandés al vapor, perfumado y esponjoso.', price: 8,  category_id: 'acompañamientos', image_url: 'https://images.pexels.com/photos/1350197/pexels-photo-1350197.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['vegetarian'], available: true, created_at: '', updated_at: '' },
  { id: 'a-04', name: 'Pan Chino Bao (4 pzs)',    description: 'Bollitos al vapor rellenos de char siu (cerdo asado al miel).', price: 16, category_id: 'acompañamientos', image_url: 'https://images.pexels.com/photos/5409013/pexels-photo-5409013.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['new'], available: true, created_at: '', updated_at: '' },
  { id: 'b-01', name: 'Chicha Morada Premium',    description: 'Maíz morado con canela, clavo y piña. Tradición peruana.', price: 12, category_id: 'bebidas', image_url: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['popular'], available: true, created_at: '', updated_at: '' },
  { id: 'b-02', name: 'Té de Jazmín Ceremonial',  description: 'Tetera de porcelana para dos, hojas de primera cosecha.', price: 18, category_id: 'bebidas', image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['premium'], available: true, created_at: '', updated_at: '' },
  { id: 'b-03', name: 'Limonada de Maracuyá',     description: 'Maracuyá fresco, limón y jengibre. Cítrico y refrescante.', price: 14, category_id: 'bebidas', image_url: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=600', tags: [], available: true, created_at: '', updated_at: '' },
  { id: 'b-04', name: 'Cerveza Tsingtao',          description: 'Lager china ligera, perfecta para acompañar.', price: 16, category_id: 'bebidas', image_url: 'https://images.pexels.com/photos/1267358/pexels-photo-1267358.jpeg?auto=compress&cs=tinysrgb&w=600', tags: [], available: true, created_at: '', updated_at: '' },
];

// ── Tag config ───────────────────────────────────────────────
const TAG_CFG = {
  popular:    { label: 'Popular',  Icon: Star,     bg: 'rgba(192,57,43,0.85)',  fg: '#fff' },
  premium:    { label: 'Premium',  Icon: Sparkles, bg: 'rgba(212,172,13,0.9)',  fg: '#000' },
  spicy:      { label: 'Picante',  Icon: Flame,    bg: 'rgba(200,80,0,0.85)',   fg: '#fff' },
  new:        { label: 'Nuevo',    Icon: Sparkles, bg: 'rgba(39,174,96,0.85)',  fg: '#fff' },
  vegetarian: { label: 'Veggie',   Icon: Leaf,     bg: 'rgba(46,204,113,0.85)', fg: '#fff' },
} as const;

// ── Services ─────────────────────────────────────────────────
const SERVICES = [
  { type: 'water' as const,     label: 'Pedir Agua',   Icon: Droplets,   color: '#3498DB', bg: 'rgba(52,152,219,0.15)', message: 'Solicita agua' },
  { type: 'condiment' as const, label: 'Más Cremas',   Icon: Plus,       color: '#F39C12', bg: 'rgba(243,156,18,0.15)', message: 'Solicita condimentos' },
  { type: 'waiter' as const,    label: 'Llamar Mozo',  Icon: Bell,       color: '#E74C3C', bg: 'rgba(192,57,43,0.2)',   message: 'Llamada al mesero' },
  { type: 'bill' as const,      label: 'Pedir Cuenta', Icon: CreditCard, color: '#D4AC0D', bg: 'rgba(212,172,13,0.15)', message: 'Solicita la cuenta' },
];

// ── Order status steps ───────────────────────────────────────
const ORDER_STEPS = [
  { key: 'pending',   label: 'Recibido',   Icon: Package,      color: '#E74C3C' },
  { key: 'preparing', label: 'Cocinando',  Icon: ChefHat,      color: '#F39C12' },
  { key: 'ready',     label: 'Listo',      Icon: CheckCircle2, color: '#27AE60' },
] as const;

interface CartItem { productId: string; qty: number }
interface ActiveOrder { id: string; status: string }

// ── Product card ─────────────────────────────────────────────
function ProductCard({ product, qty, onAdd, onRemove }: {
  product: Product; qty: number;
  onAdd: () => void; onRemove: () => void;
}) {
  const [added, setAdded] = useState(false);
  const primaryTag = product.tags[0] as keyof typeof TAG_CFG | undefined;
  const tagCfg = primaryTag ? TAG_CFG[primaryTag] : null;

  const handleAdd = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, boxShadow: '0 16px 50px rgba(192,57,43,0.3), 0 0 0 1px rgba(212,172,13,0.4)' }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(16,9,5,0.95)',
        border: '1px solid rgba(212,172,13,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* image */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,5,2,0.9) 0%, transparent 55%)' }} />
        {tagCfg && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: tagCfg.bg, color: tagCfg.fg }}>
            <tagCfg.Icon className="w-3 h-3" />{tagCfg.label}
          </div>
        )}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-sm font-bold" style={{ background: 'rgba(10,5,2,0.85)', border: '1px solid rgba(212,172,13,0.4)', color: '#D4AC0D', backdropFilter: 'blur(8px)' }}>
          S/ {product.price}
        </div>
        {qty > 0 && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#C0392B', color: '#fff', boxShadow: '0 0 10px rgba(192,57,43,0.7)' }}>
            {qty}
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-white font-semibold text-base leading-snug mb-1.5">{product.name}</h3>
        <p className="text-[#606060] text-xs leading-relaxed flex-1 line-clamp-2 mb-4">{product.description}</p>

        {qty > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button whileTap={{ scale: 0.85 }} onClick={onRemove}
                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.45)' }}>
                −
              </motion.button>
              <span className="text-white font-semibold text-sm w-4 text-center">{qty}</span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={onAdd}
                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.45)' }}>
                +
              </motion.button>
            </div>
            <span className="text-[#D4AC0D] text-sm font-bold">S/ {product.price * qty}</span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={added
              ? { background: 'rgba(39,174,96,0.2)', border: '1px solid rgba(39,174,96,0.5)', color: '#27AE60' }
              : { background: 'linear-gradient(135deg, #C0392B, #922B21)', boxShadow: '0 4px 16px rgba(192,57,43,0.4)', color: '#fff' }
            }
          >
            {added ? <><Check className="w-4 h-4" /> Agregado</> : <><Plus className="w-4 h-4" /> Agregar</>}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function MesaPage({ params }: Props) {
  const mesaNum    = decodeURIComponent(params.mesa);
  const tableNum   = parseInt(mesaNum) || 1;

  const [products,     setProducts]     = useState<Product[]>([]);
  const [loadingMenu,  setLoadingMenu]  = useState(true);
  const [activeCat,    setActiveCat]    = useState<string>(CATEGORIES[0].id);
  const [cart,         setCart]         = useState<CartItem[]>([]);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [svcOpen,      setSvcOpen]      = useState(false);
  const [sentSvc,      setSentSvc]      = useState<string | null>(null);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [orderSent,    setOrderSent]    = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  // ── Load products + realtime listener ────────────────────
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: true });
      const rows = (data as Product[]) ?? [];
      setProducts(rows.length > 0 ? rows : STATIC_PRODUCTS);
      setLoadingMenu(false);
    };
    load();

    const ch = supabase.channel('menu-products-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (p) => {
        const prod = p.new as Product;
        if (prod.available) setProducts((prev) => [...prev.filter((x) => x.id !== prod.id), prod]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (p) => {
        const prod = p.new as Product;
        setProducts((prev) =>
          prod.available
            ? prev.some((x) => x.id === prod.id)
              ? prev.map((x) => x.id === prod.id ? prod : x)
              : [...prev, prod]
            : prev.filter((x) => x.id !== prod.id)
        );
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'products' }, (p) => {
        setProducts((prev) => prev.filter((x) => x.id !== (p.old as Product).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Listen to this table's active orders ─────────────────
  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('id,status')
        .eq('table_number', tableNum)
        .in('status', ['pending','preparing','ready'])
        .order('created_at', { ascending: false });
      setActiveOrders((data as ActiveOrder[]) ?? []);
    };
    loadOrders();

    const ch = supabase.channel(`table-orders-${tableNum}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (p) => {
        const o = p.new as ActiveOrder & { table_number: number };
        if (p.eventType === 'DELETE') { setActiveOrders((prev) => prev.filter((x) => x.id !== (p.old as ActiveOrder).id)); return; }
        if (o.table_number !== tableNum) return;
        if (['pending','preparing','ready'].includes(o.status)) {
          setActiveOrders((prev) => prev.some((x) => x.id === o.id) ? prev.map((x) => x.id === o.id ? o : x) : [o, ...prev]);
        } else {
          setActiveOrders((prev) => prev.filter((x) => x.id !== o.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [tableNum]);

  // ── Cart helpers ─────────────────────────────────────────
  const addToCart    = useCallback((pid: string) => setCart((p) => { const ex = p.find((i) => i.productId === pid); return ex ? p.map((i) => i.productId === pid ? { ...i, qty: i.qty + 1 } : i) : [...p, { productId: pid, qty: 1 }]; }), []);
  const removeFromCart = useCallback((pid: string) => setCart((p) => { const ex = p.find((i) => i.productId === pid); if (!ex) return p; return ex.qty <= 1 ? p.filter((i) => i.productId !== pid) : p.map((i) => i.productId === pid ? { ...i, qty: i.qty - 1 } : i); }), []);
  const qtyFor       = (pid: string) => cart.find((i) => i.productId === pid)?.qty ?? 0;
  const totalItems   = cart.reduce((a, i) => a + i.qty, 0);
  const displayProducts = (products.length > 0 ? products : STATIC_PRODUCTS).filter((p) => p.category_id === activeCat && p.available);
  const totalPrice   = cart.reduce((acc, i) => acc + ((products.find((p) => p.id === i.productId) || STATIC_PRODUCTS.find((p) => p.id === i.productId))?.price ?? 0) * i.qty, 0);

  // ── Send service request ─────────────────────────────────
  const sendService = async (type: string, message: string) => {
    setSentSvc(type);
    await supabase.from('service_requests').insert({ table_number: tableNum, type, message, status: 'open' });
    setTimeout(() => { setSentSvc(null); setSvcOpen(false); }, 1800);
  };

  // ── Send order ───────────────────────────────────────────
  const confirmOrder = async () => {
    if (!totalItems || orderLoading) return;
    setOrderLoading(true);
    const allProducts = products.length > 0 ? products : STATIC_PRODUCTS;
    const items = cart.map(({ productId, qty }) => {
      const p = allProducts.find((x) => x.id === productId)!;
      return { name: p.name, qty, price: p.price };
    });
    const { data } = await supabase.from('orders').insert({
      table_number: tableNum, status: 'pending', items,
      subtotal: totalPrice, total: +(totalPrice * 1.1).toFixed(2), notes: '',
    }).select('id,status').single();
    if (data) setActiveOrders((prev) => [data as ActiveOrder, ...prev]);
    setCart([]);
    setCartOpen(false);
    setOrderSent(true);
    setOrderLoading(false);
    setTimeout(() => setOrderSent(false), 5000);
  };

  const scrollTo = (catId: string) => {
    setActiveCat(catId);
    categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const latestOrder = activeOrders[0];
  const stepIndex   = latestOrder ? ORDER_STEPS.findIndex((s) => s.key === latestOrder.status) : -1;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#050505' }}>

      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3"
        style={{ background: 'rgba(5,3,2,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,172,13,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image src="/images/image.png" alt="Dragon" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(192,57,43,0.7))' }} />
          </div>
          <div>
            <p className="text-[10px] text-[#D4AC0D] tracking-[0.25em] uppercase leading-none">Dragon Chifa</p>
            <p className="text-white text-sm font-semibold leading-tight mt-0.5">
              Mesa <span className="px-1.5 py-0.5 rounded text-[#D4AC0D] font-bold text-xs" style={{ background: 'rgba(192,57,43,0.25)', border: '1px solid rgba(192,57,43,0.4)' }}>#{mesaNum}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => setSvcOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-colors"
            style={{ background: 'rgba(212,172,13,0.1)', border: '1px solid rgba(212,172,13,0.25)', color: '#D4AC0D' }}>
            <Bell className="w-3.5 h-3.5" /><span className="hidden sm:inline">Servicios</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: totalItems > 0 ? 'rgba(192,57,43,0.25)' : 'rgba(255,255,255,0.06)', border: totalItems > 0 ? '1px solid rgba(192,57,43,0.5)' : '1px solid rgba(255,255,255,0.1)', color: totalItems > 0 ? '#F5F5F5' : '#A0A0A0' }}>
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && <span>{totalItems}</span>}
            {totalItems > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#C0392B', color: '#fff' }}>{totalItems}</span>}
          </motion.button>
        </div>
      </header>

      {/* ── Order status tracker ─────────────────────────── */}
      <AnimatePresence>
        {latestOrder && stepIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3" style={{ background: 'rgba(18,10,6,0.95)', borderBottom: '1px solid rgba(212,172,13,0.12)' }}>
              <p className="text-[10px] text-[#505050] uppercase tracking-widest mb-2.5">Estado de tu pedido</p>
              <div className="flex items-center gap-1">
                {ORDER_STEPS.map((step, i) => {
                  const done    = i <= stepIndex;
                  const current = i === stepIndex;
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <motion.div
                        animate={current ? { scale: [1, 1.12, 1] } : {}}
                        transition={{ duration: 1.2, repeat: current ? Infinity : 0, ease: 'easeInOut' }}
                        className="flex flex-col items-center gap-1 flex-1"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                          style={{
                            background: done ? `${step.color}25` : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${done ? step.color : 'rgba(255,255,255,0.1)'}`,
                            boxShadow: current ? `0 0 12px ${step.color}60` : 'none',
                          }}>
                          <step.Icon className="w-4 h-4" style={{ color: done ? step.color : '#404040' }} />
                        </div>
                        <span className="text-[9px] leading-none font-medium" style={{ color: done ? step.color : '#404040' }}>{step.label}</span>
                      </motion.div>
                      {i < ORDER_STEPS.length - 1 && (
                        <div className="h-0.5 flex-1 mx-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div className="h-full rounded-full"
                            animate={{ width: i < stepIndex ? '100%' : '0%' }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ background: `linear-gradient(to right, ${ORDER_STEPS[i].color}, ${ORDER_STEPS[i+1].color})` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order sent toast ────────────────────────────── */}
      <AnimatePresence>
        {orderSent && (
          <motion.div initial={{ opacity:0, y: -20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y: -20 }}
            className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ background:'rgba(39,174,96,0.15)', border:'1px solid rgba(39,174,96,0.35)', color:'#27AE60' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">Pedido enviado a cocina — te avisamos cuando esté listo.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category tabs ────────────────────────────────── */}
      <div className="sticky top-[61px] z-20 px-4 py-3 overflow-x-auto"
        style={{ background: 'rgba(5,3,2,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)', scrollbarWidth: 'none' }}>
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <motion.button key={cat.id} whileTap={{ scale: 0.95 }} onClick={() => scrollTo(cat.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  background: active ? `${cat.accent}22` : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${cat.accent}55` : '1px solid rgba(255,255,255,0.08)',
                  color: active ? '#F5F5F5' : '#606060',
                  boxShadow: active ? `0 0 20px ${cat.accent}30` : 'none',
                  transition: 'all 0.2s ease',
                }}>
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Product sections (all categories, scroll-based) ── */}
      <main className="flex-1 px-4 py-6 pb-40">
        {CATEGORIES.map((cat) => {
          const catProducts = (products.length > 0 ? products : STATIC_PRODUCTS)
            .filter((p) => p.category_id === cat.id && p.available);
          return (
            <section
              key={cat.id}
              ref={(el) => { categoryRefs.current[cat.id] = el; }}
              className="mb-14 scroll-mt-36"
            >
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${cat.accent}18`, border: `1px solid ${cat.accent}30` }}>
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{cat.name}</h2>
                </div>
                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${cat.accent}50, transparent)` }} />
              </div>

              {loadingMenu ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
                  ))}
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {catProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        layout
                        transition={{ delay: i * 0.055, duration: 0.4, ease: [0.4,0,0.2,1] }}
                      >
                        <ProductCard
                          product={product}
                          qty={qtyFor(product.id)}
                          onAdd={() => addToCart(product.id)}
                          onRemove={() => removeFromCart(product.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </section>
          );
        })}
      </main>

      {/* ── Floating cart bar ────────────────────────────── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4,0,0.2,1] }}
            className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-3"
            style={{ background: 'linear-gradient(to top, rgba(5,3,2,0.98) 60%, transparent)' }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setCartOpen(true)}
              className="w-full max-w-lg mx-auto flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(192,57,43,0.95) 0%, rgba(146,43,33,0.95) 100%)',
                border: '1px solid rgba(231,76,60,0.4)',
                boxShadow: '0 8px 40px rgba(192,57,43,0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{totalItems}</div>
                <span className="text-white text-sm font-medium">{totalItems === 1 ? '1 plato' : `${totalItems} platos`} en pedido</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FFD700] font-bold text-base">S/ {totalPrice.toFixed(2)}</span>
                <span className="text-white text-sm font-semibold px-3 py-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>Ver pedido →</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setCartOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
              style={{ background: 'rgba(12,7,4,0.98)', borderLeft: '1px solid rgba(212,172,13,0.2)', backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p className="text-[#D4AC0D] text-xs tracking-widest uppercase">Tu pedido</p>
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>Mesa #{mesaNum}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCartOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <X className="w-4 h-4 text-[#A0A0A0]" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center py-16 gap-3">
                    <ShoppingBag className="w-12 h-12 text-[#2A2A2A]" />
                    <p className="text-[#505050] text-sm">Tu pedido está vacío</p>
                  </div>
                ) : cart.map(({ productId, qty }) => {
                  const allP = products.length > 0 ? products : STATIC_PRODUCTS;
                  const p = allP.find((x) => x.id === productId);
                  if (!p) return null;
                  return (
                    <div key={productId} className="flex items-center gap-3 px-3 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-[#D4AC0D] text-xs">S/ {p.price}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeFromCart(productId)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                          style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.4)' }}>−</motion.button>
                        <span className="text-white text-sm font-semibold w-4 text-center">{qty}</span>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => addToCart(productId)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                          style={{ background: 'rgba(192,57,43,0.25)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.4)' }}>+</motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cart.length > 0 && (
                <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex justify-between mb-4">
                    <span className="text-[#808080] text-sm">Total</span>
                    <span className="text-[#D4AC0D] font-bold text-lg">S/ {totalPrice.toFixed(2)}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }} disabled={orderLoading} onClick={confirmOrder}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base"
                    style={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', boxShadow: '0 8px 30px rgba(192,57,43,0.5)', opacity: orderLoading ? 0.7 : 1 }}>
                    {orderLoading ? 'Enviando...' : 'Confirmar pedido'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Services modal ────────────────────────────────── */}
      <AnimatePresence>
        {svcOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
              onClick={() => setSvcOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.34,1.56,0.64,1] }}
              className="fixed inset-x-4 bottom-8 z-50 rounded-3xl p-6"
              style={{ background: 'rgba(12,7,4,0.98)', border: '1px solid rgba(212,172,13,0.25)', boxShadow: '0 -8px 60px rgba(192,57,43,0.3)', backdropFilter: 'blur(20px)', maxWidth: 420, margin: 'auto' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[#D4AC0D] text-xs tracking-widest uppercase">Servicios</p>
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>Mesa #{mesaNum}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSvcOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <X className="w-4 h-4 text-[#A0A0A0]" />
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map(({ type, label, Icon, color, bg, message }) => {
                  const isSent = sentSvc === type;
                  return (
                    <motion.button
                      key={type} whileTap={{ scale: 0.93 }}
                      onClick={() => sendService(type, message)} disabled={!!sentSvc}
                      className="flex flex-col items-center gap-3 py-5 px-3 rounded-2xl transition-all"
                      style={{
                        background: isSent ? 'rgba(39,174,96,0.15)' : bg,
                        border: `1px solid ${isSent ? 'rgba(39,174,96,0.5)' : `${color}35`}`,
                        boxShadow: isSent ? '0 0 20px rgba(39,174,96,0.2)' : `0 4px 20px ${color}15`,
                      }}
                    >
                      {isSent ? <Check className="w-6 h-6 text-[#27AE60]" /> : <Icon className="w-6 h-6" style={{ color }} />}
                      <span className="text-xs font-semibold text-center leading-tight" style={{ color: isSent ? '#27AE60' : '#D0D0D0' }}>
                        {isSent ? 'Enviado' : label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
