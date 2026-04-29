import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export type PageType =
  | "home"
  | "about"
  | "courses"
  | "our-campus"
  | "admission"
  | "franchise"
  | "contact"
  | "login"
  | "register"
  | "student-dashboard"
  | "admin-dashboard";

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navLinks: { label: string; page: PageType }[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Courses", page: "courses" },
  { label: "Our Campus", page: "our-campus" },
  { label: "Franchise", page: "franchise" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    onNavigate("home");
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[#E5E7EB]"
          : "bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]"
      }`}
    >
      <nav className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base text-gradient tracking-tight">
                PDIT
              </span>
              <span className="text-[10px] text-[#9CA3AF] font-body font-medium tracking-wide hidden sm:block">
                Pragyodaya Institute of Technology
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                data-ocid={`nav.${link.page}.link`}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? "text-[#4F46E5] bg-indigo-50 font-semibold"
                    : "text-[#374151] hover:text-[#4F46E5] hover:bg-indigo-50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA / Auth */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              // Logged in state
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      currentUser.role === "admin"
                        ? "admin-dashboard"
                        : "student-dashboard",
                    )
                  }
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                  data-ocid="nav.dashboard.link"
                >
                  <div className="w-7 h-7 rounded-full border-2 border-[#E5E7EB] gradient-primary flex items-center justify-center">
                    {currentUser.role === "admin" ? (
                      <Shield className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-display font-semibold text-[#111827] leading-tight">
                      {currentUser.fullName.split(" ")[0]}
                    </div>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 border-0 ${currentUser.role === "admin" ? "bg-[#F59E0B] text-white" : "bg-[#4F46E5] text-white"}`}
                    >
                      {currentUser.role === "admin" ? "Admin" : "Student"}
                    </Badge>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Logout"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Not logged in
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate("login")}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-semibold text-[#4F46E5] border border-[#4F46E5] hover:bg-indigo-50 transition-all duration-200"
                  data-ocid="nav.login.button"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("admission")}
                  data-ocid="nav.apply_now.button"
                  className="hidden sm:flex items-center gap-1 btn-primary text-sm"
                >
                  Apply Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-ocid="nav.hamburger.button"
              className="md:hidden p-2 rounded-lg text-[#374151] hover:bg-indigo-50 hover:text-[#4F46E5] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-[#E5E7EB] bg-white"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.page}
                    onClick={() => handleNavigate(link.page)}
                    data-ocid={`nav.mobile.${link.page}.link`}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                      currentPage === link.page
                        ? "text-[#4F46E5] bg-indigo-50 font-semibold"
                        : "text-[#374151] hover:text-[#4F46E5] hover:bg-indigo-50"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-2 pb-1 px-4 space-y-2">
                  {currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigate(
                            currentUser.role === "admin"
                              ? "admin-dashboard"
                              : "student-dashboard",
                          )
                        }
                        data-ocid="nav.mobile.dashboard.link"
                        className="w-full flex items-center gap-2 bg-indigo-50 text-[#4F46E5] py-2.5 px-4 rounded-full text-sm font-body font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {currentUser.role === "admin"
                          ? "Admin Panel"
                          : "Student Dashboard"}
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        data-ocid="nav.mobile.logout.button"
                        className="w-full flex items-center gap-2 bg-red-50 text-red-600 py-2.5 px-4 rounded-full text-sm font-body font-semibold hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleNavigate("login")}
                        data-ocid="nav.mobile.login.button"
                        className="w-full border border-[#4F46E5] text-[#4F46E5] py-2.5 rounded-full text-sm font-body font-semibold hover:bg-indigo-50 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavigate("admission")}
                        data-ocid="nav.mobile.apply_now.button"
                        className="w-full btn-primary text-sm py-2.5"
                      >
                        Apply Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
