'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, LayoutGrid,
  Settings, ChefHat, Waves, LogOut, Menu, X,
} from 'lucide-react';

const NAV = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard',    exact: true },
  { href: '/admin/menu',     icon: UtensilsCrossed, label: 'Carta / Menú', exact: false },
  { href: '/admin/tables',   icon: LayoutGrid,      label: 'Mesas',        exact: false },
  { href: '/admin/settings', icon: Settings,        label: 'Configuración',exact: false },
];

const TOOLS = [
  { href: '/kitchen', icon: ChefHat, label: 'Cocina' },
  { href: '/waiter',  icon: Waves,   label: 'Meseros' },
];

function logout() {
  localStorage.removeItem('dragon_admin_session');
  window.location.reload();
}

export default function AdminSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? path === href : path.startsWith(href);

  const NavItem = ({ href, icon: Icon, label, exact = false }: { href: string; icon: typeof LayoutDashboard; label: string; exact?: boolean }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
      style={
        isActive(href, exact)
          ? { background: 'rgba(192,57,43,0.2)', color: '#F5F5F5', border: '1px solid rgba(192,57,43,0.4)' }
          : { color: '#606060', border: '1px solid transparent' }
      }
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: isActive(href, exact) ? '#E74C3C' : '#505050' }} />
      <span>{label}</span>
      {isActive(href, exact) && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E74C3C]" />
      )}
    </Link>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 mb-8">
        <div className="relative w-8 h-8 shrink-0">
          <Image src="/images/Gemini_Generated_Image_ytneqnytneqnytne-removebg-preview.png" alt="Dragon" fill style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(192,57,43,0.6))' }} />
        </div>
        <div>
          <p className="text-[#D4AC0D] font-bold text-sm leading-none">Dragon Menu</p>
          <p className="text-[#404040] text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Main nav */}
      <p className="text-[#404040] text-[10px] tracking-widest uppercase px-3 mb-2">Principal</p>
      <nav className="space-y-1 mb-6">
        {NAV.map((item) => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* Tools */}
      <p className="text-[#404040] text-[10px] tracking-widest uppercase px-3 mb-2">Paneles operativos</p>
      <nav className="space-y-1 mb-auto">
        {TOOLS.map((item) => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* Logout */}
      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#505050] hover:text-[#E74C3C] hover:bg-[rgba(192,57,43,0.1)] transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(18,10,6,0.9)', border: '1px solid rgba(212,172,13,0.2)' }}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed left-0 top-0 bottom-0 z-50 w-64 md:hidden transition-transform duration-300"
        style={{
          background: 'rgba(12,7,4,0.98)',
          border: '1px solid rgba(212,172,13,0.15)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-[#505050] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen"
        style={{ background: 'rgba(12,7,4,0.98)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
