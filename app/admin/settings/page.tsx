'use client';

import { useState } from 'react';
import { Save, Store, Palette, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [name,    setName]    = useState('Dragon Menu – Miraflores');
  const [address, setAddress] = useState('Av. Benavides 1432, Miraflores');
  const [phone,   setPhone]   = useState('+51 1 234-5678');
  const [tables,  setTables]  = useState('16');
  const [saved,   setSaved]   = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all";
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' };
  const label = (txt: string) => <label className="text-[#808080] text-xs tracking-wider uppercase block mb-1.5">{txt}</label>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Configuración</h1>
        <p className="text-[#505050] text-sm mt-1">Ajustes generales del restaurante</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Restaurant info */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold flex items-center gap-2"><Store className="w-4 h-4 text-[#D4AC0D]" /> Información del local</p>
          <div>
            {label('Nombre del restaurante')}
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            {label('Dirección')}
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Teléfono')}
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
            <div>
              {label('Número de mesas')}
              <input type="number" value={tables} onChange={(e) => setTables(e.target.value)} className={inputCls} style={inputStyle} min="1" max="100" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold flex items-center gap-2"><Palette className="w-4 h-4 text-[#D4AC0D]" /> Apariencia del menú</p>
          <div className="flex gap-3">
            {['#C0392B','#D4AC0D','#27AE60','#2980B9','#8E44AD'].map((c, i) => (
              <button key={c} type="button" className="w-10 h-10 rounded-full transition-all hover:scale-110"
                style={{ background: c, outline: i === 0 ? `3px solid ${c}` : 'none', outlineOffset: '2px' }} />
            ))}
          </div>
          <p className="text-[#404040] text-xs">La personalización de paleta estará disponible en la versión Pro.</p>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-[#D4AC0D]" /> Notificaciones</p>
          {[
            { label: 'Nuevo pedido recibido', on: true },
            { label: 'Pedido listo en cocina', on: true },
            { label: 'Solicitud de mozo',      on: true },
            { label: 'Solicitud de cuenta',    on: false },
          ].map(({ label: lbl, on }) => (
            <div key={lbl} className="flex items-center justify-between">
              <span className="text-white text-sm">{lbl}</span>
              <div className="w-10 h-5 rounded-full relative cursor-pointer" style={{ background: on ? '#27AE60' : 'rgba(255,255,255,0.1)' }}>
                <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: on ? 'translateX(20px)' : 'translateX(2px)' }} />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all"
          style={{ background: saved ? 'rgba(39,174,96,0.8)' : 'linear-gradient(135deg,#C0392B,#922B21)', boxShadow: '0 6px 20px rgba(192,57,43,0.3)' }}>
          <Save className="w-4 h-4" />
          {saved ? '¡Configuración guardada!' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
