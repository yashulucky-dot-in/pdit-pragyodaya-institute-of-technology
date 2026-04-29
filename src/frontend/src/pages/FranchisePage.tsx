import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Award,
  BookOpen,
  Building,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileDown,
  Headphones,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Monitor,
  Phone,
  Rocket,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { backendInterface as BackendAPI } from "../backend.d";
import FranchiseBrochurePopup from "../components/FranchiseBrochurePopup";
import { useActor } from "../hooks/useActor";

/* -- data -- */

const benefits = [
  {
    icon: Building,
    title: "Proven Business Model",
    desc: "Use our tested systems, branding, and processes. No need to start from scratch.",
    color: "bg-indigo-50 text-[#4F46E5]",
  },
  {
    icon: Users,
    title: "Complete Training & Support",
    desc: "Instructor training, curriculum, teaching materials, and ongoing academic support.",
    color: "bg-blue-50 text-[#06B6D4]",
  },
  {
    icon: TrendingUp,
    title: "High ROI Potential",
    desc: "With 20-40 students per batch and 3-4 batches annually, achieve ROI within 12 months.",
    color: "bg-emerald-50 text-[#10B981]",
  },
  {
    icon: Shield,
    title: "Exclusive Territory Rights",
    desc: "Protected territory with no competing PDIT franchise within your defined zone.",
    color: "bg-amber-50 text-[#F59E0B]",
  },
  {
    icon: Award,
    title: "Certification Authority",
    desc: "Issue PDIT-recognized certificates to your students, backed by national credibility.",
    color: "bg-purple-50 text-[#7C3AED]",
  },
  {
    icon: Zap,
    title: "Marketing & Lead Gen",
    desc: "National marketing campaigns, social media, and digital ads drive students to your center.",
    color: "bg-cyan-50 text-[#06B6D4]",
  },
];

const packages = [
  {
    name: "Starter",
    investment: "Rs.1.5 Lakhs",
    seats: "Up to 30 students/batch",
    courses: "3 courses",
    support: "Basic",
    color: "border-[#E5E7EB]",
    recommended: false,
  },
  {
    name: "Standard",
    investment: "Rs.3 Lakhs",
    seats: "Up to 60 students/batch",
    courses: "All 6 courses",
    support: "Premium",
    color: "border-[#4F46E5]",
    recommended: true,
  },
  {
    name: "Premium",
    investment: "Rs.6 Lakhs",
    seats: "Unlimited students",
    courses: "All + future courses",
    support: "Dedicated Manager",
    color: "border-[#E5E7EB]",
    recommended: false,
  },
];

