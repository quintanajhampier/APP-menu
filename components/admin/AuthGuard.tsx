'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_KEY = 'dragon_admin_session';
const ADMIN_PASS = 'dragon2024';

interface AuthGuardProps { children: React.ReactNode; }

export default function AuthGuard({ children }: AuthGuardProps) {
  const [authed, setAuthed]     = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setAuthed(!!localStorage.getItem(ADMIN_KEY));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASS) {
        localStorage.setItem(ADMIN_KEY, 'true');
        setAuthed(true);
      } else {
        setError('Contraseña incorrecta. Intenta de nuevo.');
      }
      setLoading(false);
    }, 600);
  };

  if (authed === null) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-8 h-8 rounded-full border-2 border-[#D4AC0D] border-t-transparent animate-spin" />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
      {/* bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,20,10,0.2) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-sm rounded-3xl p-8" style={{ background: 'rgba(18,10,6,0.95)', border: '1px solid rgba(212,172,13,0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 mb-4">
            <Image src="/images/Gemini_Generated_Image_ytneqnytneqnytne-removebg-preview.png" alt="Dragon" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(192,57,43,0.7))' }} />
          </div>
          <p className="text-[10px] text-[#D4AC0D] tracking-[0.3em] uppercase mb-1">Dragon Menu</p>
          <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Panel de Administración</h1>
          <p className="text-[#606060] text-xs mt-1">Acceso restringido — solo personal autorizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[#808080] text-xs tracking-wider uppercase block mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505050]" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: error ? '1px solid rgba(192,57,43,0.6)' : '1px solid rgba(255,255,255,0.1)', caretColor: '#D4AC0D' }}
                autoFocus
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {show ? <EyeOff className="w-4 h-4 text-[#505050]" /> : <Eye className="w-4 h-4 text-[#505050]" />}
              </button>
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-[#E74C3C] text-xs mt-2">
                <AlertCircle className="w-3.5 h-3.5" />{error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', boxShadow: '0 8px 25px rgba(192,57,43,0.35)' }}
          >
            {loading ? 'Verificando...' : 'Ingresar al panel'}
          </button>
        </form>

        <p className="text-center text-[#404040] text-xs mt-6">
          Demo: contraseña es <span className="text-[#D4AC0D] font-mono">dragon2024</span>
        </p>
      </div>
    </div>
  );

  return <>{children}</>;
}
