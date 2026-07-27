import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { Product, Order, Coupon, AppSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS } from './data';

const firebaseConfig = {
  apiKey: "AIzaSyBh7doC_WbbAWOSbY_9VWUCfCKVOaUA6Ok",
  authDomain: "gen-lang-client-0615778109.firebaseapp.com",
  projectId: "gen-lang-client-0615778109",
  storageBucket: "gen-lang-client-0615778109.firebasestorage.app",
  messagingSenderId: "603248216329",
  appId: "1:603248216329:web:d9734453818b546c32ebd8"
};

// Initialize Firebase with custom database ID
const app = initializeApp(firebaseConfig);
const databaseId = "ai-studio-f8ac600a-ffe9-45b6-acb4-827ba339d57c";
export const db = getFirestore(app, databaseId);

// --- Firestore Helpers ---

// Products
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsList: Product[] = [];
    querySnapshot.forEach((doc) => {
      productsList.push(doc.data() as Product);
    });

    if (productsList.length === 0) {
      // Seed initial products
      console.log('Seeding initial products to Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
        productsList.push(prod);
      }
    }
    return productsList;
  } catch (error) {
    console.error('Error fetching products from Firestore, falling back to local:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function saveProductToDb(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
  }
}

// Settings
export async function getSettingsFromDb(): Promise<AppSettings> {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppSettings;
    } else {
      const defaultSettings: AppSettings = {
        whatsapp: '5511999999999',
        cepOrigem: '04571-010',
        minFreteGratis: 250.00,
        homepageBanners: [
          {
            id: 'banner-1',
            image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80',
            title: 'Use Bodin e fique chique ',
            subtitle: 'Ande alinhado com a presença imponente das joias em Moeda Antiga banhadas em Ouro 18K. Idênticas ao ouro maciço no peso e brilho.',
            tag: 'Presença e Status',
            linkView: 'catalog',
            active: true
          }
        ]
      };
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching settings from Firestore:', error);
    return {
      whatsapp: '5511999999999',
      cepOrigem: '04571-010',
      minFreteGratis: 250.00
    };
  }
}

export async function saveSettingsToDb(settings: AppSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'global'), settings);
  } catch (error) {
    console.error('Error saving settings to Firestore:', error);
  }
}

// Coupons
export async function getCouponsFromDb(): Promise<Coupon[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'coupons'));
    const couponsList: Coupon[] = [];
    querySnapshot.forEach((docSnap) => {
      couponsList.push(docSnap.data() as Coupon);
    });

    if (couponsList.length === 0) {
      console.log('Seeding initial coupons to Firestore...');
      for (const coupon of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', coupon.code), coupon);
        couponsList.push(coupon);
      }
    }
    return couponsList;
  } catch (error) {
    console.error('Error fetching coupons from Firestore:', error);
    return INITIAL_COUPONS;
  }
}

export async function saveCouponToDb(coupon: Coupon): Promise<void> {
  try {
    await setDoc(doc(db, 'coupons', coupon.code), coupon);
  } catch (error) {
    console.error('Error saving coupon to Firestore:', error);
  }
}

export async function deleteCouponFromDb(code: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'coupons', code));
  } catch (error) {
    console.error('Error deleting coupon from Firestore:', error);
  }
}

// Orders
export async function getOrdersFromDb(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const ordersList: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      ordersList.push(docSnap.data() as Order);
    });

    if (ordersList.length === 0) {
      console.log('Seeding initial orders to Firestore...');
      for (const order of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', order.id), order);
        ordersList.push(order);
      }
    }
    return ordersList;
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return INITIAL_ORDERS;
  }
}

export async function saveOrderToDb(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, 'orders', order.id), order);
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
  }
}
