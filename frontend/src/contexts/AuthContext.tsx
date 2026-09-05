import React, { createContext, useContext, useState, useEffect } from 'react';
import { rawSupabase, isSupabaseConfigured } from '@/lib/supabase';

export type UserRoleType = 'student' | 'admin' | 'teacher' | 'parent' | 'examination_controller';

export interface User {
  id: string;
  name: string;
  email: string;
  collegeName?: string;
  role?: UserRoleType;
  semester?: number;
  branch?: string;
  department?: string;
  roll_number?: string;
  employee_id?: string;
  subjects?: string[];
  avatar?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  signInWithSupabase: (email: string, password: string) => Promise<AuthResult>;
  signUpWithSupabase: (params: {
    email: string;
    password: string;
    name: string;
    role: UserRoleType;
    collegeName?: string;
  }) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const fetchProfileForUser = async (authUser: { id: string; email?: string; user_metadata?: any }): Promise<User> => {
  let profileData: any = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await rawSupabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      }
    } catch (e) {
      console.warn('Profile fetch warning (falling back to user metadata):', e);
    }
  }

  const meta = authUser.user_metadata || {};
  const role: UserRoleType = (profileData?.role as UserRoleType) || (meta.role as UserRoleType) || 'student';
  const name: string = profileData?.name || meta.name || authUser.email?.split('@')[0] || 'User';
  const collegeName: string = profileData?.college_name || meta.college_name || 'Nexora University';

  const userObj: User = {
    id: authUser.id,
    name,
    email: authUser.email || profileData?.email || '',
    role,
    collegeName,
    department: profileData?.department || meta.department,
    branch: profileData?.branch || meta.branch,
    semester: profileData?.semester,
    roll_number: profileData?.roll_number,
    employee_id: profileData?.employee_id,
    avatar: profileData?.avatar_url || meta.avatar_url,
  };

  return userObj;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization prevents race condition on initial render / fast redirects
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('campussync-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing saved user data on init:', error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync state helper
  const login = (userData: User) => {
    try {
      localStorage.setItem('campussync-user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to write user to localStorage:', e);
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await rawSupabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    } finally {
      try {
        localStorage.removeItem('campussync-user');
      } catch (e) {}
      setUser(null);
    }
  };

  const signInWithSupabase = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim();
      const { data, error } = await rawSupabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed: No user record returned from Supabase.' };
      }

      const mappedUser = await fetchProfileForUser(data.user);
      login(mappedUser);
      return { success: true, user: mappedUser };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithSupabase = async ({
    email,
    password,
    name,
    role,
    collegeName,
  }: {
    email: string;
    password: string;
    name: string;
    role: UserRoleType;
    collegeName?: string;
  }): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim();
      const { data, error } = await rawSupabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name,
            role,
            college_name: collegeName || 'Nexora University',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Automatically attempt to insert/upsert a profile row in the profiles table
      try {
        await rawSupabase.from('profiles').upsert(
          {
            id: data.user.id,
            name,
            email: cleanEmail,
            role,
            college_name: collegeName || 'Nexora University',
            status: 'active',
          },
          { onConflict: 'id' }
        );
      } catch (profileErr) {
        console.warn('Could not auto-insert profile row in database:', profileErr);
      }

      // Check if session was granted immediately (email confirmation disabled)
      if (data.session && data.user) {
        const mappedUser = await fetchProfileForUser(data.user);
        login(mappedUser);
        return { success: true, user: mappedUser, requiresEmailConfirmation: false };
      }

      return { success: true, requiresEmailConfirmation: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred during sign up.' };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: { session } } = await rawSupabase.auth.getSession();
      if (session?.user) {
        const mapped = await fetchProfileForUser(session.user);
        login(mapped);
      }
    } catch (e) {
      console.warn('Error refreshing Supabase session:', e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await rawSupabase.auth.getSession();
          if (session?.user && mounted) {
            const mapped = await fetchProfileForUser(session.user);
            login(mapped);
          }
        }
      } catch (err) {
        console.warn('Error during Supabase initial auth check:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Supabase Auth State Change Listener
    let authSubscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      const { data } = rawSupabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const mapped = await fetchProfileForUser(session.user);
          login(mapped);
        } else if (event === 'SIGNED_OUT') {
          // Only clear if not in judge/demo session mode
          try {
            const saved = localStorage.getItem('campussync-user');
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.id?.startsWith('20CS') || parsed?.id?.startsWith('T10') || parsed?.id?.startsWith('ADM') || parsed?.id?.startsWith('coe_')) {
                // Keep judge demo session
                return;
              }
            }
          } catch (e) {}
          setUser(null);
        }
      });
      authSubscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signInWithSupabase,
    signUpWithSupabase,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};