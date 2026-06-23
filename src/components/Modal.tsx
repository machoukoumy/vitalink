"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Desktop: centered modal / Mobile: bottom sheet */}
      <div className="relative bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90dvh] overflow-hidden animate-[slideUp_0.3s_ease] md:animate-[fadeIn_0.2s_ease] md:mx-4">
        {/* Mobile drag handle */}
        <div className="md:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between p-5 md:p-6 pb-3 md:pb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 md:px-6 pb-6 md:pb-6 overflow-y-auto max-h-[calc(90dvh-80px)]"
          style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
