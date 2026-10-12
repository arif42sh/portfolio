import React, { useState } from 'react';
import { Mail, Github, Linkedin, Facebook, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.name.trim() || formData.name.length < 2) {
      setStatus({ type: 'error', message: 'Please enter a valid name (at least 2 characters).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      setStatus({ type: 'error', message: 'Please write a message of at least 10 characters.' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStatus({
        type: 'success',
        message: `Thank you, ${formData.name}! Your message has been received. I'll get back to you shortly.`
      });
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus({ type: '', message: '' }), 6000);
    }, 1000);
  };

  const socialLinks = [
    { label: profile?.email || 'arifshahriar85204@gmail.com', href: `mailto:${profile?.email || 'arifshahriar85204@gmail.com'}`, icon: Mail },
    { label: 'GitHub Profile', href: profile?.github_url || 'https://github.com/arif42sh', icon: Github },
    { label: 'LinkedIn Profile', href: profile?.linkedin_url || 'https://www.linkedin.com', icon: Linkedin },
    { label: 'Facebook Profile', href: profile?.facebook_url || 'https://facebook.com', icon: Facebook },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Links */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">Get In Touch</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight title-underline">
                Let’s build something meaningful together.
              </h2>
            </div>

            <p className="text-[#53627a] text-sm sm:text-base leading-relaxed">
              Whether it’s a collaboration, an engineering project idea, or an opportunity, feel free to reach out.
            </p>

            <div className="space-y-3 pt-2">
              {socialLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="orig-card p-4 flex items-center gap-3.5 hover:border-[#405f9f] text-[#1d2a44] hover:text-[#405f9f] text-sm font-semibold transition-all hover:translate-x-1.5"
                  >
                    <div className="p-2.5 rounded-xl bg-[#405f9f]/10 text-[#405f9f]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="orig-card p-7 sm:p-9">
              <h3 className="text-xl font-bold text-[#1d2a44] mb-6">Send a Direct Message</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#53627a] uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arif Shahriar"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#cbd4e7] focus:border-[#405f9f] focus:ring-2 focus:ring-[#405f9f]/20 text-[#1d2a44] placeholder-[#8a9bb5] text-sm outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#53627a] uppercase tracking-wider mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#cbd4e7] focus:border-[#405f9f] focus:ring-2 focus:ring-[#405f9f]/20 text-[#1d2a44] placeholder-[#8a9bb5] text-sm outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-[#53627a] uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#cbd4e7] focus:border-[#405f9f] focus:ring-2 focus:ring-[#405f9f]/20 text-[#1d2a44] placeholder-[#8a9bb5] text-sm outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {status.message && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      status.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                        : 'bg-rose-50 border border-rose-300 text-rose-800'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-[#385a9a] to-[#7655a6] shadow-[0_6px_20px_rgba(64,95,159,0.25)] hover:shadow-[0_8px_24px_rgba(118,85,166,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
