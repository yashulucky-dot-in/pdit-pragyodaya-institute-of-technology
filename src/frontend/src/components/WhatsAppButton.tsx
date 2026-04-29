import { MessageCircle } from "lucide-react";
import React from "react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#22C55E] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" fill="white" />
    </a>
  );
}
