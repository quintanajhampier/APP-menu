'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/menu-data';

const EMPTY = { name: '', description: '', price: '', category_id: CATEGORIES[0].id, image_url: '', available: true };

export default function AdminMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const flash = (msg: string, type: 'ok' | 'err') => {
    type === 'ok' ? setSuccess(msg) : setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return setError('Nombre y precio son requeridos.');
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), tags: [] };

    if (editId) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editId);
      if (err) { flash('Error al actualizar el plato.', 'err'); }
      else {
        setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, ...payload } : p));
        flash('Plato actualizado correctamente.', 'ok');
        setEditId(null); setForm(EMPTY);
      }
    } else {
      const { data, error: err } = await supabase.from('products').insert(payload).select().single();
      if (err || !data) { flash('Error al guardar el plato.', 'err'); }
      else {
        setProducts((prev) => [data as Product, ...prev]);
        flash('Plato agregado al menú.', 'ok');
        setForm(EMPTY);
      }
    }
    setSaving(false);
  };

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, price: String(p.price), category_id: p.category_id, image_url: p.image_url, available: p.available });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este plato?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    flash('Plato eliminado.', 'ok');
  };

  const field = (key: keyof typeof EMPTY, label: string, el: 'input' | 'textarea' = 'input', extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="text-[#808080] text-xs tracking-wider uppercase block mb-1.5">{label}</label>
      {el === 'textarea' ? (
        <textarea value={form[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' }} />
      ) : (
        <input value={form[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' }}
          {...extra} />
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
          {editId ? 'Editar plato' : 'Carta / Menú'}
        </h1>
        <p className="text-[#505050] text-sm mt-1">Gestiona los platos del menú digital</p>
      </div>

      {/* Feedback */}
      {(success || error) && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: success ? 'rgba(39,174,96,0.12)' : 'rgba(192,57,43,0.12)', border: `1px solid ${success ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}`, color: success ? '#27AE60' : '#E74C3C' }}>
          {success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {success || error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(212,172,13,0.15)' }}>
        <p className="text-white font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#D4AC0D]" />{editId ? 'Modificar plato' : 'Agregar nuevo plato'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('name', 'Nombre del plato')}
          <div>
            <label className="text-[#808080] text-xs tracking-wider uppercase block mb-1.5">Precio (S/)</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' }} />
          </div>
        </div>
        {field('description', 'Descripción', 'textarea')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[#808080] text-xs tracking-wider uppercase block mb-1.5">Categoría</label>
            <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none appearance-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#808080] text-xs tracking-wider uppercase block mb-1.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> URL de imagen</label>
            <input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://images.pexels.com/..."
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' }} />
          </div>
        </div>

        {/* Preview */}
        {form.image_url && (
          <div className="w-24 h-24 rounded-xl overflow-hidden">
            <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
              className="w-10 h-5 rounded-full relative transition-colors cursor-pointer"
              style={{ background: form.available ? '#27AE60' : 'rgba(255,255,255,0.1)' }}>
              <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow"
                style={{ transform: form.available ? 'translateX(20px)' : 'translateX(2px)' }} />
            </div>
            <span className="text-sm" style={{ color: form.available ? '#27AE60' : '#606060' }}>
              {form.available ? 'Disponible' : 'No disponible'}
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', boxShadow: '0 6px 20px rgba(192,57,43,0.3)' }}>
            {saving ? 'Guardando...' : editId ? 'Actualizar plato' : 'Agregar al menú'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }}
              className="px-6 py-2.5 rounded-xl text-[#808080] text-sm font-medium transition-all hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white font-semibold mb-4">Platos registrados <span className="text-[#505050] text-sm font-normal">({products.length})</span></p>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}</div>
        ) : products.length === 0 ? (
          <p className="text-[#404040] text-sm text-center py-8">No hay platos. Agrega el primero.</p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => {
              const cat = CATEGORIES.find((c) => c.id === p.category_id);
              return (
                <div key={p.id} className="flex items-center gap-3 px-3 py-3 rounded-xl group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: 'rgba(212,172,13,0.1)' }}>{cat?.icon ?? '🍽'}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[#505050] text-xs">{cat?.name} · S/ {Number(p.price).toFixed(2)}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: p.available ? 'rgba(39,174,96,0.15)' : 'rgba(255,255,255,0.05)', color: p.available ? '#27AE60' : '#505050' }}>
                    {p.available ? 'Activo' : 'Oculto'}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(212,172,13,0.15)] transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-[#D4AC0D]" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(192,57,43,0.15)] transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-[#E74C3C]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
