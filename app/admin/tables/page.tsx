'use client';

import { useEffect, useState } from 'react';
import { QrCode, Users } from 'lucide-react';
import { supabase, type Order } from '@/lib/supabase';

const TOTAL_TABLES = 16;

export default function TablesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('orders').select('*').in('status', ['pending','preparing','ready']);
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    };
    load();
    const ch = supabase.channel('tables-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const tableStatus = (num: number) => {
    const tableOrders = orders.filter((o) => o.table_number === num);
    if (!tableOrders.length) return 'available';
    if (tableOrders.some((o) => o.status === 'pending')) return 'pending';
    if (tableOrders.some((o) => o.status === 'preparing')) return 'preparing';
    return 'ready';
  };

  const STATUS = {
    available: { label: 'Libre',     color: '#27AE60', bg: 'rgba(39,174,96,0.12)',   border: 'rgba(39,174,96,0.25)' },
    pending:   { label: 'Nuevo ped.', color: '#E74C3C', bg: 'rgba(192,57,43,0.2)',   border: 'rgba(192,57,43,0.5)' },
    preparing: { label: 'Cocinando', color: '#F39C12', bg: 'rgba(243,156,18,0.15)',  border: 'rgba(243,156,18,0.35)' },
    ready:     { label: 'Listo',     color: '#3498DB', bg: 'rgba(52,152,219,0.12)',  border: 'rgba(52,152,219,0.3)' },
  };

  const stats = [
    { label: 'Libres',      count: Array.from({ length: TOTAL_TABLES }, (_, i) => tableStatus(i + 1)).filter((s) => s === 'available').length, color: '#27AE60' },
    { label: 'Ocupadas',    count: orders.length > 0 ? Array.from(new Set(orders.map((o) => o.table_number))).length : 0, color: '#E74C3C' },
    { label: 'Pedido listo',count: Array.from({ length: TOTAL_TABLES }, (_, i) => tableStatus(i + 1)).filter((s) => s === 'ready').length, color: '#3498DB' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Mesas</h1>
        <p className="text-[#505050] text-sm mt-1">Estado en tiempo real · {TOTAL_TABLES} mesas en total</p>
      </div>

      <div className="flex gap-4">
        {stats.map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[#808080] text-sm">{label}: <strong className="text-white">{loading ? '—' : count}</strong></span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {Array.from({ length: TOTAL_TABLES }, (_, i) => {
          const num = i + 1;
          const st = loading ? 'available' : tableStatus(num);
          const cfg = STATUS[st];
          const tableOrders = orders.filter((o) => o.table_number === num);
          return (
            <div key={num} className="rounded-2xl p-3 flex flex-col items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: st !== 'available' ? `0 0 16px ${cfg.color}20` : 'none' }}>
              <div className="flex items-center justify-between w-full">
                <span className="text-white font-bold text-sm">#{num}</span>
                {st !== 'available' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />}
              </div>
              <Users className="w-5 h-5" style={{ color: cfg.color }} />
              <span className="text-[10px] font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
              {tableOrders.length > 0 && (
                <span className="text-[10px] text-[#606060]">S/ {tableOrders.reduce((s, o) => s + Number(o.total), 0).toFixed(0)}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* QR generation hint */}
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(212,172,13,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212,172,13,0.1)' }}>
          <QrCode className="w-5 h-5 text-[#D4AC0D]" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Códigos QR por mesa</p>
          <p className="text-[#505050] text-xs mt-0.5">
            Cada mesa tiene su URL: <span className="text-[#D4AC0D] font-mono">/mesa/[numero]</span> — genera QR con cualquier herramienta online apuntando a esa URL.
          </p>
        </div>
      </div>
    </div>
  );
}
