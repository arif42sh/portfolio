import React, { useState } from 'react';
import { Code2, Server, Database, Wrench, Cpu } from 'lucide-react';

export default function Skills({ skills }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Languages', 'Frameworks', 'Database', 'Tools', 'Machine Learning'];

  const categoryIcons = {
    Languages: Code2,
    Frameworks: Server,
    Database: Database,
    Tools: Wrench,
    'Machine Learning': Cpu
  };

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Group by category when 'All' is selected
  const groupedSkills = categories.slice(1).map(cat => ({
    category: cat,
    items: skills.filter(s => s.category.toLowerCase() === cat.toLowerCase())
  })).filter(g => g.items.length > 0);

  return (
    <section id="skills" className="py-24 border-y border-[#cbd4e7]/60 bg-[#fbfcff]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">Skills</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight title-underline">
            A modern toolkit for building real-world software.
          </h2>
          <p className="text-[#53627a] text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Proficient across full-stack web engineering, database architecture, desktop systems, and software engineering.
          </p>

          {/* Clean Aligned Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#385a9a] to-[#7655a6] text-white shadow-sm'
                    : 'bg-white/85 text-[#53627a] hover:text-[#1d2a44] hover:bg-white border border-[#cbd4e7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
        {activeCategory === 'All' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedSkills.map((group) => {
              const Icon = categoryIcons[group.category] || Code2;
              return (
                <div key={group.category} className="orig-card p-6">
                  <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-[#cbd4e7]/60">
                    <Icon className="w-4 h-4 text-[#405f9f]" />
                    <h3 className="font-bold text-[#1d2a44] text-base">{group.category}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill.id || skill.name}
                        className="orig-pill"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="orig-card p-8">
            <h3 className="text-lg font-bold text-[#1d2a44] mb-4">
              {activeCategory}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {filteredSkills.map((skill) => (
                <span
                  key={skill.id || skill.name}
                  className="orig-pill text-sm py-2 px-4"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
