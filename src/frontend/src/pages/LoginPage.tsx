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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
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
          <h1 className="text-2xl font-bold text-[#111827] font-display">
            Welcome to <span className="text-gradient">PDIT</span>
          </h1>
          <p className="text-[#6B7280] text-sm mt-1 font-body">
            Sign in to your account
          </p>
        </div>

        {/* Demo Credentials Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 mb-6"
          data-ocid="login.demo.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-[#4F46E5]" />
            </div>
            <span className="text-sm font-semibold text-[#4F46E5] font-display">
              Demo Credentials
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              data-ocid="login.demo_admin.button"
              className="text-left bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#D97706] rounded-xl p-3 hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all cursor-pointer"
            >
              <div className="text-base mb-1 font-bold">[A]</div>
              <div className="text-xs font-semibold font-display">Admin</div>
              <div className="text-[11px] font-mono opacity-80">
                admin / admin123
              </div>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("student")}
              data-ocid="login.demo_student.button"
              className="text-left bg-indigo-50 border border-[#4F46E5]/30 text-[#4F46E5] rounded-xl p-3 hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all cursor-pointer"
            >
              <div className="text-base mb-1 font-bold">[S]</div>
              <div className="text-xs font-semibold font-display">Student</div>
              <div className="text-[11px] font-mono opacity-80">
                student / student123
              </div>
            </button>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-2 text-center font-body">
            Click a card to auto-fill credentials
          </p>
        </motion.div>

        {/* Login Form */}
        <Card className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB]">
          <CardHeader className="pb-0 pt-6 px-6">
            <h2 className="text-lg font-semibold text-[#111827] font-display">
              Sign In
            </h2>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-[#374151]"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 text-[#111827] placeholder:text-[#9CA3AF] transition-colors"
                    autoComplete="username"
                    data-ocid="login.username.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[#374151]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 text-[#111827] placeholder:text-[#9CA3AF] transition-colors"
                    autoComplete="current-password"
                    data-ocid="login.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
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
                    className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-[#EF4444]"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full h-12 btn-primary border-0 disabled:opacity-60"
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

            <div className="mt-4 text-center text-sm text-[#6B7280] font-body">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("register" as PageType)}
                className="text-[#4F46E5] font-medium hover:text-[#4338CA] transition-colors"
                data-ocid="login.register.link"
              >
                Register here
              </button>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-xs text-[#6B7280] hover:text-[#111827] transition-colors"
                data-ocid="login.back_to_website.link"
              >
                &laquo; Back to Website
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
