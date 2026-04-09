import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  FileDown,
  IndianRupee,
  Layers,
  Monitor,
  Palette,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import type { Course, backendInterface as FullBackend } from "../backend.d";
import CourseBrochurePopup from "../components/CourseBrochurePopup";
import type { PageType } from "../components/Navbar";
import { useActor } from "../hooks/useActor";

// ── Fallback static courses ──────────────────────────────────────────────────
const FALLBACK_COURSES: Course[] = [
  {
    id: BigInt(1),
    title: "Web Development",
    subtitle: "Build beautiful, interactive websites",
    description:
      "Master the art of web development from scratch. Learn HTML5, CSS3, JavaScript (ES6+), and React to build professional, responsive websites. Includes hands-on projects and portfolio development.",
    topics: [
      "HTML5 & CSS3 Fundamentals",
      "JavaScript & ES6+",
      "React.js & Hooks",
      "Responsive Design",
      "Git & GitHub",
      "Project Portfolio",
    ],
    duration: "3 months",
    fee: "₹8,000",
    badge: "Popular",
    colorKey: "#3B82F6",
    isActive: true,
  },
  {
    id: BigInt(2),
    title: "Full Stack Development",
    subtitle: "Build complete web applications",
    description:
      "Become a complete web developer with the MERN stack. From database design to API development to beautiful frontends — this comprehensive course covers everything you need to build production-ready applications.",
    topics: [
      "MongoDB & Mongoose",
      "Express.js & REST APIs",
      "React.js Advanced",
      "Node.js Backend",
      "Authentication & Security",
      "Deployment & DevOps",
    ],
    duration: "6 months",
    fee: "₹15,000",
    badge: "Best Value",
    colorKey: "#7C3AED",
    isActive: true,
  },
  {
    id: BigInt(3),
    title: "Digital Marketing",
    subtitle: "Grow brands in the digital world",
    description:
      "Learn to drive business growth through digital channels. Master SEO, social media marketing, Google Ads, content marketing, and email automation. Includes real campaign management.",
    topics: [
      "SEO & Content Strategy",
      "Google Ads & Analytics",
      "Social Media Marketing",
      "Facebook & Instagram Ads",
      "Email Marketing",
      "Marketing Analytics",
    ],
    duration: "2 months",
    fee: "₹6,000",
    badge: "Fast Track",
    colorKey: "#059669",
    isActive: true,
  },
  {
    id: BigInt(4),
    title: "Graphic Design",
    subtitle: "Create stunning visual content",
    description:
      "Develop your creative skills with industry-standard tools. Learn Adobe Photoshop, Illustrator, and Canva to create logos, social media content, brochures, and brand identities.",
    topics: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Canva Pro",
      "Logo Design",
      "Brand Identity",
      "Social Media Graphics",
    ],
    duration: "2 months",
    fee: "₹5,000",
    badge: "Creative",
    colorKey: "#DB2777",
    isActive: true,
  },
  {
    id: BigInt(5),
    title: "Computer Applications",
    subtitle: "Essential skills for every profession",
    description:
      "Build a strong foundation in computer applications for office productivity. Master MS Office suite, accounting with Tally, internet fundamentals, and basic computer operations.",
    topics: [
      "MS Word & Excel",
      "PowerPoint & Presentations",
      "Tally ERP 9",
      "Internet & Email",
      "Data Entry Skills",
      "Google Workspace",
    ],
    duration: "3 months",
    fee: "₹4,000",
    badge: "Foundation",
    colorKey: "#EA580C",
    isActive: true,
  },
  {
    id: BigInt(6),
    title: "Freelancing Skills",
    subtitle: "Build your independent career",
    description:
      "Start earning online as a freelancer. Learn to set up profiles on Upwork, Fiverr, and Freelancer, build a winning portfolio, find clients, manage projects, and grow your freelancing income.",
    topics: [
      "Upwork & Fiverr Setup",
      "Profile Optimization",
      "Proposal Writing",
      "Client Management",
      "Payment Methods",
      "Growing Your Business",
    ],
    duration: "1 month",
    fee: "₹3,000",
    badge: "Quick Start",
    colorKey: "#0891B2",
    isActive: true,
  },
];

// ── Icon mapper ───────────────────────────────────────────────────────────────
function getCourseIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("web")) return Code;
  if (t.includes("full stack") || t.includes("fullstack")) return Layers;
  if (t.includes("digital")) return TrendingUp;
  if (t.includes("graphic")) return Palette;
  if (t.includes("computer")) return Monitor;
  if (t.includes("freelanc")) return Briefcase;
  return BookOpen;
}

