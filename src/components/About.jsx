import React from 'react';
import { GraduationCap, Shield, Layers, Target } from 'lucide-react';

export default function About() {
  const cards = [
    {
      badge: 'Education',
      icon: GraduationCap,
      title: 'B.Sc. in Computer Science and Engineering',
      desc: 'Bangladesh Army University of Science and Technology (BAUST), Saidpur'
    },
    {
      badge: 'Focus Areas',
      icon: Shield,
      title: 'Secure Software Development',
      desc: 'Data validation, threat mitigation, and security-focused defensive engineering.'
    },
    {
      badge: 'Expertise',
      icon: Layers,
      title: 'Software Engineering',
      desc: 'Full-stack web engineering, desktop solutions, and mobile app ecosystems.'
    },
    {
      badge: 'Career Goal',
      icon: Target,
      title: 'Professional Software Developer',
      desc: 'Growing toward a high-impact Software Developer & Cybersecurity Architect.'
    }
  ];

  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">About Me</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight leading-tight title-underline">
            Building secure, scalable solutions with impact
          </h2>
        </div>

        {/* Education & Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="education-card group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="education-badge">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.badge}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#29457f] mb-1.5 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-[#4e5f7e] text-sm leading-relaxed transition-colors">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
