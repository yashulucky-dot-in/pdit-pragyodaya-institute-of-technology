import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Home,
  Loader2,
  LogOut,
  Save,
  TrendingUp,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Announcement } from "../backend.d";
import type { PageType } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

type SectionType = "dashboard" | "course" | "announcements" | "profile";

interface StudentDashboardProps {
  onNavigate: (page: PageType) => void;
}

const COURSE_DESCRIPTIONS: Record<string, string> = {
  "Web Development":
    "Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and deploy them live.",
  "Python Programming":
    "Learn Python from basics to advanced topics including data structures, OOP, and automation.",
  "Data Science":
    "Explore data analysis, visualization, machine learning, and statistical modeling with Python.",
  "Graphic Design":
    "Create stunning visuals using Photoshop, Illustrator, and Canva for digital and print media.",
  "Digital Marketing":
    "Master SEO, social media marketing, Google Ads, and content strategy for modern businesses.",
  "Tally & Accounting":
    "Learn accounting fundamentals, GST, TDS, and Tally ERP for corporate finance management.",
};

export default function StudentDashboard({
  onNavigate,
}: StudentDashboardProps) {
  const { currentUser, logout, refreshUser } = useAuth();
  const { actor, isFetching } = useActor();
  const [activeSection, setActiveSection] = useState<SectionType>("dashboard");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (actor && !isFetching) {
      setLoadingAnnouncements(true);
      actor
        .getAnnouncements()
        .then((res: any) => {
          if (res?.ok) setAnnouncements(res.ok);
        })
        .catch(() => {})
        .finally(() => setLoadingAnnouncements(false));
    }
  }, [actor, isFetching]);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  const handleSaveProfile = async () => {
    if (!actor || !currentUser) return;
    setSavingProfile(true);
    try {
      await actor.updateUserProfile(
        currentUser.username,
        profileForm.fullName,
        profileForm.email,
        profileForm.phone,
      );
      await refreshUser(actor, currentUser.username);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const progress = Number(currentUser?.progress ?? 0);
  const enrolledDate = currentUser?.enrolledDate
    ? new Date(Number(currentUser.enrolledDate) / 1_000_000).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : "N/A";

  const navItems: { id: SectionType; label: string; icon: React.ReactNode }[] =
    [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Home className="w-4 h-4" />,
      },
      {
        id: "course",
        label: "My Course",
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        id: "announcements",
        label: "Announcements",
        icon: <Bell className="w-4 h-4" />,
      },
      { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">PDIT</div>
            <div className="text-indigo-300 text-[10px]">Student Portal</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-indigo-400 text-white font-semibold text-sm">
              {currentUser?.fullName?.charAt(0)?.toUpperCase() ?? "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {currentUser?.fullName ?? "Student"}
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-0 text-[10px] px-2 py-0 mt-0.5">
              Student
            </Badge>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-ocid="student.nav.panel">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
            data-ocid={`student.${item.id}.link`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeSection === item.id
                ? "bg-white/15 text-white shadow-sm"
                : "text-indigo-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 space-y-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-indigo-300 hover:text-white hover:bg-white/10 transition-all"
          data-ocid="student.back_to_website.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:text-white hover:bg-red-500/20 transition-all"
          data-ocid="student.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-[#3730a3] to-[#1e1b4b] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#3730a3] to-[#1e1b4b] z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Open sidebar"
              data-ocid="student.menu.button"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900 capitalize">
                {activeSection === "dashboard"
                  ? "Overview"
                  : activeSection === "course"
                    ? "My Course"
                    : activeSection === "announcements"
                      ? "Announcements"
                      : "My Profile"}
              </h1>
              <p className="text-xs text-gray-500">PDIT Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-pdit-indigo text-white text-xs font-semibold">
                {currentUser?.fullName?.charAt(0)?.toUpperCase() ?? "S"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "dashboard" && (
                <div
                  className="space-y-6"
                  data-ocid="student.dashboard.section"
                >
                  {/* Welcome */}
                  <div className="bg-gradient-to-r from-pdit-indigo to-pdit-cyan rounded-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold">
                          Welcome back,{" "}
                          {currentUser?.fullName?.split(" ")[0] ?? "Student"}!
                          👋
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                          Keep up the great work on your learning journey.
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-indigo-100 mb-1.5">
                        <span>Course Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Enrolled Course",
                        value: currentUser?.course ?? "N/A",
                        icon: <BookOpen className="w-5 h-5" />,
                        color: "text-pdit-indigo bg-indigo-50",
                      },
                      {
                        label: "Progress",
                        value: `${progress}%`,
                        icon: <TrendingUp className="w-5 h-5" />,
                        color: "text-emerald-600 bg-emerald-50",
                      },
                      {
                        label: "Attendance",
                        value: "85%",
                        icon: <CheckCircle2 className="w-5 h-5" />,
                        color: "text-amber-600 bg-amber-50",
                      },
                      {
                        label: "Enrolled Date",
                        value: enrolledDate,
                        icon: <Calendar className="w-5 h-5" />,
                        color: "text-cyan-600 bg-cyan-50",
                      },
                    ].map((stat) => (
                      <Card
                        key={stat.label}
                        className="border-0 shadow-card rounded-2xl"
                        data-ocid="student.stats.card"
                      >
                        <CardContent className="p-4">
                          <div
                            className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
                          >
                            {stat.icon}
                          </div>
                          <div className="text-lg font-bold text-gray-900 truncate">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Announcements */}
                  <Card className="border-0 shadow-card rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                          Recent Announcements
                        </CardTitle>
                        <button
                          type="button"
                          onClick={() => setActiveSection("announcements")}
                          className="text-xs text-pdit-indigo hover:underline"
                        >
                          View all
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loadingAnnouncements ? (
                        <div
                          className="flex items-center justify-center py-6"
                          data-ocid="student.announcements.loading_state"
                        >
                          <Loader2 className="w-5 h-5 animate-spin text-pdit-indigo" />
                        </div>
                      ) : announcements.length === 0 ? (
                        <div
                          className="text-center py-6 text-gray-400 text-sm"
                          data-ocid="student.announcements.empty_state"
                        >
                          No announcements yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {announcements.slice(0, 3).map((ann, i) => (
                            <div
                              key={String(ann.id)}
                              className="flex gap-3 p-3 bg-indigo-50 rounded-xl"
                              data-ocid={`student.announcements.item.${i + 1}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-pdit-indigo flex items-center justify-center flex-shrink-0">
                                <Bell className="w-4 h-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-800 truncate">
                                  {ann.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {ann.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "course" && (
                <div className="space-y-6" data-ocid="student.course.section">
                  <h2 className="text-xl font-bold text-gray-900">My Course</h2>
                  <Card className="border-0 shadow-card rounded-2xl overflow-hidden">
                    <div className="gradient-primary h-2" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {currentUser?.course ?? "Not enrolled"}
                          </h3>
                          <Badge className="bg-indigo-100 text-pdit-indigo border-0 mt-2">
                            Active
                          </Badge>
                        </div>
                        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                          <BookOpen className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-6">
                        {COURSE_DESCRIPTIONS[currentUser?.course ?? ""] ??
                          "Your course content will be available here."}
                      </p>

                      <Separator className="mb-6" />

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">
                            Overall Progress
                          </span>
                          <span className="text-pdit-indigo font-bold">
                            {progress}%
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-3 rounded-full"
                        />
                        <p className="text-xs text-gray-400">
                          {progress < 30
                            ? "Just getting started — keep going!"
                            : progress < 70
                              ? "Great progress! You're halfway there."
                              : progress < 100
                                ? "Almost there! Great work!"
                                : "Course completed! 🎉"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Enrolled Date
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            {enrolledDate}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Attendance
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            85%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "announcements" && (
                <div
                  className="space-y-6"
                  data-ocid="student.announcements.section"
                >
                  <h2 className="text-xl font-bold text-gray-900">
                    Announcements
                  </h2>
                  {loadingAnnouncements ? (
                    <div
                      className="flex items-center justify-center py-12"
                      data-ocid="student.announcements.loading_state"
                    >
                      <Loader2 className="w-6 h-6 animate-spin text-pdit-indigo" />
                    </div>
                  ) : announcements.length === 0 ? (
                    <Card
                      className="border-0 shadow-card rounded-2xl"
                      data-ocid="student.announcements.empty_state"
                    >
                      <CardContent className="py-12 text-center">
                        <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No announcements yet.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {announcements.map((ann, i) => (
                        <Card
                          key={String(ann.id)}
                          className="border-0 shadow-card rounded-2xl"
                          data-ocid={`student.announcements.item.${i + 1}`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900">
                                  {ann.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ann.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  Posted by {ann.postedBy}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "profile" && (
                <div className="space-y-6" data-ocid="student.profile.section">
                  <h2 className="text-xl font-bold text-gray-900">
                    My Profile
                  </h2>
                  <Card className="border-0 shadow-card rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-pdit-indigo text-white font-bold text-xl">
                            {currentUser?.fullName?.charAt(0)?.toUpperCase() ??
                              "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {currentUser?.fullName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{currentUser?.username}
                          </p>
                          <Badge className="bg-indigo-100 text-pdit-indigo border-0 mt-1">
                            Student
                          </Badge>
                        </div>
                      </div>

                      <Separator className="mb-6" />

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Full Name
                          </Label>
                          <Input
                            value={profileForm.fullName}
                            onChange={(e) =>
                              setProfileForm((p) => ({
                                ...p,
                                fullName: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl"
                            data-ocid="student.profile.fullname.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl"
                            data-ocid="student.profile.email.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Phone
                          </Label>
                          <Input
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl"
                            data-ocid="student.profile.phone.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Username
                          </Label>
                          <Input
                            value={currentUser?.username ?? ""}
                            disabled
                            className="h-11 rounded-xl bg-gray-50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">
                            Course
                          </Label>
                          <Input
                            value={currentUser?.course ?? ""}
                            disabled
                            className="h-11 rounded-xl bg-gray-50"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="mt-6 gradient-primary text-white border-0 rounded-xl hover:opacity-90"
                        data-ocid="student.profile.save_button"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
