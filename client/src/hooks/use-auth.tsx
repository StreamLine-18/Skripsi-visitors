import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

  const base = import.meta.env.VITE_API_BASE_URL;

  const login = async (email: string, password: string) => {
    const res = await fetch(`${base}/public/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.meta?.message || "Login gagal");
    setToken(data.data.accessToken);
    setRole(data.data.role ?? null);
    setUser({ email });
  };

  const register = async (full_name: string, email: string, password: string) => {
    const res = await fetch(`${base}/public/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.meta?.message || "Registrasi gagal");
    // optional: auto login after register
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const value = useMemo<AuthValue>(() => ({ token, role, user, login, register, logout }), [token, role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
