import React from 'react';
import { ShoppingBag, Search, ShieldCheck, Heart, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
  favoritesCount: number;
}

export default function Navbar({
  currentView,
  onNavigate,
  cartCount,
  favoritesCount
}: NavbarProps) {
  const navItems = [
    { view: 'home' as ViewState, label: 'Início' },
    { view: 'catalog' as ViewState, label: 'Catálogo' },
    { view: 'admin' as ViewState, label: 'Dashboard', icon: LayoutDashboard }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
      {/* Brand Logo & Name */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2.5 group focus:outline-none focus:ring-0 active:scale-95 transition-transform"
      >
        <Logo size="sm" showSub={false} />
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg tracking-[0.2em] uppercase font-light gold-text">
            Bodin
          </span>
          <span className="text-[8px] tracking-[0.4em] uppercase font-light text-[#A1A1A6]">
            Jóias
          </span>
        </div>
      </button>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className="relative py-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer select-none"
            >
              <span className={isActive ? 'text-white' : 'text-[#A1A1A6] hover:text-white transition-colors'}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Icons (Cart, Favorites, Premium Stamp) */}
      <div className="flex items-center gap-4">
        {/* Trust/Premium seal badge for luxury feel */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white text-[9px] uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA6B]" />
          <span>Garantia Eterna</span>
        </div>

        {/* Favorites button */}
        <button
          onClick={() => onNavigate('catalog')} // Navigate to catalog (which has a filters tab)
          className="relative p-2.5 text-[#A1A1A6] hover:text-[#DFBA6B] active:scale-90 transition-all rounded-full hover:bg-white/[0.05]"
          title="Ver Favoritos"
        >
          <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#DFBA6B] text-[#DFBA6B]' : ''}`} />
          {favoritesCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 gold-gradient text-black text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-black"
            >
              {favoritesCount}
            </motion.span>
          )}
        </button>

        {/* Cart button */}
        <button
          onClick={() => onNavigate('cart')}
          className="relative p-2.5 text-[#A1A1A6] hover:text-[#DFBA6B] active:scale-90 transition-all rounded-full hover:bg-white/[0.05]"
          title="Sacola de Compras"
        >
          <ShoppingBag className={`w-5 h-5 ${cartCount > 0 ? 'text-[#DFBA6B]' : ''}`} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 gold-gradient text-black text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-black"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
