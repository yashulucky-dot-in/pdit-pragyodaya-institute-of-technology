import {
  BookOpen,
  Building2,
  ChevronRight,
  FlaskConical,
  Globe,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import type { PageType } from "../components/Navbar";

interface CampusPageProps {
  onNavigate: (page: PageType) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
};
const vp = { once: true };

const stats = [
  {
    icon: Building2,
    label: "Campus Area",
    value: "50,000",
    unit: "sq ft",
    color: "from-[#4F46E5] to-[#4338CA]",
  },
  {
    icon: Users,
    label: "Faculty Members",
    value: "200+",
    unit: "Experts",
    color: "from-[#06B6D4] to-[#0891B2]",
  },
  {
    icon: FlaskConical,
    label: "Labs & Studios",
    value: "20+",
    unit: "Facilities",
    color: "from-[#7C3AED] to-[#6D28D9]",
  },
  {
    icon: GraduationCap,
    label: "Alumni Network",
    value: "5000+",
    unit: "Graduates",
    color: "from-[#10B981] to-[#059669]",
  },
];

const gallery = [
  {
    src: "/assets/generated/campus-lab.dim_800x600.jpg",
    label: "Computer Labs",
    span: "",
  },
  {
    src: "/assets/generated/campus-library.dim_800x600.jpg",
    label: "Library & Resources",
    span: "",
  },
  {
    src: "/assets/generated/campus-innovation-hub.dim_800x600.jpg",
    label: "Innovation Hub",
    span: "md:row-span-2",
  },
  {
    src: "/assets/generated/campus-cafeteria.dim_800x600.jpg",
    label: "Cafeteria & Dining",
    span: "",
  },
  {
    src: "/assets/generated/campus-sports.dim_800x600.jpg",
    label: "Sports Complex",
    span: "",
  },
  {
    src: "/assets/generated/campus-auditorium.dim_800x600.jpg",
    label: "Grand Auditorium",
    span: "md:col-span-2",
  },
];

const facilities = [
  {
    icon: FlaskConical,
    title: "Computer Labs",
    description:
      "40+ high-performance systems with latest software, high-speed fiber internet, and 24/7 student access.",
    color: "from-[#4F46E5] to-[#6366F1]",
  },
  {
    icon: BookOpen,
    title: "Library & Resource Center",
    description:
      "10,000+ books, digital journals, e-library access, and dedicated reading zones for focused study.",
    color: "from-[#06B6D4] to-[#22D3EE]",
  },
  {
    icon: Lightbulb,
    title: "Innovation Hub",
    description:
      "3D printing, robotics kits, IoT lab, and a maker space to prototype your ideas into reality.",
    color: "from-[#7C3AED] to-[#8B5CF6]",
  },
  {
    icon: Trophy,
    title: "Sports Complex",
    description:
      "Indoor/outdoor courts, fully equipped gym, cricket ground, and dedicated yoga & fitness area.",
    color: "from-[#10B981] to-[#34D399]",
  },
  {
    icon: Utensils,
    title: "Cafeteria & Dining",
    description:
      "Hygienic, affordable meals across multiple cuisines with comfortable seating for 200+ students.",
    color: "from-[#F59E0B] to-[#FBBF24]",
  },
  {
    icon: Zap,
    title: "Auditorium",
    description:
      "500-seat air-conditioned auditorium with modern AV systems, used for seminars and events.",
    color: "from-[#EF4444] to-[#F87171]",
  },
];

const highlights = [
  {
    image: "/assets/generated/campus-outdoor.dim_800x600.jpg",
    icon: GraduationCap,
    iconColor: "bg-indigo-100 text-[#4F46E5]",
    title: "Academic Excellence",
    badge: "Top Results",
    description:
      "Our rigorous curriculum, led by industry practitioners, ensures every student gains hands-on expertise. 95% of graduates are placed within 3 months.",
    stats: [
      { label: "Placement Rate", value: "95%" },
      { label: "Avg Package", value: "Rs.4.5 LPA" },
    ],
  },
  {
    image: "/assets/generated/campus-student-life.dim_800x600.jpg",
    icon: Users,
    iconColor: "bg-cyan-100 text-[#06B6D4]",
    title: "Vibrant Student Life",
    badge: "20+ Clubs",
    description:
      "From coding hackathons and cultural fests to sports tournaments and entrepreneurship cells - life at PDIT extends far beyond the classroom.",
    stats: [
      { label: "Annual Events", value: "30+" },
      { label: "Student Clubs", value: "20+" },
    ],
  },
  {
    image: "/assets/generated/campus-innovation-hub.dim_800x600.jpg",
    icon: Globe,
    iconColor: "bg-purple-100 text-purple-600",
    title: "Industry Connections",
    badge: "50+ Partners",
    description:
      "Regular company visits, live projects, internships with top firms, and expert guest lectures bridge the gap between education and employment.",
    stats: [
      { label: "Partner Companies", value: "50+" },
      { label: "Internships/yr", value: "200+" },
    ],
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    course: "Full Stack Development",
    quote:
      "PDIT's campus gave me everything I needed - a world-class lab, supportive mentors, and a community that pushed me to grow every single day.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    name: "Rahul Verma",
    course: "Digital Marketing",
    rating: 5,
    quote:
      "The innovation hub changed my perspective on technology. I built my first IoT prototype here and landed a job at a top tech startup right after placement.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    name: "Ananya Singh",
    course: "Graphic Design",
    rating: 5,
    quote:
      "The campus culture is incredible - a perfect mix of academics, fun events, and real industry exposure. I made lifelong friends and found my career path here.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
];

export default function CampusPage({ onNavigate }: CampusPageProps) {
  return (
    <main className="pt-16 md:pt-20">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('/assets/generated/campus-hero.dim_1600x900.jpg')",
          }}
        />
        {/* Deep overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/80 via-[#4F46E5]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-2 rounded-full mb-6"
          >
            <Building2 className="w-4 h-4 text-cyan-300" />
            Delhi, India | Established 2018
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={vp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-6"
          >
            Discover Your Future
            <span className="block text-gradient-cyan">at PDIT Campus</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={vp}
            className="text-lg md:text-xl text-white/85 font-body max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            A 50,000 sq ft state-of-the-art campus in the heart of Delhi -
            designed to inspire innovation, foster collaboration, and launch
            careers that matter.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={vp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              type="button"
              data-ocid="campus.explore_button"
              onClick={() =>
                document
                  .getElementById("campus-facilities")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 bg-white text-[#4F46E5] px-8 py-4 rounded-full font-bold font-display text-base hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Building2 className="w-5 h-5" />
              Explore Campus
            </button>
            <button
              type="button"
              data-ocid="campus.apply_button"
              onClick={() => onNavigate("admission")}
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold font-display text-base hover:bg-white hover:text-[#4F46E5] transition-all duration-300"
            >
              Apply Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2.5 bg-white/70 rounded-full" />
        </motion.div>
      </section>

      {/* STATS */}
      <section
        className="section-padding bg-white"
        data-ocid="campus.stats.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              By The Numbers
            </p>
            <h2 className="heading-section text-[#111827]">
              A Campus Built for{" "}
              <span className="text-gradient">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={vp}
                className="card-hover bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-card"
                data-ocid={`campus.stat.item.${i + 1}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold font-display text-[#4F46E5] mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide">
                  {s.unit}
                </div>
                <div className="text-sm text-[#6B7280] font-body mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="section-padding bg-[#F8FAFC]"
        data-ocid="campus.gallery.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Visual Tour
            </p>
            <h2 className="heading-section text-[#111827]">
              Campus Life <span className="text-gradient">in Pictures</span>
            </h2>
            <p className="text-[#6B7280] font-body mt-3 max-w-xl mx-auto">
              Experience the vibrant, modern spaces where students learn,
              create, and grow every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <motion.div
                key={img.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={vp}
                className={`group relative rounded-2xl overflow-hidden shadow-card ${img.span} h-52 md:h-60`}
                data-ocid={`campus.gallery.item.${i + 1}`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white font-semibold text-sm font-display">
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section
        id="campus-facilities"
        className="section-padding bg-white"
        data-ocid="campus.facilities.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-14"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Infrastructure
            </p>
            <h2 className="heading-section text-[#111827]">
              World-Class <span className="text-gradient">Facilities</span>
            </h2>
            <p className="text-[#6B7280] font-body mt-3 max-w-xl mx-auto">
              Every space at PDIT is purposefully designed to foster learning,
              creativity, and real-world readiness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={vp}
                className="card-hover group bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-card cursor-pointer"
                data-ocid={`campus.facility.item.${i + 1}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#111827] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-4">
                  {f.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[#4F46E5] text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section
        className="section-padding bg-[#F8FAFC]"
        data-ocid="campus.highlights.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-14"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Student Experience
            </p>
            <h2 className="heading-section text-[#111827]">
              Life Beyond <span className="text-gradient">the Classroom</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={vp}
                className="card-hover bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-card"
                data-ocid={`campus.highlight.item.${i + 1}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#4F46E5] text-xs font-bold font-display px-3 py-1.5 rounded-full shadow">
                      {h.badge}
                    </span>
                  </div>
                  <div
                    className={`absolute bottom-4 left-4 w-10 h-10 rounded-xl ${h.iconColor} flex items-center justify-center`}
                  >
                    <h.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold font-display text-[#111827] mb-2">
                    {h.title}
                  </h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-5">
                    {h.description}
                  </p>
                  <div className="flex gap-4">
                    {h.stats.map((st) => (
                      <div
                        key={st.label}
                        className="flex-1 bg-[#F8FAFC] rounded-xl px-3 py-2.5 text-center"
                      >
                        <div className="text-[#4F46E5] font-bold font-display text-lg">
                          {st.value}
                        </div>
                        <div className="text-[#6B7280] font-body text-[11px] font-medium">
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIRTUAL TOUR CTA */}
      <section
        className="section-padding relative overflow-hidden"
        data-ocid="campus.tour.section"
      >
        <div className="absolute inset-0 gradient-primary" />
        {/* Decorative dots */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} viewport={vp}>
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Experience Our Campus Virtually
            </h2>
            <p className="text-white/80 font-body text-lg mb-10 max-w-2xl mx-auto">
              Can't visit in person? Take a 360-degree virtual tour of our
              campus - explore labs, library, sports facilities and more from
              anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                data-ocid="campus.virtual_tour.button"
                className="inline-flex items-center gap-2 bg-white text-[#4F46E5] px-8 py-4 rounded-full font-bold font-display text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                Take Virtual Tour
              </button>
              <button
                type="button"
                data-ocid="campus.schedule_visit.button"
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold font-display text-base hover:bg-white/10 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                Schedule a Visit
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="section-padding bg-white"
        data-ocid="campus.testimonials.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Student Voices
            </p>
            <h2 className="heading-section text-[#111827]">
              What Our Students{" "}
              <span className="text-gradient">Say About Campus</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={vp}
                className="card-hover bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-card relative"
                data-ocid={`campus.testimonial.item.${i + 1}`}
              >
                {/* Quote mark */}
                <div className="absolute top-5 right-6 text-6xl text-indigo-100 font-serif leading-none select-none">
                  "
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={`star-${t.name}-${j}`}
                      className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                    />
                  ))}
                </div>
                <p className="text-[#374151] font-body text-sm leading-relaxed mb-6 relative z-10 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#E5E7EB]"
                  />
                  <div>
                    <div className="font-bold font-display text-[#111827] text-sm">
                      {t.name}
                    </div>
                    <div className="text-[#6B7280] font-body text-xs">
                      {t.course}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <section
        className="section-padding bg-[#F8FAFC]"
        data-ocid="campus.location.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            viewport={vp}
            className="text-center mb-12"
          >
            <p className="text-[#4F46E5] font-semibold text-sm uppercase tracking-wider mb-2">
              Find Us
            </p>
            <h2 className="heading-section text-[#111827]">
              Visit Our <span className="text-gradient">Campus</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Map placeholder */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={vp}
              className="rounded-2xl overflow-hidden shadow-card border border-[#E5E7EB] min-h-72 relative gradient-primary flex flex-col items-center justify-center gap-4 p-10 text-white"
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-2">
                  PDIT Campus
                </h3>
                <p className="text-white/80 font-body text-sm mb-6">
                  Sector 15, Rohini, Delhi - 110089
                </p>
                <a
                  href="https://maps.google.com/?q=Sector+15+Rohini+Delhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="campus.get_directions.link"
                  className="inline-flex items-center gap-2 bg-white text-[#4F46E5] px-6 py-3 rounded-full font-bold font-display text-sm hover:scale-105 transition-transform"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={vp}
              className="bg-white rounded-2xl p-8 shadow-card border border-[#E5E7EB] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold font-display text-[#111827] mb-6">
                  Get in Touch
                </h3>
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <div>
                      <div className="font-semibold font-display text-[#111827] text-sm mb-0.5">
                        Campus Address
                      </div>
                      <div className="text-[#374151] font-body text-sm">
                        Sector 15, Rohini, Delhi - 110089, India
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#06B6D4]" />
                    </div>
                    <div>
                      <div className="font-semibold font-display text-[#111827] text-sm mb-0.5">
                        Call Us
                      </div>
                      <a
                        href="tel:+919999999999"
                        className="text-[#374151] font-body text-sm hover:text-[#4F46E5] transition-colors"
                      >
                        +91 99999 99999
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#06B6D4]" />
                    </div>
                    <div>
                      <div className="font-semibold font-display text-[#111827] text-sm mb-0.5">
                        Email Us
                      </div>
                      <a
                        href="mailto:info@pdit.in"
                        className="text-[#374151] font-body text-sm hover:text-[#4F46E5] transition-colors"
                      >
                        info@pdit.in
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  data-ocid="campus.contact_us.button"
                  onClick={() => onNavigate("contact")}
                  className="btn-primary flex-1 text-center"
                >
                  Contact Us
                </button>
                <button
                  type="button"
                  data-ocid="campus.apply_now_footer.button"
                  onClick={() => onNavigate("admission")}
                  className="btn-secondary flex-1 text-center"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
