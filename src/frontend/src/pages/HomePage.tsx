import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Download,
  Globe,
  Layers,
  Monitor,
  Palette,
  Play,
  Quote,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Course, backendInterface as FullBackend } from "../backend.d";
import CourseBrochurePopup from "../components/CourseBrochurePopup";
import type { PageType } from "../components/Navbar";
import { useActor } from "../hooks/useActor";

// -- Static data --

const HERO_STATS = [
  { value: "10,000+", label: "Students Trained", icon: Users },
  { value: "95%", label: "Placement Rate", icon: TrendingUp },
  { value: "50+", label: "Courses Offered", icon: BookOpen },
  { value: "100+", label: "Partner Companies", icon: Award },
];

const EXPERTS = [
  {
    name: "Dr. Rajesh Sharma",
    title: "Full Stack Developer",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    experience: "12 Years",
    tags: ["React", "Node.js", "AWS"],
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Priya Agarwal",
    title: "Digital Marketing Expert",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    experience: "9 Years",
    tags: ["SEO", "Google Ads", "Analytics"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Vikram Singh",
    title: "Data Science Lead",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    experience: "11 Years",
    tags: ["Python", "ML", "Power BI"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Neha Gupta",
    title: "UI/UX & Graphic Design",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    experience: "8 Years",
    tags: ["Figma", "Adobe CC", "Branding"],
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Amit Verma",
    title: "Cloud & DevOps Engineer",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces",
    experience: "10 Years",
    tags: ["Docker", "CI/CD", "Azure"],
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Sunita Yadav",
    title: "Placement & Career Coach",
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces",
    experience: "7 Years",
    tags: ["Resume", "Interviews", "HR"],
    color: "from-violet-500 to-indigo-500",
  },
];

const ROADMAP_STEPS = [
  {
    icon: BookOpen,
    num: "01",
    title: "Enroll in Program",
    desc: "Choose your career path and enroll in an industry-aligned course with flexible batch timings.",
  },
  {
    icon: Users,
    num: "02",
    title: "Learn from Experts",
    desc: "Get hands-on training from industry professionals with live projects and real-world case studies.",
  },
  {
    icon: Award,
    num: "03",
    title: "Get Certified",
    desc: "Earn industry-recognized certificates validated by top companies across India.",
  },
  {
    icon: Briefcase,
    num: "04",
    title: "Land Your Dream Job",
    desc: "Access our placement cell, mock interviews, and 100+ hiring partners for guaranteed job support.",
  },
];

const ADVANTAGES = [
  {
    icon: Shield,
    title: "Job Guarantee",
    desc: "We guarantee placement support until you land your first job. Our dedicated team works tirelessly for every student.",
    color: "from-indigo-50 to-indigo-100",
    iconBg: "bg-indigo-500",
  },
  {
    icon: Users,
    title: "Industry Mentors",
    desc: "Learn from professionals with 7-15 years of real industry experience who bring live projects into the classroom.",
    color: "from-cyan-50 to-cyan-100",
    iconBg: "bg-cyan-500",
  },
  {
    icon: Globe,
    title: "Lifetime Access",
    desc: "Get lifetime access to course materials, updated content, alumni network, and recorded sessions forever.",
    color: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "100% Placement Support",
    desc: "Resume building, mock interviews, job portal access, and direct referrals to our 100+ hiring partner companies.",
    color: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    course: "Full Stack Development",
    company: "TCS Digital",
    text: "PDIT transformed my career completely. The Full Stack course was incredibly well-structured and the practical projects gave me real-world experience. Got placed in TCS within 2 months of completion!",
    rating: 5,
    avatar: "RS",
  },
  {
    name: "Priya Verma",
    course: "Digital Marketing",
    company: "Freelancer (5 LPA)",
    text: "I was a commerce graduate with zero tech knowledge. PDIT's Digital Marketing course gave me the skills to build my own agency. Now earning Rs.5 LPA working from home!",
    rating: 5,
    avatar: "PV",
  },
  {
    name: "Amit Kumar",
    course: "Web Development",
    company: "Infosys",
    text: "The instructors at PDIT are fantastic. They don't just teach theory - they solve real problems and teach you how to think like a developer. Best investment I've made in my career.",
    rating: 5,
    avatar: "AK",
  },
];

const WHY_CHOOSE = [
  {
    icon: Zap,
    title: "Industry-Ready Curriculum",
    desc: "Courses designed with industry experts to match real-world job requirements and the latest tech trends.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "Learn from working professionals with 5-15 years of industry experience in their respective domains.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Shield,
    title: "Placement Support",
    desc: "Dedicated placement cell, mock interviews, resume building, and connections to 100+ hiring partners.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Globe,
    title: "Certified Credentials",
    desc: "Industry-recognized certificates that are valued by employers across India and internationally.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const CERTIFICATES = [
  {
    name: "Diploma in Computer Applications",
    body: "PDIT - Ministry of MSME Recognized",
    desc: "A comprehensive certification covering MS Office, Tally, and internet fundamentals for office professionals.",
    badge: "Foundation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Advanced Web Development",
    body: "PDIT - ISO 9001:2015 Certified",
    desc: "Industry-recognized credential validating full-stack development skills using modern frameworks.",
    badge: "Advanced",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Data Analytics Professional",
    body: "PDIT - NSDC Affiliated",
    desc: "Certifies proficiency in Excel, Python, and Power BI for data-driven decision making in enterprises.",
    badge: "Professional",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Digital Marketing Specialist",
    body: "PDIT - Google Partner Institution",
    desc: "Validates expertise in SEO, PPC, social media, and digital campaign management across platforms.",
    badge: "Specialist",
    color: "from-pink-500 to-rose-500",
  },
];

const HIRING_PARTNERS = [
  {
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
  },
  {
    name: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
  },
  {
    name: "Wipro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
  },
  {
    name: "HCL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/HCL_Technologies_logo.svg",
  },
  {
    name: "Tech Mahindra",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Tech_Mahindra_New_Logo.svg",
  },
  {
    name: "Accenture",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "Capgemini",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Capgemini_logo.svg",
  },
  { name: "Cognizant", logo: null },
  { name: "LTIMindtree", logo: null },
  { name: "Hexaware", logo: null },
  { name: "Mphasis", logo: null },
];

const TUTORIALS = [
  {
    title: "HTML & CSS for Beginners - Full Course",
    instructor: "Rajesh Sharma",
    duration: "2h 15m",
    level: "Beginner",
    featured: true,
    thumb:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=220&fit=crop",
  },
  {
    title: "JavaScript ES6 - Modern JS Fundamentals",
    instructor: "Rajesh Sharma",
    duration: "1h 45m",
    level: "Beginner",
    thumb:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=220&fit=crop",
  },
  {
    title: "React.js Complete Guide 2024",
    instructor: "Priya Agarwal",
    duration: "3h 20m",
    level: "Intermediate",
    thumb:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop",
  },
  {
    title: "Digital Marketing Crash Course",
    instructor: "Priya Agarwal",
    duration: "1h 30m",
    level: "Beginner",
    thumb:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&h=220&fit=crop",
  },
  {
    title: "Python for Data Science",
    instructor: "Vikram Singh",
    duration: "2h 40m",
    level: "Intermediate",
    thumb:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=220&fit=crop",
  },
  {
    title: "Figma UI Design Masterclass",
    instructor: "Neha Gupta",
    duration: "1h 55m",
    level: "Beginner",
    thumb:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=220&fit=crop",
  },
];

const RESOURCES = [
  {
    icon: BookOpen,
    title: "Career Guide 2024",
    desc: "Complete career roadmap for IT fresher graduates with salary benchmarks and skill requirements.",
    btn: "Download Free",
  },
  {
    icon: Code,
    title: "Web Dev Roadmap",
    desc: "Step-by-step visual roadmap from HTML beginner to Full Stack Developer with timeline estimates.",
    btn: "Access Free",
  },
  {
    icon: CheckCircle,
    title: "Interview Prep Checklist",
    desc: "100+ technical interview questions with answers for web development and IT placement drives.",
    btn: "Download Free",
  },
  {
    icon: Palette,
    title: "Resume Templates Pack",
    desc: "5 ATS-optimized resume templates designed specifically for IT freshers and career switchers.",
    btn: "Download Free",
  },
  {
    icon: Monitor,
    title: "Python Starter Pack",
    desc: "Complete beginner kit: cheat sheets, project ideas, and a 30-day practice plan for Python.",
    btn: "Access Free",
  },
  {
    icon: Layers,
    title: "Digital Marketing Kit",
    desc: "SEO checklist, social media calendar template, and Google Ads guide for beginners.",
    btn: "Download Free",
  },
];

const ALUMNI = [
  {
    name: "Sneha Kapoor",
    company: "Wipro",
    role: "Junior Developer",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=220&fit=crop",
    quote:
      "PDIT's placement team was relentless. Three rounds of mock interviews prepared me completely for Wipro's hiring process.",
  },
  {
    name: "Rohan Mishra",
    company: "Infosys",
    role: "Digital Analyst",
    photo:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=220&fit=crop",
    quote:
      "The Digital Marketing course gave me real campaign experience. Infosys was impressed by my live project portfolio.",
  },
  {
    name: "Ankita Singh",
    company: "HCL Technologies",
    role: "UI Developer",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=220&fit=crop",
    quote:
      "From Figma to React - PDIT covered it all. I got placed in HCL within 45 days of course completion.",
  },
  {
    name: "Deepak Yadav",
    company: "TCS",
    role: "Full Stack Developer",
    photo:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=220&fit=crop",
    quote:
      "MERN stack expertise built at PDIT helped me clear TCS Digital's technical round with confidence.",
  },
];

const FAQS = [
  {
    q: "What courses does PDIT offer?",
    a: "PDIT offers 50+ courses including Web Development, Full Stack Development, Digital Marketing, Graphic Design, Data Analytics, Computer Applications, Python, Tally, and Freelancing Skills - all designed for career transformation.",
  },
  {
    q: "Is there 100% job placement support?",
    a: "Yes! Our dedicated placement cell provides resume building, mock interviews, aptitude training, and direct referrals to our 100+ hiring partner companies. We support every student until they land their first job.",
  },
  {
    q: "What is the course duration?",
    a: "Courses range from 1 month (Freelancing Skills) to 6 months (Full Stack Development). Most popular courses are 2-3 months, designed to fit working professionals and students.",
  },
  {
    q: "Do you provide industry-recognized certificates?",
    a: "Yes, all PDIT certificates are recognized by top companies. We are affiliated with NSDC, ISO 9001:2015 certified, and recognized by the Ministry of MSME, making our certificates credible nationally.",
  },
  {
    q: "Can I enroll online?",
    a: "Yes, you can enroll online through our admission form. We offer both classroom training at our Delhi campus and online live sessions for students from other cities.",
  },
  {
    q: "What are the eligibility criteria?",
    a: "There are no strict eligibility requirements. Whether you're a school pass-out, graduate, working professional, or career changer - all are welcome. Basic computer knowledge is helpful but not mandatory.",
  },
  {
    q: "What is the fee structure?",
    a: "Course fees range from Rs.3,000 to Rs.15,000 depending on the program. We offer flexible EMI options, group discounts, and scholarships for meritorious students from underprivileged backgrounds.",
  },
  {
    q: "How is the teaching quality at PDIT?",
    a: "All faculty are working industry professionals with 7-15 years of experience. Classes include live projects, code reviews, real client case studies, and regular assessments to ensure practical skill development.",
  },
];

const FALLBACK_COURSES: Course[] = [
  {
    id: BigInt(1),
    title: "Web Development",
    subtitle: "Build beautiful, interactive websites",
    description: "Master HTML, CSS, JavaScript & React.",
    topics: ["HTML5", "CSS3", "JavaScript", "React"],
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
    description: "MERN Stack from database to frontend.",
    topics: ["MongoDB", "Express", "React", "Node"],
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
    description: "SEO, Social Media & Google Ads mastery.",
    topics: ["SEO", "Google Ads", "Social Media"],
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
    description: "Adobe Photoshop, Illustrator & Canva.",
    topics: ["Photoshop", "Illustrator", "Canva"],
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
    description: "MS Office, Excel, Tally & more.",
    topics: ["MS Office", "Excel", "Tally"],
    duration: "3 months",
    fee: "Rs.4,000",
    badge: "Foundation",
    colorKey: "#EA580C",
    isActive: true,
  },
  {
    id: BigInt(6),
    title: "Data Analytics",
    subtitle: "Turn data into business insights",
    description: "Python, Power BI & advanced Excel.",
    topics: ["Python", "Power BI", "Excel"],
    duration: "4 months",
    fee: "Rs.10,000",
    badge: "In Demand",
    colorKey: "#0891B2",
    isActive: true,
  },
];

const COURSE_IMAGES: Record<string, string> = {
  "Web Development":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
  "Full Stack Development":
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop",
  "Digital Marketing":
    "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
  "Graphic Design":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
  "Computer Applications":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
  "Data Analytics":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
  "Freelancing Skills":
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop",
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-orange-100 text-orange-700",
  Advanced: "bg-red-100 text-red-700",
};

// -- Sub-components --

function SectionBadge({
  icon: Icon,
  label,
  variant = "indigo",
}: { icon: React.ElementType; label: string; variant?: "indigo" | "cyan" }) {
  const cls =
    variant === "cyan"
      ? "bg-cyan-50 text-cyan-600"
      : "bg-indigo-50 text-pdit-indigo";
  return (
    <div
      className={`inline-flex items-center gap-2 ${cls} text-sm px-4 py-2 rounded-full mb-4 font-medium`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
}

function CourseCard({
  course,
  onEnroll,
}: { course: Course; onEnroll: (c: Course) => void }) {
  const colorKey =
    typeof course.colorKey === "string" ? course.colorKey : "#4F46E5";
  const courseImage = COURSE_IMAGES[course.title];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-[#E5E7EB] flex flex-col card-hover"
      data-ocid="programs.course.card"
    >
      {/* Course image */}
      <div className="relative h-40 overflow-hidden">
        {courseImage ? (
          <img
            src={courseImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colorKey}22 0%, ${colorKey}44 100%)`,
            }}
          >
            <BookOpen className="w-10 h-10" style={{ color: colorKey }} />
          </div>
        )}
        {/* Colored overlay bar at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: colorKey }}
        />
        {course.badge && (
          <span
            className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-md"
            style={{ background: colorKey }}
          >
            {course.badge}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[#111827] font-display text-base mb-1 leading-tight">
          {course.title}
        </h3>
        <p className="text-[#6B7280] text-sm mb-4 flex-1">{course.subtitle}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-[#4F46E5] px-3 py-1 rounded-full font-medium">
            <Clock className="w-3 h-3" /> {course.duration}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onEnroll(course)}
          data-ocid="programs.enroll.button"
          className="btn-primary w-full py-2.5 text-sm justify-center"
        >
          Enroll Now
        </button>
      </div>
    </motion.div>
  );
}

function VideoCard({
  title,
  instructor,
  duration,
  level,
  featured,
  thumb,
}: {
  title: string;
  instructor: string;
  duration: string;
  level: string;
  featured?: boolean;
  thumb?: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-card border border-[#E5E7EB] hover:shadow-card-hover transition-all duration-300 ${featured ? "md:col-span-2" : ""}`}
      data-ocid="tutorials.video.card"
    >
      {playing ? (
        <div className="relative aspect-video">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="w-full relative group"
          aria-label={`Play ${title}`}
          data-ocid="tutorials.play.button"
        >
          <div
            className={`${featured ? "h-52" : "h-44"} relative overflow-hidden flex items-center justify-center`}
          >
            {thumb ? (
              <img
                src={thumb}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1660 0%, #2d2994 60%, #1e6bb8 100%)",
                }}
              />
            )}
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg border-2 border-white/40">
                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        </button>
      )}
      <div className="p-4">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[level] ?? "bg-indigo-50 text-[#4F46E5]"}`}
        >
          {level}
        </span>
        <h4 className="font-semibold text-[#111827] text-sm mt-2 mb-1 leading-snug line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span>{instructor}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

function AlumniVideoCard({
  name,
  company,
  role,
  quote,
  photo,
}: {
  name: string;
  company: string;
  role: string;
  quote: string;
  photo?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-card border border-[#E5E7EB] hover:shadow-card-hover transition-all duration-300 card-hover"
      data-ocid="alumni.video.card"
    >
      {playing ? (
        <div className="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title={`${name} testimonial`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="w-full relative group"
          aria-label={`Play ${name}'s testimonial`}
        >
          <div className="h-44 relative overflow-hidden flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a5f 0%, #1a1660 100%)",
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-white/40">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        </button>
      )}
      <div className="p-5">
        <p className="text-[#6B7280] text-sm italic mb-4 line-clamp-3">
          "{quote}"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-[#111827] text-sm">{name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-[#F59E0B] text-white rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {company}
              </span>
              <span className="text-xs text-[#6B7280]">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  q,
  a,
  open: isOpen,
  onToggle,
}: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm"
      data-ocid="faq.item"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-indigo-50/50 transition-colors duration-200"
        data-ocid="faq.toggle.button"
      >
        <span className="font-semibold text-[#111827] text-sm md:text-base">
          {q}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
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
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-1 text-[#6B7280] text-sm leading-relaxed border-t border-[#E5E7EB] bg-indigo-50/20">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -- Main Component --

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { actor, isFetching } = useActor();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [counselingForm, setCounselingForm] = useState({
    name: "",
    phone: "",
    course: "",
  });

  // Fetch courses from backend
  useEffect(() => {
    if (!actor || isFetching) return;
    (async () => {
      try {
        const fullActor = actor as unknown as FullBackend;
        const result = await fullActor.getCourses();
        const active = result.ok.filter((c: Course) => c.isActive);
        setCourses(active.length > 0 ? active : FALLBACK_COURSES);
      } catch {
        setCourses(FALLBACK_COURSES);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, [actor, isFetching]);

  useEffect(() => {
    if (!isFetching && !actor) setCoursesLoading(false);
  }, [isFetching, actor]);

  const openEnrollPopup = (course: Course) => {
    setSelectedCourse(course);
    setPopupOpen(true);
  };

  const handleCounselingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openEnrollPopup(courses[0] ?? FALLBACK_COURSES[0]);
  };

  const scrollToCta = () => {
    document
      .getElementById("cta-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const displayCourses = courses.length > 0 ? courses : FALLBACK_COURSES;

  return (
    <main>
      {/* 1. HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1660 0%, #2d2994 40%, #1e6bb8 100%)",
        }}
        data-ocid="home.hero.section"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #06B6D4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4F46E5 0%, transparent 40%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 text-sm px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                India's Fastest Growing Tech Institute
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Build Your Career{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #67E8F9, #06B6D4)",
                  }}
                >
                  in Technology
                </span>
              </h1>
              <p className="text-lg text-indigo-200 mb-8 leading-relaxed max-w-lg">
                Join Pragyodaya Institute of Technology and acquire
                industry-ready skills in Web Development, Digital Marketing,
                Graphic Design & more. Transform your future today.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("admission");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  data-ocid="hero.enroll_now.primary_button"
                  className="btn-cta flex items-center gap-2"
                >
                  Enroll Now <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("franchise");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  data-ocid="hero.franchise.secondary_button"
                  className="flex items-center gap-2 border-2 border-white/60 text-white hover:bg-white/10 hover:border-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
                >
                  Open Franchise <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-5">
                {[
                  { text: "Government Recognized", icon: CheckCircle },
                  { text: "Industry Certified", icon: Award },
                  { text: "100% Practical", icon: Zap },
                ].map(({ text, icon: Icon }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <Icon className="w-4 h-4 text-[#06B6D4]" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="block w-full"
            >
              <div className="relative">
                <div
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl pointer-events-none"
                  style={{ zIndex: 0 }}
                />
                <img
                  src="/assets/generated/hero-pdit.dim_1200x600.jpg"
                  alt="PDIT Technology Training"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                  style={{ maxHeight: "420px", zIndex: 1 }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src =
                      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=600&fit=crop&q=80";
                  }}
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] text-lg leading-none">
                        10,000+
                      </div>
                      <div className="text-[#6B7280] text-xs">
                        Students Placed
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Star
                        className="w-5 h-5 text-[#4F46E5]"
                        fill="currentColor"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] text-lg leading-none">
                        4.9/5
                      </div>
                      <div className="text-[#6B7280] text-xs">
                        Student Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {HERO_STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {value}
                </div>
                <div className="text-indigo-300 text-xs md:text-sm mt-1">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. OUR PROGRAMS */}
      <section
        className="section-padding bg-white"
        data-ocid="programs.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={BookOpen} label="Our Programs" />
            <h2 className="heading-section text-foreground mb-4">
              Choose Your <span className="text-gradient">Career Path</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Industry-designed courses built to get you job-ready, fast.
            </p>
          </motion.div>
          {coursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={String(i)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
                >
                  <div className="h-32 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-9 bg-muted rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map((course, i) => (
                <motion.div
                  key={String(course.id)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <CourseCard course={course} onEnroll={openEnrollPopup} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => {
                onNavigate("courses");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-ocid="programs.view_all.button"
              className="inline-flex items-center gap-2 text-[#4F46E5] font-semibold hover:gap-3 transition-all duration-200 hover:text-[#4338CA]"
            >
              View All Courses <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. EXPERT TEAM */}
      <section
        className="section-padding section-alt"
        data-ocid="experts.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={Users} label="Our Expert Team" variant="cyan" />
            <h2 className="heading-section text-foreground mb-4">
              Meet Our <span className="text-gradient">Expert Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Learn from Industry Professionals with real-world experience
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {EXPERTS.map((expert, i) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 text-center group border border-[#E5E7EB] card-hover"
                data-ocid="experts.expert.card"
              >
                <img
                  src={expert.photo}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#E5E7EB] shadow-md"
                />
                <h3 className="font-semibold text-[#111827] font-display text-sm mb-0.5 leading-tight">
                  {expert.name}
                </h3>
                <p className="text-[#6B7280] text-xs mb-2">{expert.title}</p>
                <p className="text-xs text-[#4F46E5] font-semibold mb-3">
                  {expert.experience} exp.
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {expert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-indigo-50 text-[#4F46E5] px-2 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAREER GROWTH ROADMAP */}
      <section className="section-padding bg-white" data-ocid="roadmap.section">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={TrendingUp} label="Your Roadmap" />
            <h2 className="heading-section text-foreground mb-4">
              Your Career <span className="text-gradient">Growth Roadmap</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A clear path from enrollment to your dream job - step by step.
            </p>
          </motion.div>
          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-cyan-300 to-indigo-200 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
              {ROADMAP_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                  data-ocid="roadmap.step.card"
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#4F46E5] border-2 border-white rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#111827] font-display mb-2 text-base">
                    {step.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                  {i < ROADMAP_STEPS.length - 1 && (
                    <div className="md:hidden mt-4 w-px h-8 bg-indigo-200 mx-auto" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADVANTAGE */}
      <section
        className="section-padding section-alt"
        data-ocid="advantage.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge
              icon={Star}
              label="The PDIT Advantage"
              variant="cyan"
            />
            <h2 className="heading-section text-foreground mb-4">
              Why <span className="text-gradient">10,000+ Students</span> Choose
              Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our advantages go beyond education - we are your career partner.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-[#E5E7EB]/60 card-hover`}
                data-ocid="advantage.item.card"
              >
                <div
                  className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-md`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-[#111827] font-display text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section
        className="section-padding bg-white"
        data-ocid="testimonials.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={Quote} label="Success Stories" />
            <h2 className="heading-section text-foreground mb-4">
              Student <span className="text-gradient">Achievements</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real stories from real students who transformed their careers with
              PDIT.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card border border-[#E5E7EB] hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 card-hover"
                data-ocid="testimonials.card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={String(idx)}
                      className="w-4 h-4 text-[#F59E0B]"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827] text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {t.course} | {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US */}
      <section
        className="section-padding section-alt"
        data-ocid="why_choose.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={Star} label="Why Choose Us" variant="cyan" />
            <h2 className="heading-section text-foreground mb-4">
              What Makes PDIT <span className="text-gradient">Different</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We go beyond textbooks to deliver transformative learning
              experiences.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB] card-hover"
                data-ocid="why_choose.card"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#111827] font-display mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CERTIFICATES */}
      <section
        className="section-padding bg-white"
        data-ocid="certificates.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={Award} label="Certifications" />
            <h2 className="heading-section text-foreground mb-4">
              Industry-Recognized{" "}
              <span className="text-gradient">Certificates</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Boost Your Career Credibility with certificates trusted by top
              employers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATES.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB] card-hover"
                data-ocid="certificates.cert.card"
              >
                {/* Certificate mockup header */}
                <div
                  className={`h-28 bg-gradient-to-br ${cert.color} relative flex flex-col items-center justify-center p-4`}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                      backgroundSize: "10px 10px",
                    }}
                  />
                  <Award className="w-10 h-10 text-white opacity-90 mb-1" />
                  <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                    Certificate
                  </span>
                  <span className="absolute top-3 right-3 text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {cert.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#111827] font-display text-sm leading-tight mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-[#4F46E5] font-semibold mb-2">
                    {cert.body}
                  </p>
                  <p className="text-[#6B7280] text-xs leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRANSFORM YOUR CAREER TODAY */}
      <section
        className="py-20 gradient-primary relative overflow-hidden"
        data-ocid="transform.section"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
          }}
        />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Transform Your Career Today
            </h2>
            <p className="text-indigo-200 text-lg max-w-xl mx-auto">
              Join thousands of students who already unlocked their potential
              with PDIT.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { num: "5000+", label: "Placements" },
              { num: "50+", label: "Courses" },
              { num: "100%", label: "Job Support" },
              { num: "10+", label: "Years Legacy" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5"
                data-ocid="transform.stat"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {s.num}
                </div>
                <div className="text-indigo-200 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => openEnrollPopup(displayCourses[0])}
              data-ocid="transform.start_learning.button"
              className="bg-white text-[#4F46E5] font-bold px-10 py-4 rounded-full text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Learning Today
            </button>
            <button
              type="button"
              onClick={scrollToCta}
              data-ocid="transform.talk_counselor.button"
              className="border-2 border-white/60 text-white font-semibold px-10 py-4 rounded-full text-base hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              Talk to Counselor
            </button>
          </div>
        </div>
      </section>

      {/* 10. HIRING PARTNERS */}
      <section
        className="section-padding section-alt"
        data-ocid="hiring_partners.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge
              icon={Briefcase}
              label="Hiring Partners"
              variant="cyan"
            />
            <h2 className="heading-section text-foreground mb-4">
              Our <span className="text-gradient">Hiring Partners</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Top Companies Trust Our Graduates - 100+ hiring partners across
              India.
            </p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {HIRING_PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] flex items-center justify-center hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 group h-16"
                data-ocid="hiring_partners.partner.logo"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 max-w-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#4F46E5] transition-colors text-center leading-tight">
                    {partner.name}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. TUTORIALS & LEARNING HUB */}
      <section
        className="section-padding bg-white"
        data-ocid="tutorials.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={Play} label="Tutorials & Learning Hub" />
            <h2 className="heading-section text-foreground mb-4">
              Tutorials &amp;{" "}
              <span className="text-gradient">Learning Hub</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Free Resources to Get You Started - curated by our expert faculty.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TUTORIALS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <VideoCard {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. OUR RESOURCES */}
      <section
        className="section-padding section-alt"
        data-ocid="resources.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge
              icon={Download}
              label="Our Resources"
              variant="cyan"
            />
            <h2 className="heading-section text-foreground mb-4">
              Our <span className="text-gradient">Resources</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything You Need to Succeed - free guides, templates, and
              checklists.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((res, i) => (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-[#E5E7EB] flex flex-col card-hover"
                data-ocid="resources.resource.card"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <res.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="font-semibold text-[#111827] font-display mb-2">
                  {res.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4 flex-1">
                  {res.desc}
                </p>
                <button
                  type="button"
                  onClick={() => openEnrollPopup(displayCourses[0])}
                  data-ocid="resources.access.button"
                  className="inline-flex items-center gap-2 text-[#4F46E5] font-semibold text-sm hover:gap-3 transition-all duration-200 hover:text-[#4338CA]"
                >
                  <Download className="w-4 h-4" />
                  {res.btn}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. ALUMNI AT TOP COMPANIES */}
      <section className="section-padding bg-white" data-ocid="alumni.section">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={TrendingUp} label="Alumni Stories" />
            <h2 className="heading-section text-foreground mb-4">
              Alumni at <span className="text-gradient">Top Companies</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real Stories from Our Students - placed at India's leading IT
              companies.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALUMNI.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AlumniVideoCard {...a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. FAQ'S */}
      <section className="section-padding section-alt" data-ocid="faq.section">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={CheckCircle} label="FAQ's" variant="cyan" />
            <h2 className="heading-section text-foreground mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about PDIT courses and admissions.
            </p>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <FAQItem
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. READY TO START YOUR JOURNEY? (CTA) */}
      <section
        id="cta-section"
        className="section-padding bg-white"
        data-ocid="cta.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-3xl overflow-hidden shadow-xl border border-indigo-100">
            <div className="grid lg:grid-cols-2 gap-0 items-stretch">
              {/* Left - Form */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 bg-indigo-100 text-[#4F46E5] text-xs px-3 py-1.5 rounded-full mb-4 font-semibold uppercase tracking-wide">
                    Free Counseling
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-[#111827] mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Ready to Start Your{" "}
                    <span className="text-gradient">Journey?</span>
                  </h2>
                  <p className="text-[#6B7280] mb-8 leading-relaxed">
                    Talk to our expert career counselor for free. We'll help you
                    choose the right course and map your career path - no
                    commitment required.
                  </p>
                  <form
                    onSubmit={handleCounselingSubmit}
                    className="space-y-4"
                    data-ocid="cta.counseling.form"
                  >
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={counselingForm.name}
                      onChange={(e) =>
                        setCounselingForm((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      required
                      data-ocid="cta.name.input"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pdit-indigo/30 text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone Number"
                      value={counselingForm.phone}
                      onChange={(e) =>
                        setCounselingForm((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      required
                      data-ocid="cta.phone.input"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pdit-indigo/30 text-sm"
                    />
                    <select
                      value={counselingForm.course}
                      onChange={(e) =>
                        setCounselingForm((p) => ({
                          ...p,
                          course: e.target.value,
                        }))
                      }
                      data-ocid="cta.course.select"
                      className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-pdit-indigo/30 text-sm"
                    >
                      <option value="">Select Course Interest</option>
                      {displayCourses.map((c) => (
                        <option key={String(c.id)} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      data-ocid="cta.submit.button"
                      className="btn-cta w-full h-12 justify-center text-base"
                    >
                      Get Free Counseling &gt;&gt;
                    </button>
                  </form>
                  <p className="text-xs text-[#6B7280] mt-3 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Your information is 100%
                    secure and will never be shared.
                  </p>
                </motion.div>
              </div>

              {/* Right - Counselor visual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative hidden lg:flex items-end justify-center overflow-hidden min-h-[400px]"
                style={{
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #1e6bb8 50%, #06B6D4 100%)",
                }}
              >
                {/* Decorative circles */}
                <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute bottom-12 left-8 w-32 h-32 rounded-full bg-white/10" />

                {/* Counselor photo */}
                <div className="relative z-10 flex flex-col items-center pb-8 px-8 w-full">
                  <div className="relative mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=460&fit=crop&crop=top"
                      alt="Ms. Kavita Sharma - Senior Career Counselor"
                      className="w-52 h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/30"
                    />
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold text-lg">
                      Ms. Kavita Sharma
                    </div>
                    <div className="text-indigo-200 text-sm">
                      Senior Career Counselor
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={String(idx)}
                          className="w-3.5 h-3.5 text-yellow-300"
                          fill="currentColor"
                        />
                      ))}
                      <span className="text-white/80 text-xs ml-1">
                        500+ Students Guided
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-3 text-white text-xs">
                  <div className="font-bold text-sm">Free Session</div>
                  <div className="text-white/80">30 minutes</div>
                </div>
                <div className="absolute bottom-32 right-6 bg-white rounded-xl p-3 shadow-lg text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        No Obligation
                      </div>
                      <div className="text-muted-foreground">100% Free</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup */}
      <CourseBrochurePopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse ? Number(selectedCourse.id) : 0}
        courseName={selectedCourse?.title ?? ""}
        brochureUrl={undefined}
        courses={displayCourses}
      />
    </main>
  );
}
