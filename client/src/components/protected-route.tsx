import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) setLocation("/login");
  }, [token, setLocation]);

  if (!token) return null; // or a spinner
  return children;
}
