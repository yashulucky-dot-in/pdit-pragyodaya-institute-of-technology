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
  Building2,
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
import type { backendInterface as FullBackend } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface FranchiseBrochurePopupProps {
  open: boolean;
  onClose: () => void;
  franchiseBrochureUrl?: string;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  investment: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INVESTMENT_OPTIONS = [
  { value: "₹1–2 Lakhs", label: "₹1 – 2 Lakhs (Starter)" },
  { value: "₹2–5 Lakhs", label: "₹2 – 5 Lakhs (Standard)" },
  { value: "₹5–10 Lakhs", label: "₹5 – 10 Lakhs (Premium)" },
  { value: "₹10+ Lakhs", label: "₹10+ Lakhs (Master Franchise)" },
];

export default function FranchiseBrochurePopup({
  open,
  onClose,
  franchiseBrochureUrl,
}: FranchiseBrochurePopupProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    city: "",
    investment: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setErrors({});
      setSubmitted(false);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Enter a valid 10-digit phone number.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.investment)
      errs.investment = "Please select an investment budget.";
    return errs;
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
      const fullActor = actor as unknown as FullBackend;
      if (fullActor) {
        const leadId = await fullActor.submitFranchiseLead(
          form.name.trim(),
          form.email.trim(),
          form.phone.trim(),
          form.city.trim(),
          form.investment,
          form.message.trim(),
        );
        await fullActor.trackDownload(leadId, "franchise").catch(() => {});
      }
      sessionStorage.setItem("franchise_popup_shown", "1");
      setSubmitted(true);
      toast.success("Franchise brochure downloaded!");
      if (franchiseBrochureUrl) {
        window.open(franchiseBrochureUrl, "_blank", "noopener");
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
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      investment: "",
      message: "",
    });
    setErrors({});
  };

  const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    "Hi, I'm interested in PDIT franchise opportunity. I just downloaded the franchise brochure.",
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="franchise-backdrop"
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
            key="franchise-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            aria-label="Get Franchise Brochure"
            data-ocid="franchise_brochure.dialog"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div
                className="relative px-7 pt-8 pb-6 rounded-t-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #0E7490 100%)",
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  data-ocid="franchise_brochure.close_button"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-cyan-100 text-xs font-medium uppercase tracking-wider mb-1">
                      Franchise Partner Program
                    </p>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      Get Franchise Brochure
                    </h2>
                  </div>
                </div>
                <div className="mt-4 bg-white/15 rounded-xl px-4 py-2.5 text-white/90 text-sm">
                  🏢 Own a PDIT franchise — low investment, high returns
                </div>
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                    data-ocid="franchise_brochure.success_state"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-9 h-9 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Franchise brochure downloaded!
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Our franchise team will contact you within 48 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {franchiseBrochureUrl && (
                        <a
                          href={franchiseBrochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="franchise_brochure.download.button"
                          className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" /> Download Now
                        </a>
                      )}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="franchise_brochure.whatsapp.button"
                        className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm mb-5">
                      Fill in your details to receive the franchise brochure
                      instantly.
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="fb-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fb-name"
                          ref={firstInputRef}
                          placeholder="e.g. Amit Gupta"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className={`h-11 rounded-xl ${
                            errors.name ? "border-red-400" : ""
                          }`}
                          data-ocid="franchise_brochure.name.input"
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p
                            className="text-red-500 text-xs"
                            data-ocid="franchise_brochure.name.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="fb-email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fb-email"
                          type="email"
                          placeholder="e.g. amit@example.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={`h-11 rounded-xl ${
                            errors.email ? "border-red-400" : ""
                          }`}
                          data-ocid="franchise_brochure.email.input"
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p
                            className="text-red-500 text-xs"
                            data-ocid="franchise_brochure.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="fb-phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fb-phone"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={`h-11 rounded-xl ${
                            errors.phone ? "border-red-400" : ""
                          }`}
                          data-ocid="franchise_brochure.phone.input"
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <p
                            className="text-red-500 text-xs"
                            data-ocid="franchise_brochure.phone.error_state"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="fb-city"
                          className="text-sm font-medium text-gray-700"
                        >
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fb-city"
                          placeholder="e.g. Delhi, Mumbai, Pune"
                          value={form.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className={`h-11 rounded-xl ${
                            errors.city ? "border-red-400" : ""
                          }`}
                          data-ocid="franchise_brochure.city.input"
                          autoComplete="address-level2"
                        />
                        {errors.city && (
                          <p
                            className="text-red-500 text-xs"
                            data-ocid="franchise_brochure.city.error_state"
                          >
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* Investment Budget */}
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                          Investment Budget{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={form.investment}
                          onValueChange={(v) => updateField("investment", v)}
                        >
                          <SelectTrigger
                            data-ocid="franchise_brochure.investment.select"
                            className={`h-11 rounded-xl ${
                              errors.investment ? "border-red-400" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select investment range" />
                          </SelectTrigger>
                          <SelectContent>
                            {INVESTMENT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.investment && (
                          <p
                            className="text-red-500 text-xs"
                            data-ocid="franchise_brochure.investment.error_state"
                          >
                            {errors.investment}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="fb-message"
                          className="text-sm font-medium text-gray-700"
                        >
                          Short Message{" "}
                          <span className="text-gray-400 text-xs font-normal">
                            (optional)
                          </span>
                        </Label>
                        <Textarea
                          id="fb-message"
                          placeholder="Tell us about your plans and location..."
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          className="rounded-xl resize-none"
                          rows={2}
                          data-ocid="franchise_brochure.message.textarea"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        data-ocid="franchise_brochure.submit_button"
                        className="w-full h-12 rounded-xl text-white font-semibold text-base border-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)",
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Building2 className="mr-2 h-4 w-4" />
                            Get Franchise Brochure
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-gray-400">
                        🔒 Your information is secure and will not be shared.
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
