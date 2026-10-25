"use client";

import { useEffect, useState } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        const session = await checkSession();

        if (!session) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        if (active) {
          setUser(user);
        }
      } catch {
        if (active) {
          clearIsAuthenticated();
        }
      } finally {
        if (active) {
          setChecked(true);
        }
      }
    }

    void initializeAuth();

    return () => {
      active = false;
    };
  }, [setUser, clearIsAuthenticated]);

  if (!checked) {
    return <p>Loading...</p>;
  }

  return children;
}
