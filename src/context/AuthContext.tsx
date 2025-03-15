"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, validateCredentials, generateToken, setAuthCookie, removeAuthCookie, getAuthCookie, verifyToken } from '@/utils/auth';

// Define the auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Create the auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check if there's a token in localStorage or cookies
        const token = localStorage.getItem('adminToken') || getAuthCookie();
        
        if (token) {
          // Verify the token
          const userData = await verifyToken(token);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('adminToken');
            removeAuthCookie();
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate credentials
      const userData = await validateCredentials(email, password);
      
      if (userData) {
        // Generate token
        const token = await generateToken(userData);
        
        // Store token in localStorage and cookies
        localStorage.setItem('adminToken', token);
        setAuthCookie(token);
        
        setUser(userData);
        setIsAuthenticated(true);
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    removeAuthCookie();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 