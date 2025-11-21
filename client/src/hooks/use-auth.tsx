import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

type AuthValue = {
  token: string | null;
  role: string | null;
  user: { email?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));
  const [user, setUser] = useState<{ email?: string } | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const base = import.meta.env.VITE_API_BASE_URL;

  // 🔐 Decode token expiration (works for JWTs)
  const getTokenExpiration = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return null;
      return payload.exp * 1000; // convert seconds → ms
    } catch {
      return null;
    }
  };

  // 🚪 Logout function
  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  }, []);

  // 🔁 Persist to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // 🕒 Auto logout when token expires
  useEffect(() => {
    if (!token) return;

    const exp = getTokenExpiration(token);
    if (!exp) return; // Token may not be JWT-based, skip

    const now = Date.now();

    if (exp <= now) {
      logout();
      return;
    }

    // Schedule automatic logout
    const timeout = exp - now;
    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [token, logout]);

  // 🔑 Login
  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting login to:', `${base}/public/auth/login`);
    
    const res = await fetch(`${base}/public/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('📡 Response status:', res.status);
    
    const data = await res.json();
    console.log('📦 Response data:', data);
    
    if (!res.ok) throw new Error(data?.meta?.message || "Login gagal");

    setToken(data.data.accessToken);
    setRole(data.data.role ?? null);
    setUser({ email });
    
    console.log('✅ Login successful');
  };

  // 📝 Register
  const register = async (full_name: string, email: string, password: string) => {
    const res = await fetch(`${base}/public/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.meta?.message || "Registrasi gagal");

    // Optional: auto-login after registration
    await login(email, password);
  };

  const value = useMemo<AuthValue>(
    () => ({ token, role, user, login, register, logout }),
    [token, role, user, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
