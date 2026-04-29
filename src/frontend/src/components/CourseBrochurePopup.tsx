import { Button } from "@/components/ui/button";
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
  BookOpen,
  CheckCircle,
  Download,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Course, backendInterface as FullBackend } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface CourseBrochurePopupProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  courseName: string;
  brochureUrl?: string;
  courses: Course[];
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  courseId: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CourseBrochurePopup({
  open,
  onClose,
  courseId,
  courseName,
  brochureUrl,
  courses,
}: CourseBrochurePopupProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    courseId: courseId > 0 ? String(courseId) : "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedBrochureUrl, setSubmittedBrochureUrl] = useState<
    string | undefined
  >(undefined);
  const [submittedCourseName, setSubmittedCourseName] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync courseId prop into form when popup opens
  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        courseId: courseId > 0 ? String(courseId) : prev.courseId,
      }));
      setErrors({});
      setSubmitted(false);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open, courseId]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Enter a valid 10-digit phone number.";
    if (!form.courseId) errs.courseId = "Please select a course.";
    return errs;
  };

  const getSelectedCourseName = () => {
    if (!form.courseId) return courseName;
    const found = courses.find((c) => String(c.id) === form.courseId);
    return found?.title ?? courseName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const selectedCourseId = form.courseId
        ? BigInt(form.courseId)
        : BigInt(courseId);
      const selectedCourseName = getSelectedCourseName();
      let leadId: bigint | null = null;
      const fullActor = actor as unknown as FullBackend;
      if (fullActor) {
        leadId = await fullActor.submitCourseLead(
          form.name.trim(),
          form.email.trim(),
          form.phone.trim(),
          selectedCourseId,
          selectedCourseName,
          form.message.trim(),
        );
        if (leadId != null) {
          await fullActor.trackDownload(leadId, "course").catch(() => {});
        }
      }
      setSubmittedCourseName(selectedCourseName);
      setSubmittedBrochureUrl(brochureUrl);
      sessionStorage.setItem("course_popup_shown", "1");
      setSubmitted(true);
      toast.success("Your course brochure is ready! Downloading...");
      if (brochureUrl) {
        window.open(brochureUrl, "_blank", "noopener");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", courseId: "", message: "" });
    setErrors({});
  };

  const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I just downloaded the ${submittedCourseName} brochure from PDIT website.`)}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            aria-label="Download Course Brochure"
            data-ocid="course_brochure.dialog"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div
                className="relative px-7 pt-8 pb-6 rounded-t-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #6366F1 60%, #818CF8 100%)",
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  data-ocid="course_brochure.close_button"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1 font-body">
                      Free Download
                    </p>
                    <h2 className="text-xl font-bold text-white leading-tight font-display">
                      Download Course Brochure
                    </h2>
                  </div>
                </div>
                {courseName && (
                  <div className="mt-4 bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-white/90 text-sm font-medium font-body">
                    {courseName}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                    data-ocid="course_brochure.success_state"
                  >
                    <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-9 h-9 text-[#10B981]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2 font-display">
                      Your course brochure is ready!
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-6 font-body">
                      Download has started. Our team will reach out to you soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {submittedBrochureUrl && (
                        <a
                          href={submittedBrochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="course_brochure.download.button"
                          className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          style={{
                            background:
                              "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                          }}
                        >
                          <Download className="w-4 h-4" /> Download Now
                        </a>
                      )}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="course_brochure.whatsapp.button"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22C55E] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 text-sm shadow-md hover:shadow-[0_4px_15px_rgba(37,211,102,0.35)] hover:-translate-y-0.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-[#6B7280] text-sm mb-5 font-body">
                      Fill in your details to get the brochure instantly.
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cb-name"
                          className="text-sm font-medium text-[#374151] font-body"
                        >
                          Full Name <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                          id="cb-name"
                          ref={firstInputRef}
                          placeholder="e.g. Rahul Sharma"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className={`h-11 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] px-4 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-body ${
                            errors.name
                              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100"
                              : ""
                          }`}
                          data-ocid="course_brochure.name.input"
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p
                            className="text-[#EF4444] text-xs mt-1 font-body"
                            data-ocid="course_brochure.name.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cb-email"
                          className="text-sm font-medium text-[#374151] font-body"
                        >
                          Email Address{" "}
                          <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                          id="cb-email"
                          type="email"
                          placeholder="e.g. rahul@example.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={`h-11 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] px-4 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-body ${
                            errors.email
                              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100"
                              : ""
                          }`}
                          data-ocid="course_brochure.email.input"
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p
                            className="text-[#EF4444] text-xs mt-1 font-body"
                            data-ocid="course_brochure.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cb-phone"
                          className="text-sm font-medium text-[#374151] font-body"
                        >
                          Phone Number <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                          id="cb-phone"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={`h-11 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] px-4 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-body ${
                            errors.phone
                              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100"
                              : ""
                          }`}
                          data-ocid="course_brochure.phone.input"
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <p
                            className="text-[#EF4444] text-xs mt-1 font-body"
                            data-ocid="course_brochure.phone.error_state"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Course Select */}
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-[#374151] font-body">
                          Select Course{" "}
                          <span className="text-[#EF4444]">*</span>
                        </Label>
                        <Select
                          value={form.courseId}
                          onValueChange={(v) => updateField("courseId", v)}
                        >
                          <SelectTrigger
                            data-ocid="course_brochure.course.select"
                            className={`h-11 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-body ${
                              errors.courseId
                                ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-red-100"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses
                              .filter((c) => c.isActive)
                              .map((c) => (
                                <SelectItem
                                  key={String(c.id)}
                                  value={String(c.id)}
                                >
                                  {c.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errors.courseId && (
                          <p
                            className="text-[#EF4444] text-xs mt-1 font-body"
                            data-ocid="course_brochure.course.error_state"
                          >
                            {errors.courseId}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="cb-message"
                          className="text-sm font-medium text-[#374151] font-body"
                        >
                          Short Message{" "}
                          <span className="text-[#9CA3AF] text-xs font-normal">
                            (optional)
                          </span>
                        </Label>
                        <Textarea
                          id="cb-message"
                          placeholder="Any questions or special requirements..."
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          className="rounded-xl resize-none border border-[#E5E7EB] bg-white text-[#111827] placeholder-[#9CA3AF] px-4 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-body"
                          rows={2}
                          data-ocid="course_brochure.message.textarea"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        data-ocid="course_brochure.submit_button"
                        className="w-full h-12 rounded-full text-white font-semibold text-base border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Get My Brochure
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-[#9CA3AF] font-body">
                        Your information is secure and will not be shared.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
