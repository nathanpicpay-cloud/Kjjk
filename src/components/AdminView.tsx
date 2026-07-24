import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Users, Gem, Ticket, Settings, Plus, Trash2, Check, RefreshCw, Eye, MessageCircle, AlertCircle, TrendingUp, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order, Coupon } from '../types';
import { GlassCard, PremiumButton, GlassInput, Badge } from './DesignSystem';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (code: string) => void;
}

export default function AdminView({
  products,
  orders,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onUpdateOrderStatus,
  onDeleteProduct,
  onAddCoupon,
  onToggleCoupon
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'settings'>('overview');

  // --- Add Product Form States ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('correntes');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('');
  const [newProdThickness, setNewProdThickness] = useState('');
  const [newProdLengths, setNewProdLengths] = useState('60cm, 70cm');
  const [newProdClasps, setNewProdClasps] = useState('Gaveta, Mosquetão');

  // --- Edit Product Form States ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('correntes');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdOrigPrice, setEditProdOrigPrice] = useState('');
  const [editProdDescription, setEditProdDescription] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdWeight, setEditProdWeight] = useState('');
  const [editProdThickness, setEditProdThickness] = useState('');
  const [editProdLengths, setEditProdLengths] = useState('');
  const [editProdClasps, setEditProdClasps] = useState('');
  const [editProdStock, setEditProdStock] = useState('15');

  // --- Add Coupon Form States ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('');

  // --- Calculations for metrics ---
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const totalSalesCount = orders.filter(o => o.status === 'paid' || o.status === 'delivered').length;
  const avgTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
  
  // Custom unique customers count calculation
  const uniqueCustomers = Array.from(new Set(orders.map(o => o.customerEmail))).length;

  // --- Mock weekly revenue data for the custom SVG Line Chart ---
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
  const chartHeight = 160;
  const chartWidth = 500;

  // Generate SVG Points
  const svgPoints = chartData.map((d, idx) => {
    const x = (idx / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - (d.val / maxChartVal) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdDescription) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const lengthsArray = newProdLengths.split(',').map(s => s.trim()).filter(Boolean);
    const claspsArray = newProdClasps.split(',').map(s => s.trim()).filter(Boolean);

    const generatedProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      description: newProdDescription,
      price: parseFloat(newProdPrice),
      originalPrice: newProdOrigPrice ? parseFloat(newProdOrigPrice) : parseFloat(newProdPrice) * 1.3,
      category: newProdCategory,
      image: newProdImage || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      secondaryImages: [],
      weight: newProdWeight || '45g',
      length: lengthsArray.length > 0 ? lengthsArray : ['60cm', '70cm'],
      thickness: newProdThickness || '8mm',
      clasp: claspsArray.length > 0 ? claspsArray : ['Gaveta'],
      plating: 'Ouro 18K Premium (Camada de 10 Milésimos + Verniz Protetor)',
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      stock: 15,
      isBestSeller: false,
      isNew: true
    };

    onAddProduct(generatedProduct);
    
    // Clear states
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOrigPrice('');
    setNewProdDescription('');
    setNewProdImage('');
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
    setEditProdWeight(p.weight || '');
    setEditProdThickness(p.thickness || '');
    setEditProdLengths(p.length.join(', '));
    setEditProdClasps(p.clasp ? p.clasp.join(', ') : '');
    setEditProdStock(p.stock ? p.stock.toString() : '15');
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

    const updatedProduct: Product = {
      ...editingProduct,
      name: editProdName,
      description: editProdDescription,
      price: parseFloat(editProdPrice),
      originalPrice: editProdOrigPrice ? parseFloat(editProdOrigPrice) : parseFloat(editProdPrice) * 1.3,
      category: editProdCategory,
      image: editProdImage || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      weight: editProdWeight || '45g',
      length: lengthsArray.length > 0 ? lengthsArray : ['60cm', '70cm'],
      thickness: editProdThickness || '8mm',
      clasp: claspsArray.length > 0 ? claspsArray : ['Gaveta'],
      stock: parseInt(editProdStock) || 15
    };

    onUpdateProduct(updatedProduct);
    setEditingProduct(null);
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
    setNewCouponCode('');
    setNewCouponVal('');
    setShowCouponForm(false);
  };

  return (
    <div className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white font-medium uppercase tracking-wider flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-[#DFBA6B]" />
            <span>Painel Administrativo VIP</span>
          </h1>
          <p className="text-xs text-zinc-500 font-light font-sans mt-0.5">
            Gerenciamento geral de vendas, estoque de joias de moeda antiga e cupons ativos.
          </p>
        </div>

        {/* Action tags */}
        <div className="flex gap-2 self-start md:self-center bg-white/[0.02] p-1 rounded-xl border border-white/5 font-sans text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
          >
            Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'products' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'coupons' ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
          >
            Cupons
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          {/* Analytical Bento Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <GlassCard className="p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA6B] font-semibold">Receita Total Bruta</span>
              <span className="text-2xl font-bold text-white font-sans">R$ {totalRevenue.toFixed(2).replace('.', ',')}</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% esta semana</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Pedidos Aprovados</span>
              <span className="text-2xl font-bold text-white font-sans">{totalSalesCount}</span>
              <span className="text-[10px] text-zinc-500 font-sans mt-1">Garantia e remessas ativas</span>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Ticket Médio</span>
              <span className="text-2xl font-bold text-white font-sans">R$ {avgTicket.toFixed(2).replace('.', ',')}</span>
              <span className="text-[10px] text-zinc-500 font-sans mt-1">Média por carrinho de luxo</span>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Clientes VIP</span>
              <span className="text-2xl font-bold text-white font-sans">{uniqueCustomers}</span>
              <span className="text-[10px] text-zinc-500 font-sans mt-1">Compradores únicos recorrentes</span>
            </GlassCard>
          </div>

          {/* Golden Vector Performance Chart & Recent Orders List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Custom Interactive SVG Line Chart */}
            <GlassCard className="lg:col-span-7 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-[#DFBA6B]">Desempenho Semanal de Faturamento</h3>
                <span className="text-[10px] text-zinc-400 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/5">Atualizado Tempo Real</span>
              </div>

              {/* Render vector SVG */}
              <div className="w-full h-44 overflow-hidden relative flex items-center justify-center mt-2 bg-black/40 rounded-xl border border-zinc-900/60">
                <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#DFBA6B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#AA7C11" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Glowing Fill Under Line */}
                  <polygon
                    points={`0,${chartHeight} ${svgPoints} ${chartWidth},${chartHeight}`}
                    fill="url(#chartGlow)"
                  />

                  {/* High fidelity Gold Line */}
                  <polyline
                    fill="none"
                    stroke="#DFBA6B"
                    strokeWidth="3.5"
                    points={svgPoints}
                  />

                  {/* Dot anchors and anchors tags */}
                  {chartData.map((d, idx) => {
                    const x = (idx / (chartData.length - 1)) * chartWidth;
                    const y = chartHeight - (d.val / maxChartVal) * (chartHeight - 40) - 20;
                    return (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle cx={x} cy={y} r="5" fill="#0F0F0F" stroke-width="2.5" className="stroke-white" />
                        <text x={x} y={y - 12} textAnchor="middle" fill="white" fontSize="8" className="opacity-0 group-hover/dot:opacity-100 transition-opacity font-semibold font-sans">
                          R$ {d.val}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Labels Row */}
              <div className="flex justify-between px-2 text-[10px] text-zinc-500 font-sans border-t border-white/5 pt-2">
                {chartData.map((d, idx) => <span key={idx}>{d.day}</span>)}
              </div>
            </GlassCard>

            {/* Quick Recent order tracking */}
            <GlassCard className="lg:col-span-5 p-6 flex flex-col gap-4">
              <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-[#DFBA6B] border-b border-white/5 pb-3">Últimas Atividades de Pedidos</h3>
              
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="flex items-center justify-between border-b border-zinc-950 pb-2.5 text-xs">
                    <div className="flex flex-col text-left">
                      <span className="text-white font-medium">{o.customerName.split(' ')[0]} {o.customerName.split(' ')[1] || ''}</span>
                      <span className="text-[10px] text-zinc-500 font-sans">{o.id} • {new Date(o.date).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold font-sans">R$ {o.total.toFixed(2).replace('.', ',')}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        o.status === 'paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' :
                        o.status === 'delivered' ? 'bg-blue-950/40 text-blue-400 border border-blue-500/10' :
                        o.status === 'pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/10' :
                        'bg-zinc-900 text-zinc-400'
                      }`}>
                        {o.status === 'paid' ? 'Pago' : o.status === 'delivered' ? 'Entregue' : o.status === 'pending' ? 'Aguardando' : 'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* --- ORDERS TAB --- */}
      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold mb-2">Pedidos de Clientes no Sistema</h2>

          <div className="grid grid-cols-1 gap-4">
            {orders.map((o) => (
              <GlassCard key={o.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/5">
                <div className="flex flex-col text-left gap-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-semibold">{o.customerName}</span>
                    <Badge variant="neutral">{o.id}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans">
                    Email: <span className="text-zinc-300 font-medium">{o.customerEmail}</span> • Tel: <span className="text-zinc-300 font-medium">{o.customerPhone}</span>
                  </p>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5 line-clamp-1">
                    Endereço: <span className="text-zinc-500">{o.address.street}, Nº {o.address.number} — {o.address.city}/{o.address.state}</span>
                  </p>
                  <p className="text-[11px] text-zinc-300 font-sans font-light mt-1.5 border-t border-white/5 pt-1.5">
                    Itens: <span className="text-zinc-300 font-medium">{o.items.map(item => `${item.quantity}x ${item.productName} (${item.length}/${item.clasp})`).join(', ')}</span>
                  </p>
                </div>

                <div className="flex flex-row sm:flex-col items-stretch sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-sm font-bold font-sans text-white">R$ {o.total.toFixed(2).replace('.', ',')}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-sans font-light">Método: {o.paymentMethod.toUpperCase()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status updater dropdown overrides */}
                    <select
                      value={o.status}
                      onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['status'])}
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

      {/* --- PRODUCTS TAB --- */}
      {activeTab === 'products' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold">Catálogo de Joias Ativas</h2>
            <PremiumButton onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); }} variant="solid" className="py-2.5 px-4 text-xs tracking-widest flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Cadastrar Joia</span>
            </PremiumButton>
          </div>

          {/* Add product expandable panel */}
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddProductSubmit}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-4 max-w-2xl card-shadow backdrop-blur-[20px]"
            >
              <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold border-b border-white/5 pb-2 mb-1">
                Cadastrar Nova Peça de Alta Joalheria
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Nome da Joia *"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Corrente Grumet Escamada 10mm"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest pl-1">
                    Categoria *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3.5 text-sm text-white outline-none focus:border-[#DFBA6B] font-sans cursor-pointer"
                  >
                    <option value="correntes">Correntes</option>
                    <option value="pulseiras">Pulseiras</option>
                    <option value="aneis">Anéis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <GlassInput
                label="URL da Imagem de Alta Resolução"
                value={newProdImage}
                onChange={(e) => setNewProdImage(e.target.value)}
                placeholder="Ex: https://images.unsplash.com/..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Peso Médio (Ex: 45g - 55g)"
                  value={newProdWeight}
                  onChange={(e) => setNewProdWeight(e.target.value)}
                  placeholder="Ex: 45g"
                />
                <GlassInput
                  label="Espessura (Ex: 8mm)"
                  value={newProdThickness}
                  onChange={(e) => setNewProdThickness(e.target.value)}
                  placeholder="Ex: 8mm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Comprimentos Disponíveis (separados por vírgula)"
                  value={newProdLengths}
                  onChange={(e) => setNewProdLengths(e.target.value)}
                  placeholder="Ex: 60cm, 70cm, 80cm"
                />
                <GlassInput
                  label="Fechos Disponíveis (separados por vírgula)"
                  value={newProdClasps}
                  onChange={(e) => setNewProdClasps(e.target.value)}
                  placeholder="Ex: Gaveta, Mosquetão"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest pl-1">
                  Descrição e Apelo Comercial *
                </label>
                <textarea
                  required
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  placeholder="Descreva a qualidade do banho de moeda antiga, acabamento dos elos e apelo..."
                  rows={3}
                  className="w-full bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                />
              </div>

              <PremiumButton type="submit" variant="solid" className="py-3 text-xs self-start mt-1">
                <span>Registrar Peça</span>
              </PremiumButton>
            </motion.form>
          )}

          {/* Edit product expandable panel */}
          {editingProduct && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleEditProductSubmit}
              className="p-6 rounded-xl bg-[#0a0a0a] border border-[#DFBA6B]/30 flex flex-col gap-4 max-w-2xl card-shadow backdrop-blur-[20px]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-1">
                <h3 className="font-serif text-sm text-[#DFBA6B] uppercase tracking-wider font-semibold">
                  Editar Peça: {editingProduct.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-all cursor-pointer"
                  title="Cancelar Edição"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Nome da Joia *"
                  required
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  placeholder="Ex: Corrente Grumet Escamada 10mm"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest pl-1">
                    Categoria *
                  </label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3.5 text-sm text-white outline-none focus:border-[#DFBA6B] font-sans cursor-pointer"
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
                  placeholder="349.90"
                />
                <GlassInput
                  label="Preço Original De R$ (Opcional)"
                  type="number"
                  step="0.01"
                  value={editProdOrigPrice}
                  onChange={(e) => setEditProdOrigPrice(e.target.value)}
                  placeholder="499.90"
                />
                <GlassInput
                  label="Quantidade em Estoque *"
                  type="number"
                  required
                  value={editProdStock}
                  onChange={(e) => setEditProdStock(e.target.value)}
                  placeholder="15"
                />
              </div>

              <GlassInput
                label="URL da Imagem de Alta Resolução"
                value={editProdImage}
                onChange={(e) => setEditProdImage(e.target.value)}
                placeholder="Ex: https://images.unsplash.com/..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Peso Médio (Ex: 45g - 55g)"
                  value={editProdWeight}
                  onChange={(e) => setEditProdWeight(e.target.value)}
                  placeholder="Ex: 45g"
                />
                <GlassInput
                  label="Espessura (Ex: 8mm)"
                  value={editProdThickness}
                  onChange={(e) => setEditProdThickness(e.target.value)}
                  placeholder="Ex: 8mm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  label="Comprimentos Disponíveis (separados por vírgula)"
                  value={editProdLengths}
                  onChange={(e) => setEditProdLengths(e.target.value)}
                  placeholder="Ex: 60cm, 70cm, 80cm"
                />
                <GlassInput
                  label="Fechos Disponíveis (separados por vírgula)"
                  value={editProdClasps}
                  onChange={(e) => setEditProdClasps(e.target.value)}
                  placeholder="Ex: Gaveta, Mosquetão"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest pl-1">
                  Descrição e Apelo Comercial *
                </label>
                <textarea
                  required
                  value={editProdDescription}
                  onChange={(e) => setEditProdDescription(e.target.value)}
                  placeholder="Descreva a qualidade do banho de moeda antiga, acabamento dos elos e apelo..."
                  rows={3}
                  className="w-full bg-white/[0.01] border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#DFBA6B] font-sans resize-none"
                />
              </div>

              <div className="flex gap-3">
                <PremiumButton type="submit" variant="solid" className="py-3 text-xs">
                  <span>Salvar Alterações</span>
                </PremiumButton>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-semibold uppercase tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          )}

          {/* Active Inventory products list grid */}
          <div className="grid grid-cols-1 gap-3">
            {products.map((p) => (
              <GlassCard key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-zinc-900 border border-zinc-800" referrerPolicy="no-referrer" />
                  <div className="text-left min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                      {p.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-sans">
                      Preço: <strong className="text-white">R$ {p.price.toFixed(2).replace('.', ',')}</strong> • Categoria: {p.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[10px] font-sans px-2.5 py-1 rounded-full border ${p.stock > 0 ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-red-950/20 text-red-400 border-red-500/20'}`}>
                    {p.stock > 0 ? `Estoque: ${p.stock}` : 'Sem Estoque'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditProduct(p)}
                      className="p-2 text-zinc-400 hover:text-[#DFBA6B] hover:bg-white/5 rounded-full transition-all active:scale-90 cursor-pointer"
                      title="Editar Produto"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all active:scale-90 cursor-pointer"
                      title="Excluir Produto"
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

      {/* --- COUPONS TAB --- */}
      {activeTab === 'coupons' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold">Cupons de Desconto Configurados</h2>
            <PremiumButton onClick={() => setShowCouponForm(!showCouponForm)} variant="solid" className="py-2.5 px-4 text-xs tracking-widest flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Criar Cupom</span>
            </PremiumButton>
          </div>

          {/* Add Coupon form expandable */}
          {showCouponForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddCouponSubmit}
              className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-4 max-w-md text-left card-shadow backdrop-blur-[20px]"
            >
              <h3 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold border-b border-zinc-900 pb-2">
                Configurar Cupom de Desconto
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
                    onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-3.5 text-xs text-white outline-none cursor-pointer"
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

          {/* Coupons active lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <GlassCard key={c.code} className="p-4 flex items-center justify-between border border-white/5">
                <div className="flex flex-col text-left">
                  <span className="text-sm text-white font-bold tracking-widest font-sans uppercase">
                    {c.code}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                    Valor: <strong className="text-white">{c.discountType === 'percentage' ? `${c.value}%` : `R$ ${c.value.toFixed(2).replace('.', ',')}`}</strong> de abatimento
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-semibold border ${c.active ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-700/30'}`}>
                    {c.active ? 'Ativo' : 'Pausado'}
                  </span>

                  <button
                    onClick={() => onToggleCoupon(c.code)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all select-none text-xs tracking-wider"
                  >
                    Alternar
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 max-w-xl text-left"
        >
          <h2 className="text-xs uppercase tracking-widest text-[#DFBA6B] font-bold">Configurações Gerais de Vendas</h2>

          <GlassCard className="p-6 flex flex-col gap-4">
            <h3 className="font-serif text-sm text-white font-medium uppercase tracking-wider">Metadados da Infraestrutura</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              Esses dados regulam as conexões de WhatsApp e o CEP de envio base dos envios da Bodin Jóias.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <GlassInput
                label="WhatsApp Central de Atendimento"
                defaultValue="5511999999999"
                placeholder="Ex: 5511999999999"
              />
              <GlassInput
                label="CEP Base de Origem"
                defaultValue="04571-010"
                placeholder="Ex: 04571-010"
              />
              <GlassInput
                label="Valor Mínimo para Frete Grátis (R$)"
                defaultValue="250.00"
                placeholder="250.00"
              />
            </div>

            <PremiumButton variant="solid" className="py-2.5 text-xs self-start mt-2">
              <span>Salvar Configurações</span>
            </PremiumButton>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
