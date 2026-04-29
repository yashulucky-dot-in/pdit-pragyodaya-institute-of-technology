import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar, { type PageType } from "./components/Navbar";
import WhatsAppButton from "./components/WhatsAppButton";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AboutPage from "./pages/AboutPage";
import AdminPanel from "./pages/AdminPanel";
import AdmissionPage from "./pages/AdmissionPage";
import CampusPage from "./pages/CampusPage";
import ContactPage from "./pages/ContactPage";
import CoursesPage from "./pages/CoursesPage";
import FranchisePage from "./pages/FranchisePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";

// Dashboard pages (no public Navbar/Footer)
const DASHBOARD_PAGES: PageType[] = [
  "student-dashboard",
  "admin-dashboard",
  "login",
  "register",
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const { currentUser, isLoading } = useAuth();

  const navigateTo = useCallback((page: PageType) => {
    if (page === "home") {
      window.history.pushState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `#${page}`);
    }
    setCurrentPage(page);
    if (!DASHBOARD_PAGES.includes(page)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // On mount, check URL hash for deep-linking
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as PageType;
    const validPages: PageType[] = [
      "home",
      "about",
      "courses",
      "our-campus",
      "admission",
      "franchise",
      "contact",
      "login",
      "register",
      "student-dashboard",
      "admin-dashboard",
    ];
    if (validPages.includes(hash)) {
      setCurrentPage(hash);
    }
  }, []);

  // Auth redirects
  useEffect(() => {
    if (isLoading) return;
    if (
      !currentUser &&
      (currentPage === "student-dashboard" || currentPage === "admin-dashboard")
    ) {
      navigateTo("login");
    } else if (
      currentUser &&
      (currentPage === "login" || currentPage === "register")
    ) {
      navigateTo(
        currentUser.role === "admin" ? "admin-dashboard" : "student-dashboard",
      );
    }
  }, [currentUser, currentPage, isLoading, navigateTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const isDashboard = DASHBOARD_PAGES.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigateTo} />;
      case "about":
        return <AboutPage onNavigate={navigateTo} />;
      case "courses":
        return <CoursesPage onNavigate={navigateTo} />;
      case "our-campus":
        return <CampusPage onNavigate={navigateTo} />;
      case "admission":
        return <AdmissionPage />;
      case "franchise":
        return <FranchisePage />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <LoginPage onNavigate={navigateTo} />;
      case "register":
        return <RegisterPage onNavigate={navigateTo} />;
      case "student-dashboard":
        return currentUser ? (
          <StudentDashboard onNavigate={navigateTo} />
        ) : null;
      case "admin-dashboard":
        return currentUser ? <AdminPanel onNavigate={navigateTo} /> : null;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      {!isDashboard && (
        <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      )}
      <div className={isDashboard ? "" : "flex-1"}>{renderPage()}</div>
      {!isDashboard && <Footer onNavigate={navigateTo} />}
      {!isDashboard && <WhatsAppButton />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
