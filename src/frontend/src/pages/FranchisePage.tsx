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
  Building,
  CheckCircle,
  FileDown,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import type { backendInterface as BackendAPI } from "../backend.d";
import FranchiseBrochurePopup from "../components/FranchiseBrochurePopup";
import { useActor } from "../hooks/useActor";

const benefits = [
  {
    icon: Building,
    title: "Proven Business Model",
    desc: "Use our tested systems, branding, and processes. No need to start from scratch.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Users,
    title: "Complete Training & Support",
    desc: "Instructor training, curriculum, teaching materials, and ongoing academic support.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "High ROI Potential",
    desc: "With 20-40 students per batch and 3-4 batches annually, achieve ROI within 12 months.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    title: "Exclusive Territory Rights",
    desc: "Protected territory with no competing PDIT franchise within your defined zone.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Award,
    title: "Certification Authority",
    desc: "Issue PDIT-recognized certificates to your students, backed by national credibility.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Zap,
    title: "Marketing & Lead Gen",
    desc: "National marketing campaigns, social media, and digital ads drive students to your center.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const packages = [
  {
    name: "Starter",
    investment: "₹1.5 Lakhs",
    seats: "Up to 30 students/batch",
    courses: "3 courses",
    support: "Basic",
    color: "border-gray-200",
    recommended: false,
  },
  {
    name: "Standard",
    investment: "₹3 Lakhs",
    seats: "Up to 60 students/batch",
    courses: "All 6 courses",
    support: "Premium",
    color: "border-pdit-indigo",
    recommended: true,
  },
  {
    name: "Premium",
    investment: "₹6 Lakhs",
    seats: "Unlimited students",
    courses: "All + future courses",
    support: "Dedicated Manager",
    color: "border-gray-200",
    recommended: false,
  },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  investment: string;
  message: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

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

  // Auto-trigger popup after 10s (once per session, franchise page only)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !sessionStorage.getItem("franchise_popup_shown") &&
        !showFranchisePopup
      ) {
        setShowFranchisePopup(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [showFranchisePopup]);

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
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 text-sm px-4 py-2 rounded-full mb-6">
              <Building className="w-4 h-4" />
              Franchise Opportunity
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Own a PDIT Franchise
            </h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
              Join India's fastest growing ed-tech franchise network. Low
              investment, high returns, proven systems.
            </p>
            {/* Prominent Get Franchise Brochure CTA */}
            <motion.button
              type="button"
              onClick={() => setShowFranchisePopup(true)}
              data-ocid="franchise.get_brochure.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-white text-cyan-700 hover:bg-cyan-50 font-bold px-8 py-4 rounded-2xl shadow-2xl transition-colors text-base"
            >
              <FileDown className="w-5 h-5" />
              Get Franchise Brochure — Free Download
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Why Franchise */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With <span className="text-gradient">PDIT?</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
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
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${b.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section className="py-20" style={{ background: "#F9FAFB" }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                className={`relative bg-white rounded-3xl p-6 shadow-card border-2 ${
                  pkg.recommended ? "border-pdit-indigo" : "border-gray-100"
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-pdit-indigo text-white text-xs px-4 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" fill="white" /> Recommended
                    </span>
                  </div>
                )}
                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-bold text-pdit-indigo">
                    {pkg.investment}
                  </div>
                  <div className="text-gray-400 text-xs">
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
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-gray-500">{label}:</span>
                      <span className="text-gray-800 font-medium">{value}</span>
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
            className="mt-10 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #0E7490 100%)",
            }}
          >
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Want Full Package Details?
                </h3>
                <p className="text-cyan-100 text-sm">
                  Download our comprehensive franchise brochure with ROI
                  calculator, territory maps, and success stories.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFranchisePopup(true)}
                data-ocid="franchise.banner_brochure.button"
                className="flex-shrink-0 flex items-center gap-2 bg-white text-cyan-700 hover:bg-cyan-50 font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
              >
                <FileDown className="w-5 h-5" />
                Download Brochure
              </button>
            </div>
          </motion.div>

          <div className="text-center mt-6 text-gray-500 text-sm">
            * All packages include: brand license, curriculum access,
            certification rights, and marketing materials.
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="bg-white rounded-3xl shadow-card p-8 md:p-10 border border-gray-100"
              data-ocid="franchise.panel"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Franchise Inquiry Form
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Fill in your details and our franchise team will contact you
                within 48 hours.
              </p>

              {status === "success" ? (
                <div
                  className="text-center py-12"
                  data-ocid="franchise.success_state"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Our franchise team will contact you within 48 hours. We look
                    forward to partnering with you!
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    data-ocid="franchise.new_inquiry.button"
                    className="bg-pdit-indigo text-white font-semibold px-8 py-3 rounded-full hover:bg-pdit-indigo-dark transition-colors"
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
                        className="text-gray-700 font-medium mb-1.5 block"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="fr-name"
                        data-ocid="franchise.name.input"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={errors.name ? "border-red-400" : ""}
                      />
                      {errors.name && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="franchise.name.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-phone"
                        className="text-gray-700 font-medium mb-1.5 block"
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
                        className={errors.phone ? "border-red-400" : ""}
                      />
                      {errors.phone && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="franchise.phone.error_state"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-email"
                        className="text-gray-700 font-medium mb-1.5 block"
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
                        className={errors.email ? "border-red-400" : ""}
                      />
                      {errors.email && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="franchise.email.error_state"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="fr-city"
                        className="text-gray-700 font-medium mb-1.5 block"
                      >
                        City *
                      </Label>
                      <Input
                        id="fr-city"
                        data-ocid="franchise.city.input"
                        placeholder="Franchise location city"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className={errors.city ? "border-red-400" : ""}
                      />
                      {errors.city && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="franchise.city.error_state"
                        >
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-gray-700 font-medium mb-1.5 block">
                        Investment Range *
                      </Label>
                      <Select
                        value={form.investment}
                        onValueChange={(v) => updateField("investment", v)}
                      >
                        <SelectTrigger
                          data-ocid="franchise.investment.select"
                          className={errors.investment ? "border-red-400" : ""}
                        >
                          <SelectValue placeholder="Select investment range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 Lakhs">
                            ₹1 - 2 Lakhs (Starter)
                          </SelectItem>
                          <SelectItem value="2-4 Lakhs">
                            ₹2 - 4 Lakhs (Standard)
                          </SelectItem>
                          <SelectItem value="4-7 Lakhs">
                            ₹4 - 7 Lakhs (Premium)
                          </SelectItem>
                          <SelectItem value="7+ Lakhs">
                            ₹7+ Lakhs (Master Franchise)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.investment && (
                        <p
                          className="text-red-500 text-xs mt-1"
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
                      className="text-gray-700 font-medium mb-1.5 block"
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
                      className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-5 text-sm"
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
                    className="w-full bg-pdit-indigo hover:bg-pdit-indigo-dark disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          data-ocid="franchise.loading_state"
                        />{" "}
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
    </main>
  );
}
