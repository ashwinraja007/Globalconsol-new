
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define and export the list of countries for the admin panel
export const ADMIN_COUNTRIES = [
  { value: "singapore", label: "Singapore 🇸🇬" },
  { value: "srilanka", label: "Sri Lanka 🇱🇰" },
  { value: "myanmar", label: "Myanmar 🇲🇲" },
  { value: "bangladesh", label: "Bangladesh 🇧🇩" },
  { value: "pakistan", label: "Pakistan 🇵🇰" },
  // Add other countries as needed, e.g., UK, USA
  // { value: "uk", label: "United Kingdom 🇬🇧" },
  // { value: "usa", label: "United States 🇺🇸" },
];

// Define the shape of our context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  adminCountry: string;
  setAdminCountry: (country: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  adminCountry: 'singapore',
  setAdminCountry: () => {},
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: false,
  isStaff: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminCountry, setAdminCountryState] = useState<string>(() => {
    return localStorage.getItem('adminCountry') || 'singapore';
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin or staff - simplified for now
  const isAdmin = user?.email === 'admin@oecl.sg' || user?.email === 'admin@globalconsolidator.com';
  const isStaff = profile?.role === 'staff';

  // Fetch user profile - simplified since we don't have profiles table yet
  const fetchProfile = async (userId: string) => {
    try {
      // For now, we'll just set a basic profile
      setProfile({ id: userId, role: (user?.email === 'admin@oecl.sg' || user?.email === 'admin@globalconsolidator.com') ? 'admin' : 'user' });
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  useEffect(() => {
    // Check for our hardcoded mock admin session to bypass Supabase issues
    if (localStorage.getItem('mockAdmin') === 'true') {
      const storedEmail = localStorage.getItem('mockAdminEmail') || 'admin@globalconsolidator.com';
      const mockUser = { id: 'mock-admin-id', email: storedEmail } as User;
      setUser(mockUser);
      setSession({ user: mockUser } as any);
      setProfile({ id: 'mock-admin-id', role: 'admin' });
      setIsLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setAdminCountry = (country: string) => {
    localStorage.setItem('adminCountry', country);
    setAdminCountryState(country);
    toast({
      title: "Switched Country",
      description: `Now managing content for ${ADMIN_COUNTRIES.find(c => c.value === country)?.label || country}.`,
    });
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Hardcoded bypass for the specific admin user requested
      if ((email === 'admin@globalconsolidator.com' || email === 'admin@oecl.sg') && password === 'GCADMIN@2026') {
        localStorage.setItem('mockAdmin', 'true');
        localStorage.setItem('mockAdminEmail', email);
        const mockUser = { id: 'mock-admin-id', email: email } as User;
        setUser(mockUser);
        setSession({ user: mockUser } as any);
        setProfile({ id: 'mock-admin-id', role: 'admin' });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Login error details:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Welcome to OECL!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Handle signout for our hardcoded mock admin
      if (localStorage.getItem('mockAdmin') === 'true') {
        localStorage.removeItem('mockAdmin');
        localStorage.removeItem('mockAdminEmail');
        setUser(null);
        setSession(null);
        setProfile(null);
        navigate('/admin-login');
        return;
      }

      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  // Make the provider with its value available to children components
  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      adminCountry,
      setAdminCountry,
      signIn,
      signUp,
      signOut,
      isAdmin,
      isStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
};
