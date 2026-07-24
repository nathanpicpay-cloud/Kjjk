import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, MessageCircle, ShoppingBag, ShieldCheck, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, Review } from '../types';
import { GlassCard, PremiumButton, Badge } from './DesignSystem';

interface ProductDetailsViewProps {
  product: Product;
  isFavorited: boolean;
  whatsapp?: string;
  onToggleFavorite: (e: React.MouseEvent, productId: string) => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  onBack: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailsView({
  product,
  isFavorited,
  whatsapp = '5511999999999',
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  onBack,
  allProducts,
  onSelectProduct
}: ProductDetailsViewProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedLength, setSelectedLength] = useState<string>(product.length[0] || '60cm');
  const [selectedClasp, setSelectedClasp] = useState<string>(product.clasp[0] || 'Gaveta');
  const [reviewFilter, setReviewFilter] = useState<number>(0); // 0 = all
  const [addedToCartToast, setAddedToCartToast] = useState<boolean>(false);

  // New review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);

  const imagesList = [product.image, ...product.secondaryImages];

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    const item: CartItem = {
      product,
      quantity: 1,
      selectedLength,
      selectedClasp
    };
    onAddToCart(item);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const handleBuyNow = () => {
    const item: CartItem = {
      product,
      quantity: 1,
      selectedLength,
      selectedClasp
    };
    onBuyNow(item);
  };

