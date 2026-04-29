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

// -- Fallback static courses --
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
    fee: "Rs.8,000",
    badge: "Popular",
    colorKey: "#3B82F6",
    isActive: true,
  },
  {
    id: BigInt(2),
    title: "Full Stack Development",
    subtitle: "Build complete web applications",
    description:
      "Become a complete web developer with the MERN stack. From database design to API development to beautiful frontends - this comprehensive course covers everything you need to build production-ready applications.",
    topics: [
      "MongoDB & Mongoose",
      "Express.js & REST APIs",
      "React.js Advanced",
      "Node.js Backend",
      "Authentication & Security",
      "Deployment & DevOps",
    ],
    duration: "6 months",
    fee: "Rs.15,000",
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
    fee: "Rs.6,000",
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
    fee: "Rs.5,000",
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
    fee: "Rs.4,000",
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
    fee: "Rs.3,000",
    badge: "Quick Start",
    colorKey: "#0891B2",
    isActive: true,
  },
];

// -- Course image map --
const COURSE_IMAGES: Record<string, string> = {
  "Web Development":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
  "Full Stack Development":
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=300&fit=crop",
  "Digital Marketing":
    "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop",
  "Graphic Design":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop",
  "Computer Applications":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop",
  "Data Analytics":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
  "Freelancing Skills":
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop",
};

// -- Icon mapper --
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

// -- Page skeleton --
function CourseSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden animate-pulse">
      <div className="h-36 bg-[#F1F5F9]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[#E5E7EB] rounded-full w-3/4" />
        <div className="h-3 bg-[#F1F5F9] rounded-full w-full" />
        <div className="h-3 bg-[#F1F5F9] rounded-full w-5/6" />
        <div className="flex justify-between pt-4">
          <div className="h-8 bg-[#E5E7EB] rounded-full w-24" />
          <div className="h-8 bg-[#E5E7EB] rounded-full w-32" />
        </div>
      </div>
    </div>
  );
}

// -- Main component --
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
      <section className="py-20 relative overflow-hidden gradient-primary">
        {/* Decorative background rings */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-cyan-200 text-sm px-4 py-2 rounded-full mb-6 font-medium backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              All Courses
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Choose Your Learning Path
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto font-body">
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
                className="btn-primary inline-flex items-center gap-2 bg-white text-[#4F46E5] hover:bg-white/95 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border-0"
              >
                <FileDown className="w-4 h-4" />
                Download Course Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-2">
              Our Programs
            </p>
            <h2 className="text-3xl font-bold text-[#111827] font-display">
              Explore All Courses
            </h2>
          </motion.div>

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
                      className="bg-white rounded-2xl shadow-card card-hover border border-[#E5E7EB] overflow-hidden"
                    >
                      {/* Course image */}
                      {COURSE_IMAGES[course.title] && (
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={COURSE_IMAGES[course.title]}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          {/* Duration badge on image */}
                          <span className="absolute top-3 right-3 bg-[#F59E0B] text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {course.duration}
                          </span>
                          {/* Course icon badge on image */}
                          <div className="absolute bottom-3 left-3 w-10 h-10 bg-[#4F46E5] text-white rounded-full flex items-center justify-center shadow-lg">
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      )}

                      {/* Card Header */}
                      <div className="p-5 relative" style={gradientStyle}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {!COURSE_IMAGES[course.title] && (
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="text-white/75 text-xs font-medium mb-0.5">
                                {course.subtitle}
                              </div>
                              <h3 className="text-lg font-semibold text-white font-display">
                                {course.title}
                              </h3>
                            </div>
                          </div>
                          {course.badge && (
                            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium shrink-0 border border-white/30">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-5 mt-4">
                          <div className="flex items-center gap-1.5 text-white/85 text-sm">
                            <Users className="w-3.5 h-3.5" />
                            Certified
                          </div>
                          <div className="flex items-center gap-1.5 text-white/85 text-sm">
                            <Star className="w-3.5 h-3.5" fill="white" />
                            4.8 Rating
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <p className="text-[#6B7280] text-sm leading-relaxed mb-4 font-body">
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
                          className="flex items-center gap-2 text-[#4F46E5] text-sm font-medium mb-4 hover:text-[#4338CA] transition-colors"
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
                                  className="flex items-center gap-2 text-[#374151] text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                                  {topic}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-5 h-5 text-[#4F46E5]" />
                            <span className="text-xl font-bold text-[#4F46E5] font-display">
                              {course.fee.replace("Rs.", "")}
                            </span>
                            <span className="text-[#9CA3AF] text-sm ml-1">
                              / full course
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openBrochurePopup(course)}
                              data-ocid={`courses.brochure.button.${i + 1}`}
                              className="flex items-center gap-1.5 border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 font-medium px-4 py-2 rounded-full text-sm transition-all duration-200"
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
                              className="btn-primary text-sm px-5 py-2"
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
            className="mt-12 bg-white rounded-2xl p-8 text-center shadow-card border border-[#E5E7EB]"
          >
            <p className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-2">
              Free Guidance
            </p>
            <h3 className="text-xl font-bold text-[#111827] mb-2 font-display">
              Not Sure Which Course to Pick?
            </h3>
            <p className="text-[#6B7280] mb-5 font-body">
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
              className="btn-primary"
            >
              Free Career Counselling
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
