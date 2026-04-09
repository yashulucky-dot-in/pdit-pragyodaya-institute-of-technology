import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import type { PageType } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

interface LoginPageProps {
  onNavigate: (page: PageType) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const user = await login(actor, username.trim(), password);
      if (user.role === "admin") {
        onNavigate("admin-dashboard" as PageType);
      } else {
        onNavigate("student-dashboard" as PageType);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (type: "admin" | "student") => {
    if (type === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("student");
      setPassword("student123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to <span className="text-gradient">PDIT</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Demo Credentials Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-2xl p-4 mb-6"
          data-ocid="login.demo.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-pdit-indigo" />
            </div>
            <span className="text-sm font-semibold text-pdit-indigo">
              Demo Credentials
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              data-ocid="login.demo_admin.button"
              className="text-left bg-white rounded-xl p-3 border border-indigo-100 hover:border-pdit-indigo hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="text-base mb-1">👨‍💼</div>
              <div className="text-xs font-semibold text-gray-800">Admin</div>
              <div className="text-[11px] text-gray-500 font-mono">
                admin / admin123
              </div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("student")}
              data-ocid="login.demo_student.button"
              className="text-left bg-white rounded-xl p-3 border border-cyan-100 hover:border-pdit-cyan hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="text-base mb-1">🎓</div>
              <div className="text-xs font-semibold text-gray-800">Student</div>
              <div className="text-[11px] text-gray-500 font-mono">
                student / student123
              </div>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Click a card to auto-fill credentials
          </p>
        </motion.div>

        {/* Login Form */}
        <Card className="shadow-card border-0 rounded-2xl">
          <CardHeader className="pb-0 pt-6 px-6">
            <h2 className="text-lg font-semibold text-gray-800">Sign In</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-pdit-indigo focus:ring-pdit-indigo/20"
                    autoComplete="username"
                    data-ocid="login.username.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-pdit-indigo focus:ring-pdit-indigo/20"
                    autoComplete="current-password"
                    data-ocid="login.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    data-ocid="login.show_password.toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full h-11 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity border-0"
                data-ocid="login.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("register" as PageType)}
                className="text-pdit-indigo font-semibold hover:underline"
                data-ocid="login.register.link"
              >
                Register here
              </button>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                data-ocid="login.back_to_website.link"
              >
                ← Back to Website
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