const whatYouGet = [
  {
    icon: BookOpen,
    title: "Complete Course Content",
    desc: "Access to our full curriculum, study materials, and digital content for all courses.",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    color: "bg-indigo-50 text-[#4F46E5]",
  },
  {
    icon: Monitor,
    title: "Student Management System",
    desc: "Powerful software to manage enrollments, attendance, progress tracking, and reports.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    color: "bg-blue-50 text-[#06B6D4]",
  },
  {
    icon: Award,
    title: "Certificate System",
    desc: "Issue PDIT-branded certificates to your students upon course completion.",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80",
    color: "bg-purple-50 text-[#7C3AED]",
  },
  {
    icon: Megaphone,
    title: "Marketing Creatives",
    desc: "Ready-made banners, social media posts, and local marketing materials.",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    color: "bg-amber-50 text-[#F59E0B]",
  },
  {
    icon: Headphones,
    title: "Training & Onboarding Support",
    desc: "Dedicated onboarding team, training sessions, and ongoing support.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    color: "bg-cyan-50 text-[#06B6D4]",
  },
];

const coursesOffered = [
  {
    name: "Web Development",
    desc: "Build modern websites using HTML, CSS, JavaScript and React.",
    duration: "3 months",
    img: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80",
    gradient: "from-[#4F46E5] to-[#6366F1]",
    badgeColor: "bg-[#4F46E5]",
  },
  {
    name: "Full Stack Development",
    desc: "Master frontend + backend with Node.js, databases and APIs.",
    duration: "6 months",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
    gradient: "from-[#7C3AED] to-[#8B5CF6]",
    badgeColor: "bg-[#7C3AED]",
  },
  {
    name: "Digital Marketing",
    desc: "SEO, Social Media, Google Ads, Content Marketing mastery.",
    duration: "2 months",
    img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&q=80",
    gradient: "from-[#06B6D4] to-[#22D3EE]",
    badgeColor: "bg-[#06B6D4]",
  },
  {
    name: "Graphic Design",
    desc: "Adobe Photoshop, Illustrator, UI/UX design fundamentals.",
    duration: "2 months",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    gradient: "from-[#EC4899] to-[#F43F5E]",
    badgeColor: "bg-[#EC4899]",
  },
  {
    name: "Computer Basics",
    desc: "Essential computer skills, MS Office, internet and email.",
    duration: "1 month",
    img: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80",
    gradient: "from-[#10B981] to-[#34D399]",
    badgeColor: "bg-[#10B981]",
  },
];

const franchiseSteps = [
  {
    icon: ClipboardList,
    title: "Fill Application Form",
    desc: "Submit your franchise interest form online.",
  },
  {
    icon: Phone,
    title: "Get Call from Team",
    desc: "Our franchise team will contact you within 24 hours.",
  },
  {
    icon: CheckCircle,
    title: "Verification",
    desc: "Background check and location assessment.",
  },
  {
    icon: Settings,
    title: "Setup & Training",
    desc: "Complete onboarding, setup assistance, and staff training.",
  },
  {
    icon: Rocket,
    title: "Launch Your Center",
    desc: "Go live and start enrolling students!",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    city: "Delhi",
    review:
      "Starting my PDIT franchise was the best business decision I made. The support team is incredible and students keep enrolling!",
    initials: "RK",
    avatarBg: "bg-[#4F46E5]",
    since: "Partner since 2023",
  },
  {
    name: "Priya Sharma",
    city: "Noida",
    review:
      "Within 3 months of launching, I had 25 students. The marketing materials and brand name really help attract students.",
    initials: "PS",
    avatarBg: "bg-[#06B6D4]",
    since: "Partner since 2023",
  },
  {
    name: "Amit Singh",
    city: "Gurgaon",
    review:
      "The training system and certificate program make it easy to deliver quality education. My center is profitable!",
    initials: "AS",
    avatarBg: "bg-[#7C3AED]",
    since: "Partner since 2022",
  },
];

const faqs = [
  {
    q: "How much is the investment?",
    a: "Our franchise packages start from Rs.1.5 Lakhs (Starter), Rs.3 Lakhs (Standard - most popular), and Rs.6 Lakhs (Premium). Each package includes everything you need to get started. Contact our team for the latest offers.",
  },
  {
    q: "How long does setup take?",
    a: "Once your application is verified, the complete setup process takes 2-4 weeks. This includes training, software setup, marketing material delivery, and center launch support from our team.",
  },
  {
    q: "What support will I get?",
    a: "You get dedicated support throughout: onboarding training, marketing creatives, student management software, curriculum updates, and a dedicated franchise manager to help you grow.",
  },
  {
    q: "Do I need a degree?",
    a: "No specific degree is required! You need a passion for education, a suitable space (min. 300 sq ft), basic infrastructure, and the drive to run a successful center. Our team will train you on everything else.",
  },
];

/* -- form types -- */

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  investment: string;
  message: string;
};
type ErrorState = Partial<Record<keyof FormState, string>>;

/* -- animated counter -- */

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}</span>;
}

/* -- FAQ accordion item -- */

