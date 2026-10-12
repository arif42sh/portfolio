import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Stories & Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  // Scrollspy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      const sections = ['home', 'about', 'skills', 'projects', 'achievements', 'blog', 'contact'];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#071d29] backdrop-blur-md border-b border-[#82c1da]/20 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand / Logo (Double click triggers secret Admin) */}
        <a 
          href="#home"
          onDoubleClick={onOpenAdmin}
          title="Double click for Admin Console"
          className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-[#f6f8ff] hover:text-[#20b7e7] transition-colors select-none cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#405f9f] to-[#7655a6] shadow-[0_0_12px_rgba(64,95,159,0.45)]"></span>
          <span>Arif Shahriar</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-[#20b7e7] bg-[#20b7e7]/10'
                    : 'text-[#b7cad4] hover:text-[#20b7e7] hover:bg-[#20b7e7]/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}

          {/* Discreet Lock icon */}
          <button
            onClick={onOpenAdmin}
            title="Admin Console (Ctrl+Shift+A)"
            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-[#20b7e7] hover:bg-[#20b7e7]/10 transition-colors opacity-60 hover:opacity-100"
            aria-label="Admin Console"
          >
            <Lock className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-[#f6f8ff] hover:text-[#20b7e7] transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071d29]/98 border-b border-[#82c1da]/25 px-4 py-4 space-y-1 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#b7cad4] hover:text-[#20b7e7] hover:bg-[#20b7e7]/10"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#20b7e7] bg-[#071d29] rounded-xl border border-[#20b7e7]/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
