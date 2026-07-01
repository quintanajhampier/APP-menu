'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, LayoutGrid, Clock, ArrowUpRight, Flame } from 'lucide-react';
import { supabase, type Order } from '@/lib/supabase';

interface Stat { label: string; value: string; sub: string; icon: typeof TrendingUp; color: string; }

const POPULAR = [
  { name: 'Chaufa Imperial Dragon', orders: 47, revenue: 2444 },
  { name: 'Aeropuerto Dragon Gold',  orders: 38, revenue: 1710 },
  { name: 'Tallarin con Res',        orders: 31, revenue: 1178 },
  { name: 'Sopa Wantán Imperial',    orders: 28, revenue:  784 },
  { name: 'Chaufa de Mariscos',      orders: 22, revenue:  990 },
];

export default function AdminDashboard() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    };
    load();

    const ch = supabase.channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (p) => {
        if (p.eventType === 'INSERT') setOrders((prev) => [p.new as Order, ...prev]);
        if (p.eventType === 'UPDATE') setOrders((prev) => prev.map((o) => o.id === (p.new as Order).id ? p.new as Order : o));
        if (p.eventType === 'DELETE') setOrders((prev) => prev.filter((o) => o.id !== (p.old as Order).id));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const todaySales    = orders.reduce((s, o) => s + Number(o.total), 0);
  const activeTables  = Array.from(new Set(orders.filter((o) => ['pending','preparing'].includes(o.status)).map((o) => o.table_number))).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const avgTime       = 17;

  const stats: Stat[] = [
    { label: 'Ventas del día',     value: `S/ ${todaySales.toFixed(0)}`, sub: '+12% vs ayer',      icon: TrendingUp,  color: '#D4AC0D' },
    { label: 'Pedidos hoy',        value: String(orders.length),         sub: `${pendingOrders} pendientes`, icon: ShoppingBag, color: '#E74C3C' },
    { label: 'Mesas activas',      value: String(activeTables),          sub: 'de 16 totales',      icon: LayoutGrid,  color: '#27AE60' },
    { label: 'Tiempo promedio',    value: `${avgTime} min`,              sub: 'por pedido',         icon: Clock,       color: '#F39C12' },
  ];

  const recent = orders.slice(0, 6);

  const STATUS_LABEL: Record<string, string> = {
    pending:   'Pendiente',
    preparing: 'Cocinando',
    ready:     'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  const STATUS_COLOR: Record<string, string> = {
    pending:   '#E74C3C',
    preparing: '#F39C12',
    ready:     '#27AE60',
    delivered: '#808080',
    cancelled: '#404040',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Dashboard</h1>
        <p className="text-[#505050] text-sm mt-1">Resumen en tiempo real del restaurante</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#606060] text-xs uppercase tracking-wider">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <p className="text-white text-2xl font-bold mb-1">{loading ? '—' : value}</p>
            <p className="text-xs flex items-center gap-1" style={{ color }}>
              <ArrowUpRight className="w-3 h-3" />{sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-3 rounded-2xl p-5" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold mb-4">Pedidos recientes</p>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-[#404040] text-sm text-center py-8">Sin pedidos aún</p>
          ) : (
            <div className="space-y-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ background: 'rgba(192,57,43,0.2)', color: '#E74C3C' }}>
                    {o.table_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Mesa #{o.table_number}</p>
                    <p className="text-[#505050] text-xs truncate">{Array.isArray(o.items) ? o.items.map((i: any) => i.name).join(', ') : '—'}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium" style={{ background: `${STATUS_COLOR[o.status]}20`, color: STATUS_COLOR[o.status], border: `1px solid ${STATUS_COLOR[o.status]}40` }}>
                    {STATUS_LABEL[o.status]}
                  </span>
                  <span className="text-[#D4AC0D] text-sm font-bold shrink-0">S/ {Number(o.total).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular dishes */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#E74C3C]" /> Más pedidos
          </p>
          <div className="space-y-3">
            {POPULAR.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-[#404040] text-xs font-mono w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{item.name}</p>
                  <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(item.orders / 47) * 100}%`, background: 'linear-gradient(to right, #C0392B, #E74C3C)' }} />
                  </div>
                </div>
                <span className="text-[#D4AC0D] text-xs font-bold shrink-0">{item.orders}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
