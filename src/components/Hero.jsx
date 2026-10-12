import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Terminal } from 'lucide-react';

export default function Hero({ profile }) {
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    profile?.currently_exploring || 'Networking Fundamentals & Linux Security',
    'Artificial Intelligence & Machine Learning',
    'Secure Software Engineering & System Architecture',
    'Full-Stack Web & Android Development'
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer;

    if (!isDeleting && typedText.length < currentPhrase.length) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, typedText.length + 1));
      }, 70);
    } else if (!isDeleting && typedText.length === currentPhrase.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedText.length > 0) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, typedText.length - 1));
      }, 35);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex, phrases]);

  return (
    <section id="home" className="hero-dark-bg text-[#f6f8ff] relative pt-12 pb-20 md:py-24 overflow-hidden border-b border-[#cbd4e7]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Eyebrow */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#20b7e7]">
              {profile?.eyebrow || 'CSE Student • Cyber Security Enthusiast • AI & Software Developer'}
            </p>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Hi, I am <span className="text-[#20b7e7]">{profile?.name || 'Arif Shahriar'}</span>
            </h1>

            {/* Hero Sub */}
            <p className="text-base sm:text-lg text-[#c0ced8] leading-relaxed max-w-xl">
              {profile?.hero_sub ||
                'I am passionate about Cyber Security, AI, software Development, and creating practical solutions with various technologies.'}
            </p>

            {/* Typing exploration - Clean Professional Presentation */}
            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base py-1">
              <span className="text-[#20b7e7] font-semibold">Currently exploring:</span>
              <span className="text-white font-bold inline-flex items-center">
                <span>{typedText}</span>
                <span className="inline-block w-0.5 h-4 bg-[#20b7e7] ml-1.5 animate-pulse"></span>
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-[#12a9dc] border border-[#12a9dc] shadow-[0_8px_24px_rgba(18,169,220,0.32)] hover:bg-[#0fa0d1] hover:-translate-y-0.5 transition-all"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={profile?.resume_url || 'resume.txt'}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#eaf7ff] border border-[#079ed1] bg-transparent hover:bg-[#079ed1]/10 hover:-translate-y-0.5 transition-all"
              >
                <Download className="w-4 h-4 text-[#20b7e7]" />
                <span>Download Resume</span>
              </a>
            </div>

          </div>

          {/* Right Portrait Column (Asymmetric Curved Original Shape) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Asymmetric curved container */}
              <div className="profile-asymmetric w-[290px] sm:w-[360px] md:w-[410px] h-[370px] sm:h-[420px] md:h-[450px] shadow-2xl">
                <img
                  src={profile?.profile_image || 'profile.png'}
                  alt={profile?.name || 'Arif Shahriar portrait'}
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
