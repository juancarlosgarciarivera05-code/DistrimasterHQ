import { supabase } from './supabaseClient';
import { MOCK_PRODUCTS } from '../constants';

export const staffService = {
  async getAll(companyId: string) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('company_id', companyId);
      if (error) throw error;
      return data || [];
    } catch (e) {
      return [{ id: 's1', full_name: 'Carlos Admin', role: 'ADMIN', city: 'Bogotá', avatar_url: 'https://i.pravatar.cc/150?u=1' }];
    }
  },
  async create(member: any) {
    const { data, error } = await supabase.from('profiles').insert([member]).select();
    if (error) throw error;
    return data[0];
  }
};

export const dashboardService = {
  async getStats(companyId: string) {
    try {
      const { data: rawOrders, error } = await supabase.from('orders').select('*, customers(name, city), profiles(full_name)').eq('company_id', companyId);
      if (error) throw error;
      const revenue = (rawOrders || []).reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
      return { revenue, orderCount: rawOrders?.length || 0, customerCount: 45, lowStockCount: 3 };
    } catch (e) {
      return { revenue: 92450000, orderCount: 124, customerCount: 850, lowStockCount: 12 };
    }
  }
};

export const customerService = {
  async getAll(companyId: string) {
    try {
      const { data, error } = await supabase.from('customers').select('*, routes(name)').eq('company_id', companyId);
      if (error) throw error;
      return data || [];
    } catch (e) {
      return [];
    }
  },
  async create(customer: any) {
    const { data, error } = await supabase.from('customers').insert([customer]).select();
    if (error) throw error;
    return data[0];
  }
};

export const orderService = {
  async getCompanyOrders(companyId: string) {
    try {
      const { data, error } = await supabase.from('orders').select('*, customers(name, city, address), profiles(full_name)').eq('company_id', companyId);
      if (error) throw error;
      return data || [];
    } catch (e) {
      return [];
    }
  },
  async createOrder(order: any, items: any[]) {
    const { data, error } = await supabase.from('orders').insert([order]).select();
    if (error) throw error;
    return data[0];
  }
};

export const productService = {
  async getAll(companyId: string) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('company_id', companyId);
      if (error) throw error;
      return data && data.length > 0 ? data : MOCK_PRODUCTS.map(p => ({ ...p, image_url: p.image }));
    } catch (e) {
      return MOCK_PRODUCTS.map(p => ({ ...p, image_url: p.image }));
    }
  },
  async create(product: any) {
    await supabase.from('products').insert([product]);
  }
};

export const inventoryService = {
  async registerEntry(entry: any) {
    const { error } = await supabase.from('inventory_transactions').insert([{
      ...entry,
      type: 'INBOUND'
    }]);
    if (error) throw error;
  },
  async getKardex(companyId: string) {
    const { data } = await supabase.from('inventory_transactions').select('*').eq('company_id', companyId);
    return data || [];
  }
};

export const targetService = {
  async getTarget(companyId: string, period: string) {
    try {
      const { data, error } = await supabase.from('sales_targets').select('*').eq('company_id', companyId).eq('period', period).maybeSingle();
      if (error) throw error;
      return data || null;
    } catch (e) {
      return null;
    }
  },
  async saveTarget(target: any) {
    await supabase.from('sales_targets').upsert([target], { onConflict: 'company_id,period' });
  }
};

export const routeService = {
  async getAll(companyId: string) {
    try {
      const { data, error } = await supabase.from('routes').select('*').eq('company_id', companyId);
      if (error) throw error;
      return data || [];
    } catch (e) {
      return [];
    }
  },
  async create(route: any) {
    await supabase.from('routes').insert([route]);
  }
};

export const fleetService = {
  async getAll(companyId: string) {
    return [{ id: 'BGT-123', model: 'NHR 3.5 Ton', status: 'DISPONIBLE' }];
  }
};

export const manifestService = {
  async getActiveForDriver(driverId: string) {
    return null;
  },
  async getAllActive(companyId: string) {
    return [];
  }
};

export const monitoringService = {
  async getLiveStaffStatus(companyId: string) {
    return { visits: [], manifests: [] };
  }
};

export const visitService = {
  async startVisit(data: any) { return { id: 'v1' }; },
  async endVisit(id: string, outcome: string, notes: string) {}
};

export const performanceService = {
  async getRepStats(repId: string, companyId: string) {
    return { totalSold: 4500000, monthlyTarget: 15000000, orderCount: 12, visitEfectivity: 85, dropSize: 375000 };
  }
};