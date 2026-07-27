import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Tag, Truck, ShieldCheck, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../types';
import { GlassCard, PremiumButton, GlassInput } from './DesignSystem';
import { INITIAL_COUPONS } from '../data';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, change: number) => void;
  onRemoveItem: (index: number) => void;
  onContinueShopping: () => void;
  onCheckout: (subtotal: number, discount: number, shipping: number, total: number, couponCode?: string) => void;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onCheckout
}: CartViewProps) {
  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<boolean>(false);

  // Shipping state
  const [cepInput, setCepInput] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<'pac' | 'sedex'>('pac');
  const [shippingCalculated, setShippingCalculated] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingLabel, setShippingLabel] = useState<string>('Calcule acima');

  // Math totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculations
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discount = subtotal * (activeCoupon.value / 100);
    } else {
      discount = activeCoupon.value;
    }
  }

  // Calculate final totals
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const foundCoupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.toUpperCase() && c.active
    );

    if (foundCoupon) {
      setActiveCoupon(foundCoupon);
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setActiveCoupon(null);
      setCouponError('Cupom inválido ou expirado.');
      setCouponSuccess(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponSuccess(false);
    setCouponInput('');
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.replace(/\D/g, '').length !== 8) {
      alert('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    setShippingCalculated(true);
    // Simulate premium shipping structures
    if (shippingMethod === 'pac') {
      setShippingCost(0);
      setShippingLabel('PAC - Grátis (7 a 10 dias úteis)');
    } else {
      setShippingCost(29.90);
      setShippingLabel('Sedex VIP Bodin - R$ 29,90 (2 a 4 dias úteis com embalagem de veludo)');
    }
  };

  const handleShippingMethodChange = (method: 'pac' | 'sedex') => {
    setShippingMethod(method);
    if (shippingCalculated) {
      if (method === 'pac') {
        setShippingCost(0);
        setShippingLabel('PAC - Grátis (7 a 10 dias úteis)');
      } else {
        setShippingCost(29.90);
        setShippingLabel('Sedex VIP Bodin - R$ 29,90 (2 a 4 dias úteis com embalagem de veludo)');
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    onCheckout(subtotal, discount, shippingCost, total, activeCoupon?.code);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-40 px-4 max-w-lg mx-auto flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#DFBA6B] animate-pulse">
          <ShoppingBag className="w-7 h-7" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <h2 className="font-serif text-2xl text-white font-medium uppercase tracking-wide">
            Sua Sacola Está Vazia
          </h2>
          <p className="text-xs text-zinc-500 font-light font-sans max-w-xs leading-relaxed">
            Selecione joias premium banhadas a Ouro 18K em nosso catálogo para preencher seu carrinho de luxo.
          </p>
        </div>

        <PremiumButton onClick={onContinueShopping} variant="solid" className="py-3 px-8 text-xs tracking-widest mt-2">
          <span>Explorar Catálogo</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8 text-left">
      {/* Return to catalog button header */}
      <div>
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5D2A4]/60 hover:text-[#DFBA6B] transition-colors select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuar Comprando</span>
        </button>
      </div>

      <h1 className="font-serif text-2xl md:text-3xl text-white font-medium uppercase tracking-wider mb-2">
        Sua Sacola de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Section: Items List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {cartItems.map((item, index) => (
            <GlassCard key={`${item.product.id}-${index}`} className="p-4 flex gap-4 items-center">
              {/* Product mini image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info, quantities and actions */}
              <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] tracking-widest text-[#DFBA6B] font-semibold uppercase">
                      {item.product.category === 'correntes' ? 'Corrente' : 'Pulseira'}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm text-white font-medium truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                      Comp: <span className="text-white font-medium">{item.selectedLength}</span> • Fecho: <span className="text-white font-medium">{item.selectedClasp}</span>
                    </p>
                  </div>

                  {/* Trash action button */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all active:scale-90 select-none shrink-0"
                    title="Excluir Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Adjust quantities and final item subtotal */}
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5">
                  <div className="flex items-center gap-1.5 bg-zinc-950/60 rounded-xl border border-zinc-900 p-1">
                    {/* Decrease */}
                    <button
                      onClick={() => onUpdateQuantity(index, -1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    {/* Value */}
                    <span className="text-xs font-semibold font-sans text-white px-2.5">
                      {item.quantity}
                    </span>
                    {/* Increase */}
                    <button
                      onClick={() => onUpdateQuantity(index, 1)}
                      className="p-1 text-zinc-500 hover:text-white active:scale-90 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal representing value */}
                  <span className="text-sm font-bold font-sans text-white">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Right Section: Discount Coupon, Shipping & Financial Checkout Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Section: Discount Coupon */}
          <GlassCard className="p-5">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#DFBA6B] mb-3.5 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Possui Cupom de Desconto?</span>
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <GlassInput
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Ex: BODIN10"
                className="py-2.5 uppercase font-sans tracking-widest text-xs"
                disabled={!!activeCoupon}
              />
              <PremiumButton
                type="submit"
                variant={activeCoupon ? 'outline' : 'solid'}
                className="py-2.5 px-4 text-xs tracking-widest shrink-0"
                disabled={!!activeCoupon && !couponInput}
              >
                <span>Aplicar</span>
              </PremiumButton>
            </form>

            <AnimatePresence>
              {couponError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400 mt-2 pl-1 font-sans"
                >
                  {couponError}
                </motion.p>
              )}
              {couponSuccess && activeCoupon && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl mt-3 text-xs text-emerald-400"
                >
                  <span className="flex items-center gap-1.5 font-sans">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    Cupom <strong>{activeCoupon.code}</strong> ativo
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="underline text-[10px] hover:text-white uppercase tracking-wider font-semibold focus:outline-none cursor-pointer"
                  >
                    Remover
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Section: Shipping CEP */}
          <GlassCard className="p-5">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#DFBA6B] mb-3.5 flex items-center gap-2">
              <Truck className="w-4.5 h-4.5" />
              <span>Simular Envio / Frete</span>
            </h3>

            <div className="flex gap-3 mb-3.5 border-b border-white/5 pb-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                <input
                  type="radio"
                  checked={shippingMethod === 'pac'}
                  onChange={() => handleShippingMethodChange('pac')}
                  className="accent-[#DFBA6B] cursor-pointer"
                />
                <span className={shippingMethod === 'pac' ? 'text-white font-semibold' : ''}>PAC (Grátis)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                <input
                  type="radio"
                  checked={shippingMethod === 'sedex'}
                  onChange={() => handleShippingMethodChange('sedex')}
                  className="accent-[#DFBA6B] cursor-pointer"
                />
                <span className={shippingMethod === 'sedex' ? 'text-white font-semibold' : ''}>Sedex Luxo</span>
              </label>
            </div>

            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <GlassInput
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Ex: 01310-100"
                className="py-2.5 font-sans text-xs tracking-wider"
              />
              <PremiumButton
                type="submit"
                variant="outline"
                className="py-2.5 px-4 text-xs tracking-widest shrink-0"
              >
                <span>Calcular</span>
              </PremiumButton>
            </form>

            {shippingCalculated && (
              <p className="text-[11px] text-zinc-300 mt-2.5 pl-1 font-sans flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#DFBA6B] shrink-0" />
                <span>{shippingLabel}</span>
              </p>
            )}
          </GlassCard>

          {/* Section: Receipt Checkout Summary */}
          <GlassCard className="p-6 border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
            <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-white border-b border-white/5 pb-3 mb-4">
              Resumo do Pedido
            </h3>

            <div className="flex flex-col gap-3 font-sans text-xs pb-4 border-b border-white/5">
              {/* Subtotal */}
              <div className="flex justify-between text-zinc-400 font-light">
                <span>Subtotal dos itens:</span>
                <span className="text-white font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {/* Discount Coupon applied */}
              {activeCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto cupom ({activeCoupon.code}):</span>
                  <span className="font-semibold">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              {/* Shipping calculated */}
              <div className="flex justify-between text-zinc-400 font-light">
                <span>Taxa de Envio:</span>
                {shippingCalculated ? (
                  <span className="text-white font-semibold">
                    {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                ) : (
                  <span className="text-zinc-600">Calcule acima</span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline font-sans text-white pt-4 pb-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#DFBA6B]">
                Valor Total:
              </span>
              <span className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Installments info tag */}
            <div className="text-right text-[10px] text-zinc-500 font-light pb-6">
              ou em até <span className="text-[#DFBA6B] font-medium">10x de R$ {(total / 10).toFixed(2).replace('.', ',')}</span> sem juros
            </div>

            {/* Final CTA Buttons */}
            <PremiumButton
              onClick={handleProceedToCheckout}
              variant="solid"
              fullWidth={true}
              className="py-4 text-xs tracking-widest flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>Ir Para O Pagamento</span>
            </PremiumButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
