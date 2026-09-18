import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Current user role: 'customer' or 'admin'
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('atchu_role') || 'customer';
    } catch {
      return 'customer';
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return {
      id: 'cust-01',
      name: 'Kavitha Ramachandran',
      phone: '+91 94432 18900',
      email: 'kavitha.r@gmail.com',
      addresses: [
        {
          id: 'addr-1',
          name: 'Home',
          address: 'Plot 12, Sri Nagar 2nd Street, Anna Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600040',
          isDefault: true
        }
      ]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('atchu_role', role);
    } catch (e) {
      console.warn('Failed to save role', e);
    }
  }, [role]);

  const switchRole = (newRole) => {
    if (newRole === 'admin' || newRole === 'customer') {
      setRole(newRole);
    }
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin,
        switchRole,
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
