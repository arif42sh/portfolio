import React from 'react';
import { Calendar } from 'lucide-react';

export default function Achievements() {
  const semesters = [
    {
      year: '2024',
      sem: 'Semester 1',
      period: 'Jan - Jun 2024',
      title: 'Foundations & Core Programming',
      desc: 'Core programming concepts and mathematical foundations for computer science.',
      tags: ['C', 'Algorithms', 'Computer Basics']
    },
    {
      year: '2024',
      sem: 'Semester 2',
      period: 'Jul - Dec 2024',
      title: 'OOP & Web Engineering',
      desc: 'Object-oriented programming paradigms, Competitive Programming, and web development.',
      tags: ['Java', 'C++', 'Competitive Programming']
    },
    {
      year: '2025',
      sem: 'Semester 3',
      period: 'Jan - Jun 2025',
      title: 'Desktop Application & Statistics',
      desc: 'Digital Logic Design, Applied Statistics, Desktop Applications, Data Structures & Algorithms I.',
      tags: ['MySQL', 'DBMS', 'DSA I', 'JavaFX']
    },
    {
      year: '2025',
      sem: 'Semester 4',
      period: 'Jul - Dec 2025',
      title: 'Database Management & Web Applications',
      desc: 'Theory of computation, full web application workflows, and relational database systems.',
      tags: ['JavaScript', 'HTML/CSS', 'MySQL', 'DSA II']
    },
    {
      year: '2026',
      sem: 'Semester 5',
      period: 'Jan - Jun 2026',
      title: 'Software Design & System Architecture',
      desc: 'Software Engineering, Compiler Design, Full-Stack Development, Computer Architecture.',
      tags: ['JavaScript', 'HTML/CSS', 'PHP', 'Software Design']
    },
    {
      year: '2026',
      sem: 'Semester 6 • Current',
      period: 'Jul - Dec 2026',
      title: 'AI, Networking & Full Stack Dev',
      desc: 'Artificial Intelligence, Computer Networking, Operating Systems, and Laravel Development.',
      tags: ['Python', 'AI', 'Networking', 'Operating Systems', 'Laravel']
    }
  ];

  return (
    <section id="achievements" className="py-24 border-y border-[#cbd4e7]/60 bg-[#fbfcff]/40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">Academic Roadmap</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight inline-block title-underline">
            Milestones that Shaped My Journey
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-1 before:bg-gradient-to-b before:from-[#405f9f] before:via-[#7655a6] before:to-[#087b77] before:-translate-x-1/2 before:rounded-full">
          {semesters.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Node circle */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-4 border-[#7655a6] shadow-[0_0_12px_rgba(118,85,166,0.35)] z-10"></div>

                {/* Content Box */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-8">
                  <div className="orig-card p-6 sm:p-7 relative transition-all hover:scale-[1.01]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#405f9f] to-[#7655a6] text-white shadow-xs">
                        {item.sem}
                      </span>
                      <span className="text-xs font-semibold text-[#53627a] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#405f9f]" />
                        <span>{item.period}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1d2a44] mb-1.5">{item.title}</h3>
                    <p className="text-[#53627a] text-sm leading-relaxed mb-4">{item.desc}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="orig-pill text-xs py-1 px-2.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
