import React, { useState } from 'react';
import { ExternalLink, Github, FolderGit2, Check } from 'lucide-react';

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Full-Stack', 'Mobile', 'Cyber & Networking'];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => (p.category || '').toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">
            Featured Projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight title-underline">
            Selected work that reflects my growth and ambition.
          </h2>

          {/* Clean Aligned Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#385a9a] to-[#7655a6] text-white shadow-sm'
                    : 'bg-white/85 text-[#53627a] hover:text-[#1d2a44] hover:bg-white border border-[#cbd4e7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id || project.title}
              className="orig-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Media Preview */}
                <div className="relative h-52 sm:h-60 bg-gradient-to-br from-[#dfe6f7] to-[#cbd4e7] overflow-hidden border-b border-[#cbd4e7]">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#405f9f]">
                      <FolderGit2 className="w-12 h-12 text-[#405f9f]/60 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#53627a]">Project Showcase</span>
                    </div>
                  )}

                  {/* Clean Professional Badge */}
                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#385a9a] border border-[#cbd4e7] shadow-sm">
                    {project.badge || 'Project'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 space-y-3.5">
                  <h3 className="text-xl font-bold text-[#1d2a44] group-hover:text-[#385a9a] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[#53627a] text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map((tech, i) => (
                      <span
                        key={i}
                        className="orig-pill text-xs py-1 px-3"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Feature bullets */}
                  {Array.isArray(project.bullets) && project.bullets.length > 0 && (
                    <ul className="space-y-1.5 pt-2 text-xs text-[#53627a]">
                      {project.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#385a9a] shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                <a
                  href={project.github_url || '#contact'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-[#1d2a44] border border-[#cbd4e7] hover:border-[#385a9a] hover:text-[#385a9a] transition-all shadow-xs"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <a
                  href={project.demo_url || '#contact'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#385a9a] to-[#7655a6] shadow-[0_4px_14px_rgba(64,95,159,0.22)] hover:opacity-95 transition-all"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
