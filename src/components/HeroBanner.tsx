import React from 'react';
import { Sparkles, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PremiumButton } from './DesignSystem';

interface HeroBannerProps {
  onExplore: () => void;
  whatsapp?: string;
}

export default function HeroBanner({ onExplore, whatsapp = '5511999999999' }: HeroBannerProps) {
  // WhatsApp direct template link for simulated luxury support
  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Olá! Estou no site da Bodin Jóias e gostaria de falar com um consultor para atendimento personalizado.");
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 md:px-8">
      {/* Cinematic Luxury Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=90"
          alt="Bodin Jóias Premium Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 animate-[pulse_10s_infinite_alternate] opacity-65"
        />
      </div>

      {/* Floating Sparkle Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#AA7C11]/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
        {/* Texts & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex self-start items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5D2A4] text-xs uppercase tracking-[0.25em]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFBA6B] animate-spin" style={{ animationDuration: '4s' }} />
            <span>Coleção Signature 2026</span>
          </motion.div>

          {/* Luxury Main Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-1"
          >
            <span
              className="text-lg md:text-xl font-light text-[#A1A1A6] uppercase tracking-[0.4em]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Joias em Moeda Antiga
            </span>
            <h1
              className="text-4xl md:text-6xl font-serif text-white font-medium tracking-wide uppercase leading-[1.1]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              O Peso da <br />
              <span className="gold-text font-bold">
                Conquista
              </span>
            </h1>
          </motion.div>

          {/* Subtitle / Narrative */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[#A1A1A6] font-sans text-sm md:text-base leading-relaxed max-w-xl font-light"
          >
            A elegância inabalável de peças pesadas de Moeda Antiga banhadas com 10 Milésimos de Ouro 18K. Idênticas ao ouro maciço no peso, na cor e no brilho, combinadas com a garantia vitalícia incomparável da Bodin Jóias.
          </motion.p>

          {/* Direct CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2"
          >
            <PremiumButton onClick={onExplore} variant="solid" className="px-8 py-4 text-xs tracking-widest">
              <span>Conhecer Coleção</span>
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>

            <PremiumButton onClick={handleWhatsAppSupport} variant="outline" className="px-8 py-4 text-xs tracking-widest">
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Atendimento VIP</span>
            </PremiumButton>
          </motion.div>

          {/* Direct Bullet highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex items-center gap-6 mt-4 border-t border-white/5 pt-6 text-[11px] uppercase tracking-widest text-[#A1A1A6] font-light"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#DFBA6B]" />
              <span>Garantia Vitalícia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#DFBA6B]" />
              <span>Ouro 18K Real</span>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Side Panel - Highlight Hero Product Card */}
        <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
            className="relative p-px rounded-xl bg-gradient-to-b from-white/10 to-transparent"
          >
            <div className="rounded-xl bg-white/[0.03] backdrop-blur-[20px] p-4 w-72 card-shadow flex flex-col gap-4 border border-white/5">
              {/* Product preview */}
              <div className="relative rounded-lg overflow-hidden aspect-square border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
                  alt="Grumet Bodin"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <span className="absolute top-2 right-2 bg-black/80 backdrop-blur border border-white/10 text-[#DFBA6B] text-[8px] tracking-widest px-2 py-0.5 rounded-full uppercase font-bold">
                  Mais Vendido
                </span>
              </div>

              {/* Specs info */}
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] tracking-widest text-[#DFBA6B] font-semibold uppercase">
                  Bodin Premium Chains
                </span>
                <h3 className="font-serif text-md text-white font-medium">
                  Corrente Grumet Escamada 8mm
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-md text-white font-semibold font-sans">
                    R$ 349,90
                  </span>
                  <span className="text-xs text-zinc-500 line-through">
                    R$ 499,90
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