  // WhatsApp individual piece direct template link
  const handleWhatsAppConsult = () => {
    const text = `Olá! Tenho interesse no *${product.name}* (Tamanho: ${selectedLength}, Fecho: ${selectedClasp}) no valor de R$ ${product.price.toFixed(2).replace('.', ',')}. Pode me enviar mais fotos reais?`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const newReview: Review = {
      id: `r-user-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      text: newText,
      date: new Date().toLocaleDateString('pt-BR'),
      verifiedPurchase: true
    };

    setReviewsList([newReview, ...reviewsList]);
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
    setShowReviewForm(false);
  };

  // Filter reviews
  const filteredReviews = reviewFilter === 0
    ? reviewsList
    : reviewsList.filter(r => r.rating === reviewFilter);

  // Filter related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToCartToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-xl bg-black/85 border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11] flex items-center justify-center text-black">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Adicionado à Sacola com Sucesso!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back header navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-[#E5D2A4]/60 hover:text-[#DFBA6B] active:scale-95 transition-all select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Catálogo</span>
        </button>

        <button
          onClick={(e) => onToggleFavorite(e, product.id)}
          className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:text-red-500 hover:border-red-500/20 transition-all active:scale-90"
          title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4.5 h-4.5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Premium Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Main Display Image */}
          <GlassCard className="p-2 aspect-square max-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl relative">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-110"
            />
            
            {/* Ambient luxury glint */}
            <div className="absolute top-4 left-4">
              <Badge variant="gold">
                Banho Ouro 18K
              </Badge>
            </div>
          </GlassCard>

          {/* Thumbnail Selectors */}
          {imagesList.length > 1 && (
            <div className="flex gap-3">
              {imagesList.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
                    selectedImage === img
                      ? 'border-[#DFBA6B] ring-1 ring-[#DFBA6B]/30'
                      : 'border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Configuration */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          {/* Main specs intro */}
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-widest text-[#DFBA6B] font-semibold uppercase">
              Bodin Joalheria
            </span>
            <h1 className="font-serif text-2xl md:text-3xl text-white font-medium tracking-wide uppercase leading-tight">
              {product.name}
            </h1>
            
            {/* Reviews Summary */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#DFBA6B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-[#DFBA6B] text-[#DFBA6B]' : 'text-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-sans pl-1">
                {product.rating} ({reviewsList.length} avaliações de compradores)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-2xl font-bold font-sans text-white">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Em até <span className="text-[#DFBA6B] font-medium">10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')}</span> sem juros no cartão de crédito ou com <span className="text-emerald-400 font-medium">10% de desconto adicional</span> via PIX.
            </p>
          </div>

          {/* Selector 1: Length */}
          {product.length.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A6] pl-1">
                Selecionar Comprimento: <span className="text-white font-sans">{selectedLength}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.length.map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-5 py-2.5 rounded-lg border text-xs font-sans tracking-wide transition-all duration-300 cursor-pointer ${
                      selectedLength === len
                        ? 'bg-white/10 border-white/20 text-white font-semibold'
                        : 'border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector 2: Clasp Type */}
          {product.clasp.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A6] pl-1">
                Selecionar Fecho de Luxo: <span className="text-white font-sans">{selectedClasp}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.clasp.map((clp) => (
                  <button
                    key={clp}
                    onClick={() => setSelectedClasp(clp)}
                    className={`px-5 py-2.5 rounded-lg border text-xs tracking-wide transition-all duration-300 cursor-pointer ${
                      selectedClasp === clp
                        ? 'bg-white/10 border-white/20 text-white font-semibold'
                        : 'border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {clp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Call-to-actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <PremiumButton
              onClick={handleBuyNow}
              variant="solid"
              className="flex-1 py-4 text-xs tracking-widest"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar Agora</span>
            </PremiumButton>

            <PremiumButton
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 py-4 text-xs tracking-widest"
            >
              <span>Adicionar à Sacola</span>
            </PremiumButton>
          </div>

          {/* Direct Consult on WhatsApp */}
          <PremiumButton
            onClick={handleWhatsAppConsult}
            variant="outline"
            className="border-[#128C7E]/40 text-[#25D366] hover:bg-[#25D366]/5 hover:border-[#25D366] py-3.5 text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span>Tirar dúvidas por WhatsApp</span>
          </PremiumButton>

          {/* Technical Specifications Specs Grid */}
          <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#DFBA6B]">
              Especificações Técnicas da Peça
            </h4>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
              <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-light">Material Base:</span>
                <span className="text-zinc-300 font-medium">Moeda Antiga Premium</span>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-light">Espessura / Elos:</span>
                <span className="text-zinc-300 font-medium">{product.thickness}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-light">Camada de Ouro:</span>
                <span className="text-zinc-300 font-medium">10 Milésimos 18K Real</span>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 font-light">Faixa de Peso:</span>
                <span className="text-zinc-300 font-medium">{product.weight}</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1 bg-white/[0.02] p-3.5 rounded-xl border border-white/5 mt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#DFBA6B] font-semibold uppercase tracking-wider">
                   <ShieldCheck className="w-4 h-4" />
                   <span>Selo Garantia Eterna Bodin</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed pl-5.5 font-light">
                   Sua joia nunca mudará de col. A moeda antiga é um metal eterno que brilha infinitamente, necessitando apenas de limpeza periódica simples (com xampu e vinagre) para restaurar o brilho dourado metálico original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative block */}
      <GlassCard className="p-6 md:p-8 text-left flex flex-col gap-4 mt-4">
        <h3 className="font-serif text-lg text-[#DFBA6B] tracking-wider uppercase font-medium">
          Descrição da Joia
        </h3>
        <p className="text-zinc-300 text-sm leading-relaxed font-light font-sans whitespace-pre-line">
          {product.description}
        </p>
      </GlassCard>

      {/* Interactive Reviews Logger */}
      <div className="border-t border-white/5 pt-10 flex flex-col gap-6 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-xl text-white font-medium uppercase tracking-wider">
              Avaliações de Clientes
            </h3>
            <p className="text-xs text-zinc-500 font-light">
              Depoimentos reais de quem adquiriu a joia Bodin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PremiumButton
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
              className="py-2.5 px-5 text-xs tracking-wider"
            >
              <span>{showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}</span>
            </PremiumButton>

            {/* Stars Selector Filter */}
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(Number(e.target.value))}
              className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-medium outline-none focus:border-[#DFBA6B] cursor-pointer"
            >
              <option value="0">Todas Estrelas</option>
              <option value="5">5 Estrelas</option>
              <option value="4">4 Estrelas</option>
              <option value="3">3 Estrelas</option>
            </select>
          </div>
        </div>

        {/* Review Input Form Panel */}
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddReview}
            className="p-6 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-4 max-w-xl card-shadow"
          >
            <h4 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold">
              Nova Avaliação da Joia
            </h4>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium pl-1">Seu Nome:</span>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ex: Gustavo Lima"
                className="bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#DFBA6B] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium pl-1">Nota:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        star <= newRating ? 'fill-[#DFBA6B] text-[#DFBA6B]' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium pl-1">Sua Mensagem:</span>
              <textarea
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Conte o que achou da joia, peso, brilho e qualidade..."
                rows={3}
                className="bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#DFBA6B] transition-all font-sans resize-none"
              />
            </div>

            <PremiumButton type="submit" variant="solid" className="py-2.5 text-xs self-start">
              <span>Publicar Avaliação</span>
            </PremiumButton>
          </motion.form>
        )}

        {/* Reviews Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <GlassCard key={review.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90">
                    {review.author}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans">
                    {review.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#DFBA6B]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating ? 'fill-[#DFBA6B] text-[#DFBA6B]' : 'text-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded-full uppercase border border-emerald-500/10">
                      Compra Verificada
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                  "{review.text}"
                </p>
              </GlassCard>
            ))
          ) : (
            <p className="text-xs text-zinc-500 font-light col-span-2 py-4">
              Nenhuma avaliação registrada com {reviewFilter} estrelas para esta joia.
            </p>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-white/5 pt-10 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-1">
            <h3 className="font-serif text-xl text-white font-medium uppercase tracking-wider">
              Aproveite Para Combinar
            </h3>
            <p className="text-xs text-zinc-500 font-light">
              Monte um conjunto exclusivo Bodin Signature.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <GlassCard
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  setSelectedImage(p.image);
                  setSelectedLength(p.length[0] || '60cm');
                  setSelectedClasp(p.clasp[0] || 'Gaveta');
                  setReviewsList(p.reviews);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                hoverEffect={true}
                className="group flex flex-col justify-between h-full p-4"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-950/20 rounded-xl border border-white/5">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col gap-2 pt-3">
                  <span className="text-[9px] tracking-widest text-[#DFBA6B] font-semibold uppercase text-left">
                    Conjunto Sugerido
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm text-white/90 line-clamp-1 text-left font-medium">
                    {p.name}
                  </h4>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold font-sans text-white">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-zinc-500 hover:text-[#DFBA6B] transition-colors uppercase tracking-wider font-medium">
                      Ver Peça →
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
