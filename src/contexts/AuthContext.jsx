import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserKey = (u) => {
    if (!u) return null;
    const identifier = u.enrollment || u.email || u.studentId || u.id || 'unknown';
    return `${u.role || 'user'}:${identifier}`;
  };

  const readProfileFromStorage = (u) => {
    try {
      const key = getUserKey(u);
      if (!key) return null;
      const raw = localStorage.getItem(`profile:${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  };

  const writeProfileToStorage = (u) => {
    try {
      const key = getUserKey(u);
      if (!key) return;
      localStorage.setItem(`profile:${key}` , JSON.stringify(u));
    } catch (_) {}
  };

  useEffect(() => {
    // Check if user is logged in from persistent or session storage
    const savedLocal = localStorage.getItem('user');
    const savedSession = sessionStorage.getItem('user');
    if (savedLocal) {
      const parsed = JSON.parse(savedLocal);
      const profile = readProfileFromStorage(parsed);
      setUser(profile ? { ...parsed, ...profile } : parsed);
    } else if (savedSession) {
      const parsed = JSON.parse(savedSession);
      const profile = readProfileFromStorage(parsed);
      setUser(profile ? { ...parsed, ...profile } : parsed);
    }
    setLoading(false);
  }, []);

  const login = (userData, remember) => {
    const profile = readProfileFromStorage(userData);
    const mergedUser = profile ? { ...userData, ...profile } : userData;
    setUser(mergedUser);
    try {
      if (remember) {
        localStorage.setItem('user', JSON.stringify(mergedUser));
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('user', JSON.stringify(mergedUser));
        localStorage.removeItem('user');
      }
      writeProfileToStorage(mergedUser);
    } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    } catch (_) {}
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    try {
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
      writeProfileToStorage(updatedUser);
    } catch (_) {}
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
