import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Company, AuthState, PlanType, UserRole, CompanyStatus } from '../types';
import { supabase } from '../services/supabaseClient';
import { PLAN_PERMISSIONS } from '../config/planPermissions';

type DemoProfile = 'ADMIN_GLOBAL' | 'REP_BOGOTA' | 'DELIVERER_MASTER' | 'BOD_ADMIN' | 'SUPER_MASTER' | 'SUPERVISOR_DEMO' | 'IA_PREDICTIVE';

interface AuthContextType extends AuthState {
  permissions: string[];
  role: UserRole | null;
  login: (email: string) => Promise<void>;
  loginWithMagicLink: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (profile: DemoProfile, plan?: PlanType) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Motor de Expiración Anycast Sentinel
 * Compara las fechas de vencimiento del plan o trial contra el tiempo real.
 * Si ha expirado, transmuta el status a SUSPENDED.
 */
const enforceExpirationPolicy = (company: Company): Company => {
  if (company.status === 'SUSPENDED') return company;

  const expirationDate = company.plan_expires_at || company.trialEndDate;
  
  if (expirationDate) {
    const now = new Date();
    const exp = new Date(expirationDate);
    
    if (now > exp) {
      console.warn(`[SENTINEL] Nodo ${company.id} expirado el ${expirationDate}. Acceso restringido.`);
      return { ...company, status: 'SUSPENDED' };
    }
  }
  
  return company;
};

const getInitialState = (): AuthState => {
  try {
    const savedUser = localStorage.getItem('sfa_user');
    const savedCompanyStr = localStorage.getItem('sfa_company');
    
    if (savedUser && savedCompanyStr) {
      const savedCompany = JSON.parse(savedCompanyStr);
      // Validar expiración al hidratar
      const validatedCompany = enforceExpirationPolicy(savedCompany);
      
      return {
        user: JSON.parse(savedUser),
        company: validatedCompany,
        isAuthenticated: true
      };
    }
  } catch (e) {
    console.warn("Auth hydration failed:", e);
  }
  return { user: null, company: null, isAuthenticated: false };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [auth, setAuth] = useState<AuthState>(getInitialState());

  useEffect(() => {
    const verifyAuth = () => {
      try {
        const savedUser = localStorage.getItem('sfa_user');
        const savedCompanyStr = localStorage.getItem('sfa_company');
        
        if (savedUser && savedCompanyStr && !auth.isAuthenticated) {
          const savedCompany = JSON.parse(savedCompanyStr);
          const validatedCompany = enforceExpirationPolicy(savedCompany);
          
          setAuth({ 
            user: JSON.parse(savedUser), 
            company: validatedCompany, 
            isAuthenticated: true 
          });
        }
      } catch (e) {
        console.error("Auth validation failed:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    
    const timer = setTimeout(verifyAuth, 100);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated]);

  const fetchPermissions = async (userId: string, roleId: string | null): Promise<string[]> => {
    try {
      let rolePermissions: string[] = [];
      let userPermissions: string[] = [];

      if (roleId) {
        const { data: rpData } = await supabase
          .from('role_permissions')
          .select('permissions(name)')
          .eq('role_id', roleId);
        
        rolePermissions = rpData?.map((item: any) => item.permissions?.name).filter(Boolean) || [];
      }

      const { data: upData } = await supabase
        .from('user_permissions')
        .select('permissions(name)')
        .eq('user_id', userId);
      
      userPermissions = upData?.map((item: any) => item.permissions?.name).filter(Boolean) || [];

      return Array.from(new Set([...rolePermissions, ...userPermissions]));
    } catch (error) {
      console.error("Critical error fetching RBAC permissions:", error);
      return [];
    }
  };

  const loginDemo = (profile: DemoProfile, plan: PlanType = 'Professional') => {
    let mockUser: User;
    const assignedPlan = (profile === 'ADMIN_GLOBAL' || profile === 'SUPER_MASTER' || profile === 'SUPERVISOR_DEMO' || profile === 'BOD_ADMIN' || profile === 'IA_PREDICTIVE') ? 'Enterprise' : plan;
    
    let mockCompany: Company = { 
      id: profile === 'SUPER_MASTER' ? 'DM-HQ' : 'DEMO-CORP-1', 
      name: profile === 'SUPER_MASTER' ? 'Headquarters' : 'DistriMaster Demo', 
      logo: 'https://cdn-icons-png.flaticon.com/512/3061/3061341.png', 
      primaryColor: '#137fec',
      plan: assignedPlan,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    mockCompany = enforceExpirationPolicy(mockCompany);
    const planBasePermissions = PLAN_PERMISSIONS[mockCompany.plan] || [];

    switch (profile) {
      case 'SUPER_MASTER':
        mockUser = { id: 'MASTER', name: 'Master Admin', email: 'master@distrimaster.co', role: 'SUPER_ADMIN', companyId: 'DM-HQ', city: 'Global', avatar: 'https://i.pravatar.cc/150?u=hq', permissions: planBasePermissions };
        break;
      case 'ADMIN_GLOBAL':
      case 'IA_PREDICTIVE':
        mockUser = { id: 'ADM001', name: 'Carlos Ruiz', email: 'admin@demo.com', role: 'ADMIN', companyId: 'DEMO-CORP-1', city: 'Bogotá', avatar: 'https://i.pravatar.cc/150?u=adm', permissions: planBasePermissions };
        break;
      case 'SUPERVISOR_DEMO':
        mockUser = { id: 'SUP007', name: 'Ricardo Supervisor', email: 'super@demo.com', role: 'SUPERVISOR', companyId: 'DEMO-CORP-1', city: 'Zona Norte', avatar: 'https://i.pravatar.cc/150?u=sup', permissions: planBasePermissions.filter(p => p !== "MANAGE_TENANTS") };
        break;
      case 'BOD_ADMIN':
        mockUser = { id: 'BOD101', name: 'Alba Lucía R.', email: 'bodega@demo.com', role: 'WAREHOUSE_ADMIN', companyId: 'DEMO-CORP-1', city: 'Sede Principal', avatar: 'https://i.pravatar.cc/150?u=bod', permissions: planBasePermissions.filter(p => ["VIEW_INVENTORY", "MANAGE_INVENTORY", "VIEW_MANIFESTS"].includes(p) || p.startsWith("VIEW_")) };
        break;
      case 'REP_BOGOTA':
        mockUser = { id: 'VEN102', name: 'Juan Vendedor', email: 'ventas@demo.com', role: 'REPRESENTATIVE', companyId: 'DEMO-CORP-1', city: 'Medellín', avatar: 'https://i.pravatar.cc/150?u=rep', permissions: planBasePermissions.filter(p => ["VIEW_ORDERS", "CREATE_ORDERS", "VIEW_CATALOG", "VIEW_ROUTE"].includes(p)) };
        break;
      case 'DELIVERER_MASTER':
        mockUser = { id: 'ENT505', name: 'Mario Chofer', email: 'entregas@demo.com', role: 'DELIVERER', companyId: 'DEMO-CORP-1', city: 'Cali', avatar: 'https://i.pravatar.cc/150?u=ent', permissions: planBasePermissions.filter(p => ["VIEW_MANIFESTS", "UPDATE_DELIVERY_STATUS", "PROCESS_PAYMENT"].includes(p) || p.startsWith("VIEW_")) };
        break;
      default:
        mockUser = { id: 'USR', name: 'Usuario Demo', email: 'demo@demo.com', role: 'ADMIN', companyId: 'DEMO-CORP-1', city: 'Central', avatar: 'https://i.pravatar.cc/150?u=usr', permissions: planBasePermissions };
    }

    localStorage.setItem('sfa_user', JSON.stringify(mockUser));
    localStorage.setItem('sfa_company', JSON.stringify(mockCompany));
    setAuth({ user: mockUser, company: mockCompany, isAuthenticated: true });
    setIsInitializing(false);
  };

  const loginWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const syncProfile = async (supabaseUser: any) => {
    if (!supabaseUser) return;

    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('*, companies!inner(*)')
      .eq('id', supabaseUser.id)
      .single();

    if (pError || !profile) {
      console.warn("Profile not found for authenticated user:", supabaseUser.email);
      // If profile doesn't exist yet (e.g. first time Google login), we might need to handle it.
      // For now, we assume profiles are created during onboarding.
      return;
    }
    
    const realPermissions = await fetchPermissions(profile.id, profile.role_id);

    const userObj: User = { 
      id: profile.id, 
      name: profile.full_name, 
      email: profile.email, 
      role: profile.role as UserRole, 
      companyId: profile.company_id, 
      city: profile.city || 'Sede Principal', 
      avatar: profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`,
      permissions: realPermissions
    };

    let companyObj: Company = { 
      id: profile.companies.id, 
      name: profile.companies.name, 
      logo: profile.companies.logo_url || '', 
      primaryColor: profile.companies.primary_color || '#137fec', 
      plan: profile.companies.plan as PlanType, 
      status: profile.companies.status, 
      createdAt: profile.companies.created_at,
      plan_expires_at: profile.companies.plan_expires_at,
      trialEndDate: profile.companies.trial_ends_at
    };

    companyObj = enforceExpirationPolicy(companyObj);

    localStorage.setItem('sfa_user', JSON.stringify(userObj));
    localStorage.setItem('sfa_company', JSON.stringify(companyObj));
    setAuth({ user: userObj, company: companyObj, isAuthenticated: true });
  };

  useEffect(() => {
    // Escuchar cambios en la sesión de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await syncProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('sfa_user');
        localStorage.removeItem('sfa_company');
        setAuth({ user: null, company: null, isAuthenticated: false });
      }
      setIsInitializing(false);
    });

    // Verificación inicial
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncProfile(session.user);
      } else {
        // Fallback a localStorage para demos o sesiones persistidas manualmente
        const savedUser = localStorage.getItem('sfa_user');
        const savedCompanyStr = localStorage.getItem('sfa_company');
        if (savedUser && savedCompanyStr) {
          setAuth({
            user: JSON.parse(savedUser),
            company: enforceExpirationPolicy(JSON.parse(savedCompanyStr)),
            isAuthenticated: true
          });
        }
      }
      setIsInitializing(false);
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sfa_user');
    localStorage.removeItem('sfa_company');
    setAuth({ user: null, company: null, isAuthenticated: false });
    setIsInitializing(false);
  };

  return (
    <AuthContext.Provider value={{ 
      ...auth, 
      permissions: auth.user?.permissions || [],
      role: auth.user?.role || null,
      login: loginWithMagicLink, // Alias para compatibilidad o uso directo
      loginWithMagicLink,
      loginWithGoogle,
      loginDemo, 
      updateUser: (data: Partial<User>) => {
        if (!auth.user) return;
        const updated = { ...auth.user, ...data };
        setAuth(prev => ({ ...prev, user: updated }));
        localStorage.setItem('sfa_user', JSON.stringify(updated));
      }, 
      logout, 
      isInitializing 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};