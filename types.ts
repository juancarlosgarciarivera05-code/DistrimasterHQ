export type UserRole = 'ADMIN' | 'WAREHOUSE_ADMIN' | 'REPRESENTATIVE' | 'DELIVERER' | 'SUPER_ADMIN' | 'SUPERVISOR';
export type PlanType = 'Starter' | 'Professional' | 'Enterprise';
export type CompanyStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export interface Company {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  plan: PlanType;
  status: CompanyStatus;
  trialEndDate?: string;
  trial_started_at?: string;
  plan_expires_at?: string; // Campo universal de expiración
  sandbox_started_at?: string;
  sandbox_expires_at?: string;
  nurturing_stage?: string;
  last_nurturing_sent_at?: string;
  createdAt: string;
  mrr?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  city: string;
  avatar: string;
  sku?: string; 
  permissions?: string[];
}

export interface Customer {
  id: string;
  name: string;
  owner_name: string;
  address: string;
  city: string;
  barrio: string;
  phone: string;
  route_id: string;
  visit_day: string;
  delivery_type: 'Pre' | 'Auto';
  merchant_type: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  weight: number; 
  image_url?: string;
  is_promo?: boolean;
  promo_price?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  company_id: string;
  customer_id: string;
  rep_id?: string;
  total_amount: number;
  status: 'PENDING' | 'APPROVED' | 'SHIPPED' | 'DELIVERED' | 'REJECTED';
  is_qr_order: boolean;
  created_at: string;
  customers?: any;
  profiles?: any;
}

export interface DeliveryStop {
  id: string;
  client: string;
  address: string;
  orders: number;
  amount: string;
  status: 'pending' | 'delivered' | 'returned' | 'active' | 'closed';
  products?: CartItem[];
  reason?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  orderId?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Vehicle {
  id: string;
  model: string;
  capacityKg: number;
  type: 'PROPIO' | 'ALQUILADO';
  status: 'DISPONIBLE' | 'EN_RUTA' | 'MANTENIMIENTO';
  driver?: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
}

export interface RouteTarget {
  route_id: string;
  route_name: string;
  amount: number;
}

export interface ZoneTarget {
  zone_name: string;
  amount: number;
  route_targets: RouteTarget[];
}

export interface SalesTarget {
  id?: string;
  company_id: string;
  period: string;
  global_amount: number;
  zone_targets: ZoneTarget[];
}