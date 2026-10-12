import React, { useState } from 'react';
import { Trophy, Code2, BookOpen, Calendar, ArrowRight, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Blog({ posts }) {
  const [filter, setFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const categories = ['All', 'Hackathons', 'Competitions', 'Articles'];

  const filteredPosts = filter === 'All'
    ? posts
    : posts.filter((p) => (p.category || '').toLowerCase() === filter.toLowerCase());

  const getCategoryIcon = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'hackathons':
        return Code2;
      case 'competitions':
        return Trophy;
      default:
        return BookOpen;
    }
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setActiveImageIdx(0);
  };

  // Extract all unique images (cover + additional gallery)
  const getAllPostImages = (post) => {
    if (!post) return [];
    const list = [];
    if (post.image_url) list.push(post.image_url);
    if (Array.isArray(post.images)) {
      post.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  };

  const modalImages = getAllPostImages(selectedPost);

  return (
    <section id="blog" className="py-24 border-t border-[#cbd4e7]/60 bg-[#fbfcff]/35">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#7655a6] mb-1">
            Articles & Experiences
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d2a44] tracking-tight title-underline">
            Hackathons, competitions, and technical stories.
          </h2>
          <p className="text-[#53627a] text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Documenting hands-on engineering challenges, competitive programming insights, and collaborative hackathon journeys.
          </p>

          {/* Category Tabs */}
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPosts.map((post) => {
            const Icon = getCategoryIcon(post.category);
            const postImages = getAllPostImages(post);

            return (
              <article
                key={post.id || post.title}
                className="orig-card overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-all"
              >
                <div>
                  {/* Card Media Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-[#dfe6f7] to-[#cbd4e7] overflow-hidden border-b border-[#cbd4e7]">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#405f9f]">
                        <Icon className="w-10 h-10 text-[#405f9f]/70 mb-1" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#53627a]">
                          {post.category} Showcase
                        </span>
                      </div>
                    )}

                    {/* Category Pill Badge */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-0.5 rounded-full text-xs font-bold bg-white/95 text-[#385a9a] border border-[#cbd4e7] shadow-xs flex items-center gap-1.5">
                      <Icon className="w-3 h-3" />
                      <span>{post.category}</span>
                    </span>

                    {/* Multiple Images Indicator Badge */}
                    {postImages.length > 1 && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{postImages.length} photos</span>
                      </span>
                    )}

                    {/* Achievement Pill */}
                    {post.badge && (
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7655a6] text-white shadow-xs">
                        {post.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#53627a]">
                      <Calendar className="w-3.5 h-3.5 text-[#385a9a]" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1d2a44] group-hover:text-[#385a9a] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-[#53627a] text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Tags */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="orig-pill text-[11px] py-0.5 px-2.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Read Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => handleOpenPost(post)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold bg-white text-[#1d2a44] border border-[#cbd4e7] hover:border-[#385a9a] hover:text-[#385a9a] transition-all cursor-pointer shadow-xs"
                  >
                    <span>Read Full Experience</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* Reader Modal (High z-index to never get cut off by Navbar) */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#cbd4e7] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Modal Bar with Close Button */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-[#cbd4e7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#385a9a]/10 text-[#385a9a] border border-[#385a9a]/20">
                  {selectedPost.category}
                </span>
                {selectedPost.badge && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#7655a6] text-white">
                    {selectedPost.badge}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full bg-white hover:bg-slate-200 text-[#1d2a44] border border-[#cbd4e7] transition-all cursor-pointer shadow-xs"
                title="Close story"
                aria-label="Close story"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto flex-1">
              
              {/* Image Gallery Viewer (Contains entire photo without cropping/cutting off) */}
              {modalImages.length > 0 ? (
                <div className="border-b border-[#cbd4e7]">
                  {/* Main Selected Image Stage */}
                  <div className="relative w-full h-64 sm:h-80 md:h-96 bg-[#071d29] flex items-center justify-center overflow-hidden">
                    <img
                      src={modalImages[activeImageIdx]}
                      alt={`${selectedPost.title} slide ${activeImageIdx + 1}`}
                      className="w-full h-full object-contain p-2"
                    />

                    {/* Prev / Next Arrows */}
                    {modalImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIdx((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 transition-all cursor-pointer shadow-md"
                          title="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setActiveImageIdx((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 transition-all cursor-pointer shadow-md"
                          title="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-white backdrop-blur-xs border border-white/20">
                          {activeImageIdx + 1} / {modalImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multiple Images Thumbnail Strip */}
                  {modalImages.length > 1 && (
                    <div className="px-4 py-3 bg-slate-100 flex items-center gap-2.5 overflow-x-auto border-t border-[#cbd4e7]">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            activeImageIdx === idx
                              ? 'border-[#385a9a] scale-105 shadow-sm'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Story Details & Text */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#53627a] font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#385a9a]" />
                  <span>{selectedPost.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d2a44] leading-tight">
                  {selectedPost.title}
                </h2>

                <p className="text-sm sm:text-base font-medium text-[#385a9a] bg-[#385a9a]/8 p-4 rounded-2xl border border-[#385a9a]/20">
                  {selectedPost.summary}
                </p>

                <div className="text-sm sm:text-base text-[#1d2a44] leading-relaxed whitespace-pre-line space-y-3 pt-2">
                  {selectedPost.content}
                </div>

                {/* Tags */}
                {Array.isArray(selectedPost.tags) && selectedPost.tags.length > 0 && (
                  <div className="pt-4 border-t border-[#cbd4e7] flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, i) => (
                      <span key={i} className="orig-pill text-xs py-1 px-3">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-[#cbd4e7] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#1d2a44] text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
