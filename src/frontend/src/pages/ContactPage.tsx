import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import type { backendInterface as BackendAPI } from "../backend.d";
import { useActor } from "../hooks/useActor";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Address",
    lines: ["Sector 15, Rohini", "Delhi - 110089, India"],
    color: "bg-indigo-100 text-pdit-indigo",
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 99999 99999", "+91 88888 88888"],
    color: "bg-cyan-100 text-pdit-cyan",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@pdit.in", "admissions@pdit.in"],
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon-Sat: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 3:00 PM"],
    color: "bg-orange-100 text-orange-600",
  },
];

export default function ContactPage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const validate = (): boolean => {
    const newErrors: ErrorState = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
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
      await (actor as unknown as BackendAPI).submitContact(
        form.name.trim(),
        form.email.trim(),
        form.phone.trim(),
        form.message.trim(),
      );
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
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
      <section
        className="py-20"
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
              <MessageSquare className="w-4 h-4" />
              Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-indigo-200 text-lg max-w-xl mx-auto">
              Have questions? We're here to help. Reach out via form, phone, or
              visit us in Delhi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ background: "#F9FAFB" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-card text-center"
              >
                <div
                  className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {item.title}
                </h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-gray-500 text-sm">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div
                className="bg-white rounded-3xl shadow-card p-8"
                data-ocid="contact.panel"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  We typically respond within 2-4 hours on business days.
                </p>

                {status === "success" ? (
                  <div
                    className="text-center py-10"
                    data-ocid="contact.success_state"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-9 h-9 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 mb-5">
                      We'll get back to you within 4 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      data-ocid="contact.new_message.button"
                      className="bg-pdit-indigo text-white font-semibold px-6 py-2.5 rounded-full hover:bg-pdit-indigo-dark transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    data-ocid="contact.modal"
                  >
                    <div className="space-y-4 mb-5">
                      <div>
                        <Label
                          htmlFor="ct-name"
                          className="text-gray-700 font-medium mb-1.5 block"
                        >
                          <User className="w-3.5 h-3.5 inline mr-1" /> Your Name
                          *
                        </Label>
                        <Input
                          id="ct-name"
                          data-ocid="contact.name.input"
                          placeholder="Full name"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className={errors.name ? "border-red-400" : ""}
                        />
                        {errors.name && (
                          <p
                            className="text-red-500 text-xs mt-1"
                            data-ocid="contact.name.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="ct-email"
                          className="text-gray-700 font-medium mb-1.5 block"
                        >
                          <Mail className="w-3.5 h-3.5 inline mr-1" /> Email
                          Address *
                        </Label>
                        <Input
                          id="ct-email"
                          data-ocid="contact.email.input"
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={errors.email ? "border-red-400" : ""}
                        />
                        {errors.email && (
                          <p
                            className="text-red-500 text-xs mt-1"
                            data-ocid="contact.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="ct-phone"
                          className="text-gray-700 font-medium mb-1.5 block"
                        >
                          <Phone className="w-3.5 h-3.5 inline mr-1" /> Phone
                          (Optional)
                        </Label>
                        <Input
                          id="ct-phone"
                          data-ocid="contact.phone.input"
                          type="tel"
                          placeholder="Your phone number"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="ct-message"
                          className="text-gray-700 font-medium mb-1.5 block"
                        >
                          <MessageSquare className="w-3.5 h-3.5 inline mr-1" />{" "}
                          Message *
                        </Label>
                        <Textarea
                          id="ct-message"
                          data-ocid="contact.message.textarea"
                          placeholder="How can we help you?"
                          rows={5}
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          className={errors.message ? "border-red-400" : ""}
                        />
                        {errors.message && (
                          <p
                            className="text-red-500 text-xs mt-1"
                            data-ocid="contact.message.error_state"
                          >
                            {errors.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {status === "error" && (
                      <div
                        className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm"
                        data-ocid="contact.error_state"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        Failed to send. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      data-ocid="contact.submit.submit_button"
                      className="w-full bg-pdit-indigo hover:bg-pdit-indigo-dark disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2
                            className="w-5 h-5 animate-spin"
                            data-ocid="contact.loading_state"
                          />{" "}
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div
                className="bg-white rounded-3xl shadow-card overflow-hidden h-full min-h-[500px]"
                data-ocid="contact.map_marker"
              >
                <div className="gradient-primary p-5">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Find Us on Map
                  </h3>
                  <p className="text-indigo-200 text-sm mt-1">
                    Sector 15, Rohini, Delhi - 110089
                  </p>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14001.12345678!2d77.1025!3d28.7041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sRohini%20Sector%2015%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PDIT Location - Rohini Delhi"
                  className="block"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
