'use client'; // Important pour les composants utilisant des hooks React dans le App Router

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Pour le App Router de Next.js

// Définition de l'interface pour le contexte d'authentification
interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  token: string | null;
  login: (token: string, email: string, name: string) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>; // Pour les requêtes authentifiées
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Composant Provider pour l'authentification
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Charge l'état d'authentification depuis le localStorage au démarrage du composant
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedEmail = localStorage.getItem('user_email');
    const storedName = localStorage.getItem('user_name');

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUserEmail(storedEmail);
      setUserName(storedName); // Peut être null si non défini
      setIsLoggedIn(true);
    }
  }, []);

  // Fonction de connexion : met à jour l'état et stocke les données dans localStorage
  const login = useCallback((newToken: string, email: string, name: string) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name);
    setToken(newToken);
    setUserEmail(email);
    setUserName(name);
    setIsLoggedIn(true);
  }, []);

  // Fonction de déconnexion : nettoie l'état et le localStorage, puis redirige
  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setToken(null);
    setUserEmail(null);
    setUserName(null);
    setIsLoggedIn(false);
    router.push('/login');
  }, [router]);

  // Fonction utilitaire pour faire des requêtes fetch avec le token JWT
  const fetchWithAuth = useCallback(async (url: string, options?: RequestInit) => {
    const headers: Record<string, string> = {
      ...(options?.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : (options?.headers as Record<string, string> ?? {}))
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, [token]);

  // Valeurs fournies par le contexte à tous les composants enfants
  const contextValue = React.useMemo(() => ({
    isLoggedIn,
    userEmail,
    userName,
    token,
    login,
    logout,
    fetchWithAuth,
  }), [isLoggedIn, userEmail, userName, token, login, logout, fetchWithAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
