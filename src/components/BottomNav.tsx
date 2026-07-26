import React from 'react';
import { Home, Gem, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: any) => void;
  cartCount: number;
  showOnlyFavorites?: boolean;
}

export default function BottomNav({ currentView, onNavigate, cartCount, showOnlyFavorites = false }: BottomNavProps) {
  const tabs = [
    { view: 'home' as ViewState, label: 'Início', icon: Home },
    { view: 'catalog' as ViewState, label: 'Catálogo', icon: Gem },
    { view: 'favorites', label: 'Favoritos', icon: Heart },
    { view: 'cart' as ViewState, label: 'Sacola', icon: ShoppingBag, badge: cartCount }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
      {/* Tab Container */}
      <nav className="pointer-events-auto mx-auto max-w-sm h-16 rounded-2xl bg-[#0F0F0F]/80 border border-[#D4AF37]/15 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = tab.view === 'favorites'
            ? (currentView === 'catalog' && showOnlyFavorites)
            : (tab.view === 'catalog'
                ? (currentView === 'catalog' && !showOnlyFavorites) || currentView === 'product_details'
                : currentView === tab.view);

          const IconComponent = tab.icon;

          return (
            <button
              key={tab.view}
              onClick={() => onNavigate(tab.view)}
              className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer select-none focus:outline-none focus:ring-0 active:scale-90 transition-transform"
            >
              {/* Highlight background pill for active tab */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-x-2 inset-y-1.5 rounded-xl bg-gradient-to-r from-[#DFBA6B]/10 to-[#AA7C11]/10 border border-[#DFBA6B]/15"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              {/* Icon & Badge */}
              <div className="relative">
                <IconComponent
                  className={`w-5.5 h-5.5 transition-colors duration-300 ${
                    isActive
                      ? 'text-[#DFBA6B]'
                      : 'text-[#E5D2A4]/50'
                  }`}
                />
                
                {/* Badge Count */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11] text-[#0F0F0F] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#0F0F0F]"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] tracking-wider mt-1 transition-colors duration-300 font-medium ${
                  isActive ? 'text-[#F9E4B7] font-semibold' : 'text-[#E5D2A4]/40'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
