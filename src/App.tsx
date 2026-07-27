import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, MessageCircle, ShieldCheck, Sparkles, Lock, CreditCard, ArrowRight, Search, SlidersHorizontal, Heart, Trash2, Award, Truck, Check } from 'lucide-react';

import { Product, CartItem, Order, Coupon, ViewState, AppSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, SYSTEM_BENEFITS } from './data';

// Import Custom Crafted Components
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailsView from './components/ProductDetailsView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import AdminView from './components/AdminView';
import AdminLogin from './components/AdminLogin';
import { GlobalKeyframes, GlassCard, PremiumButton, GlassInput, Badge } from './components/DesignSystem';

export default function App() {
  // --- Persistent Local States (Acting like an integrated Supabase replica db) ---
  const [currentView, _setCurrentView] = useState<ViewState>(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase();
    
    const isAuthed = sessionStorage.getItem('bodin_admin_auth') === 'true';
    const isAllowedLogin = sessionStorage.getItem('bodin_allowed_login_access') === 'true';

    if (path === '/painel-privado-bodin-joias' || path.startsWith('/painel-privado-bodin-joias/') || hash === '#/painel-privado-bodin-joias' || hash === '#painel-privado-bodin-joias' || hash.startsWith('#/painel-privado-bodin-joias/') || hash.startsWith('#painel-privado-bodin-joias/')) {
      if (isAuthed || isAllowedLogin) {
        return 'admin';
      } else {
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', '/');
        }
        return 'home';
      }
    }
    if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin' || hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
      // Quietly clean up the url to protect admin discovery
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/');
      }
      return 'home';
    }
    if (path === '/cart' || hash === '#/cart' || hash === '#cart') return 'cart';
    if (path === '/checkout' || hash === '#/checkout' || hash === '#checkout') return 'checkout';
    if (path === '/catalog' || hash === '#/catalog' || hash === '#catalog') return 'catalog';
    if (path === '/product_details' || hash === '#/product_details' || hash === '#product_details') return 'product_details';
    return 'home';
  });

  const setCurrentView = (view: ViewState) => {
    _setCurrentView(view);
    const mappedPath = view === 'admin' ? 'painel-privado-bodin-joias' : view;
    const path = view === 'home' ? '/' : `/${mappedPath}`;
    const hash = view === 'home' ? '' : `#/${mappedPath}`;
    
    if (window.location.pathname !== path) {
      window.history.pushState({ view }, '', path);
    }
    
    // Also update Hash to support both routing methods seamlessly (especially useful on static hosts like Vercel)
    if (view !== 'home' && window.location.hash !== hash) {
      window.location.hash = hash;
    } else if (view === 'home' && window.location.hash) {
      window.history.pushState({ view }, '', '/');
    }
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bodin_admin_auth') === 'true';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('bodin_settings');
    return saved ? JSON.parse(saved) : {
      whatsapp: '5511999999999',
      cepOrigem: '04571-010',
      minFreteGratis: 250.00
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bodin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bodin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('bodin_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bodin_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bodin_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Checkout totals carried over from Cart
  const [checkoutTotals, setCheckoutTotals] = useState<{
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    couponCode?: string;
  } | null>(null);

  // --- Filtering & Searching Catalog States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'correntes' | 'pulseiras' | 'aneis'>('todos');
  const [sizeFilter, setSizeFilter] = useState('todos');
  const [sortOption, setSortOption] = useState<'default' | 'price_asc' | 'price_desc' | 'popular'>('default');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated premium high-speed loading shimmer effect on filters or route navigation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [categoryFilter, sizeFilter, sortOption, showOnlyFavorites, currentView]);

  // --- Synchronization effects with localStorage ---
  useEffect(() => {
    localStorage.setItem('bodin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bodin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bodin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('bodin_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('bodin_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bodin_settings', JSON.stringify(settings));
  }, [settings]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Dynamic SEO Robots meta tag injection for admin security and preventing indexation
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    
    if (currentView === 'admin') {
      meta.setAttribute('content', 'noindex, nofollow');
    } else {
      meta.setAttribute('content', 'index, follow');
    }
  }, [currentView]);

  // Synchronize view state with browser routing (popstate and hashchange)
  useEffect(() => {
    const handleRoutingChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      
      const isAuthed = sessionStorage.getItem('bodin_admin_auth') === 'true';
      const isAllowedLogin = sessionStorage.getItem('bodin_allowed_login_access') === 'true';

      if (path === '/painel-privado-bodin-joias' || path.startsWith('/painel-privado-bodin-joias/') || hash === '#/painel-privado-bodin-joias' || hash === '#painel-privado-bodin-joias' || hash.startsWith('#/painel-privado-bodin-joias/') || hash.startsWith('#painel-privado-bodin-joias/')) {
        if (isAuthed || isAllowedLogin) {
          _setCurrentView('admin');
        } else {
          window.history.replaceState({}, '', '/');
          _setCurrentView('home');
        }
      } else if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin' || hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
        window.history.replaceState({}, '', '/');
        _setCurrentView('home');
      } else if (path === '/cart' || hash === '#/cart' || hash === '#cart') {
        _setCurrentView('cart');
      } else if (path === '/checkout' || hash === '#/checkout' || hash === '#checkout') {
        _setCurrentView('checkout');
      } else if (path === '/catalog' || hash === '#/catalog' || hash === '#catalog') {
        _setCurrentView('catalog');
      } else if (path === '/product_details' || hash === '#/product_details' || hash === '#product_details') {
        _setCurrentView('product_details');
      } else {
        _setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleRoutingChange);
    window.addEventListener('hashchange', handleRoutingChange);
    return () => {
      window.removeEventListener('popstate', handleRoutingChange);
      window.removeEventListener('hashchange', handleRoutingChange);
    };
  }, []);

  // --- Operations / Mutations ---
  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Find matching item by same ID, length and clasp type
      const matchIdx = prev.findIndex(
        (ci) =>
          ci.product.id === item.product.id &&
          ci.selectedLength === item.selectedLength &&
          ci.selectedClasp === item.selectedClasp
      );

      if (matchIdx > -1) {
        const updated = [...prev];
        updated[matchIdx].quantity += item.quantity;
        return updated;
      } else {
        return [...prev, item];
      }
    });
  };

  const handleBuyNow = (item: CartItem) => {
    handleAddToCart(item);
    // Directly calculate subtotal & checkout values
    const subtotal = item.product.price * item.quantity;
    setCheckoutTotals({
      subtotal,
      discount: 0,
      shipping: 0,
      total: subtotal
    });
    setCurrentView('checkout');
  };

  const handleUpdateCartQuantity = (index: number, change: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, updated[index].quantity + change);
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckoutTransition = (
    subtotal: number,
    discount: number,
    shipping: number,
    total: number,
    couponCode?: string
  ) => {
    setCheckoutTotals({ subtotal, discount, shipping, total, couponCode });
    setCurrentView('checkout');
  };

  const handleOrderCompleted = (completedOrder: Order) => {
    setOrders((prev) => [completedOrder, ...prev]);
    setCart([]); // Reset Cart
  };

  // --- Administrative Backoffice Handlers ---
  const handleAdminAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleAdminUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleAdminDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleAdminAddCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const handleAdminToggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleAdminUpdateSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
  };

  // --- Filter Catalog Engine Logic ---
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'todos' ? true : product.category === categoryFilter;

    const matchesSize =
      sizeFilter === 'todos' ? true : product.length.includes(sizeFilter);

    const matchesFavorite = showOnlyFavorites ? favorites.includes(product.id) : true;

    return matchesSearch && matchesCategory && matchesSize && matchesFavorite;
  });

  // Sort Engine
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'popular') return b.rating - a.rating;
    return 0; // default
  });

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 3);
  const newReleases = products.filter((p) => p.isNew).slice(0, 3);

  // Direct contact consult links
  const handleWhatsAppGeneral = () => {
    const text = "Olá! Gostaria de falar com o consultor de vendas da Bodin Jóias para ver fotos reais de peças e tirar dúvidas.";
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased pb-20 md:pb-0 flex flex-col justify-between">
      {/* Global CSS keyframes for shimmer animations */}
      <GlobalKeyframes />

      {/* Elegant Glass Header/Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'favorites') {
            setShowOnlyFavorites(true);
            setCurrentView('catalog');
          } else {
            if (view === 'catalog') {
              setShowOnlyFavorites(false);
            }
            setCurrentView(view);
          }
          setSelectedProduct(null);
        }}
        cartCount={cart.reduce((acc, ci) => acc + ci.quantity, 0)}
        favoritesCount={favorites.length}
      />

      {/* Main Container Views Slider */}
      <main className="flex-1 w-full bg-[#050505]">
        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {currentView === 'home' && !selectedProduct && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroBanner
                onExplore={(targetView) => {
                  setSelectedProduct(null);
                  if (targetView === 'home' || targetView === 'catalog' || targetView === 'cart' || targetView === 'checkout' || targetView === 'admin') {
                    setCurrentView(targetView);
                  } else {
                    setCurrentView('catalog');
                  }
                }}
                whatsapp={settings.whatsapp}
                banners={settings.homepageBanners}
              />

              {/* Section: Category highlights */}
              <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto text-center flex flex-col gap-10">
                <div className="flex flex-col gap-1.5 items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFBA6B] font-bold">Tá de responsa</span>
                  <h2
                    className="text-2xl md:text-3.5xl font-serif text-white font-medium uppercase tracking-wide leading-snug"
                    style={{ fontFamily: 'Playfair Display, Cormorant Garamond, Georgia, serif' }}
                  >
                    As Peças Que Impõem Respeito
                  </h2>
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFBA6B] to-transparent mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Category 1 */}
                  <GlassCard
                    onClick={() => {
                      setCategoryFilter('correntes');
                      setCurrentView('catalog');
                    }}
                    hoverEffect={true}
                    className="p-1 aspect-[4/3] relative rounded-2xl group cursor-pointer overflow-hidden border border-[#D4AF37]/10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent z-10 rounded-xl" />
                    <div className="absolute bottom-5 left-5 right-5 z-20 text-left flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#DFBA6B] font-bold">
                        Pesada viu
                      </span>
                      <h3 className="font-serif text-lg text-white font-medium uppercase tracking-wide">
                        Correntes de Moeda Antiga
                      </h3>
                    </div>
                  </GlassCard>

                  {/* Category 2 */}
                  <GlassCard
                    onClick={() => {
                      setCategoryFilter('pulseiras');
                      setCurrentView('catalog');
                    }}
                    hoverEffect={true}
                    className="p-1 aspect-[4/3] relative rounded-2xl group cursor-pointer overflow-hidden border border-[#D4AF37]/10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent z-10 rounded-xl" />
                    <div className="absolute bottom-5 left-5 right-5 z-20 text-left flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#DFBA6B] font-bold">
                        Quem conhece sabe
                      </span>
                      <h3 className="font-serif text-lg text-white font-medium uppercase tracking-wide">
                        Pulseiras no Grau
                      </h3>
                    </div>
                  </GlassCard>

                  {/* Category 3 */}
                  <GlassCard
                    onClick={() => {
                      setCategoryFilter('aneis');
                      setCurrentView('catalog');
                    }}
                    hoverEffect={true}
                    className="p-1 aspect-[4/3] relative rounded-2xl group cursor-pointer overflow-hidden border border-[#D4AF37]/10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
                      alt=""
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent z-10 rounded-xl" />
                    <div className="absolute bottom-5 left-5 right-5 z-20 text-left flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#DFBA6B] font-bold">
                        É outro nível
                      </span>
                      <h3 className="font-serif text-lg text-white font-medium uppercase tracking-wide">
                        Anéis de Respeito
                      </h3>
                    </div>
                  </GlassCard>
                </div>
              </section>

              {/* Section: Best Sellers Spotlight */}
              <section className="py-16 bg-gradient-to-b from-zinc-950 to-[#050505] border-y border-white/5 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFBA6B] font-bold">O homem fica no grau</span>
                      <h2
                        className="text-2xl md:text-3xl font-serif text-white font-medium uppercase tracking-wider"
                        style={{ fontFamily: 'Playfair Display, Cormorant Garamond, Georgia, serif' }}
                      >
                        Diferenciadas Que Quem Vê, Respeita
                      </h2>
                    </div>

                    <PremiumButton
                      onClick={() => {
                        setSortOption('popular');
                        setCurrentView('catalog');
                      }}
                      variant="text"
                      className="text-xs tracking-widest font-semibold flex items-center self-start gap-1 p-0.5 select-none"
                    >
                      <span>Ver Todas As Correntes</span>
                      <ArrowRight className="w-4 h-4" />
                    </PremiumButton>
                  </div>

                  {/* Best sellers slider grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bestSellers.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorited={favorites.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={(p) => {
                          setSelectedProduct(p);
                          setCurrentView('product_details');
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Section: Trust Badges / Benefits */}
              <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SYSTEM_BENEFITS.map((benefit, idx) => (
                    <GlassCard key={idx} className="p-6 flex flex-col gap-3.5 border border-[#D4AF37]/15">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFBA6B]/20 to-[#AA7C11]/5 border border-[#DFBA6B]/30 flex items-center justify-center text-[#DFBA6B]">
                        {benefit.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                        {benefit.icon === 'Award' && <Award className="w-5 h-5" />}
                        {benefit.icon === 'Truck' && <Truck className="w-5 h-5" />}
                        {benefit.icon === 'MessageCircle' && <MessageCircle className="w-5 h-5" />}
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <h3 className="font-serif text-sm uppercase tracking-wider font-semibold text-white">
                          {benefit.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {/* Section: Direct consult call */}
              <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
                <GlassCard className="p-8 md:p-12 relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#DFBA6B]/5 rounded-full filter blur-[100px] pointer-events-none" />
                  
                  <div className="relative z-10 max-w-2xl flex flex-col gap-6 text-left">
                    <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFBA6B]/15 border border-[#DFBA6B]/40 text-[#DFBA6B] text-[9.5px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Chama No Grau
                    </span>

                    <h2
                      className="text-3xl md:text-4xl font-serif text-white font-medium uppercase tracking-wide leading-tight"
                      style={{ fontFamily: 'Playfair Display, Cormorant Garamond, Georgia, serif' }}
                    >
                      Chama no WhatsApp VIP <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFBA6B] via-[#F9E4B7] to-[#AA7C11]">
                        e Garanta a Sua
                      </span>
                    </h2>

                    <p className="text-xs md:text-sm text-zinc-400 font-light font-sans leading-relaxed">
                      Quer ver o brilho de verdade e o peso real da peça no pescoço? Nossos consultores estão de prontidão para te mandar vídeos reais direto no zap. Aqui não tem conversa, o atendimento é diferenciado para quem gosta de andar alinhado.
                    </p>

                    <PremiumButton
                      onClick={handleWhatsAppGeneral}
                      variant="solid"
                      className="self-start py-4 px-8 text-xs tracking-widest bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 border-none shadow-none text-white flex items-center gap-2"
                    >
                      <MessageCircle className="w-4.5 h-4.5" />
                      <span>Chama no WhatsApp e escolhe a sua</span>
                    </PremiumButton>
                  </div>
                </GlassCard>
              </section>
            </motion.div>
          )}

          {/* CATALOG VIEW */}
          {currentView === 'catalog' && !selectedProduct && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8 text-left"
            >
              {/* Heading Catalog introduction */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs tracking-widest text-[#DFBA6B] font-semibold uppercase">
                  Bodin Premium Catalog
                </span>
                <h1 className="font-serif text-2xl md:text-3xl text-white font-medium uppercase tracking-wider">
                  Coleção de Moeda Antiga
                </h1>
                <p className="text-xs text-zinc-500 font-light max-w-lg leading-relaxed">
                  Utilize as ferramentas de busca e filtros refinados para selecionar joias polidas banhadas a Ouro 18K.
                </p>
              </div>

              {/* Filters / Search Bar row */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Text search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DFBA6B]/50 w-4.5 h-4.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por grumet, elos, pulseira, aro..."
                    className="w-full bg-white/[0.02] border border-white/8 rounded-xl px-11 py-3.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#DFBA6B] focus:ring-1 focus:ring-[#DFBA6B]/30 transition-all font-sans"
                  />
                </div>

                {/* Filter toggle and Favorite indicators */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all duration-300 ${
                      showOnlyFavorites
                        ? 'bg-[#DFBA6B]/10 border-[#DFBA6B]/40 text-white'
                        : 'bg-white/[0.02] border-white/8 text-[#A1A1A6] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>Favoritos ({favorites.length})</span>
                  </button>

                  <button
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all duration-300 ${
                      showFiltersPanel
                        ? 'bg-[#DFBA6B]/10 border-[#DFBA6B]/40 text-white'
                        : 'bg-white/[0.02] border-white/8 text-[#A1A1A6] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#DFBA6B]" />
                    <span>Filtros Refinados</span>
                  </button>
                </div>
              </div>

              {/* Expandable Refined Filter Panel */}
              <AnimatePresence>
                {showFiltersPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs backdrop-blur-[20px] card-shadow">
                      {/* Filter category */}
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-[#DFBA6B] uppercase tracking-widest pl-1">Filtrar Categoria:</span>
                        <div className="flex flex-col gap-1">
                          {['todos', 'correntes', 'pulseiras', 'aneis'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setCategoryFilter(cat as any)}
                              className={`text-left py-1.5 px-3 rounded-lg transition-colors font-sans capitalize cursor-pointer ${
                                categoryFilter === cat
                                  ? 'bg-white/10 text-white font-semibold'
                                  : 'text-[#A1A1A6] hover:text-white'
                              }`}
                            >
                              {cat === 'todos' ? 'Todas Peças' : cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filter lengths */}
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-[#DFBA6B] uppercase tracking-widest pl-1">Filtrar Medidas:</span>
                        <div className="flex flex-col gap-1">
                          {['todos', '60cm', '70cm', '80cm', '19cm', '21cm', 'Aro 22', 'Aro 24'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setSizeFilter(size)}
                              className={`text-left py-1.5 px-3 rounded-lg transition-colors font-sans capitalize cursor-pointer ${
                                sizeFilter === size
                                  ? 'bg-white/10 text-white font-semibold'
                                  : 'text-[#A1A1A6] hover:text-white'
                              }`}
                            >
                              {size === 'todos' ? 'Todas Medidas' : size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sorting filter options */}
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-[#DFBA6B] uppercase tracking-widest pl-1">Ordenar Vistas:</span>
                        <div className="flex flex-col gap-1">
                          {[
                            { id: 'default', label: 'Ordenação Padrão' },
                            { id: 'price_asc', label: 'Preço: Menor para Maior' },
                            { id: 'price_desc', label: 'Preço: Maior para Menor' },
                            { id: 'popular', label: 'Mais Avaliados / Populares' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setSortOption(opt.id as any)}
                              className={`text-left py-1.5 px-3 rounded-lg transition-colors font-sans cursor-pointer ${
                                sortOption === opt.id
                                  ? 'bg-white/10 text-white font-semibold'
                                  : 'text-[#A1A1A6] hover:text-white'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic catalog listing grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center w-full">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 p-5 flex flex-col gap-4 w-full max-w-[340px] sm:max-w-none">
                      <div className="relative aspect-square w-full rounded-xl bg-zinc-900/50 border border-zinc-800/40 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="relative h-3 w-1/3 rounded bg-zinc-900/50 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                        <div className="relative h-5 w-4/5 rounded bg-zinc-900/50 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                        <div className="relative h-3.5 w-2/3 rounded bg-zinc-900/50 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div className="flex flex-col gap-1 w-1/2">
                          <div className="relative h-2.5 w-1/2 rounded bg-zinc-900/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                          </div>
                          <div className="relative h-4.5 w-4/5 rounded bg-zinc-900/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                        <div className="relative h-3.5 w-1/3 rounded bg-zinc-900/50 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                      <div className="relative h-10 w-full rounded bg-zinc-900/50 overflow-hidden mt-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center w-full">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorited={favorites.includes(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(p) => {
                        setSelectedProduct(p);
                        setCurrentView('product_details');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-4 w-full">
                  <span className="text-zinc-600 font-sans text-xs">
                    Nenhuma joia encontrada correspondente aos seus filtros.
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('todos');
                      setSizeFilter('todos');
                      setSortOption('default');
                      setShowOnlyFavorites(false);
                    }}
                    className="text-[#DFBA6B] text-xs font-semibold uppercase tracking-widest underline cursor-pointer"
                  >
                    Resetar Filtros
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* DYNAMIC VIEW FOR PRODUCT DETAILS SHEET */}
          {selectedProduct && currentView === 'product_details' && (
            <motion.div
              key="product_details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductDetailsView
                product={selectedProduct}
                isFavorited={favorites.includes(selectedProduct.id)}
                whatsapp={settings.whatsapp}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onBack={() => {
                  setSelectedProduct(null);
                  setCurrentView('catalog');
                }}
                allProducts={products}
                onSelectProduct={setSelectedProduct}
              />
            </motion.div>
          )}

          {/* BASKET / SHOPPING CART VIEW */}
          {currentView === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CartView
                cartItems={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onContinueShopping={() => setCurrentView('catalog')}
                onCheckout={handleCheckoutTransition}
              />
            </motion.div>
          )}

          {/* SECURE CHECKOUT EXPERIMENTAL SHEET */}
          {currentView === 'checkout' && checkoutTotals && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CheckoutView
                cartItems={cart}
                subtotal={checkoutTotals.subtotal}
                discount={checkoutTotals.discount}
                shipping={checkoutTotals.shipping}
                total={checkoutTotals.total}
                couponCode={checkoutTotals.couponCode}
                settings={settings}
                onOrderCompleted={handleOrderCompleted}
                onBackToCart={() => setCurrentView('cart')}
                onBackToHome={() => {
                  setSelectedProduct(null);
                  setCurrentView('home');
                }}
              />
            </motion.div>
          )}

          {/* ADMIN MANAGEMENT BACKOFFICE DASHBOARD */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isAdminAuthenticated ? (
                <AdminView
                  products={products}
                  orders={orders}
                  coupons={coupons}
                  settings={settings}
                  onAddProduct={handleAdminAddProduct}
                  onUpdateProduct={handleAdminUpdateProduct}
                  onUpdateOrderStatus={handleAdminUpdateOrderStatus}
                  onDeleteProduct={handleAdminDeleteProduct}
                  onAddCoupon={handleAdminAddCoupon}
                  onToggleCoupon={handleAdminToggleCoupon}
                  onUpdateSettings={handleAdminUpdateSettings}
                  onLogout={() => {
                    setIsAdminAuthenticated(false);
                    sessionStorage.removeItem('bodin_admin_auth');
                    sessionStorage.removeItem('bodin_allowed_login_access');
                  }}
                  onReorderProducts={setProducts}
                />
              ) : (
                <AdminLogin
                  onSuccess={() => {
                    setIsAdminAuthenticated(true);
                    sessionStorage.setItem('bodin_admin_auth', 'true');
                  }}
                  onCancel={() => {
                    sessionStorage.removeItem('bodin_allowed_login_access');
                    setCurrentView('home');
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* iOS Translucent Bottom Tab Bar for Mobile layout */}
      <BottomNav
        currentView={currentView}
        showOnlyFavorites={showOnlyFavorites}
        onNavigate={(view) => {
          if (view === 'favorites') {
            setShowOnlyFavorites(true);
            setCurrentView('catalog');
          } else {
            if (view === 'catalog') {
              setShowOnlyFavorites(false);
            }
            setCurrentView(view);
          }
          setSelectedProduct(null);
        }}
        cartCount={cart.reduce((acc, ci) => acc + ci.quantity, 0)}
      />

      {/* Premium Luxury Footer signature for the Bodin brand */}
      <footer className="border-t border-white/5 bg-black py-12 px-4 md:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 text-left">
          {/* Informações da loja Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" showSub={false} />
              <div className="flex flex-col">
                <span className="font-serif text-md tracking-[0.25em] uppercase font-light gold-text">
                  Bodin
                </span>
                <span className="text-[7.5px] tracking-[0.45em] uppercase font-light text-[#A1A1A6]">
                  Jóias
                </span>
              </div>
            </div>
            
            <p className="text-zinc-500 font-light leading-relaxed max-w-sm">
              Criando peças de moeda antiga de prestígio inabalável e banhos de Ouro 18K espessos. Feito para quem valoriza a presença e o brilho eterno de uma alta joalheria.
            </p>
          </div>

          {/* Contato & Redes sociais Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#DFBA6B]">Atendimento & Redes</h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsAppGeneral}
                className="text-zinc-500 hover:text-[#F9E4B7] text-left flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp VIP</span>
              </button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-[#F9E4B7] flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram Oficial</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-2 text-zinc-600 text-[10px] mt-2">
              <span className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 flex items-center gap-1 select-none">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pix Seguro</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 flex items-center gap-1 select-none">
                <CreditCard className="w-3.5 h-3.5 text-[#DFBA6B]" />
                <span>SSL Criptografado</span>
              </span>
            </div>
          </div>

          {/* Políticas & Navegação Column */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#DFBA6B]">Joalheria</h4>
              <button onClick={() => { setCurrentView('home'); setSelectedProduct(null); }} className="text-zinc-500 hover:text-[#F9E4B7] text-left transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">Página Inicial</button>
              <button onClick={() => { setCurrentView('catalog'); setSelectedProduct(null); }} className="text-zinc-500 hover:text-[#F9E4B7] text-left transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">Catálogo de Joias</button>
              <button onClick={() => setCurrentView('cart')} className="text-zinc-500 hover:text-[#F9E4B7] text-left transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">Sacola</button>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#DFBA6B]">Políticas</h4>
              <span className="text-zinc-500 cursor-help select-none">Garantia Eterna</span>
              <span className="text-zinc-500 cursor-help select-none">Política de Limpeza</span>
              <span className="text-zinc-500 cursor-help select-none">Segurança Certificada</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/5 my-8 max-w-7xl mx-auto" />

        {/* Copyright & Secret Discrete Footer trigger points for Admin Panel */}
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center select-none">
          <p className="text-[9px] text-zinc-600 font-light leading-relaxed max-w-2xl">
            Bodin Jóias LTDA <button 
              onClick={() => {
                sessionStorage.setItem('bodin_allowed_login_access', 'true');
                setSelectedProduct(null);
                setCurrentView('admin');
              }}
              className="text-zinc-600 hover:text-[#DFBA6B] transition-colors bg-transparent border-none p-0 outline-none cursor-pointer inline font-light"
            >©</button> 2026. Todos os direitos reservados. CNPJ: 00.000.000/0001-00. Joias banhadas a Ouro 18K em Moeda Antiga<button 
              onClick={() => {
                sessionStorage.setItem('bodin_allowed_login_access', 'true');
                setSelectedProduct(null);
                setCurrentView('admin');
              }}
              className="text-zinc-600 hover:text-[#DFBA6B] transition-colors bg-transparent border-none p-0 outline-none cursor-pointer inline font-light"
            >.</button>
          </p>
          {/* Secret tiny luxury gold bullet button ornament */}
          <button
            onClick={() => {
              sessionStorage.setItem('bodin_allowed_login_access', 'true');
              setSelectedProduct(null);
              setCurrentView('admin');
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#DFBA6B]/20 hover:bg-[#DFBA6B] transition-all duration-300 cursor-pointer outline-none mt-2 mx-auto"
            title="Acesso Privado"
          />
        </div>
      </footer>
    </div>
  );
}
