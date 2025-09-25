'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with proper cookie handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: {
        getItem: (key: string) => {
          if (typeof window === 'undefined') return null;
          return window.localStorage.getItem(key);
        },
        setItem: (key: string, value: string) => {
          if (typeof window === 'undefined') return;
          window.localStorage.setItem(key, value);
          
          // Also set cookies for middleware
          if (key.includes('supabase.auth.token')) {
            try {
              const session = JSON.parse(value);
              if (session.access_token && session.refresh_token) {
                document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600; SameSite=Lax`;
                document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
              }
            } catch (e) {
              console.log('Failed to parse session for cookies');
            }
          }
        },
        removeItem: (key: string) => {
          if (typeof window === 'undefined') return;
          window.localStorage.removeItem(key);
          
          // Also remove cookies
          if (key.includes('supabase.auth.token')) {
            document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        },
      },
    },
  }
);
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
            });
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email,
              name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0],
            });
          }
        } else {
          setUser(null);
        }
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      // Manually set cookies for immediate middleware recognition
      if (data.session) {
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      
      router.push('/polls');
    } catch (error: any) {
      console.error('Sign in failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }
      router.push('/auth/sign-in');
    } catch (error: any) {
      console.error('Sign up failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear cookies
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      router.push('/');
    } catch (error: any) {
      console.error('Sign out failed:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}