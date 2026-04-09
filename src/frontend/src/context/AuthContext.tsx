import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { UserProfile } from "../backend.d";

interface AuthContextValue {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (
    actor: any,
    username: string,
    password: string,
  ) => Promise<UserProfile>;
  logout: () => void;
  register: (
    actor: any,
    username: string,
    password: string,
    fullName: string,
    email: string,
    phone: string,
    course: string,
  ) => Promise<UserProfile>;
  refreshUser: (actor: any, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "pdit_auth_user";

function persistUser(user: UserProfile) {
  const serializable = {
    ...user,
    id: user.id.toString(),
    progress: user.progress.toString(),
    enrolledDate: user.enrolledDate.toString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const persistUserRef = useRef(persistUser);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Restore BigInt fields
        parsed.id = BigInt(parsed.id ?? 0);
        parsed.progress = BigInt(parsed.progress ?? 0);
        parsed.enrolledDate = BigInt(parsed.enrolledDate ?? 0);
        setCurrentUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      actor: any,
      username: string,
      password: string,
    ): Promise<UserProfile> => {
      if (!actor) throw new Error("Backend not ready. Please try again.");
      const result = await actor.loginUser(username, password);
      if (!result?.ok) throw new Error("Invalid username or password.");
      const user = result.ok;
      setCurrentUser(user);
      persistUserRef.current(user);
      return user;
    },
    [],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const register = useCallback(
    async (
      actor: any,
      username: string,
      password: string,
      fullName: string,
      email: string,
      phone: string,
      course: string,
    ): Promise<UserProfile> => {
      if (!actor) throw new Error("Backend not ready. Please try again.");
      const result = await actor.registerUser(
        username,
        password,
        fullName,
        email,
        phone,
        course,
      );
      if (!result?.ok)
        throw new Error("Registration failed. Username may already exist.");
      const user = result.ok;
      setCurrentUser(user);
      persistUserRef.current(user);
      return user;
    },
    [],
  );

  const refreshUser = useCallback(async (actor: any, username: string) => {
    if (!actor) return;
    const result = await actor.getUserProfile(username);
    if (result?.ok) {
      setCurrentUser(result.ok);
      persistUserRef.current(result.ok);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, logout, register, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
