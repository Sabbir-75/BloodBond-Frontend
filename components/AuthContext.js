// BloodBond Frontend - login state (Auth Context)
// Keeps the logged-in user in memory for the whole website.
// Token + user are saved in the browser (localStorage) at login, removed at logout.

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getSavedUser, getToken, saveToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On first load, read the saved login (if any).
  useEffect(() => {
    if (getToken()) {
      setUser(getSavedUser());
    }
    setReady(true);
  }, []);

  // Called after a successful login: save token + user, update state.
  function login(token, userData) {
    saveToken(token);
    localStorage.setItem('bloodbond_user', JSON.stringify(userData));
    setUser(userData);
  }

  // Logout: remove token + user, go back to guest state.
  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Easy access in any page: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
