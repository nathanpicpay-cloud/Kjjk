import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Gem,
  Ticket,
  Settings,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Eye,
  MessageCircle,
  AlertCircle,
  TrendingUp,
  Pencil,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Copy,
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  ArrowUp,
  ArrowDown,
  Shield,
  Download,
  Upload,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, Coupon, AppSettings } from '../types';
import { GlassCard, PremiumButton, GlassInput, Badge } from './DesignSystem';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  settings: AppSettings;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (code: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onLogout?: () => void;
  onReorderProducts?: (products: Product[]) => void;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export default function AdminView({
  products,
  orders,
  coupons,
  settings,
  onAddProduct,
  onUpdateProduct,
  onUpdateOrderStatus,
  onDeleteProduct,
  onAddCoupon,
  onToggleCoupon,
  onUpdateSettings,
  onLogout,
  onReorderProducts
}: AdminViewProps) {
  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'homepage' | 'settings' | 'security'>('overview');

  // Activity logs persistence
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('bodin_admin_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('pt-BR'), action: 'Autenticação', details: 'Administrador logado com sucesso do endereço IP 192.168.1.10', type: 'success' },
      { id: '2', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('pt-BR'), action: 'Leitura', details: 'Sincronização de catálogo e pedidos realizada', type: 'info' }
    ];
  });

  const addLog = (action: string, details: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      action,
      details,
      type
    };
    setLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 50); // Keep last 50 logs
      localStorage.setItem('bodin_admin_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Auto Timeout Setup
  useEffect(() => {
    const timeout = setTimeout(() => {
      addLog('Timeout de Sessão', 'Sessão administrativa expirada por inatividade', 'warning');
      if (onLogout) {
        onLogout();
      }
    }, 1800000); // 30 minutes autologout
    return () => clearTimeout(timeout);
  }, []);

  // Form search states
  const [productSearch, setProductSearch] = useState('');

  // --- Add Product Form States ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('correntes');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdSecImages, setNewProdSecImages] = useState('');
  const [newProdVideoUrl, setNewProdVideoUrl] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('');
  const [newProdThickness, setNewProdThickness] = useState('');
  const [newProdLengths, setNewProdLengths] = useState('60cm, 70cm');
  const [newProdClasps, setNewProdClasps] = useState('Gaveta, Canhão');
  const [newProdStock, setNewProdStock] = useState('10');
  
  // Custom states
  const [newProdIsNew, setNewProdIsNew] = useState(true);
  const [newProdIsBestSeller, setNewProdIsBestSeller] = useState(false);
  const [newProdIsFeatured, setNewProdIsFeatured] = useState(false);
  const [newProdIsActive, setNewProdIsActive] = useState(true);
  const [newProdSeoTitle, setNewProdSeoTitle] = useState('');
  const [newProdSeoDescription, setNewProdSeoDescription] = useState('');

  // --- Edit Product Form States ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('correntes');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdOrigPrice, setEditProdOrigPrice] = useState('');
  const [editProdDescription, setEditProdDescription] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdSecImages, setEditProdSecImages] = useState('');
  const [editProdVideoUrl, setEditProdVideoUrl] = useState('');
  const [editProdWeight, setEditProdWeight] = useState('');
  const [editProdThickness, setEditProdThickness] = useState('');
  const [editProdLengths, setEditProdLengths] = useState('');
  const [editProdClasps, setEditProdClasps] = useState('');
  const [editProdStock, setEditProdStock] = useState('10');
  const [editProdIsNew, setEditProdIsNew] = useState(false);
  const [editProdIsBestSeller, setEditProdIsBestSeller] = useState(false);
  const [editProdIsFeatured, setEditProdIsFeatured] = useState(false);
  const [editProdIsActive, setEditProdIsActive] = useState(true);
  const [editProdSeoTitle, setEditProdSeoTitle] = useState('');
  const [editProdSeoDescription, setEditProdSeoDescription] = useState('');

  // --- Add Coupon Form States ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('');

  // --- Settings Form States ---
  const [settingsCompanyName, setSettingsCompanyName] = useState(settings.companyName || 'Bodin Jóias');
  const [settingsLogoUrl, setSettingsLogoUrl] = useState(settings.logoUrl || '');
  const [settingsFaviconUrl, setSettingsFaviconUrl] = useState(settings.faviconUrl || '');
  const [settingsInstagramUrl, setSettingsInstagramUrl] = useState(settings.instagramUrl || 'https://instagram.com/bodin_joias');
  const [settingsAddress, setSettingsAddress] = useState(settings.address || 'Avenida das Nações Unidas, 12901 — São Paulo/SP');
  const [settingsOperationHours, setSettingsOperationHours] = useState(settings.operationHours || 'Segunda a Sábado — 09h às 19h');
  const [settingsPrimaryColor, setSettingsPrimaryColor] = useState(settings.primaryColor || '#DFBA6B');
  const [settingsGlobalSeoTitle, setSettingsGlobalSeoTitle] = useState(settings.globalSeoTitle || 'Bodin Jóias — Joalheria Premium em Moeda Antiga');
  const [settingsGlobalSeoDescription, setSettingsGlobalSeoDescription] = useState(settings.globalSeoDescription || 'Joalheria premium em moeda antiga banhada a ouro 18k.');
  const [settingsGlobalSeoKeywords, setSettingsGlobalSeoKeywords] = useState(settings.globalSeoKeywords || 'joias, moeda antiga, ouro 18k');
  const [settingsTermsOfUse, setSettingsTermsOfUse] = useState(settings.termsOfUse || '');
  const [settingsPrivacyPolicy, setSettingsPrivacyPolicy] = useState(settings.privacyPolicy || '');
  const [settingsRefundPolicy, setSettingsRefundPolicy] = useState(settings.refundPolicy || '');

  const [settingsWhatsapp, setSettingsWhatsapp] = useState(settings.whatsapp);
  const [settingsCepOrigem, setSettingsCepOrigem] = useState(settings.cepOrigem);
  const [settingsMinFrete, setSettingsMinFrete] = useState(settings.minFreteGratis.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Homepage Banner Management States ---
  const [bannersList, setBannersList] = useState(() => {
    return settings.homepageBanners || [
      { id: 'banner-1', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80', title: 'Moeda Antiga de Elite', subtitle: 'Correntes Pesadas Banhadas a Ouro 18K • Garantia Vitalícia', tag: 'Coleção Premium', linkView: 'catalog', active: true }
    ];
  });
  const [showAddBannerForm, setShowAddBannerForm] = useState(false);
  const [newBannerImg, setNewBannerImg] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerTag, setNewBannerTag] = useState('');

  // --- Homepage Sections Management States ---
  const [sectionsList, setSectionsList] = useState(() => {
    return settings.homepageSections || [
      { id: 'hero', name: 'Banner Principal', active: true, order: 1 },
      { id: 'categories', name: 'Categorias em Destaque', active: true, order: 2 },
      { id: 'best_sellers', name: 'Produtos em Destaque', active: true, order: 3 },
      { id: 'benefits', name: 'Selo de Confiança', active: true, order: 4 },
      { id: 'whatsapp_call', name: 'Atendimento WhatsApp VIP', active: true, order: 5 }
    ];
  });

  // Calculate stats metrics
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const totalSalesCount = orders.filter(o => o.status === 'paid' || o.status === 'delivered').length;
  const avgTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
  const uniqueCustomers = Array.from(new Set(orders.map(o => o.customerEmail))).length;

  // Products Category Distribution logic for SVG chart
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Weekly Revenue SVG rendering
  const chartData = [
    { day: 'Seg', val: 1200 },
    { day: 'Ter', val: 1850 },
    { day: 'Qua', val: 1500 },
    { day: 'Qui', val: 2400 },
    { day: 'Sex', val: 3100 },
    { day: 'Sáb', val: 2800 },
    { day: 'Dom', val: 3900 }
  ];

  const maxChartVal = Math.max(...chartData.map(d => d.val));
  const chartHeight = 130;
  const chartWidth = 500;

  const svgPoints = chartData.map((d, idx) => {
    const x = (idx / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - (d.val / maxChartVal) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  // Product drag & drop (reordering simulator)
  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const updated = [...products];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap displays order
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    if (onReorderProducts) {
      onReorderProducts(updated);
      addLog('Ordenação', `Ordem de exibição do catálogo reorganizada`, 'success');
    } else {
      // Local reorder backup call
      localStorage.setItem('bodin_products', JSON.stringify(updated));
      window.location.reload();
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdDescription) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const lengthsArray = newProdLengths.split(',').map(s => s.trim()).filter(Boolean);
    const claspsArray = newProdClasps.split(',').map(s => s.trim()).filter(Boolean);
    const secondaryArray = newProdSecImages.split(',').map(s => s.trim()).filter(Boolean);

    const generatedProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      description: newProdDescription,
      price: parseFloat(newProdPrice),
      originalPrice: newProdOrigPrice ? parseFloat(newProdOrigPrice) : parseFloat(newProdPrice) * 1.3,
      category: newProdCategory,
      image: newProdImage || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      secondaryImages: secondaryArray,
      videoUrl: newProdVideoUrl,
      weight: newProdWeight || '45g',
      length: lengthsArray.length > 0 ? lengthsArray : ['60cm', '70cm'],
      thickness: newProdThickness || '8mm',
      clasp: claspsArray.length > 0 ? claspsArray : ['Gaveta'],
      plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Protetor)',
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      stock: parseInt(newProdStock) || 10,
      isBestSeller: newProdIsBestSeller,
      isNew: newProdIsNew,
      isFeatured: newProdIsFeatured,
      isActive: newProdIsActive,
      seoTitle: newProdSeoTitle || newProdName,
      seoDescription: newProdSeoDescription || newProdDescription.slice(0, 150)
    };

    onAddProduct(generatedProduct);
    addLog('Cadastro', `Peça "${newProdName}" cadastrada com sucesso`, 'success');

    // Reset forms
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOrigPrice('');
    setNewProdDescription('');
    setNewProdImage('');
    setNewProdSecImages('');
    setNewProdVideoUrl('');
    setNewProdWeight('');
    setNewProdThickness('');
    setShowAddForm(false);
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProdName(p.name);
    setEditProdCategory(p.category);
    setEditProdPrice(p.price.toString());
    setEditProdOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setEditProdDescription(p.description);
    setEditProdImage(p.image);
    setEditProdSecImages(p.secondaryImages ? p.secondaryImages.join(', ') : '');
    setEditProdVideoUrl(p.videoUrl || '');
    setEditProdWeight(p.weight || '');
    setEditProdThickness(p.thickness || '');
    setEditProdLengths(p.length.join(', '));
    setEditProdClasps(p.clasp ? p.clasp.join(', ') : '');
    setEditProdStock(p.stock ? p.stock.toString() : '10');
    setEditProdIsNew(!!p.isNew);
    setEditProdIsBestSeller(!!p.isBestSeller);
    setEditProdIsFeatured(!!p.isFeatured);
    setEditProdIsActive(p.isActive !== false);
    setEditProdSeoTitle(p.seoTitle || '');
    setEditProdSeoDescription(p.seoDescription || '');
    setShowAddForm(false);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editProdName || !editProdPrice || !editProdDescription) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const lengthsArray = editProdLengths.split(',').map(s => s.trim()).filter(Boolean);
    const claspsArray = editProdClasps.split(',').map(s => s.trim()).filter(Boolean);
    const secondaryArray = editProdSecImages.split(',').map(s => s.trim()).filter(Boolean);

    const updatedProduct: Product = {
      ...editingProduct,
      name: editProdName,
      description: editProdDescription,
      price: parseFloat(editProdPrice),
      originalPrice: editProdOrigPrice ? parseFloat(editProdOrigPrice) : parseFloat(editProdPrice) * 1.3,
      category: editProdCategory,
      image: editProdImage || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      secondaryImages: secondaryArray,
      videoUrl: editProdVideoUrl,
      weight: editProdWeight || '45g',
      length: lengthsArray.length > 0 ? lengthsArray : ['60cm', '70cm'],
      thickness: editProdThickness || '8mm',
      clasp: claspsArray.length > 0 ? claspsArray : ['Gaveta'],
      stock: parseInt(editProdStock) || 10,
      isBestSeller: editProdIsBestSeller,
      isNew: editProdIsNew,
      isFeatured: editProdIsFeatured,
      isActive: editProdIsActive,
      seoTitle: editProdSeoTitle,
      seoDescription: editProdSeoDescription
    };

    onUpdateProduct(updatedProduct);
    addLog('Edição', `Peça "${editProdName}" atualizada com sucesso`, 'success');
    setEditingProduct(null);
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (Cópia)`,
      isNew: true,
      reviewsCount: 0,
      reviews: []
    };
    onAddProduct(duplicated);
    addLog('Duplicação', `Peça "${p.name}" duplicada com sucesso`, 'success');
  };

  const handleDeleteProductSecure = (productId: string, productName: string) => {
    const confirm = window.confirm(`Deseja mesmo excluir permanentemente o produto "${productName}"? Esta operação é irreversível.`);
    if (confirm) {
      onDeleteProduct(productId);
      addLog('Exclusão', `Peça "${productName}" removida do catálogo`, 'warning');
    }
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponVal) return;

    const coupon: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      value: parseFloat(newCouponVal),
      active: true
    };

    onAddCoupon(coupon);
    addLog('Cupom Criado', `Cupom de Desconto "${coupon.code}" ativado`, 'success');
    setNewCouponCode('');
    setNewCouponVal('');
    setShowCouponForm(false);
  };

  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImg || !newBannerTitle) return;

    const newBanner = {
      id: `banner-${Date.now()}`,
      image: newBannerImg,
      title: newBannerTitle,
      subtitle: newBannerSubtitle || 'Lançamentos Bodin',
      tag: newBannerTag || 'Novidade',
      linkView: 'catalog',
      active: true
    };

    const updatedBanners = [...bannersList, newBanner];
    setBannersList(updatedBanners);
    addLog('Banner Promocional', `Novo banner "${newBannerTitle}" inserido`, 'success');

    onUpdateSettings({
      ...settings,
      homepageBanners: updatedBanners
    });

    setNewBannerImg('');
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerTag('');
    setShowAddBannerForm(false);
  };

  const handleToggleBanner = (id: string) => {
    const updated = bannersList.map(b => b.id === id ? { ...b, active: !b.active } : b);
    setBannersList(updated);
    onUpdateSettings({
      ...settings,
      homepageBanners: updated
    });
    addLog('Banner Alternado', `Status do banner administrativo modificado`, 'info');
  };

  const handleDeleteBanner = (id: string) => {
    const updated = bannersList.filter(b => b.id !== id);
    setBannersList(updated);
    onUpdateSettings({
      ...settings,
      homepageBanners: updated
    });
    addLog('Banner Excluído', `Banner promocional removido`, 'warning');
  };

  const handleToggleSection = (id: string) => {
    const updated = sectionsList.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setSectionsList(updated);
    onUpdateSettings({
      ...settings,
      homepageSections: updated
    });
    addLog('Seção Alternada', `Seção da página inicial alternada com sucesso`, 'info');
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...sectionsList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Update internal orders index
    const reordered = updated.map((item, i) => ({ ...item, order: i + 1 }));
    setSectionsList(reordered);
    onUpdateSettings({
      ...settings,
      homepageSections: reordered
    });
    addLog('Ordenação de Seção', `Posicionamento de seções da vitrine alterada`, 'success');
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdateSettings({
      whatsapp: settingsWhatsapp.trim(),
      cepOrigem: settingsCepOrigem.trim(),
      minFreteGratis: parseFloat(settingsMinFrete) || 0,
      companyName: settingsCompanyName.trim(),
      logoUrl: settingsLogoUrl.trim(),
      faviconUrl: settingsFaviconUrl.trim(),
      instagramUrl: settingsInstagramUrl.trim(),
      address: settingsAddress.trim(),
      operationHours: settingsOperationHours.trim(),
      primaryColor: settingsPrimaryColor,
      globalSeoTitle: settingsGlobalSeoTitle.trim(),
      globalSeoDescription: settingsGlobalSeoDescription.trim(),
      globalSeoKeywords: settingsGlobalSeoKeywords.trim(),
      termsOfUse: settingsTermsOfUse.trim(),
      privacyPolicy: settingsPrivacyPolicy.trim(),
      refundPolicy: settingsRefundPolicy.trim(),
      homepageBanners: bannersList,
      homepageSections: sectionsList
    });

    addLog('Configurações', `Parâmetros gerais do e-commerce salvos no banco`, 'success');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Simulated Database Backups
  const handleDownloadBackup = () => {
    const databaseBackup = {
      app: 'Bodin Jóias backoffice',
      exportDate: new Date().toISOString(),
      catalog: products,
      orders: orders,
      settings: settings,
      coupons: coupons
    };
    const blob = new Blob([JSON.stringify(databaseBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_bodin_joias_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addLog('Backup exportado', `Estrutura de dados exportada via JSON para download`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row text-left font-sans antialiased">
      {/* LEFT NAVIGATION COLLAPSIBLE APPLE-STYLE SIDEBAR */}
      <aside
        className={`bg-zinc-950/90 border-r border-white/5 backdrop-blur-[30px] transition-all duration-300 relative z-30 shrink-0 flex flex-col ${
          isSidebarCollapsed ? 'w-16 md:w-20' : 'w-full md:w-64'
        }`}
      >
        {/* Sidebar Header Brand Area */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3 h-20">
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11] flex items-center justify-center font-serif text-black font-extrabold text-sm shadow-[0_0_15px_rgba(223,186,107,0.3)]">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#DFBA6B]">
                  BODIN JÓIAS
                </span>
                <span className="text-[8px] text-zinc-500 tracking-[0.2em] uppercase font-light">
                  Painel de Controle
                </span>
              </div>
            </motion.div>
          )}

          {isSidebarCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11] flex items-center justify-center font-serif text-black font-extrabold text-xs shadow-[0_0_15px_rgba(223,186,107,0.3)]">
              B
            </div>
          )}

          {/* Collapsible toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Tab navigation links */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Catálogo de Peças', icon: Gem },
            { id: 'orders', label: 'Pedidos de Compra', icon: ShoppingCart },
            { id: 'coupons', label: 'Cupons de Desconto', icon: Ticket },
            { id: 'homepage', label: 'Design & Vitrine', icon: Layers },
            { id: 'settings', label: 'Configurações Loja', icon: Settings },
            { id: 'security', label: 'Segurança & Logs', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer select-none group text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DFBA6B]/15 to-[#AA7C11]/5 border border-[#DFBA6B]/30 text-[#F9E4B7] font-semibold shadow-inner'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#DFBA6B]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {!isSidebarCollapsed && <span className="truncate">{tab.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout action */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente sair da área restrita?')) {
                  onLogout();
                }
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-red-950/15 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/10 transition-all cursor-pointer select-none text-xs"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Encerrar Acesso</span>}
            </button>
          )}

          {!isSidebarCollapsed && (
            <div className="text-[9px] text-zinc-600 font-light text-center mt-2 pl-1">
              Sessão segura • 128-bit SSL
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT FLEX PANEL SCREEN WRAPPER */}
      <main className="flex-1 min-w-0 bg-[#070707] min-h-screen pb-24 md:pb-12 overflow-y-auto">
        {/* Dynamic Panel Header bar */}
        <header className="h-20 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md px-6 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-lg text-white font-medium uppercase tracking-wider">
              {activeTab === 'overview' && 'Dashboard de Performance'}
              {activeTab === 'products' && 'Gerenciador do Catálogo'}
              {activeTab === 'orders' && 'Lista de Pedidos'}
              {activeTab === 'coupons' && 'Gestão de Cupons'}
              {activeTab === 'homepage' && 'Visual da Página Inicial'}
              {activeTab === 'settings' && 'Metadados e Identidade'}
              {activeTab === 'security' && 'Painel de Auditoria e Backup'}
            </h1>
            <p className="text-[10px] text-zinc-500 font-light mt-0.5">
              Propriedade de {settingsCompanyName} • Modo Gerente
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Conexão Supabase Ativa</span>
            </span>
          </div>
        </header>

        {/* Inner layout block container */}
        <div className="p-6 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
          {/* --- TAB OVERVIEW (BENTO DASHBOARD INSPIRED BY APPLE) --- */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              {/* Bento statistical boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <GlassCard className="p-5 flex flex-col justify-between h-32 border border-[#DFBA6B]/15 bg-gradient-to-tr from-[#DFBA6B]/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-[#DFBA6B] font-bold">Faturamento Bruto</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold font-sans text-white">
                      R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5">Vendas aprovadas via Pix/MP</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between h-32 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">Pedidos Pagos</span>
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold font-sans text-white">{totalSalesCount}</span>
                    <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5">Expedições liberadas</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between h-32 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">Ticket Médio</span>
                    <Gem className="w-4 h-4 text-[#DFBA6B]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold font-sans text-white">
                      R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5">Média por carrinho de luxo</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between h-32 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">Clientes Cadastrados</span>
                    <Users className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold font-sans text-white">{uniqueCustomers}</span>
                    <span className="text-[9.5px] text-zinc-500 font-sans mt-0.5">Compradores VIP registrados</span>
                  </div>
                </GlassCard>
              </div>

              {/* Advanced Graphs grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Weekly Revenue vector SVG */}
                <GlassCard className="lg:col-span-7 p-6 flex flex-col gap-4 border border-white/5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-[#DFBA6B]">Desempenho Comercial de Vendas</h3>
                    <span className="text-[9px] text-zinc-500">Últimos 7 dias</span>
                  </div>
                  <div className="w-full h-36 overflow-hidden relative flex items-center justify-center bg-black/40 rounded-xl border border-white/5 mt-1">
                    <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#DFBA6B" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#AA7C11" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polygon points={`0,${chartHeight} ${svgPoints} ${chartWidth},${chartHeight}`} fill="url(#chartGlow)" />
                      <polyline fill="none" stroke="#DFBA6B" strokeWidth="3" points={svgPoints} />
                      {chartData.map((d, idx) => {
                        const x = (idx / (chartData.length - 1)) * chartWidth;
                        const y = chartHeight - (d.val / maxChartVal) * (chartHeight - 30) - 15;
                        return (
                          <circle key={idx} cx={x} cy={y} r="4.5" fill="#070707" stroke="#DFBA6B" strokeWidth="2" />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex justify-between px-1 text-[9px] text-zinc-500 font-sans border-t border-white/5 pt-2">
                    {chartData.map((d, idx) => <span key={idx}>{d.day}</span>)}
                  </div>
                </GlassCard>

                {/* SVG Inventory category breakdown chart requested */}
                <GlassCard className="lg:col-span-5 p-6 flex flex-col gap-4 border border-white/5">
                  <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-[#DFBA6B] border-b border-white/5 pb-3">Distribuição do Catálogo</h3>
                  <div className="flex flex-col gap-4 py-1">
                    {['correntes', 'pulseiras', 'aneis'].map((cat) => {
                      const count = categoryCounts[cat] || 0;
                      const pct = products.length > 0 ? (count / products.length) * 100 : 0;
                      return (
                        <div key={cat} className="flex flex-col gap-1.5 text-left">
                          <div className="flex justify-between items-center text-xs text-zinc-300">
                            <span className="capitalize font-semibold">{cat === 'aneis' ? 'Anéis' : cat}</span>
                            <span className="font-mono text-[10px] text-zinc-400">{count} peças ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-[#DFBA6B] to-[#AA7C11] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[9px] text-zinc-500 text-center pt-2 border-t border-white/5">
                    Estoque total ativo: {products.reduce((acc, p) => acc + p.stock, 0)} joias físicas
                  </div>
                </GlassCard>
              </div>

              {/* Shortcut buttons section */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#DFBA6B] text-left">Atalhos Administrativos Rápidos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => { setActiveTab('products'); setShowAddForm(true); }}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-center flex flex-col items-center gap-2 text-xs text-white transition-all select-none cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-[#DFBA6B]" />
                    <span>Cadastrar Peça</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-center flex flex-col items-center gap-2 text-xs text-white transition-all select-none cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    <span>Ver Pedidos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-center flex flex-col items-center gap-2 text-xs text-white transition-all select-none cursor-pointer"
                  >
                    <Layers className="w-5 h-5 text-teal-400" />
                    <span>Editar Vitrine</span>
                  </button>
                  <button
                    onClick={handleDownloadBackup}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-center flex flex-col items-center gap-2 text-xs text-white transition-all select-none cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-emerald-400" />
                    <span>Gerar Backup</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- TAB PRODUCTS (COMPREHENSIVE CATALOG MANAGEMENT) --- */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                {/* Search in Catalog Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar peças no catálogo..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#DFBA6B] transition-all font-sans"
                  />
                </div>

                <div className="flex gap-2.5">
                  <PremiumButton
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setEditingProduct(null);
                    }}
                    variant="solid"
                    className="py-2.5 px-4 text-xs tracking-widest flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Joia</span>
                  </PremiumButton>
                </div>
              </div>

              {/* Add Product Expandable Panel */}
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddProductSubmit}
                  className="p-6 rounded-xl bg-zinc-950 border border-white/10 flex flex-col gap-5 text-left card-shadow overflow-hidden"
                >
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
                    Cadastrar Nova Peça de Alta Joalheria
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <GlassInput
                        label="Nome da Joia *"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Ex: Corrente Grumet Escamada 10mm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                        Categoria *
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-[#DFBA6B] font-sans cursor-pointer h-[44px]"
                      >
                        <option value="correntes">Correntes</option>
                        <option value="pulseiras">Pulseiras</option>
                        <option value="aneis">Anéis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassInput
                      label="Preço Final de Venda (R$) *"
                      required
                      type="number"
                      step="0.01"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="349.90"
                    />
                    <GlassInput
                      label="Preço Original De R$ (Opcional)"
                      type="number"
                      step="0.01"
                      value={newProdOrigPrice}
                      onChange={(e) => setNewProdOrigPrice(e.target.value)}
                      placeholder="499.90"
                    />
                    <GlassInput
                      label="Estoque Inicial *"
                      required
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <GlassInput
                        label="URL da Imagem Principal *"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <GlassInput
                      label="URL do Vídeo MP4/Youtube (Opcional)"
                      value={newProdVideoUrl}
                      onChange={(e) => setNewProdVideoUrl(e.target.value)}
                      placeholder="Ex: https://..."
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                      URLs de Imagens Secundárias (Separadas por vírgula para Upload Múltiplo)
                    </label>
                    <textarea
                      value={newProdSecImages}
                      onChange={(e) => setNewProdSecImages(e.target.value)}
                      placeholder="https://images.unsplash.com/imagem2.jpg, https://images.unsplash.com/imagem3.jpg"
                      rows={2}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassInput label="Peso (Ex: 45g)" value={newProdWeight} onChange={(e) => setNewProdWeight(e.target.value)} placeholder="45g" />
                    <GlassInput label="Espessura (Ex: 8mm)" value={newProdThickness} onChange={(e) => setNewProdThickness(e.target.value)} placeholder="8mm" />
                    <GlassInput label="Comprimentos (Vírgula)" value={newProdLengths} onChange={(e) => setNewProdLengths(e.target.value)} placeholder="60cm, 70cm" />
                    <GlassInput label="Fechos (Vírgula)" value={newProdClasps} onChange={(e) => setNewProdClasps(e.target.value)} placeholder="Gaveta, Canhão" />
                  </div>

                  {/* Highlights and Flags Toggles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-white/5">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={newProdIsNew} onChange={(e) => setNewProdIsNew(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Novidade</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={newProdIsBestSeller} onChange={(e) => setNewProdIsBestSeller(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Mais Vendido</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={newProdIsFeatured} onChange={(e) => setNewProdIsFeatured(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Destaque</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={newProdIsActive} onChange={(e) => setNewProdIsActive(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Produto Ativo</span>
                    </label>
                  </div>

                  {/* Product-level SEO tags */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#DFBA6B] pl-1">Indexação SEO Individual</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput label="Meta Title SEO (Opcional)" value={newProdSeoTitle} onChange={(e) => setNewProdSeoTitle(e.target.value)} placeholder="Título da aba de navegação" />
                      <GlassInput label="Meta Description SEO (Opcional)" value={newProdSeoDescription} onChange={(e) => setNewProdSeoDescription(e.target.value)} placeholder="Breve resumo para resultados do Google" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                      Descrição & Apelo Comercial *
                    </label>
                    <textarea
                      required
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      placeholder="Descreva o luxo do banho de moeda antiga..."
                      rows={3}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <PremiumButton type="submit" variant="solid" className="py-2.5 text-xs">
                      <span>Registrar Peça</span>
                    </PremiumButton>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="py-2.5 px-5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-bold uppercase tracking-widest"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Edit Product Panel */}
              {editingProduct && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleEditProductSubmit}
                  className="p-6 rounded-xl bg-zinc-950 border border-[#DFBA6B]/40 flex flex-col gap-5 text-left card-shadow"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold">
                      Editar Peça: {editingProduct.name}
                    </h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-all cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <GlassInput
                        label="Nome da Joia *"
                        required
                        value={editProdName}
                        onChange={(e) => setEditProdName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                        Categoria *
                      </label>
                      <select
                        value={editProdCategory}
                        onChange={(e) => setEditProdCategory(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-[#DFBA6B] font-sans cursor-pointer h-[44px]"
                      >
                        <option value="correntes">Correntes</option>
                        <option value="pulseiras">Pulseiras</option>
                        <option value="aneis">Anéis</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassInput
                      label="Preço Final de Venda (R$) *"
                      required
                      type="number"
                      step="0.01"
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(e.target.value)}
                    />
                    <GlassInput
                      label="Preço Original De (R$)"
                      type="number"
                      step="0.01"
                      value={editProdOrigPrice}
                      onChange={(e) => setEditProdOrigPrice(e.target.value)}
                    />
                    <GlassInput
                      label="Quantidade em Estoque *"
                      required
                      type="number"
                      value={editProdStock}
                      onChange={(e) => setEditProdStock(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <GlassInput
                        label="URL da Imagem Principal *"
                        value={editProdImage}
                        onChange={(e) => setEditProdImage(e.target.value)}
                      />
                    </div>
                    <GlassInput
                      label="URL do Vídeo do Produto"
                      value={editProdVideoUrl}
                      onChange={(e) => setEditProdVideoUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                      URLs de Imagens Secundárias (Múltiplas separadas por vírgula)
                    </label>
                    <textarea
                      value={editProdSecImages}
                      onChange={(e) => setEditProdSecImages(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassInput label="Peso" value={editProdWeight} onChange={(e) => setEditProdWeight(e.target.value)} />
                    <GlassInput label="Espessura" value={editProdThickness} onChange={(e) => setEditProdThickness(e.target.value)} />
                    <GlassInput label="Comprimentos" value={editProdLengths} onChange={(e) => setEditProdLengths(e.target.value)} />
                    <GlassInput label="Fechos" value={editProdClasps} onChange={(e) => setEditProdClasps(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-white/5">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={editProdIsNew} onChange={(e) => setEditProdIsNew(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Novidade</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={editProdIsBestSeller} onChange={(e) => setEditProdIsBestSeller(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Mais Vendido</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={editProdIsFeatured} onChange={(e) => setEditProdIsFeatured(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Marcar como Destaque</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input type="checkbox" checked={editProdIsActive} onChange={(e) => setEditProdIsActive(e.target.checked)} className="rounded border-zinc-700 bg-zinc-900 text-[#DFBA6B] focus:ring-0 w-4 h-4" />
                      <span>Produto Ativo</span>
                    </label>
                  </div>

                  {/* Product-level SEO tags */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#DFBA6B] pl-1">Indexação SEO Individual</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput label="Meta Title SEO" value={editProdSeoTitle} onChange={(e) => setEditProdSeoTitle(e.target.value)} />
                      <GlassInput label="Meta Description SEO" value={editProdSeoDescription} onChange={(e) => setEditProdSeoDescription(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">
                      Descrição & Apelo Comercial
                    </label>
                    <textarea
                      required
                      value={editProdDescription}
                      onChange={(e) => setEditProdDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <PremiumButton type="submit" variant="solid" className="py-2.5 text-xs">
                      <span>Salvar Alterações</span>
                    </PremiumButton>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="py-2.5 px-5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-bold uppercase tracking-widest"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Product catalog inventory lists table */}
              <div className="flex flex-col gap-3">
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p, index) => (
                    <GlassCard key={p.id} className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-white/5">
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Drag and Drop reordering simulated indicators */}
                        <div className="flex flex-col gap-1 items-center shrink-0">
                          <button
                            onClick={() => handleMoveProduct(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-zinc-400 hover:text-white disabled:pointer-events-none cursor-pointer"
                            title="Subir Posição"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveProduct(index, 'down')}
                            disabled={index === products.length - 1}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-zinc-400 hover:text-white disabled:pointer-events-none cursor-pointer"
                            title="Descer Posição"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-zinc-900 border border-white/5" referrerPolicy="no-referrer" />
                        
                        <div className="text-left min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-md">
                              {p.name}
                            </h3>
                            {p.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
                            {p.isNew && <Badge variant="neutral">Novidade</Badge>}
                            {p.isFeatured && <Badge variant="neutral">Destaque</Badge>}
                            {p.isActive === false && <Badge variant="neutral" className="bg-red-950/40 text-red-400 border border-red-500/10">Inativo</Badge>}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-sans mt-0.5 block">
                            Valor: <strong className="text-white">R$ {p.price.toFixed(2).replace('.', ',')}</strong> • Categoria: {p.category.toUpperCase()} • Qtd: {p.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 border-zinc-900 pt-2 sm:pt-0">
                        <span className={`text-[9px] font-sans px-2.5 py-1 rounded-full border ${p.stock > 0 ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-red-950/20 text-red-400 border-red-500/20'}`}>
                          {p.stock > 0 ? `Estoque: ${p.stock}` : 'Esgotado'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="p-2 text-zinc-400 hover:text-teal-400 hover:bg-white/5 rounded-full transition-all cursor-pointer"
                            title="Duplicar Produto"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEditProduct(p)}
                            className="p-2 text-zinc-400 hover:text-[#DFBA6B] hover:bg-white/5 rounded-full transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProductSecure(p.id, p.name)}
                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
              </div>
            </motion.div>
          )}

          {/* --- TAB ORDERS (PEDIDOS DE COMPRA CLIENTES) --- */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold mb-2">Pedidos no Sistema</h2>

              <div className="grid grid-cols-1 gap-4">
                {orders.map((o) => (
                  <GlassCard key={o.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-white/5">
                    <div className="flex flex-col text-left gap-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-semibold">{o.customerName}</span>
                        <Badge variant="neutral">{o.id}</Badge>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans">
                        Email: <span className="text-zinc-300 font-medium">{o.customerEmail}</span> • Tel: <span className="text-zinc-300 font-medium">{o.customerPhone}</span>
                      </p>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5 truncate">
                        Endereço: {o.address.street}, {o.address.number} — {o.address.city}/{o.address.state}
                      </p>
                      <p className="text-[11px] text-[#DFBA6B] font-sans font-light mt-1.5 border-t border-white/5 pt-1.5">
                        Itens: <span className="text-zinc-300 font-medium">{o.items.map(item => `${item.quantity}x ${item.productName} (${item.length}/${item.clasp})`).join(', ')}</span>
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-stretch md:items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                      <div className="flex flex-col md:items-end">
                        <span className="text-sm font-bold font-sans text-white">R$ {o.total.toFixed(2).replace('.', ',')}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-sans">Método: {o.paymentMethod.toUpperCase()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => {
                            onUpdateOrderStatus(o.id, e.target.value as Order['status']);
                            addLog('Atualização de Pedido', `Status do pedido ${o.id} alterado para ${e.target.value}`, 'info');
                          }}
                          className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer font-sans"
                        >
                          <option value="pending">Aguardando</option>
                          <option value="paid">Pago</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>

                        <button
                          onClick={() => window.open(`https://wa.me/55${o.customerPhone}?text=Olá%20${encodeURIComponent(o.customerName.split(' ')[0])}!%20Aqui%20é%20da%20Bodin%20Jóias.%20Seu%20pedido%20*${o.id}*%20foi%20atualizado%20no%20nosso%20sistema.`, '_blank')}
                          className="p-2.5 rounded-xl bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-950/40 hover:border-emerald-500/30 transition-all select-none"
                          title="Contatar Cliente"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- TAB COUPONS (CUPONS DE DESCONTO CONFIGURADOS) --- */}
          {activeTab === 'coupons' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold">Cupons Ativos</h2>
                <PremiumButton onClick={() => setShowCouponForm(!showCouponForm)} variant="solid" className="py-2 px-4 text-xs tracking-widest flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Criar Cupom</span>
                </PremiumButton>
              </div>

              {showCouponForm && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddCouponSubmit}
                  className="p-5 rounded-xl bg-zinc-950 border border-white/10 flex flex-col gap-4 max-w-md text-left card-shadow"
                >
                  <h3 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold border-b border-white/5 pb-2">
                    Configurar Cupom
                  </h3>

                  <GlassInput
                    label="Código do Cupom *"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: MEUDEZ"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest pl-1">
                        Tipo de Desconto *
                      </label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as any)}
                        className="bg-zinc-900 border border-white/10 rounded-lg h-[44px] px-3 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="percentage">Porcentagem (%)</option>
                        <option value="fixed">Valor Fixo (R$)</option>
                      </select>
                    </div>

                    <GlassInput
                      label="Valor do Desconto *"
                      required
                      type="number"
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(e.target.value)}
                      placeholder="Ex: 10"
                    />
                  </div>

                  <PremiumButton type="submit" variant="solid" className="py-2.5 text-xs self-start mt-1">
                    <span>Criar Cupom</span>
                  </PremiumButton>
                </motion.form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <GlassCard key={c.code} className="p-4 flex items-center justify-between border border-white/5">
                    <div className="flex flex-col text-left">
                      <span className="text-sm text-white font-bold tracking-widest uppercase">{c.code}</span>
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                        Abatimento: <strong className="text-white">{c.discountType === 'percentage' ? `${c.value}%` : `R$ ${c.value}`}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full uppercase font-semibold border ${c.active ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-700/30'}`}>
                        {c.active ? 'Ativo' : 'Pausado'}
                      </span>

                      <button
                        onClick={() => {
                          onToggleCoupon(c.code);
                          addLog('Alternação de Cupom', `Cupom de Desconto ${c.code} alternado`, 'info');
                        }}
                        className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-all text-xs"
                      >
                        Alternar
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- TAB HOMEPAGE (DESIGN, BANNERS AND SECTIONS MANAGEMENT) --- */}
          {activeTab === 'homepage' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 text-left">
              {/* SLIDERS / BANNERS SECTION */}
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Sliders e Banners da Vitrine</h3>
                    <p className="text-[10px] text-zinc-500">Adicione ou ative banners rotativos na página inicial.</p>
                  </div>
                  <PremiumButton onClick={() => setShowAddBannerForm(!showAddBannerForm)} variant="solid" className="py-2 px-3 text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" />
                    <span>Criar Novo Banner</span>
                  </PremiumButton>
                </div>

                {showAddBannerForm && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddBannerSubmit}
                    className="p-5 rounded-xl bg-zinc-950 border border-white/10 flex flex-col gap-4 max-w-xl text-left"
                  >
                    <h4 className="text-xs font-bold text-[#DFBA6B] uppercase tracking-widest">Novo Banner Promocional</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput label="Título do Banner *" required value={newBannerTitle} onChange={(e) => setNewBannerTitle(e.target.value)} placeholder="Ex: Moeda Antiga de Elite" />
                      <GlassInput label="Slogan / Tag (Opcional)" value={newBannerTag} onChange={(e) => setNewBannerTag(e.target.value)} placeholder="Ex: Coleção Signature" />
                    </div>
                    <GlassInput label="Slogan Secundário (Subtitle) *" required value={newBannerSubtitle} onChange={(e) => setNewBannerSubtitle(e.target.value)} placeholder="Correntes Pesadas Banhadas a Ouro..." />
                    <GlassInput label="URL da Imagem do Banner *" required value={newBannerImg} onChange={(e) => setNewBannerImg(e.target.value)} placeholder="https://images.unsplash.com/..." />
                    
                    <PremiumButton type="submit" variant="solid" className="py-2.5 text-xs self-start">
                      <span>Adicionar Banner</span>
                    </PremiumButton>
                  </motion.form>
                )}

                {/* Active banners cards display */}
                <div className="grid grid-cols-1 gap-3.5">
                  {bannersList.map((b) => (
                    <GlassCard key={b.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/5 bg-zinc-950/40">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={b.image} alt="" className="w-14 h-10 rounded-lg object-cover bg-zinc-900 shrink-0" referrerPolicy="no-referrer" />
                        <div className="text-left min-w-0">
                          <span className="text-[9px] uppercase tracking-widest text-[#DFBA6B] font-bold block">{b.tag}</span>
                          <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">{b.title}</h4>
                          <p className="text-[10px] text-zinc-500 font-sans truncate">{b.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold border ${b.active ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-700/30'}`}>
                          {b.active ? 'Ativo' : 'Inativo'}
                        </span>
                        <button onClick={() => handleToggleBanner(b.id)} className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs cursor-pointer">
                          Alternar
                        </button>
                        <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 rounded-lg hover:bg-red-950/10 text-zinc-600 hover:text-red-400 transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* SECTIONS ORDERING & STATUS */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Ordenação e Controle de Seções da Vitrine</h3>
                  <p className="text-[10px] text-zinc-500 font-sans">Ative ou desative seções e mude sua ordem de exibição na Página Inicial (arrastar e soltar simulado).</p>
                </div>

                <div className="flex flex-col gap-2.5 max-w-xl">
                  {sectionsList
                    .sort((a, b) => a.order - b.order)
                    .map((sect, index) => (
                      <GlassCard key={sect.id} className="p-4 flex items-center justify-between gap-4 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1 items-center shrink-0">
                            <button
                              onClick={() => handleMoveSection(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveSection(index, 'down')}
                              disabled={index === sectionsList.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-left">
                            <span className="text-[10px] text-zinc-500 font-mono">Posição #{sect.order}</span>
                            <h4 className="text-xs sm:text-sm font-semibold text-white capitalize">{sect.name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold border ${sect.active ? 'bg-[#DFBA6B]/10 text-[#DFBA6B] border-[#DFBA6B]/30' : 'bg-zinc-900 text-zinc-500 border-zinc-700/30'}`}>
                            {sect.active ? 'Visível' : 'Oculta'}
                          </span>
                          <button
                            onClick={() => handleToggleSection(sect.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors cursor-pointer"
                          >
                            Alternar
                          </button>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- TAB SETTINGS (GERENCIADOR GERAL E POLÍTICAS) --- */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 text-left">
              <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                {/* Section 1: Brand Info */}
                <GlassCard className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-3">
                    1. Identidade de Marca & Logotipos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassInput label="Nome Oficial da Empresa" value={settingsCompanyName} onChange={(e) => setSettingsCompanyName(e.target.value)} />
                    <GlassInput label="URL Logotipo Oficial (Opcional)" value={settingsLogoUrl} onChange={(e) => setSettingsLogoUrl(e.target.value)} placeholder="https://..." />
                    <GlassInput label="URL Favicon do Site (Opcional)" value={settingsFaviconUrl} onChange={(e) => setSettingsFaviconUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </GlassCard>

                {/* Section 2: Contact Details */}
                <GlassCard className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-3">
                    2. Canais de Atendimento & Endereço
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassInput label="WhatsApp Central (Com DDD, apenas números)" value={settingsWhatsapp} onChange={(e) => setSettingsWhatsapp(e.target.value)} />
                    <GlassInput label="Instagram Oficial Link" value={settingsInstagramUrl} onChange={(e) => setSettingsInstagramUrl(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassInput label="Endereço Físico / Sede" value={settingsAddress} onChange={(e) => setSettingsAddress(e.target.value)} />
                    <GlassInput label="Horário de Funcionamento Comercial" value={settingsOperationHours} onChange={(e) => setSettingsOperationHours(e.target.value)} />
                  </div>
                </GlassCard>

                {/* Section 3: Shipping & Design */}
                <GlassCard className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-3">
                    3. Parâmetros de Envios, Fretes e Design
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlassInput label="CEP Origem Expedição" value={settingsCepOrigem} onChange={(e) => setSettingsCepOrigem(e.target.value)} />
                    <GlassInput label="Min. para Frete Grátis (R$)" type="number" step="0.01" value={settingsMinFrete} onChange={(e) => setSettingsMinFrete(e.target.value)} />
                    <GlassInput label="Cor Primária do Design Hex" value={settingsPrimaryColor} onChange={(e) => setSettingsPrimaryColor(e.target.value)} placeholder="#DFBA6B" />
                  </div>
                </GlassCard>

                {/* Section 4: Global SEO Meta-tags */}
                <GlassCard className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-3">
                    4. Indexação SEO Global do Site
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <GlassInput label="Google Search Title" value={settingsGlobalSeoTitle} onChange={(e) => setSettingsGlobalSeoTitle(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <GlassInput label="Google Description Tag" value={settingsGlobalSeoDescription} onChange={(e) => setSettingsGlobalSeoDescription(e.target.value)} />
                    </div>
                  </div>
                  <GlassInput label="Palavras-chave SEO (Separadas por vírgula)" value={settingsGlobalSeoKeywords} onChange={(e) => setSettingsGlobalSeoKeywords(e.target.value)} />
                </GlassCard>

                {/* Section 5: Legal policies */}
                <GlassCard className="p-6 flex flex-col gap-4">
                  <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-3">
                    5. Políticas Legais & Termos do E-commerce
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">Termos de Uso do Site</label>
                      <textarea value={settingsTermsOfUse} onChange={(e) => setSettingsTermsOfUse(e.target.value)} placeholder="Termos de Uso..." rows={2} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3.5 text-xs text-white" />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">Política de Privacidade</label>
                      <textarea value={settingsPrivacyPolicy} onChange={(e) => setSettingsPrivacyPolicy(e.target.value)} placeholder="Política de Privacidade..." rows={2} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3.5 text-xs text-white" />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest pl-1">Garantias, Trocas & Reembolso</label>
                      <textarea value={settingsRefundPolicy} onChange={(e) => setSettingsRefundPolicy(e.target.value)} placeholder="Condições de Devolução..." rows={2} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3.5 text-xs text-white" />
                    </div>
                  </div>
                </GlassCard>

                {saveSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Configurações administrativas sincronizadas com o Supabase com sucesso!</span>
                  </motion.div>
                )}

                <PremiumButton type="submit" variant="solid" className="py-3 px-8 text-xs tracking-widest self-start">
                  <span>Salvar Todas as Configurações</span>
                </PremiumButton>
              </form>
            </motion.div>
          )}

          {/* --- TAB SECURITY (AUDIT LOGS, FIREBASE RULES AND BACKUPS EXTRAS) --- */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 text-left">
              {/* Backups section */}
              <GlassCard className="p-6 flex flex-col gap-4 border border-[#DFBA6B]/20 bg-gradient-to-tr from-[#DFBA6B]/5 to-transparent">
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-sm text-white uppercase tracking-wider font-semibold">Sistema de Backup de Segurança</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">Exporte toda a base do banco de dados (catálogo de produtos, clientes, cupons, ordens de serviço e configurações de vitrine) em um único arquivo de segurança JSON.</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-1">
                  <PremiumButton onClick={handleDownloadBackup} variant="solid" className="py-2.5 px-4 text-xs tracking-widest flex items-center gap-1.5">
                    <Download className="w-4.5 h-4.5" />
                    <span>Baixar Backup Completo</span>
                  </PremiumButton>

                  <button
                    onClick={() => {
                      const confirm = window.confirm('Deseja mesmo redefinir o banco de dados administrativos para os padrões originais de fábrica? Isso removerá novos produtos criados de teste.');
                      if (confirm) {
                        localStorage.clear();
                        addLog('Reset Completo', 'Bodin banco de dados limpo para os padrões de fábrica', 'error');
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-950/10 hover:bg-red-950/25 text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 text-xs tracking-widest uppercase font-semibold transition-all cursor-pointer"
                  >
                    Resetar Banco de Dados
                  </button>
                </div>
              </GlassCard>

              {/* Payment systems extra configurations placeholders */}
              <GlassCard className="p-6 flex flex-col gap-4">
                <h3 className="font-serif text-sm text-white uppercase tracking-wider font-semibold border-b border-white/5 pb-3">Futuras Integrações & Gateways de Pagamento</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">Prepare credenciais secretas do Mercado Pago, Stripe, ou Webhook Pix diretamente abaixo. Esses campos já estão vinculados à API de checkout e estarão operacionais no ambiente de produção.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput label="Mercado Pago Public Key" type="password" value="APP_USR-da97d192-3103-91ab-32bc" readOnly />
                  <GlassInput label="Mercado Pago Access Token" type="password" value="APP_USR-7821639102830192-91ab-32bc-91023801" readOnly />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GlassInput label="Webhook URL para Status do Pix" value="https://api.bodinjoias.com.br/v1/payments/pix-callback" readOnly />
                  <GlassInput label="Stripe Publishable Key" type="password" value="pk_test_51NxBodInJoIaSSeCureKey" readOnly />
                </div>
              </GlassCard>

              {/* Real activity logs requested by security audit */}
              <GlassCard className="p-6 flex flex-col gap-4 border border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-[#DFBA6B]">Registro de Atividades (Auditoria do Sistema)</h3>
                  <span className="text-[9px] text-zinc-500 font-sans uppercase">Acesso administrativo monitorado</span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-2">
                  {logs.map((l) => (
                    <div key={l.id} className="flex items-start justify-between gap-3 text-xs border-b border-white/[0.02] pb-2 font-sans">
                      <div className="flex flex-col text-left">
                        <span className="text-zinc-400 text-[11px] font-semibold flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            l.type === 'success' ? 'bg-emerald-400' :
                            l.type === 'warning' ? 'bg-amber-400' :
                            l.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                          }`} />
                          {l.action}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-light mt-0.5">{l.details}</span>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-mono shrink-0">{l.timestamp}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
