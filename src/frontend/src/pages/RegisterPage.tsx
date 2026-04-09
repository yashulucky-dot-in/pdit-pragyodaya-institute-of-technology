import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import type { PageType } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

const COURSES = [
  "Web Development",
  "Python Programming",
  "Data Science",
  "Graphic Design",
  "Digital Marketing",
  "Tally & Accounting",
];

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useAuth();
  const { actor, isFetching } = useActor();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    course: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const {
      fullName,
      email,
      phone,
      username,
      password,
      confirmPassword,
      course,
    } = form;

    if (
      !fullName ||
      !email ||
      !phone ||
      !username ||
      !password ||
      !confirmPassword ||
      !course
    ) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        actor,
        username.trim(),
        password,
        fullName.trim(),
        email.trim(),
        phone.trim(),
        course,
      );
      onNavigate("student-dashboard" as PageType);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Join <span className="text-gradient">PDIT</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create your student account
          </p>
        </div>

        <Card className="shadow-card border-0 rounded-2xl">
          <CardHeader className="pb-0 pt-6 px-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Student Registration
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={update("fullName")}
                      className="pl-10 h-11 rounded-xl"
                      autoComplete="name"
                      data-ocid="register.fullname.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={update("email")}
                      className="pl-10 h-11 rounded-xl"
                      autoComplete="email"
                      data-ocid="register.email.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={update("phone")}
                      className="pl-10 h-11 rounded-xl"
                      autoComplete="tel"
                      data-ocid="register.phone.input"
                    />
                  </div>
                </div>

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
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={update("username")}
                      className="pl-10 h-11 rounded-xl"
                      autoComplete="username"
                      data-ocid="register.username.input"
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
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={update("password")}
                      className="pl-10 pr-10 h-11 rounded-xl"
                      autoComplete="new-password"
                      data-ocid="register.password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={update("confirmPassword")}
                      className="pl-10 pr-10 h-11 rounded-xl"
                      autoComplete="new-password"
                      data-ocid="register.confirm_password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Course
                </Label>
                <Select
                  value={form.course}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, course: val }))
                  }
                  data-ocid="register.course.select"
                >
                  <SelectTrigger
                    className="h-11 rounded-xl"
                    data-ocid="register.course.select"
                  >
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
                    data-ocid="register.error_state"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full h-11 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity border-0"
                data-ocid="register.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login" as PageType)}
                className="text-pdit-indigo font-semibold hover:underline"
                data-ocid="register.login.link"
              >
                Sign in
              </button>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                data-ocid="register.back_to_website.link"
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
