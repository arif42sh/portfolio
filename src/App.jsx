import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Stats from './components/Stats';
import Achievements from './components/Achievements';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import { supabase, INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_POSTS } from './lib/supabase';

export default function App() {
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem('CACHED_PROFILE');
    return cached ? JSON.parse(cached) : INITIAL_PROFILE;
  });

  const [projects, setProjects] = useState(() => {
    const cached = localStorage.getItem('CACHED_PROJECTS');
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });

  const [skills, setSkills] = useState(() => {
    const cached = localStorage.getItem('CACHED_SKILLS');
    return cached ? JSON.parse(cached) : INITIAL_SKILLS;
  });

  const [posts, setPosts] = useState(() => {
    const cached = localStorage.getItem('CACHED_POSTS');
    return cached ? JSON.parse(cached) : INITIAL_POSTS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch live data from Supabase on mount
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        // 1. Fetch Profile
        const { data: profData, error: profErr } = await supabase.from('profile').select('*').limit(1).single();
        if (!profErr && profData) {
          setProfile(profData);
          localStorage.setItem('CACHED_PROFILE', JSON.stringify(profData));
        }

        // 2. Fetch Projects
        const { data: projData, error: projErr } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
        if (!projErr && projData && projData.length > 0) {
          setProjects(projData);
          localStorage.setItem('CACHED_PROJECTS', JSON.stringify(projData));
        }

        // 3. Fetch Skills
        const { data: skillData, error: skillErr } = await supabase.from('skills').select('*').order('id', { ascending: true });
        if (!skillErr && skillData && skillData.length > 0) {
          setSkills(skillData);
          localStorage.setItem('CACHED_SKILLS', JSON.stringify(skillData));
        }

        // 4. Fetch Posts / Experiences
        const { data: postData, error: postErr } = await supabase.from('posts').select('*').order('id', { ascending: false });
        if (!postErr && postData && postData.length > 0) {
          setPosts(postData);
          localStorage.setItem('CACHED_POSTS', JSON.stringify(postData));
        }
      } catch (err) {
        console.warn('Live Supabase fetch notice:', err);
      }
    }

    fetchSupabaseData();
  }, []);

  // Keyboard shortcut: Ctrl + Shift + A for Admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1d2a44] selection:bg-[#7655a6] selection:text-white relative">
      <div className="aurora"></div>
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <main className="flex-1 relative z-1">
        <Hero profile={profile} />
        <About />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Stats />
        <Achievements />
        <Blog posts={posts} />
        <Contact profile={profile} />
      </main>

      <Footer />

      {/* Secret Authenticated Admin Console */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        profile={profile}
        setProfile={setProfile}
        projects={projects}
        setProjects={setProjects}
        skills={skills}
        setSkills={setSkills}
        posts={posts}
        setPosts={setPosts}
      />
    </div>
  );
}
