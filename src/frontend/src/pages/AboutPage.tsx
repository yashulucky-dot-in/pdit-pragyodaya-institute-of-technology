import {
  Award,
  Calendar,
  CheckCircle,
  Eye,
  GraduationCap,
  Heart,
  MapPin,
  Rocket,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import type { PageType } from "../components/Navbar";

const milestones = [
  {
    year: "2018",
    event: "PDIT founded in Delhi with 3 courses and 25 students",
    icon: Rocket,
  },
  {
    year: "2020",
    event: "Expanded to online learning during COVID-19 pandemic",
    icon: Globe2,
  },
  {
    year: "2022",
    event: "Crossed 500+ students milestone, launched Full Stack program",
    icon: Users,
  },
  {
    year: "2023",
    event: "Franchise expansion program launched across 5 cities",
    icon: MapPin,
  },
  {
    year: "2024",
    event: "Crossed 1000+ students, 95% placement rate achieved",
    icon: Award,
  },
  {
    year: "2025",
    event: "National expansion plan: 50+ franchise centres across India",
    icon: TrendingUp,
  },
];

function Globe2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <title>Globe</title>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const values = [
  {
    icon: Heart,
    title: "Student First",
    desc: "Every decision we make revolves around student success and career outcomes.",
  },
  {
    icon: CheckCircle,
    title: "Quality Education",
    desc: "We maintain the highest standards in curriculum, teaching, and assessment.",
  },
  {
    icon: Target,
    title: "Practical Focus",
    desc: "80% of our curriculum is hands-on, project-based learning.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    desc: "We update our courses every 6 months to match industry demands.",
  },
];

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <main className="pt-20">
      {/* Hero */}
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
              <GraduationCap className="w-4 h-4" />
              About PDIT
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Story & Mission
            </h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Building the next generation of technology professionals from the
              heart of Delhi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Institute Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transforming Lives Through{" "}
                <span className="text-gradient">Technology Education</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pragyodaya Institute of Technology (PDIT) is a premier
                technology training institute based in Delhi, India. Founded in
                2018 with a vision to democratize quality tech education, we
                have trained over 1,000 students from diverse backgrounds.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our institute bridges the gap between classroom learning and
                industry requirements. We partner with leading companies to
                ensure our curriculum stays current, and our dedicated placement
                cell works tirelessly to connect graduates with top employers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Established", value: "2018" },
                  { label: "Location", value: "Delhi, India" },
                  { label: "Students Trained", value: "1000+" },
                  { label: "Placement Rate", value: "95%" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-pdit-indigo">
                      {value}
                    </div>
                    <div className="text-gray-500 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/assets/generated/about-pdit.dim_800x400.jpg"
                alt="PDIT Campus"
                className="rounded-3xl shadow-xl w-full object-cover"
                style={{ maxHeight: "400px" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20" style={{ background: "#F9FAFB" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-pdit-indigo text-sm px-4 py-2 rounded-full mb-4 font-medium">
              <Users className="w-4 h-4" />
              Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Our <span className="text-gradient">Founder</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-card p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="shrink-0">
                <div className="relative">
                  <img
                    src="/assets/generated/founder-suryavanshi.dim_400x400.jpg"
                    alt="Suryavanshi Kumar"
                    className="w-36 h-36 md:w-48 md:h-48 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-md">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-cyan-50 text-pdit-cyan text-xs px-3 py-1 rounded-full mb-3 font-medium">
                  <Award className="w-3 h-3" />
                  Founder & Director
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  Suryavanshi Kumar
                </h3>
                <p className="text-pdit-indigo font-semibold mb-1">
                  "Yashu Lucky"
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Technology Educator & Edtech Entrepreneur, Delhi
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Suryavanshi Kumar, popularly known as "Yashu Lucky" in the
                  tech education community, is a passionate technology educator
                  and entrepreneur. With over 8 years of experience in the IT
                  industry, he founded PDIT with a singular mission: to make
                  quality technology education accessible to every aspiring
                  professional in India.
                </p>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Having witnessed firsthand the gap between college education
                  and industry requirements, Suryavanshi built PDIT to be a
                  bridge — combining theoretical knowledge with intensive
                  practical training, mentorship, and guaranteed placement
                  support.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {[
                    "8+ Years in IT",
                    "1000+ Students Mentored",
                    "Edtech Innovator",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="bg-indigo-50 text-pdit-indigo text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-indigo-200 leading-relaxed">
                To empower India's youth with world-class technology education
                that is practical, affordable, and career-focused. We strive to
                ensure every student who walks through our doors leaves with the
                skills, confidence, and connections needed to succeed in the
                digital economy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl p-8 text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-cyan-100 leading-relaxed">
                To become India's most trusted and largest network of technology
                training institutes, with 500+ franchise centers by 2028 —
                creating 1 lakh tech-skilled professionals and contributing to
                India's digital transformation journey.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Core Values</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-indigo-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-indigo-100 group-hover:bg-pdit-indigo rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <v.icon className="w-5 h-5 text-pdit-indigo group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Timeline */}
      <section className="py-20" style={{ background: "#F9FAFB" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-pdit-indigo text-sm px-4 py-2 rounded-full mb-4 font-medium">
              <Calendar className="w-4 h-4" />
              Our Journey
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Growth <span className="text-gradient">Milestones</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 md:-translate-x-0.5" />
            {milestones.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex gap-6 md:gap-0 mb-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 bg-white rounded-2xl p-5 shadow-card ml-10 md:ml-0 ${
                    i % 2 === 0 ? "md:mr-12" : "md:ml-12"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pdit-indigo font-bold text-lg">
                      {milestone.year}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{milestone.event}</p>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-5 w-4 h-4 gradient-primary rounded-full shadow-md" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Be Part of Our Growing Story
          </h2>
          <p className="text-indigo-200 mb-8">
            Whether as a student or a franchise partner, join the PDIT
            revolution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                onNavigate("admission");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-ocid="about.enroll.primary_button"
              className="bg-white text-pdit-indigo font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Enroll as Student
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate("franchise");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-ocid="about.franchise.secondary_button"
              className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Open Franchise
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
