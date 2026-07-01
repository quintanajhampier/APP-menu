'use client';

import { useEffect, useState, useCallback } from 'react';
import { UtensilsCrossed, Bell, CheckCircle2, Clock, Droplets, Coffee, CreditCard, MessageCircle } from 'lucide-react';
import { supabase, type ServiceRequest } from '@/lib/supabase';

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Bell; color: string; bg: string }> = {
  water:      { label: 'Agua',           icon: Droplets,      color: '#3498DB', bg: 'rgba(52,152,219,0.15)'  },
  condiment:  { label: 'Condimento',     icon: Coffee,        color: '#F39C12', bg: 'rgba(243,156,18,0.15)'  },
  waiter:     { label: 'Llamada',        icon: Bell,          color: '#E74C3C', bg: 'rgba(192,57,43,0.2)'    },
  bill:       { label: 'La cuenta',      icon: CreditCard,    color: '#D4AC0D', bg: 'rgba(212,172,13,0.15)'  },
  other:      { label: 'Otro',           icon: MessageCircle, color: '#808080', bg: 'rgba(128,128,128,0.1)'  },
};

function elapsed(created: string) {
  return Math.floor((Date.now() - new Date(created).getTime()) / 60000);
}

export default function WaiterPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<'open' | 'all'>('open');

  const load = useCallback(async () => {
    const q = supabase.from('service_requests').select('*').order('created_at', { ascending: false });
    if (filter === 'open') q.eq('status', 'open');
    const { data } = await q;
    setRequests((data as ServiceRequest[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
    const ch = supabase.channel('waiter-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' },
        (p) => { const r = p.new as ServiceRequest; setRequests((prev) => [r, ...prev]); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_requests' },
        (p) => { const r = p.new as ServiceRequest; setRequests((prev) => filter === 'open' ? prev.filter((x) => x.id !== r.id || r.status === 'open') : prev.map((x) => x.id === r.id ? r : x)); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, filter]);

  const acknowledge = async (id: string) => {
    await supabase.from('service_requests').update({ status: 'acknowledged' }).eq('id', id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'acknowledged' } : r));
  };

  const resolve = async (id: string) => {
    await supabase.from('service_requests').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id);
    setRequests((prev) => filter === 'open' ? prev.filter((r) => r.id !== id) : prev.map((r) => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const openCount = requests.filter((r) => r.status === 'open').length;
  const ackCount  = requests.filter((r) => r.status === 'acknowledged').length;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,172,13,0.15)', border: '1px solid rgba(212,172,13,0.3)' }}>
            <UtensilsCrossed className="w-5 h-5 text-[#D4AC0D]" />
          </div>
          <div>
            <p className="text-xs text-[#D4AC0D] tracking-widest uppercase">Dragon Menu</p>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Panel de Mesero</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {openCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <Bell className="w-4 h-4 text-[#E74C3C]" />
              <span className="text-[#E74C3C] text-sm font-bold">{openCount} pendiente{openCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {ackCount > 0 && (
            <div className="px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(243,156,18,0.15)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.3)' }}>
              {ackCount} en curso
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['open','all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={filter === f
              ? { background: 'linear-gradient(135deg,#C0392B,#922B21)', color: '#fff', boxShadow: '0 0 20px rgba(192,57,43,0.3)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#606060', border: '1px solid rgba(255,255,255,0.1)' }}>
            {f === 'open' ? 'Pendientes' : 'Todos'}
          </button>
        ))}
      </div>

      {/* Requests grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <CheckCircle2 className="w-10 h-10 text-[#27AE60] opacity-40" />
          <p className="text-[#505050] text-sm">Sin solicitudes pendientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => {
            const cfg = TYPE_CONFIG[req.type] ?? TYPE_CONFIG.other;
            const Icon = cfg.icon;
            const min = elapsed(req.created_at);
            const urgent = min > 5 && req.status === 'open';
            return (
              <div key={req.id} className="rounded-2xl p-4 flex flex-col gap-3 transition-all"
                style={{ background: 'rgba(18,10,6,0.95)', border: `1px solid ${urgent ? 'rgba(231,76,60,0.5)' : `${cfg.color}30`}`, boxShadow: urgent ? '0 0 25px rgba(231,76,60,0.2)' : 'none' }}>
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{cfg.label}</p>
                      <p className="text-[#D4AC0D] text-xs font-bold">Mesa #{req.table_number}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={req.status === 'open'
                        ? { background: 'rgba(231,76,60,0.2)', color: '#E74C3C', border: '1px solid rgba(231,76,60,0.4)' }
                        : req.status === 'acknowledged'
                        ? { background: 'rgba(243,156,18,0.2)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.4)' }
                        : { background: 'rgba(39,174,96,0.2)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.4)' }}>
                      {req.status === 'open' ? 'Nuevo' : req.status === 'acknowledged' ? 'En curso' : 'Atendido'}
                    </span>
                    <span className="text-[#505050] text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{min}m{urgent && ' ⚠'}
                    </span>
                  </div>
                </div>

                {req.message && <p className="text-[#808080] text-xs leading-relaxed">{req.message}</p>}

                {/* Actions */}
                {req.status !== 'resolved' && (
                  <div className="flex gap-2 mt-auto">
                    {req.status === 'open' && (
                      <button onClick={() => acknowledge(req.id)}
                        className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{ background: 'rgba(243,156,18,0.2)', color: '#F39C12', border: '1px solid rgba(243,156,18,0.4)' }}>
                        En camino
                      </button>
                    )}
                    <button onClick={() => resolve(req.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-[0.97]"
                      style={{ background: 'rgba(39,174,96,0.8)', boxShadow: '0 4px 12px rgba(39,174,96,0.25)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Atendido
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