function FAQItem({
  faq,
  index,
  openIndex,
  setOpenIndex,
}: {
  faq: { q: string; a: string };
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border border-[#E5E7EB] transition-all duration-200 overflow-hidden ${
        isOpen ? "border-[#4F46E5]/30 bg-indigo-50/40" : "bg-white"
      }`}
      data-ocid={`franchise.faq.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold font-display text-[#111827] transition-colors ${
          isOpen ? "text-[#4F46E5]" : ""
        }`}
        aria-expanded={isOpen}
        data-ocid={`franchise.faq.toggle.${index + 1}`}
      >
        <span className="text-sm md:text-base leading-snug">{faq.q}</span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? "bg-[#4F46E5] text-white" : "bg-[#F8FAFC] text-[#6B7280]"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-[#6B7280] font-body leading-relaxed border-l-4 border-[#4F46E5] ml-6">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -- main component -- */

export default function FranchisePage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    city: "",
    investment: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Franchise brochure popup state
  const [showFranchisePopup, setShowFranchisePopup] = useState(false);
  const [franchiseBrochureUrl, setFranchiseBrochureUrl] = useState<
    string | undefined
  >(undefined);

  // Sticky CTA dismiss state
  const [stickyDismissed, setStickyDismissed] = useState(
    () => sessionStorage.getItem("franchise_sticky_dismissed") === "1",
  );

  // FAQ open index
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch franchise brochure URL on mount
  useEffect(() => {
    if (!actor) return;
    const fullActor = actor as unknown as BackendAPI;
    fullActor
      .getFranchiseBrochureUrl()
      .then((result) => {
        if (result) setFranchiseBrochureUrl(result.url);
      })
      .catch(() => {});
  }, [actor]);

  // Auto-trigger popup after 10s - localStorage (once per device)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !localStorage.getItem("pdit_franchise_popup_v2") &&
        !showFranchisePopup
      ) {
        setShowFranchisePopup(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [showFranchisePopup]);

  const openPopup = () => setShowFranchisePopup(true);

  const validate = (): boolean => {
    const newErrors: ErrorState = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit mobile number";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.investment)
      newErrors.investment = "Please select investment range";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!actor) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await (actor as unknown as BackendAPI).submitFranchiseInquiry(
        form.name.trim(),
        form.phone.trim(),
        form.email.trim(),
        form.city.trim(),
        form.investment,
        form.message.trim(),
      );
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        investment: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <main className="pt-20">
      {/* Franchise Brochure Popup */}
      <FranchiseBrochurePopup
        open={showFranchisePopup}
        onClose={() => setShowFranchisePopup(false)}
        franchiseBrochureUrl={franchiseBrochureUrl}
      />

      {/* HERO */}
      <section className="py-20 relative overflow-hidden gradient-hero">
        {/* decorative dots */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container mx-auto px-4 max-w-7xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#06B6D4] text-sm px-4 py-2 rounded-full mb-6">
              <Building className="w-4 h-4" />
              Franchise Opportunity
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Own a PDIT Franchise
            </h1>
            <p className="text-white/85 font-body text-lg max-w-2xl mx-auto mb-8">
              Join India's fastest growing ed-tech franchise network. Low
              investment, high returns, proven systems.
            </p>
            <motion.button
              type="button"
              onClick={openPopup}
              data-ocid="franchise.get_brochure.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-white text-[#4F46E5] hover:bg-indigo-50 font-bold font-display px-8 py-4 rounded-full shadow-2xl transition-colors text-base"
            >
              <FileDown className="w-5 h-5" />
              Get Franchise Brochure - Free Download
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: WHAT YOU GET */}
      <section
        className="py-20 bg-white"
        data-ocid="franchise.what_you_get.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              What You Get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              As a <span className="text-gradient">PDIT Franchise Partner</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              Everything you need to run a successful EdTech center
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouGet.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`franchise.what_you_get.item.${i + 1}`}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB] overflow-hidden"
              >
                {/* card image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* icon badge overlay */}
                  <div
                    className={`absolute top-3 left-3 w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-lg`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-display text-[#111827] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: COURSES YOU WILL OFFER */}
      <section
        className="py-20 bg-[#F8FAFC]"
        data-ocid="franchise.courses.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Course Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              Courses You Will <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              5 high-demand courses included in your franchise package
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesOffered.map((course, i) => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`franchise.course.item.${i + 1}`}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 border border-[#E5E7EB] overflow-hidden group"
              >
                {/* image + badge */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.img}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span
                    className={`absolute top-3 right-3 ${course.badgeColor} text-white text-xs font-bold font-display px-3 py-1 rounded-full shadow`}
                  >
                    {course.duration}
                  </span>
                </div>
                {/* gradient accent line at bottom */}
                <div className={`h-1 bg-gradient-to-r ${course.gradient}`} />
                <div className="p-5">
                  <h3 className="font-bold font-display text-[#111827] mb-1.5">
                    {course.name}
                  </h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-3">
                    {course.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 bg-[#F8FAFC] text-[#6B7280] text-xs font-medium px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {course.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARTNER (existing) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Partner Benefits
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-4">
              Why Partner With <span className="text-gradient">PDIT?</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              Get the advantage of a proven brand with the independence of
              running your own business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB]"
              >
                <div
                  className={`w-12 h-12 ${b.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold font-display text-[#111827] mb-2">
                  {b.title}
                </h3>
                <p className="text-[#6B7280] font-body text-sm leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: EARNINGS POTENTIAL */}
      <section
        className="py-20 relative overflow-hidden bg-[#F8FAFC]"
        data-ocid="franchise.earnings.section"
      >
        {/* subtle grid bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,70,229,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Income Potential
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              Your Earnings Potential
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              See how much you can earn running a PDIT franchise center
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT: visual income display */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* big counter */}
              <div className="bg-white rounded-3xl p-8 shadow-card border border-[#E5E7EB] text-center">
                <p className="text-[#6B7280] font-body text-sm mb-2 font-medium">
                  Monthly Revenue Potential
                </p>
                <div className="text-5xl md:text-6xl font-bold font-display text-gradient mb-2">
                  Rs.
                  <AnimatedCounter target={90000} />
                </div>
                <p className="text-[#6B7280] font-body text-sm">
                  30 Students x Rs.3,000/month
                </p>
              </div>

              {/* bar chart visual */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-[#E5E7EB]">
                <p className="text-[#111827] font-bold font-display mb-4 text-sm">
                  Income Scale
                </p>
                {[
                  { label: "10 students", value: 30000, max: 90000, pct: 33 },
                  { label: "20 students", value: 60000, max: 90000, pct: 66 },
                  { label: "30 students", value: 90000, max: 90000, pct: 100 },
                ].map((bar, i) => (
                  <div key={bar.label} className="mb-4">
                    <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                      <span className="font-body">{bar.label}</span>
                      <span className="font-semibold font-display text-[#4F46E5]">
                        Rs.{bar.value.toLocaleString("en-IN")}/mo
                      </span>
                    </div>
                    <div className="h-3 bg-[#F8FAFC] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.15,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full gradient-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: breakdown card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-card border border-[#E5E7EB]"
              data-ocid="franchise.earnings.breakdown_card"
            >
              <h3 className="text-xl font-bold font-display text-[#111827] mb-6 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#4F46E5]" />
                Monthly Breakdown
              </h3>

              <div className="space-y-4 mb-6">
                {[
                  {
                    label: "Revenue",
                    value: "Rs.90,000",
                    highlight: false,
                    sub: "30 students x Rs.3,000",
                  },
                  {
                    label: "Expenses",
                    value: "Rs.20,000-Rs.30,000",
                    highlight: false,
                    sub: "Rent, staff, utilities",
                  },
                  {
                    label: "Net Profit",
                    value: "Rs.50,000+",
                    highlight: true,
                    sub: "Every single month",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between p-4 rounded-2xl ${
                      row.highlight
                        ? "bg-[#F59E0B]/10 border-2 border-[#F59E0B]/40"
                        : "bg-[#F8FAFC] border border-[#E5E7EB]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p
                          className={`font-semibold font-display text-sm ${row.highlight ? "text-[#92400E]" : "text-[#374151]"}`}
                        >
                          {row.label}
                        </p>
                        <p className="text-xs text-[#6B7280] font-body">
                          {row.sub}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold font-display text-lg ${
                        row.highlight ? "text-[#F59E0B]" : "text-[#111827]"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={openPopup}
                data-ocid="franchise.earnings.start_earning_button"
                className="w-full gradient-primary text-white font-bold font-display py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Start Earning Today
              </button>

              <p className="text-xs text-[#6B7280] font-body mt-4 text-center leading-relaxed">
                *Based on 30 students at Rs.3,000/month fee. Actual results may
                vary.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INVESTMENT PACKAGES (existing) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Choose Your Plan
            </p>
            <h2 className="text-3xl font-bold font-display text-[#111827] mb-4">
              Investment <span className="text-gradient">Packages</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`franchise.package.item.${i + 1}`}
                className={`relative bg-white rounded-3xl p-6 shadow-card border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                  pkg.recommended
                    ? "border-[#4F46E5] shadow-[0_0_0_2px_rgba(79,70,229,0.15)]"
                    : "border-[#E5E7EB]"
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#4F46E5] text-white text-xs px-4 py-1 rounded-full font-semibold font-display flex items-center gap-1">
                      <Star className="w-3 h-3" fill="white" /> Recommended
                    </span>
                  </div>
                )}
                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold font-display text-[#111827] mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold font-display text-[#4F46E5]">
                    {pkg.investment}
                  </div>
                  <div className="text-[#6B7280] font-body text-xs">
                    one-time franchise fee
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    { label: "Capacity", value: pkg.seats },
                    { label: "Courses", value: pkg.courses },
                    { label: "Support Level", value: pkg.support },
                  ].map(({ label, value }) => (
                    <li key={label} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-[#6B7280] font-body">{label}:</span>
                      <span className="text-[#374151] font-display font-medium">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Brochure CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-3xl overflow-hidden gradient-primary"
          >
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold font-display mb-2">
                  Want Full Package Details?
                </h3>
                <p className="text-white/80 font-body text-sm">
                  Download our comprehensive franchise brochure with ROI
                  calculator, territory maps, and success stories.
                </p>
              </div>
              <button
                type="button"
                onClick={openPopup}
                data-ocid="franchise.banner_brochure.button"
                className="flex-shrink-0 flex items-center gap-2 bg-white text-[#4F46E5] hover:bg-indigo-50 font-bold font-display px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
              >
                <FileDown className="w-5 h-5" />
                Download Brochure
              </button>
            </div>
          </motion.div>

          <div className="text-center mt-6 text-[#6B7280] font-body text-sm">
            * All packages include: brand license, curriculum access,
            certification rights, and marketing materials.
          </div>
        </div>
      </section>

      {/* SECTION 4: FRANCHISE PROCESS */}
      <section
        className="py-20 bg-[#F8FAFC]"
        data-ocid="franchise.process.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Simple Steps
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              How to Become a{" "}
              <span className="text-gradient">PDIT Franchise Partner</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              Simple 5-step process to launch your own education center
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* steps */}
            <div className="space-y-0">
              {franchiseSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`franchise.process.step.${i + 1}`}
                  className="flex gap-5 relative"
                >
                  {/* connector line */}
                  {i < franchiseSteps.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5] to-[#06B6D4] z-0" />
                  )}
                  {/* step circle */}
                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-4 h-4 text-[#4F46E5]" />
                      <h3 className="font-bold font-display text-[#111827]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#6B7280] font-body text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* decorative image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-card"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                alt="Franchise team meeting"
                className="w-full h-80 lg:h-96 object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section
        className="py-20 bg-white"
        data-ocid="franchise.testimonials.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Partner Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              What Our Franchise{" "}
              <span className="text-gradient">Partners Say</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              Real stories from our growing network of partners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`franchise.testimonial.item.${i + 1}`}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB] relative"
              >
                {/* quote icon */}
                <div className="absolute top-5 right-5 text-indigo-100">
                  <svg
                    width="32"
                    height="24"
                    viewBox="0 0 32 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.6 6.4 6.4 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0L36 2.4C30.4 3.6 27.6 6.4 26.4 10.4H32V24H20z" />
                  </svg>
                </div>

                {/* stars */}
                <div className="flex gap-0.5 mb-3">
                  {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
                    <Star
                      key={sk}
                      className="w-4 h-4 text-[#F59E0B]"
                      fill="#F59E0B"
                    />
                  ))}
                </div>

                <p className="text-[#374151] font-body text-sm leading-relaxed mb-5 italic">
                  "{t.review}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold font-display text-[#111827] text-sm">
                      {t.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[#6B7280] font-body text-xs flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {t.city}
                      </span>
                      <span className="text-[#10B981] text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        Verified Partner
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[#6B7280] font-body">
                  {t.since}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8 text-[#6B7280] font-body text-sm">
            More partner stories coming soon. Be the next success story!
          </p>
        </div>
      </section>

      {/* BROCHURE CTA BANNER (existing position 9) handled inside packages above */}

      {/* SECTION 6: FAQ */}
      <section className="py-20 bg-[#F8FAFC]" data-ocid="franchise.faq.section">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Got Questions?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#111827] mb-3">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-[#6B7280] font-body max-w-xl mx-auto">
              Everything you need to know about the PDIT franchise
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                index={i}
                openIndex={openFaq}
                setOpenIndex={setOpenFaq}
              />
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM (existing) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="bg-white rounded-3xl shadow-card p-8 md:p-10 border border-[#E5E7EB]"
              data-ocid="franchise.panel"
            >
              <h2 className="text-2xl font-bold font-display text-[#111827] mb-2">
                Franchise Inquiry Form
              </h2>
              <p className="text-[#6B7280] font-body text-sm mb-6">
                Fill in your details and our franchise team will contact you
                within 48 hours.
              </p>

              {status === "success" ? (
                <div
                  className="text-center py-12"
                  data-ocid="franchise.success_state"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-[#10B981]" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-[#111827] mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-[#6B7280] font-body max-w-md mx-auto mb-6">
                    Our franchise team will contact you within 48 hours. We look
                    forward to partnering with you!
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    data-ocid="franchise.new_inquiry.button"
                    className="bg-[#4F46E5] text-white font-semibold font-display px-8 py-3 rounded-full hover:bg-[#4338CA] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  data-ocid="franchise.modal"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <Label
                        htmlFor="fr-name"
                        className="text-[#374151] font-display font-medium mb-1.5 block"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="fr-name"
                        data-ocid="franchise.name.input"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={errors.name ? "border-[#EF4444]" : ""}
                      />
                      {errors.name && (
                        <p
                          className="text-[#EF4444] text-xs mt-1"
                          data-ocid="franchise.name.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-phone"
                        className="text-[#374151] font-display font-medium mb-1.5 block"
                      >
                        Phone Number *
                      </Label>
                      <Input
                        id="fr-phone"
                        data-ocid="franchise.phone.input"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={errors.phone ? "border-[#EF4444]" : ""}
                      />
                      {errors.phone && (
                        <p
                          className="text-[#EF4444] text-xs mt-1"
                          data-ocid="franchise.phone.error_state"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-email"
                        className="text-[#374151] font-display font-medium mb-1.5 block"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="fr-email"
                        data-ocid="franchise.email.input"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={errors.email ? "border-[#EF4444]" : ""}
                      />
                      {errors.email && (
                        <p
                          className="text-[#EF4444] text-xs mt-1"
                          data-ocid="franchise.email.error_state"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-city"
                        className="text-[#374151] font-display font-medium mb-1.5 block"
                      >
                        City *
                      </Label>
                      <Input
                        id="fr-city"
                        data-ocid="franchise.city.input"
                        placeholder="Franchise location city"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className={errors.city ? "border-[#EF4444]" : ""}
                      />
                      {errors.city && (
                        <p
                          className="text-[#EF4444] text-xs mt-1"
                          data-ocid="franchise.city.error_state"
                        >
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-[#374151] font-display font-medium mb-1.5 block">
                        Investment Range *
                      </Label>
                      <Select
                        value={form.investment}
                        onValueChange={(v) => updateField("investment", v)}
                      >
                        <SelectTrigger
                          data-ocid="franchise.investment.select"
                          className={
                            errors.investment ? "border-[#EF4444]" : ""
                          }
                        >
                          <SelectValue placeholder="Select investment range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 Lakhs">
                            Rs.1 - 2 Lakhs (Starter)
                          </SelectItem>
                          <SelectItem value="2-4 Lakhs">
                            Rs.2 - 4 Lakhs (Standard)
                          </SelectItem>
                          <SelectItem value="4-7 Lakhs">
                            Rs.4 - 7 Lakhs (Premium)
                          </SelectItem>
                          <SelectItem value="7+ Lakhs">
                            Rs.7+ Lakhs (Master Franchise)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.investment && (
                        <p
                          className="text-[#EF4444] text-xs mt-1"
                          data-ocid="franchise.investment.error_state"
                        >
                          {errors.investment}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="fr-msg"
                      className="text-[#374151] font-display font-medium mb-1.5 block"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="fr-msg"
                      data-ocid="franchise.message.textarea"
                      placeholder="Tell us about your city, background, and any questions..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                    />
                  </div>

                  {status === "error" && (
                    <div
                      className="flex items-center gap-2 bg-red-50 text-[#EF4444] p-4 rounded-xl mb-5 text-sm"
                      data-ocid="franchise.error_state"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    data-ocid="franchise.submit.submit_button"
                    className="w-full gradient-primary disabled:opacity-60 text-white font-bold font-display py-4 rounded-full transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          data-ocid="franchise.loading_state"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Franchise Inquiry"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: STICKY CTA */}
      <AnimatePresence>
        {!stickyDismissed && !showFranchisePopup && (
          <motion.div
            key="sticky-cta"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40"
            data-ocid="franchise.sticky_cta"
          >
            <div className="shadow-2xl border-t border-white/10 bg-[#111827]">
              <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 sm:py-4">
                  <p className="text-white font-semibold font-display text-sm text-center sm:text-left">
                    Ready to start your own education center?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={openPopup}
                      data-ocid="franchise.sticky_cta.apply_button"
                      className="bg-[#F59E0B] text-white hover:bg-[#D97706] font-bold font-display px-6 py-2.5 rounded-full text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap shadow"
                    >
                      Apply for Franchise
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStickyDismissed(true);
                        sessionStorage.setItem(
                          "franchise_sticky_dismissed",
                          "1",
                        );
                      }}
                      aria-label="Dismiss"
                      data-ocid="franchise.sticky_cta.close_button"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
