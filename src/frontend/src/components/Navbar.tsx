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
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
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
              <span className="font-bold text-base text-pdit-indigo tracking-tight">
                PDIT
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide hidden sm:block">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? "text-pdit-indigo bg-indigo-50 font-semibold"
                    : "text-gray-600 hover:text-pdit-indigo hover:bg-gray-50"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  data-ocid="nav.dashboard.link"
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                    {currentUser.role === "admin" ? (
                      <Shield className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-800 leading-tight">
                      {currentUser.fullName.split(" ")[0]}
                    </div>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 border-0 ${currentUser.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-pdit-indigo"}`}
                    >
                      {currentUser.role === "admin" ? "Admin" : "Student"}
                    </Badge>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
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
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-pdit-indigo border border-pdit-indigo hover:bg-indigo-50 transition-all duration-200"
                  data-ocid="nav.login.button"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("admission")}
                  data-ocid="nav.apply_now.button"
                  className="hidden sm:flex items-center gap-1 bg-pdit-indigo text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-pdit-indigo-dark transition-all duration-200 hover:shadow-lg hover:scale-105"
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
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.page}
                    onClick={() => handleNavigate(link.page)}
                    data-ocid={`nav.mobile.${link.page}.link`}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === link.page
                        ? "text-pdit-indigo bg-indigo-50"
                        : "text-gray-600 hover:text-pdit-indigo hover:bg-gray-50"
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
                        className="w-full flex items-center gap-2 bg-indigo-50 text-pdit-indigo py-2.5 px-4 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-colors"
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
                        className="w-full flex items-center gap-2 bg-red-50 text-red-600 py-2.5 px-4 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors"
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
                        className="w-full border border-pdit-indigo text-pdit-indigo py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavigate("admission")}
                        data-ocid="nav.mobile.apply_now.button"
                        className="w-full bg-pdit-indigo text-white py-2.5 rounded-full text-sm font-semibold hover:bg-pdit-indigo-dark transition-colors"
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
