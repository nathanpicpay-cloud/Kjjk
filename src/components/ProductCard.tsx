import React from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { GlassCard, Badge, PremiumButton } from './DesignSystem';

interface ProductCardProps {
  product: Product;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent, productId: string) => void;
  onClick: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({
  product,
  isFavorited,
  onToggleFavorite,
  onClick
}: ProductCardProps) {
  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <GlassCard
      onClick={() => onClick(product)}
      hoverEffect={true}
      className="group flex flex-col justify-between h-full w-full max-w-[340px] sm:max-w-none"
    >
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950/20 rounded-t-xl border-b border-white/5">
        {/* Hover image scale parallax */}
        <motion.img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient on bottom of Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <Badge variant="gold">
              Destaque
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="new">
              Lançamento
            </Badge>
          )}
          {discountPercent > 0 && (
            <Badge variant="discount">
              -{discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button Trigger */}
        <button
          onClick={(e) => onToggleFavorite(e, product.id)}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:text-red-500 hover:border-red-500/30 active:scale-90 transition-all backdrop-blur-md"
          title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 ${
              isFavorited ? 'fill-red-500 text-red-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Information Section */}
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-1.5 text-left">
          {/* Category Tag */}
          <span className="text-[10px] tracking-widest text-[#DFBA6B] font-semibold uppercase">
            {product.category === 'correntes' ? 'Corrente Premium' : product.category === 'pulseiras' ? 'Pulseira Nobre' : 'Anel Exclusivo'}
          </span>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base text-white/90 group-hover:text-[#DFBA6B] transition-colors line-clamp-2 min-h-[2.8rem] font-medium leading-snug">
            {product.name}
          </h3>

          {/* Plating Specification Short */}
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-light line-clamp-1">
            {product.plating.split('(')[0].trim()}
          </p>
        </div>

        {/* Rating and Price layout */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
          {/* Rating reviews stars summary */}
          <div className="flex items-center gap-1">
            <div className="flex text-[#DFBA6B]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-[#DFBA6B] text-[#DFBA6B]' : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400 font-sans font-medium pl-1">
              {product.rating} <span className="text-zinc-600 font-light">({product.reviewsCount})</span>
            </span>
          </div>

          {/* Pricing Details */}
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[11px] text-zinc-500 line-through font-sans">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-base sm:text-lg font-bold font-sans text-white tracking-tight">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Installments calculation representation */}
            <span className="text-[10px] text-zinc-400 font-light text-right">
              ou 10x de <span className="text-[#DFBA6B] font-medium">R$ {(product.price / 10).toFixed(2).replace('.', ',')}</span>
            </span>
          </div>
        </div>

        {/* View Details Action Trigger */}
        <PremiumButton
          variant="outline"
          fullWidth={true}
          className="mt-2 py-2 text-xs tracking-wider"
        >
          <span>Ver Detalhes</span>
        </PremiumButton>
      </div>
    </GlassCard>
  );
}
