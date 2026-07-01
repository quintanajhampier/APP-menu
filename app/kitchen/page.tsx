'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChefHat, Flame, Clock, CheckCircle2, Plus } from 'lucide-react';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';

type KanbanStatus = 'pending' | 'preparing' | 'ready';

const COLS: { status: KanbanStatus; label: string; color: string; bg: string; next: KanbanStatus | null; nextLabel: string }[] = [
  { status: 'pending',   label: 'Nuevos pedidos', color: '#E74C3C', bg: 'rgba(192,57,43,0.15)',  next: 'preparing', nextLabel: 'Iniciar' },
  { status: 'preparing', label: 'En preparación', color: '#F39C12', bg: 'rgba(243,156,18,0.15)', next: 'ready',     nextLabel: 'Marcar listo' },
  { status: 'ready',     label: 'Listos',          color: '#27AE60', bg: 'rgba(39,174,96,0.15)',  next: null,        nextLabel: '' },
];

function elapsed(created: string) {
  return Math.floor((Date.now() - new Date(created).getTime()) / 60000);
}

export default function KitchenPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing', 'ready'])
      .order('created_at', { ascending: true });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel('kitchen-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' },
        (p) => { const o = p.new as Order; if (['pending','preparing','ready'].includes(o.status)) setOrders((prev) => [...prev, o]); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' },
        (p) => {
          const o = p.new as Order;
          if (['pending','preparing','ready'].includes(o.status)) {
            setOrders((prev) => { const idx = prev.findIndex((x) => x.id === o.id); if (idx >= 0) { const n = [...prev]; n[idx] = o; return n; } return [...prev, o]; });
          } else {
            setOrders((prev) => prev.filter((x) => x.id !== o.id));
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const advance = async (order: Order, nextStatus: KanbanStatus) => {
    const { data } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', order.id)
      .select()
      .single();
    if (data) setOrders((prev) => prev.map((o) => o.id === order.id ? data as Order : o));
  };

  const markDelivered = async (order: Order) => {
    await supabase.from('orders').update({ status: 'delivered' }).eq('id', order.id);
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
  };

  // Seed a demo order
  const addDemo = async () => {
    const demos = [
      { table_number: Math.ceil(Math.random() * 12), status: 'pending' as const, items: [{ name: 'Chaufa Imperial Dragon', qty: 2, price: 52 }, { name: 'Wantán Frito', qty: 1, price: 18 }], subtotal: 122, total: 134.2, notes: '' },
    ];
    const { data } = await supabase.from('orders').insert(demos[0]).select().single();
    if (data) setOrders((prev) => [...prev, data as Order]);
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)' }}>
            <ChefHat className="w-5 h-5 text-[#E74C3C]" />
          </div>
          <div>
            <p className="text-xs text-[#D4AC0D] tracking-widest uppercase">Dragon Menu</p>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Panel de Cocina</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <Flame className="w-4 h-4 text-[#E74C3C]" />
              <span className="text-[#E74C3C] text-sm font-bold">{pendingCount} nuevos</span>
            </div>
          )}
          <button onClick={addDemo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(212,172,13,0.15)', border: '1px solid rgba(212,172,13,0.3)', color: '#D4AC0D' }}>
            <Plus className="w-3.5 h-3.5" /> Simular pedido
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status}>
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: col.bg, border: `1px solid ${col.color}40` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                <span className="text-white font-semibold text-sm">{col.label}</span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: col.color }}>{colOrders.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {loading && colOrders.length === 0 ? (
                  <div className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
                ) : colOrders.length === 0 ? (
                  <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}>
                    <p className="text-[#404040] text-sm">Sin pedidos</p>
                  </div>
                ) : colOrders.map((order) => {
                  const min = elapsed(order.created_at);
                  const urgent = min > 15;
                  return (
                    <div key={order.id} className="rounded-2xl p-4" style={{ background: 'rgba(18,10,6,0.95)', border: `1px solid ${urgent ? 'rgba(231,76,60,0.4)' : `${col.color}25`}`, boxShadow: urgent ? '0 0 20px rgba(231,76,60,0.15)' : 'none' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AC0D] font-bold text-sm">Mesa #{order.table_number}</span>
                          {urgent && <Flame className="w-3.5 h-3.5 text-[#E74C3C]" />}
                        </div>
                        <span className="text-xs text-[#606060] flex items-center gap-1">
                          <Clock className="w-3 h-3" />{min}m
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        {(Array.isArray(order.items) ? order.items : []).map((item: OrderItem, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: col.bg, color: col.color, border: `1px solid ${col.color}50` }}>{item.qty}</span>
                            <span className="text-white text-sm">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && <p className="text-[#606060] text-xs mb-3 italic">{order.notes}</p>}

                      <div className="flex gap-2">
                        {col.next && (
                          <button onClick={() => advance(order, col.next!)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-[0.97]"
                            style={{ background: col.color, boxShadow: `0 4px 12px ${col.color}40` }}>
                            <CheckCircle2 className="w-3.5 h-3.5" />{col.nextLabel}
                          </button>
                        )}
                        {col.status === 'ready' && (
                          <button onClick={() => markDelivered(order)}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-[0.97]"
                            style={{ background: 'rgba(52,152,219,0.8)', boxShadow: '0 4px 12px rgba(52,152,219,0.3)' }}>
                            Entregado ✓
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
