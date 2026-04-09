import {
  ExternalLink,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";
import type { PageType } from "./Navbar";

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="gradient-footer text-white">
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">PDIT</div>
                <div className="text-xs text-indigo-200">
                  Pragyodaya Institute of Technology
                </div>
              </div>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed mb-5">
              Empowering careers through industry-relevant technology education
              since 2018. Join 1000+ students who transformed their careers with
              PDIT.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="https://wa.me/919999999999"
                  aria-label={label}
                  className="w-9 h-9 bg-white/15 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", page: "home" as PageType },
                { label: "About Us", page: "about" as PageType },
                { label: "Our Courses", page: "courses" as PageType },
                { label: "Admission", page: "admission" as PageType },
                { label: "Franchise", page: "franchise" as PageType },
                { label: "Contact Us", page: "contact" as PageType },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(page)}
                    className="text-indigo-200 hover:text-white text-sm transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-base mb-4">Our Courses</h4>
            <ul className="space-y-2.5">
              {[
                "Web Development",
                "Full Stack Development",
                "Digital Marketing",
                "Graphic Design",
                "Computer Applications",
                "Freelancing Skills",
              ].map((course) => (
                <li key={course}>
                  <button
                    type="button"
                    onClick={() => handleNavigate("courses")}
                    className="text-indigo-200 hover:text-white text-sm transition-colors text-left"
                  >
                    {course}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pdit-cyan mt-0.5 shrink-0" />
                <span className="text-indigo-200 text-sm">
                  Sector 15, Rohini, Delhi - 110089, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pdit-cyan shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="text-indigo-200 hover:text-white text-sm transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-pdit-cyan shrink-0" />
                <a
                  href="mailto:info@pdit.in"
                  className="text-indigo-200 hover:text-white text-sm transition-colors"
                >
                  info@pdit.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-indigo-300 text-sm">
            © {currentYear} PDIT — Pragyodaya Institute of Technology. All
            rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-300 hover:text-white text-xs transition-colors"
          >
            Built with ❤️ using caffeine.ai
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