// ── Page skeleton ─────────────────────────────────────────────────────────────
function CourseSkeletonCard() {
  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="flex justify-between pt-4">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface CoursesPageProps {
  onNavigate: (page: PageType) => void;
}

export default function CoursesPage({ onNavigate }: CoursesPageProps) {
  const { actor, isFetching } = useActor();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  // New lead-gen popup state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [brochureUrls, setBrochureUrls] = useState<Map<number, string>>(
    new Map(),
  );

  // Load courses from backend
  useEffect(() => {
    if (isFetching) return;
    if (!actor) {
      setCourses(FALLBACK_COURSES);
      setLoadingCourses(false);
      return;
    }
    setLoadingCourses(true);
    actor
      .getCourses()
      .then((res) => {
        const list = res?.ok ?? [];
        setCourses(list.length > 0 ? list : FALLBACK_COURSES);
      })
      .catch(() => {
        setCourses(FALLBACK_COURSES);
      })
      .finally(() => setLoadingCourses(false));
  }, [actor, isFetching]);

  // Load brochure URLs for each course after courses are loaded
  useEffect(() => {
    if (!actor || courses.length === 0) return;
    const fullActor = actor as unknown as FullBackend;
    Promise.all(
      courses.map((c) =>
        fullActor
          .getBrochureUrlByCourseId(c.id)
          .then((result) =>
            result ? { id: Number(c.id), url: result.url } : null,
          )
          .catch(() => null),
      ),
    ).then((results) => {
      const map = new Map<number, string>();
      for (const r of results) {
        if (r) map.set(r.id, r.url);
      }
      setBrochureUrls(map);
    });
  }, [actor, courses]);

  // Auto-trigger after 8s (once per session)
  useEffect(() => {
    if (loadingCourses) return;
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("course_popup_shown") && !showPopup) {
        const activeCourses = courses.filter((c) => c.isActive);
        if (activeCourses.length > 0) {
          setSelectedCourse(activeCourses[0]);
          setShowPopup(true);
        }
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loadingCourses, courses, showPopup]);

  const openBrochurePopup = (course: Course) => {
    setSelectedCourse(course);
    setShowPopup(true);
  };

  return (
    <main className="pt-20">
      {/* Course Brochure Lead-Gen Popup */}
      <CourseBrochurePopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        courseId={Number(selectedCourse?.id ?? 0)}
        courseName={selectedCourse?.title ?? ""}
        brochureUrl={
          selectedCourse
            ? brochureUrls.get(Number(selectedCourse.id))
            : undefined
        }
        courses={courses}
      />

      {/* Header */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1660 0%, #2d2994 60%, #1e6bb8 100%)",
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 text-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              All Courses
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              6 professionally designed courses to match your goals and budget.
              All include certification and placement support.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => {
                  const activeCourses = courses.filter((c) => c.isActive);
                  if (activeCourses.length > 0) {
                    setSelectedCourse(activeCourses[0]);
                  }
                  setShowPopup(true);
                }}
                data-ocid="courses.download_brochure.button"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                <FileDown className="w-4 h-4" />
                Download Course Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20" style={{ background: "#F9FAFB" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          {loadingCourses ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              data-ocid="courses.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <CourseSkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses
                .filter((c) => c.isActive)
                .map((course, i) => {
                  const Icon = getCourseIcon(course.title);
                  const gradientStyle = {
                    background: `linear-gradient(135deg, ${course.colorKey}, ${course.colorKey}cc)`,
                  };

                  return (
                    <motion.div
                      key={String(course.id)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      data-ocid={`courses.item.${i + 1}`}
                      className="bg-white rounded-3xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300"
                    >
                      {/* Card Header */}
                      <div className="p-6 relative" style={gradientStyle}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <div className="text-white/70 text-xs font-medium mb-1">
                                {course.subtitle}
                              </div>
                              <h3 className="text-xl font-bold text-white">
                                {course.title}
                              </h3>
                            </div>
                          </div>
                          {course.badge && (
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium shrink-0">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-5 mt-5">
                          <div className="flex items-center gap-1.5 text-white/80 text-sm">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80 text-sm">
                            <Users className="w-4 h-4" />
                            Certified
                          </div>
                          <div className="flex items-center gap-1.5 text-white/80 text-sm">
                            <Star className="w-4 h-4" fill="white" />
                            4.8
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {course.description}
                        </p>

                        {/* Toggle Topics */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              expandedId === course.id ? null : course.id,
                            )
                          }
                          data-ocid="courses.topics.toggle"
                          className="flex items-center gap-2 text-pdit-indigo text-sm font-medium mb-4 hover:text-pdit-indigo-dark transition-colors"
                        >
                          {expandedId === course.id ? (
                            <>
                              <ChevronUp className="w-4 h-4" /> Hide Topics
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" /> View Topics
                              Covered
                            </>
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedId === course.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-2 gap-2 mb-4 overflow-hidden"
                            >
                              {course.topics.map((topic) => (
                                <div
                                  key={topic}
                                  className="flex items-center gap-2 text-gray-600 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                  {topic}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-5 h-5 text-pdit-indigo" />
                            <span className="text-2xl font-bold text-pdit-indigo">
                              {course.fee.replace("₹", "")}
                            </span>
                            <span className="text-gray-400 text-sm ml-1">
                              / full course
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openBrochurePopup(course)}
                              data-ocid={`courses.brochure.button.${i + 1}`}
                              className="flex items-center gap-1.5 border border-pdit-indigo text-pdit-indigo hover:bg-indigo-50 font-medium px-4 py-2 rounded-full text-sm transition-all duration-200"
                            >
                              <FileDown className="w-4 h-4" />
                              Brochure
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onNavigate("admission");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              data-ocid="courses.enroll.button"
                              className="bg-pdit-indigo hover:bg-pdit-indigo-dark text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-200 hover:shadow-lg hover:scale-105"
                            >
                              Enroll Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}

          {/* Bottom Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white rounded-2xl p-8 text-center shadow-card"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Not Sure Which Course to Pick?
            </h3>
            <p className="text-gray-500 mb-5">
              Talk to our career counsellors for free. We'll help you choose the
              right path based on your background and goals.
            </p>
            <button
              type="button"
              onClick={() => {
                onNavigate("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-ocid="courses.counsellor.button"
              className="bg-pdit-indigo text-white font-semibold px-8 py-3 rounded-full hover:bg-pdit-indigo-dark hover:shadow-lg transition-all duration-200"
            >
              Free Career Counselling
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
