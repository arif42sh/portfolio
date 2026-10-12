import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="orig-footer py-8 border-t border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#f4ead8] text-center sm:text-left">
          © {new Date().getFullYear()} <span className="text-white font-bold">Arif Shahriar</span>. All rights reserved. Built with React & Tailwind CSS.
        </p>

        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-[#f4ead8] hover:text-white border border-white/25 transition-all cursor-pointer shadow-xs"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
