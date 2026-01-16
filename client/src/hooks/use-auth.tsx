import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

type User = {
  id_user: string;
  email: string;
  full_name: string;
};

type AuthValue = {
  token: string | null;
  role: string | null;
  user: User | null;
  isLoadingUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

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
  }, []);

  // 📡 Fetch user profile from /me endpoint
  const fetchUserProfile = useCallback(async (authToken: string) => {
    setIsLoadingUser(true);
    try {
      const res = await fetch(`${base}/public/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        // If unauthorized or error, logout
        if (res.status === 401) {
          logout();
        }
        return;
      }

      const data = await res.json();
      if (data.data) {
        setUser({
          id_user: data.data.id_user,
          email: data.data.email,
          full_name: data.data.full_name,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, [base, logout]);

  // 🔁 Persist token and role to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  // 👤 Fetch user profile when token exists (on mount or token change)
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile(token);
    }
  }, [token, user, fetchUserProfile]);

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
    const res = await fetch(`${base}/public/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.meta?.message || "Login gagal");

    const accessToken = data.data.accessToken;
    setToken(accessToken);
    setRole(data.data.role ?? null);

    // Fetch user profile after login
    await fetchUserProfile(accessToken);
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
    () => ({ token, role, user, isLoadingUser, login, register, logout }),
    [token, role, user, isLoadingUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
