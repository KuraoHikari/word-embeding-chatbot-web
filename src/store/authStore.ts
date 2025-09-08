import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
 id: string;
 email: string;
 name: string;
}

interface AuthState {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 login: (user: User, token: string) => void;
 logout: () => void;
 setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
 persist(
  (set) => ({
   user: null,
   token: null,
   isAuthenticated: false,
   login: (user, token) => {
    localStorage.setItem("auth-token", token);
    set({ user, token, isAuthenticated: true });
   },
   logout: () => {
    localStorage.removeItem("auth-token");
    set({ user: null, token: null, isAuthenticated: false });
   },
   setUser: (user) => set({ user }),
  }),
  {
   name: "auth-storage",
  }
 )
);
