import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CreditCard, Landmark, Check, ShoppingBag, ArrowRight, MessageCircle, Copy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Order } from '../types';
import { GlassCard, PremiumButton, GlassInput } from './DesignSystem';

interface CheckoutViewProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
  onBackToHome: () => void;
}

export default function CheckoutView({
  cartItems,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  onOrderCompleted,
  onBackToCart,
  onBackToHome
}: CheckoutViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info & Address, 2: Payment, 3: Success

  // Customer Info states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Address states
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'mercado_pago'>('pix');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !cep || !street || !number || !neighborhood || !city || !state) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setStep(2);
  };

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    
    // Simulate luxury processing delay (3 seconds)
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedOrderId(orderId);
      setIsSimulatingPayment(false);
      setStep(3);

      const finalOrder: Order = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        address: { cep, street, number, complement, neighborhood, city, state },
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          length: item.selectedLength,
          clasp: item.selectedClasp
        })),
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod,
        status: 'paid',
        date: new Date().toISOString()
      };

      onOrderCompleted(finalOrder);
    }, 3000);
  };

  const handleCopyPix = () => {
    const pixKey = "00020126580014br.gov.bcb.pix0136BodinJoiasChaveFalsaPixDeMoedaAntiga5204000053039865405349.905802BR5916Bodin Joias LTDA6009SAO PAULO62070503***6304D1B5";
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleWhatsAppReceipt = () => {
    const text = `Olá Bodin Jóias! Acabei de realizar o pedido *${generatedOrderId}* no valor de R$ ${total.toFixed(2).replace('.', ',')}. Segue o comprovante para liberação de envio. Obrigado!`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-28 px-4 md:px-8 max-w-4xl mx-auto text-left">
      {/* Step Indicators */}
      {step !== 3 && (
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
          <button
            onClick={step === 2 ? () => setStep(1) : onBackToCart}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-[#DFBA6B] transition-all select-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 2 ? 'Voltar para Cadastro' : 'Voltar para Sacola'}</span>
          </button>

          <div className="flex items-center gap-3 font-sans text-xs">
            <span className={`px-2.5 py-1 rounded-md border ${step === 1 ? 'border-[#DFBA6B] text-white bg-white/10 font-bold' : 'border-zinc-800 text-zinc-600'}`}>
              01 Cadastro
            </span>
            <div className="w-4 h-[1px] bg-zinc-800" />
            <span className={`px-2.5 py-1 rounded-md border ${step === 2 ? 'border-[#DFBA6B] text-white bg-white/10 font-bold' : 'border-zinc-800 text-zinc-600'}`}>
              02 Pagamento
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: Customer Credentials & Delivery Form */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          {/* Form Fields */}
          <form onSubmit={handleInfoSubmit} className="md:col-span-7 flex flex-col gap-6">
            <h2 className="font-serif text-lg text-white font-medium uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DFBA6B]" />
              <span>Dados Pessoais & Entrega</span>
            </h2>

            {/* Part A: Contact info */}
            <div className="flex flex-col gap-4">
              <GlassInput
                label="Nome Completo *"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Marcus Vinícius"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="E-mail principal *"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Ex: marcus@gmail.com"
                />
                <GlassInput
                  label="WhatsApp / Celular *"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 11999998888"
                />
              </div>
            </div>

            {/* Part B: Delivery Address */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#DFBA6B] border-b border-white/5 pb-1">
                Endereço de Entrega das Joias
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassInput
                  label="CEP *"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Ex: 04571-010"
                />
                <div className="sm:col-span-2 flex items-end">
                  <span className="text-[10px] text-zinc-500 font-light leading-snug font-sans pl-1 pb-1">
                    Insira seu CEP brasileiro. Os demais campos de rua, bairro e cidade podem ser preenchidos manualmente abaixo.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <GlassInput
                    label="Logradouro / Rua *"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Avenida Paulista"
                  />
                </div>
                <GlassInput
                  label="Número *"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 1500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Complemento (Apto, Torre, Bloco)"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Ex: Bloco A - Apto 42"
                />
                <GlassInput
                  label="Bairro *"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Bela Vista"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <GlassInput
                    label="Cidade *"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <GlassInput
                  label="Estado *"
                  required
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="Ex: SP"
                />
              </div>
            </div>

            <PremiumButton type="submit" variant="solid" className="py-4 text-xs tracking-widest mt-2 flex items-center justify-center gap-2">
              <span>Continuar para Pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          </form>

          {/* Cart summary panel */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <GlassCard className="p-5 border border-white/5">
              <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-[#DFBA6B] border-b border-white/5 pb-3 mb-4">
                Seu Pedido
              </h3>

              <div className="flex flex-col gap-3 font-sans text-xs pb-4 border-b border-white/5">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-2">
                    <span className="text-zinc-400 font-light truncate max-w-[180px]">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-white font-semibold shrink-0">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 font-sans text-xs py-3 border-b border-white/5">
                <div className="flex justify-between text-zinc-500 font-light">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Cupom ({couponCode}):</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500 font-light">
                  <span>Frete:</span>
                  <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-sans text-white pt-4">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#DFBA6B]">Total:</span>
                <span className="text-lg font-bold text-white font-sans">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Payment Gate Selector & Processing */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          {/* Payment Options Selection */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <h2 className="font-serif text-lg text-white font-medium uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#DFBA6B]" />
              <span>Método de Pagamento Seguro</span>
            </h2>

            {/* Methods Row tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 select-none transition-all duration-300 cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#DFBA6B]/10 flex items-center justify-center text-[#DFBA6B]">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Pix -10%</span>
              </button>

              <button
                onClick={() => setPaymentMethod('credit_card')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 select-none transition-all duration-300 cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#DFBA6B]/10 flex items-center justify-center text-[#DFBA6B]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Cartão 10x</span>
              </button>

              <button
                onClick={() => setPaymentMethod('mercado_pago')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 select-none transition-all duration-300 cursor-pointer ${
                  paymentMethod === 'mercado_pago'
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#DFBA6B]/10 flex items-center justify-center text-[#DFBA6B]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest">M. Pago</span>
              </button>
            </div>

            {/* Render selected Payment Gate */}
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-[20px] card-shadow">
              {/* Option A: PIX (Highly polished interactive QR + simulate) */}
              {paymentMethod === 'pix' && (
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="flex flex-col gap-1 items-center max-w-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                      <Landmark className="w-3 h-3" />
                      <span>Desconto Especial PIX: R$ {(total * 0.1).toFixed(2).replace('.', ',')}</span>
                    </span>
                    <h3 className="font-serif text-md text-white font-medium mt-2">
                      Pague via Pix de Forma Instantânea
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-sans font-light">
                      Escaneie o código QR com o aplicativo de seu banco ou copie e cole a chave Pix abaixo.
                    </p>
                  </div>

                  {/* Geometric Luxury Vector QR Code */}
                  <div className="relative p-3 rounded-2xl bg-white/95 border border-white/10 shadow-2xl flex items-center justify-center w-40 h-40">
                    <svg className="w-full h-full text-zinc-950" viewBox="0 0 100 100" fill="currentColor">
                      {/* Grid Pattern of fake luxury styled QR */}
                      <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                      <rect x="8" y="8" width="14" height="14" fill="#FFFFFF" />
                      <rect x="11" y="11" width="8" height="8" fill="currentColor" />

                      <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                      <rect x="78" y="8" width="14" height="14" fill="#FFFFFF" />
                      <rect x="81" y="11" width="8" height="8" fill="currentColor" />

                      <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                      <rect x="8" y="78" width="14" height="14" fill="#FFFFFF" />
                      <rect x="11" y="81" width="8" height="8" fill="currentColor" />

                      {/* Random pixel-like patterns */}
                      <rect x="35" y="10" width="5" height="15" />
                      <rect x="50" y="5" width="10" height="5" />
                      <rect x="45" y="20" width="15" height="5" />
                      <rect x="65" y="15" width="5" height="10" />

                      <rect x="10" y="35" width="15" height="5" />
                      <rect x="5" y="45" width="5" height="10" />
                      <rect x="20" y="50" width="10" height="15" />

                      <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                      <rect x="40" y="40" width="20" height="20" fill="#FFFFFF" />
                      {/* Diamond inside center of QR for Bodin styling */}
                      <path d="M50 43 L57 50 L50 57 L43 50 Z" fill="#AA7C11" />

                      <rect x="75" y="35" width="10" height="5" />
                      <rect x="85" y="45" width="10" height="15" />
                      <rect x="70" y="60" width="5" height="10" />

                      <rect x="35" y="75" width="15" height="5" />
                      <rect x="45" y="85" width="15" height="10" />
                      <rect x="65" y="70" width="10" height="5" />
                      <rect x="85" y="80" width="10" height="10" />
                    </svg>

                    {/* Ambient scanning laser indicator */}
                    <div className="absolute left-0 right-0 h-0.5 bg-[#DFBA6B] opacity-50 shadow-[0_0_10px_#DFBA6B] animate-bounce top-2" />
                  </div>

                  {/* PIX Key Copia e Cola Copy button */}
                  <div className="flex flex-col w-full max-w-sm gap-2 mt-1">
                    <button
                      onClick={handleCopyPix}
                      className="flex items-center justify-between bg-black/55 border border-white/10 rounded-xl px-4 py-3 text-xs text-white hover:border-[#DFBA6B] transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="truncate pr-4 font-sans max-w-[200px] sm:max-w-none">
                        {pixCopied ? 'Chave Copiada com Sucesso!' : '00020126580014br.gov.bcb.pix...'}
                      </span>
                      <Copy className="w-4 h-4 text-[#DFBA6B]" />
                    </button>
                    
                    <span className="text-[9px] text-zinc-500 font-light font-sans pl-1">
                      Valor com desconto PIX: <strong className="text-emerald-400 font-semibold font-sans">R$ {(total * 0.9).toFixed(2).replace('.', ',')}</strong>
                    </span>
                  </div>

                  {/* Simulated Payment Trigger */}
                  <PremiumButton
                    onClick={handleSimulatePayment}
                    variant="solid"
                    fullWidth={true}
                    className="py-4 text-xs tracking-widest mt-2"
                    disabled={isSimulatingPayment}
                  >
                    {isSimulatingPayment ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-[#0F0F0F]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processando Transação...</span>
                      </div>
                    ) : (
                      <span>Simular Confirmação de Pix</span>
                    )}
                  </PremiumButton>
                </div>
              )}

              {/* Option B: Credit Card form */}
              {paymentMethod === 'credit_card' && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-white font-medium mb-1 uppercase tracking-wider">
                    Dados do Cartão de Crédito
                  </h3>

                  <GlassInput
                    label="Número do Cartão *"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                    placeholder="0000 0000 0000 0000"
                    icon={<CreditCard className="w-4.5 h-4.5" />}
                  />

                  <GlassInput
                    label="Nome Completo (Conforme Impresso) *"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="EX: MARCUS V CASTRO"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <GlassInput
                      label="Validade *"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/'))}
                      placeholder="MM/AA"
                    />
                    <GlassInput
                      label="Código CVV *"
                      required
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                    />
                  </div>

                  <div className="flex flex-col gap-1 bg-white/[0.02] p-3 rounded-xl border border-white/5 text-[10px] text-zinc-400 leading-relaxed font-sans mt-1">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[#DFBA6B] text-[9px] tracking-wider mb-0.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Parcelamento de Luxo</span>
                    </span>
                    <span>Pagamento assegurado com criptografia SSL Bodin. Aceitamos Visa, Mastercard, Amex e Elo em até 10x sem juros de <strong>R$ {(total / 10).toFixed(2).replace('.', ',')}</strong>.</span>
                  </div>

                  <PremiumButton
                    onClick={handleSimulatePayment}
                    variant="solid"
                    fullWidth={true}
                    className="py-4 text-xs tracking-widest mt-2"
                    disabled={isSimulatingPayment}
                  >
                    {isSimulatingPayment ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-[#0F0F0F]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Autorizando Transação...</span>
                      </div>
                    ) : (
                      <span>Autorizar Pagamento de R$ {total.toFixed(2).replace('.', ',')}</span>
                    )}
                  </PremiumButton>
                </div>
              )}

              {/* Option C: Mercado Pago Secure redirect simulator */}
              {paymentMethod === 'mercado_pago' && (
                <div className="flex flex-col items-center text-center gap-5 py-4">
                  <div className="w-12 h-12 rounded-full bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Check className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <h3 className="font-serif text-md text-white font-medium uppercase tracking-wider">
                      Integração Segura Mercado Pago
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-sans font-light leading-relaxed">
                      Ao clicar no botão de finalizar, um link seguro de pagamento será provisionado na infraestrutura oficial para pagar via Cartão ou Boleto com segurança garantida.
                    </p>
                  </div>

                  <PremiumButton
                    onClick={handleSimulatePayment}
                    variant="solid"
                    fullWidth={true}
                    className="py-4 text-xs tracking-widest mt-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-none"
                    disabled={isSimulatingPayment}
                  >
                    {isSimulatingPayment ? (
                      <span>Redirecionando...</span>
                    ) : (
                      <span>Ir Para Checkout Seguro Mercado Pago</span>
                    )}
                  </PremiumButton>
                </div>
              )}
            </div>
          </div>

          {/* Cart summary side panel */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <GlassCard className="p-5">
              <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-white border-b border-white/5 pb-3 mb-4">
                Resumo de Valores
              </h3>

              <div className="flex flex-col gap-2.5 font-sans text-xs pb-4 border-b border-white/5">
                <div className="flex justify-between text-zinc-400 font-light">
                  <span>Subtotal das joias:</span>
                  <span className="text-white font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto Cupom:</span>
                    <span className="font-semibold">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto Adicional Pix (10%):</span>
                    <span className="font-semibold">- R$ {(total * 0.1).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 font-light">
                  <span>Frete selecionado:</span>
                  <span className="text-white font-semibold">{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-sans text-white pt-4">
                <span className="text-xs uppercase tracking-widest font-bold text-[#DFBA6B]">Total Final:</span>
                <span className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                  R$ {paymentMethod === 'pix'
                    ? (total * 0.9).toFixed(2).replace('.', ',')
                    : total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Complete Success Invoice Page */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto flex flex-col items-center justify-center text-center gap-6 pt-6"
        >
          {/* Animated check bubble */}
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Check className="w-10 h-10 stroke-[3.5] animate-[pulse_2s_infinite]" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.3em] text-[#DFBA6B] font-bold uppercase">
              Compra Concluída com Sucesso
            </span>
            <h2 className="font-serif text-3xl text-white font-medium uppercase tracking-wide">
              Seja Bem-vindo à Família Bodin
            </h2>
            <p className="text-xs text-zinc-500 font-light max-w-sm mx-auto leading-relaxed mt-1 font-sans">
              Obrigado pela confiança em nosso alto padrão de joias. Seu pedido foi registrado com sucesso em nossa central e já está entrando no processo de polimento de luxo e empacotamento.
            </p>
          </div>

          {/* Invoice Summary Card */}
          <GlassCard className="p-6 w-full text-left border border-white/10 bg-white/[0.03] flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs text-zinc-300 font-medium uppercase tracking-wider">
                Código do Pedido: <strong>{generatedOrderId}</strong>
              </span>
              <span className="text-[10px] text-zinc-500 font-sans font-light">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>

            {/* Address specs info */}
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-zinc-500 font-light">Destinatário:</span>
              <span className="text-zinc-300 font-medium">{customerName}</span>
              <span className="text-zinc-500 font-light mt-1.5">Endereço de Envio:</span>
              <span className="text-zinc-300 font-medium font-sans">
                {street}, Nº {number} {complement ? `- ${complement}` : ''} <br />
                {neighborhood} — {city}/{state}
              </span>
            </div>

            {/* Total items value summary */}
            <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-[#DFBA6B] font-semibold">Valor Pago:</span>
              <span className="text-lg font-bold font-sans text-white">
                R$ {paymentMethod === 'pix'
                  ? (total * 0.9).toFixed(2).replace('.', ',')
                  : total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </GlassCard>

          {/* Final Actions buttons layout */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <PremiumButton
              onClick={handleWhatsAppReceipt}
              variant="solid"
              fullWidth={true}
              className="py-4 text-xs tracking-widest flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Enviar Recibo WhatsApp</span>
            </PremiumButton>

            <PremiumButton
              onClick={onBackToHome}
              variant="outline"
              fullWidth={true}
              className="py-4 text-xs tracking-widest"
            >
              <span>Voltar à Página Inicial</span>
            </PremiumButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
