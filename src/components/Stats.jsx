import React from 'react';
import { GitCommit, FolderGit2, Cpu, Flame } from 'lucide-react';

export default function Stats() {
  const stats = [
    { label: 'Commits', value: '45+', icon: GitCommit, color: 'text-[#405f9f]' },
    { label: 'Featured Projects', value: '5+', icon: FolderGit2, color: 'text-[#7655a6]' },
    { label: 'Tech Stacks', value: '4+', icon: Cpu, color: 'text-[#087b77]' },
    { label: 'Problem Solving', value: '100%', icon: Flame, color: 'text-[#b14c65]' },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="orig-card p-6 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#cbd4e7] flex items-center justify-center mb-3 shadow-xs">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight">
                  {s.value}
                </span>
                <span className="text-xs font-bold text-[#53627a] uppercase tracking-wider mt-1.5">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
