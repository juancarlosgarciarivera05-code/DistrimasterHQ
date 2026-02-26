import { Product } from './types';

export const APP_VERSION = "22.0.0-FINAL-SYNC";
export const BUILD_DATE = "2024-10-25";

export const STORAGE_KEYS = {
  PRICES: 'dm_v8_prices',
  CURRENCY: 'dm_v8_currency'
};

export const GLOBAL_PRICING = {
  currency: 'USD',
  annual_discount_percentage: 20,
  plans: {
    Starter: {
      monthly: 70,
      annual: 56, // 70 * 0.8
    },
    Professional: {
      monthly: 90,
      annual: 72, // 90 * 0.8
    },
    Enterprise: {
      monthly: 150,
      annual: 120, // 150 * 0.8
    },
    EnterpriseFounder: {
      cycle_price: 150, // per 90 days
      cycles_included: 2,
    }
  }
};

export const getPricingConfig = () => {
  try {
    const savedPrices = localStorage.getItem(STORAGE_KEYS.PRICES);
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    
    return {
      currency: savedCurrency || GLOBAL_PRICING.currency,
      plans: savedPrices ? JSON.parse(savedPrices) : { ...GLOBAL_PRICING.plans }
    };
  } catch (e) {
    console.error("Error leyendo precios, usando default", e);
    return {
      currency: GLOBAL_PRICING.currency,
      plans: { ...GLOBAL_PRICING.plans }
    };
  }
};

export const MOCK_PRODUCTS: Product[] = [
  { id: 'DW-998-X', sku: 'DW-998-X', name: 'Taladro Percutor Inalámbrico 20V MAX XR', price: 780000, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', category: 'Herramientas Eléctricas', stock: 150, weight: 2.5 },
  { id: 'ST-40-SET', sku: 'ST-40-SET', name: 'Juego de Llaves Combinadas 40 Piezas', price: 345500, image: 'https://images.unsplash.com/photo-1530124560676-5f7bc47f271b?auto=format&fit=crop&q=80&w=400', category: 'Herramientas Manuales', stock: 12, weight: 4.8 },
  { id: '3M-H-500', sku: '3M-H-500', name: 'Casco de Seguridad Industrial H-700', price: 58900, image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400', category: 'Seguridad', stock: 0, weight: 0.5 },
  { id: 'BO-CS-18', sku: 'BO-CS-18', name: 'Sierra Circular GKS 190 Professional', price: 595000, image: 'https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?auto=format&fit=crop&q=80&w=400', category: 'Herramientas Eléctricas', stock: 500, weight: 4.2 },
  { id: 'DW-745', sku: 'DW-745', name: 'Sierra de Banco Compacta 10 Pulgadas', price: 1650000, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400', category: 'Herramientas Eléctricas', stock: 8, weight: 22.0 },
  { id: 'MK-99', sku: 'MK-99', name: 'Amoladora Angular 4.5 Pulgadas', price: 285000, image: 'https://images.unsplash.com/photo-1590236162851-898350c4062c?auto=format&fit=crop&q=80&w=400', category: 'Herramientas Eléctricas', stock: 25, weight: 1.9 },
];

export const APP_PRIMARY_COLOR = '#0070f3';