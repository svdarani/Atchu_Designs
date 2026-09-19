// ==========================================================================
// ATCHU DESIGNS — CLIENT AUTHENTICATION CONTEXT & SESSION MANAGER
// ==========================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('atchu_token') || '';
    } catch {
      return '';
    }
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authRedirect, setAuthRedirect] = useState(null);

  // Check current session on mount or token change
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
          }
        } else {
          // Token invalid or expired
          try {
            localStorage.removeItem('atchu_token');
          } catch {}
          if (isMounted) {
            setToken('');
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Session verification network issue:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Customer Sign In
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Sign in failed. Please check credentials.' };
      }

      localStorage.setItem('atchu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  // Dedicated Admin Sign In
  const adminLogin = async (email, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid admin credentials.' };
      }

      localStorage.setItem('atchu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Network error connecting to Atelier server.' };
    }
  };

  // Customer Registration
  const signup = async (fullName, email, mobile, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, mobile, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      localStorage.setItem('atchu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return { success: true, message: data.message, devResetToken: data.devResetToken };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Reset Password
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Password reset failed.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn('Logout notification error', e);
    } finally {
      try {
        localStorage.removeItem('atchu_token');
      } catch {}
      setToken('');
      setUser(null);
    }
  };

  // Role helpers
  const isAdmin = Boolean(user && user.role === 'admin');
  const isAuthenticated = Boolean(user);

  // Quick switch role (convenience bridge for existing demo flows)
  const switchRole = async (targetRole) => {
    if (targetRole === 'admin') {
      await adminLogin('orders.atchudesigns@gmail.com', 'AtchuAdmin@2026!');
    } else {
      await login('kavitha.r@gmail.com', 'Kavitha@2026!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        currentUser: user, // backward-compat with components using currentUser
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        adminLogin,
        signup,
        forgotPassword,
        resetPassword,
        logout,
        switchRole,
        authRedirect,
        setAuthRedirect
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
