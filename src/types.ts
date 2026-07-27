export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  secondaryImages: string[];
  weight: string; // e.g. "45g"
  length: string[]; // e.g. ["60cm", "70cm"]
  thickness: string; // e.g. "8mm"
  clasp: string[]; // e.g. ["Gaveta", "Canhão", "Mosquetão"]
  plating: string; // e.g. "Ouro 18K (Banho de 10 milésimos)"
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  stock: number;
  isBestSeller: boolean;
  isNew: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  displayOrder?: number;
  technicalSpecs?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedLength: string;
  selectedClasp: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    length: string;
    clasp: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'pix' | 'credit_card' | 'mercado_pago';
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  date: string;
}

export type ViewState = 'home' | 'catalog' | 'product_details' | 'cart' | 'checkout' | 'admin';

export interface AppSettings {
  whatsapp: string;
  cepOrigem: string;
  minFreteGratis: number;
  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  instagramUrl?: string;
  address?: string;
  operationHours?: string;
  primaryColor?: string;
  globalSeoTitle?: string;
  globalSeoDescription?: string;
  globalSeoKeywords?: string;
  termsOfUse?: string;
  privacyPolicy?: string;
  refundPolicy?: string;
  // Homepage Configurations
  homepageBanners?: {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    tag?: string;
    linkView?: string;
    active: boolean;
  }[];
  homepageSections?: {
    id: string;
    name: string;
    active: boolean;
    order: number;
  }[];
  categoryShowcase?: {
    correntes: {
      title: string;
      slogan: string;
      image: string;
    };
    pulseiras: {
      title: string;
      slogan: string;
      image: string;
    };
  };
}

