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
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import type { backendInterface as BackendAPI } from "../backend.d";
import { useActor } from "../hooks/useActor";

const courses = [
  "Web Development",
  "Full Stack Development",
  "Digital Marketing",
  "Graphic Design",
  "Computer Applications",
  "Freelancing Skills",
];

const batches = [
  "Morning Batch (9 AM - 11 AM)",
  "Afternoon Batch (2 PM - 4 PM)",
  "Evening Batch (6 PM - 8 PM)",
  "Weekend Batch (Sat-Sun)",
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  course: string;
  city: string;
  message: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

export default function AdmissionPage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    course: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const validate = (): boolean => {
    const newErrors: ErrorState = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.course) newErrors.course = "Please select a course";
    if (!form.city.trim()) newErrors.city = "City is required";
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
      await (actor as unknown as BackendAPI).submitAdmission(
        form.name.trim(),
        form.phone.trim(),
        form.email.trim(),
        form.course,
        form.city.trim(),
        form.message.trim(),
      );
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        course: "",
        city: "",
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
      {/* Header */}
      <section className="py-20 relative overflow-hidden gradient-primary">
        {/* Decorative rings */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-cyan-200 text-sm px-4 py-2 rounded-full mb-6 font-medium backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" />
              Admission Open
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Start Your Journey Today
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto font-body">
              Fill out the form below and our team will contact you within 24
              hours with enrollment details.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Side Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {/* Available Courses card */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2 font-display">
                  <BookOpen className="w-5 h-5 text-[#4F46E5]" />
                  Available Courses
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Web Development",
                      fee: "Rs.8,000",
                      dur: "3 months",
                    },
                    {
                      name: "Full Stack Dev",
                      fee: "Rs.15,000",
                      dur: "6 months",
                    },
                    {
                      name: "Digital Marketing",
                      fee: "Rs.6,000",
                      dur: "2 months",
                    },
                    {
                      name: "Graphic Design",
                      fee: "Rs.5,000",
                      dur: "2 months",
                    },
                    { name: "Computer Apps", fee: "Rs.4,000", dur: "3 months" },
                    { name: "Freelancing", fee: "Rs.3,000", dur: "1 month" },
                  ].map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between py-2 border-b border-[#E5E7EB] last:border-0"
                    >
                      <span className="text-sm text-[#374151] font-medium font-body">
                        {c.name}
                      </span>
                      <div className="text-right">
                        <div className="text-[#4F46E5] font-bold text-sm font-display">
                          {c.fee}
                        </div>
                        <div className="text-[#9CA3AF] text-xs">{c.dur}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Batch */}
              <div className="bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] rounded-2xl p-6 text-white shadow-card">
                <Clock className="w-8 h-8 mb-3 text-cyan-200" />
                <h3 className="font-bold text-lg mb-2 font-display">
                  Next Batch Starting
                </h3>
                <p className="text-white/75 text-sm mb-3 font-body">
                  New batches begin every 1st and 15th of the month.
                </p>
                <div className="bg-white/15 rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-white font-bold font-display">
                    May 1, 2026
                  </div>
                  <div className="text-white/70 text-xs">
                    Limited Seats Available
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827] mb-3 font-display">
                  Need Help?
                </h3>
                <p className="text-[#6B7280] text-sm mb-3 font-body">
                  Call us for free career counselling
                </p>
                <a
                  href="tel:+919999999999"
                  className="flex items-center gap-2 text-[#06B6D4] font-semibold hover:text-[#0891B2] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +91 99999 99999
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div
                className="bg-white rounded-3xl shadow-card border border-[#E5E7EB] p-8"
                data-ocid="admission.panel"
              >
                <p className="text-[#4F46E5] text-sm font-semibold uppercase tracking-wider mb-1">
                  Apply Now
                </p>
                <h2 className="text-2xl font-bold text-[#111827] mb-2 font-display">
                  Admission Form
                </h2>
                <p className="text-[#6B7280] text-sm mb-6 font-body">
                  Fill in your details and we'll get back to you shortly.
                </p>

                {status === "success" ? (
                  <div
                    className="text-center py-12"
                    data-ocid="admission.success_state"
                  >
                    <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-9 h-9 text-[#10B981]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2 font-display">
                      Application Submitted!
                    </h3>
                    <p className="text-[#6B7280] max-w-md mx-auto mb-6 font-body">
                      Thank you! Our admission team will contact you within 24
                      hours on your phone and email.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      data-ocid="admission.new_application.button"
                      className="btn-primary"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    data-ocid="admission.modal"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      {/* Name */}
                      <div>
                        <Label
                          htmlFor="adm-name"
                          className="text-[#374151] font-medium mb-1.5 block text-sm"
                        >
                          <User className="w-3.5 h-3.5 inline mr-1" />
                          Full Name *
                        </Label>
                        <Input
                          id="adm-name"
                          data-ocid="admission.name.input"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className={
                            errors.name
                              ? "border-[#EF4444] focus-visible:ring-red-100 rounded-xl"
                              : "border-[#E5E7EB] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-indigo-100 rounded-xl"
                          }
                        />
                        {errors.name && (
                          <p
                            className="text-[#EF4444] text-xs mt-1"
                            data-ocid="admission.name.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <Label
                          htmlFor="adm-phone"
                          className="text-[#374151] font-medium mb-1.5 block text-sm"
                        >
                          <Phone className="w-3.5 h-3.5 inline mr-1" />
                          Phone Number *
                        </Label>
                        <Input
                          id="adm-phone"
                          data-ocid="admission.phone.input"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={
                            errors.phone
                              ? "border-[#EF4444] focus-visible:ring-red-100 rounded-xl"
                              : "border-[#E5E7EB] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-indigo-100 rounded-xl"
                          }
                        />
                        {errors.phone && (
                          <p
                            className="text-[#EF4444] text-xs mt-1"
                            data-ocid="admission.phone.error_state"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label
                          htmlFor="adm-email"
                          className="text-[#374151] font-medium mb-1.5 block text-sm"
                        >
                          <Mail className="w-3.5 h-3.5 inline mr-1" />
                          Email Address *
                        </Label>
                        <Input
                          id="adm-email"
                          data-ocid="admission.email.input"
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={
                            errors.email
                              ? "border-[#EF4444] focus-visible:ring-red-100 rounded-xl"
                              : "border-[#E5E7EB] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-indigo-100 rounded-xl"
                          }
                        />
                        {errors.email && (
                          <p
                            className="text-[#EF4444] text-xs mt-1"
                            data-ocid="admission.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Course */}
                      <div>
                        <Label className="text-[#374151] font-medium mb-1.5 block text-sm">
                          <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                          Course *
                        </Label>
                        <Select
                          value={form.course}
                          onValueChange={(v) => updateField("course", v)}
                        >
                          <SelectTrigger
                            data-ocid="admission.course.select"
                            className={
                              errors.course
                                ? "border-[#EF4444] rounded-xl"
                                : "border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 rounded-xl"
                            }
                          >
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.course && (
                          <p
                            className="text-[#EF4444] text-xs mt-1"
                            data-ocid="admission.course.error_state"
                          >
                            {errors.course}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <Label
                          htmlFor="adm-city"
                          className="text-[#374151] font-medium mb-1.5 block text-sm"
                        >
                          <MapPin className="w-3.5 h-3.5 inline mr-1" />
                          City *
                        </Label>
                        <Input
                          id="adm-city"
                          data-ocid="admission.city.input"
                          placeholder="Your city"
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className={
                            errors.city
                              ? "border-[#EF4444] focus-visible:ring-red-100 rounded-xl"
                              : "border-[#E5E7EB] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-indigo-100 rounded-xl"
                          }
                        />
                        {errors.city && (
                          <p
                            className="text-[#EF4444] text-xs mt-1"
                            data-ocid="admission.city.error_state"
                          >
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* Batch */}
                      <div>
                        <Label className="text-[#374151] font-medium mb-1.5 block text-sm">
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          Preferred Batch
                        </Label>
                        <Select>
                          <SelectTrigger
                            data-ocid="admission.batch.select"
                            className="border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 rounded-xl"
                          >
                            <SelectValue placeholder="Select batch timing" />
                          </SelectTrigger>
                          <SelectContent>
                            {batches.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <Label
                        htmlFor="adm-message"
                        className="text-[#374151] font-medium mb-1.5 block text-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                        Message (Optional)
                      </Label>
                      <Textarea
                        id="adm-message"
                        data-ocid="admission.message.textarea"
                        placeholder="Any questions or special requirements..."
                        rows={4}
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        className="border-[#E5E7EB] focus-visible:border-[#4F46E5] focus-visible:ring-2 focus-visible:ring-indigo-100 rounded-xl"
                      />
                    </div>

                    {status === "error" && (
                      <div
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-[#EF4444] p-4 rounded-xl mb-5 text-sm"
                        data-ocid="admission.error_state"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        Something went wrong. Please try again or call us
                        directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-ocid="admission.submit.submit_button"
                      className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2
                            className="w-5 h-5 animate-spin"
                            data-ocid="admission.loading_state"
                          />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
