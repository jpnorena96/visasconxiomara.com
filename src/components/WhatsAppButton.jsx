import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const phoneNumber = "51977600626"; // Número sin símbolos
    const message = "Hola, me gustaría recibir información sobre las visas.";
    const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat en WhatsApp"
            className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 sm:w-16 sm:h-16
        bg-[#25D366] text-white
        rounded-full shadow-xl
        hover:scale-110 hover:shadow-2xl hover:bg-[#20bd5a]
        transition-all duration-300 ease-out
        animate-bounce-in
      "
        >
            <MessageCircle size={32} strokeWidth={2.5} />

            {/* Tooltip opcional */}
            <span className="absolute right-full mr-4 bg-white text-ink-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden lg:block">
                ¡Escríbenos!
            </span>
        </a>
    );
}
