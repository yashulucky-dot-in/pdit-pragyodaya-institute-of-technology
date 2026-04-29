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
    <footer className="bg-[#111827] text-[#D1D5DB]">
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">
                  PDIT
                </div>
                <div className="text-xs text-[#9CA3AF] font-body">
                  Pragyodaya Institute of Technology
                </div>
              </div>
            </div>
            <p className="text-[#9CA3AF] font-body text-sm leading-relaxed mb-5">
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
                  className="w-9 h-9 bg-[#1F2937] hover:bg-[#4F46E5] text-[#9CA3AF] hover:text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base text-white mb-4 border-l-2 border-[#4F46E5] pl-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", page: "home" as PageType },
                { label: "About Us", page: "about" as PageType },
                { label: "Our Courses", page: "courses" as PageType },
                { label: "Our Campus", page: "our-campus" as PageType },
                { label: "Admission", page: "admission" as PageType },
                { label: "Franchise", page: "franchise" as PageType },
                { label: "Contact Us", page: "contact" as PageType },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(page)}
                    className="text-[#9CA3AF] hover:text-white font-body text-sm transition-all duration-200 hover:translate-x-1 text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display font-semibold text-base text-white mb-4 border-l-2 border-[#4F46E5] pl-3">
              Our Courses
            </h4>
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
                    className="text-[#9CA3AF] hover:text-white font-body text-sm transition-all duration-200 hover:translate-x-1 text-left"
                  >
                    {course}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base text-white mb-4 border-l-2 border-[#4F46E5] pl-3">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#06B6D4] mt-0.5 shrink-0" />
                <span className="text-[#9CA3AF] font-body text-sm">
                  Sector 15, Rohini, Delhi - 110089, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#06B6D4] shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="text-[#9CA3AF] hover:text-white font-body text-sm transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#06B6D4] shrink-0" />
                <a
                  href="mailto:info@pdit.in"
                  className="text-[#9CA3AF] hover:text-white font-body text-sm transition-colors"
                >
                  info@pdit.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] font-body text-sm">
            &copy; {currentYear} PDIT - Pragyodaya Institute of Technology. All
            rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#6B7280] hover:text-white font-body text-xs transition-colors"
          >
            Built with love using caffeine.ai
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
