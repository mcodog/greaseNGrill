import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auth');
        setUser(res.data.user)
        if (res.data.user.role == 'Admin') {
          setIsAdmin(true)
        }
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, isAdmin }}>
      {loading ? <div></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);