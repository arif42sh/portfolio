import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, X, Plus, Trash2, Edit3, CheckCircle, RefreshCw, LogOut, BookOpen, Trophy, Code2 } from 'lucide-react';
import { supabase, computeSHA256 } from '../lib/supabase';

const DEFAULT_PASS_HASH = import.meta.env.VITE_ADMIN_PASS_HASH || '9e6c69d9c081151935be2cb3090e4607a161cb3e6f09518264c5dae1dbc255d2';

export default function AdminModal({
  isOpen,
  onClose,
  profile,
  setProfile,
  projects,
  setProjects,
  skills,
  setSkills,
  posts = [],
  setPosts = () => {}
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState('');

  // Profile Form
  const [profForm, setProfForm] = useState({ ...profile });

  // Project Form & Modal
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    title: '',
    badge: 'Project',
    category: 'Full-Stack',
    description: '',
    tech_stack: '',
    bullets: '',
    image_url: '',
    github_url: '',
    demo_url: ''
  });

  // Post / Experience Form & Modal
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: '',
    category: 'Hackathons',
    date: '',
    badge: '',
    summary: '',
    image_url: '',
    content: '',
    tags: ''
  });

  // New Skill Form
  const [newSkillCat, setNewSkillCat] = useState('Frameworks');
  const [newSkillName, setNewSkillName] = useState('');

  // Password Change
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Sync profile when opened
  useEffect(() => {
    if (profile) setProfForm({ ...profile });
  }, [profile]);

  // Check existing session
  useEffect(() => {
    if (sessionStorage.getItem('ADMIN_AUTH') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    const inputHash = await computeSHA256(password);
    const storedHash = localStorage.getItem('ADMIN_PASS_HASH') || DEFAULT_PASS_HASH;

    if (inputHash === storedHash) {
      sessionStorage.setItem('ADMIN_AUTH', 'true');
      setIsAuthenticated(true);
      setPassword('');
      showToast('✓ Welcome, Arif! Admin Console unlocked.');
    } else {
      setAuthError('Incorrect master security password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ADMIN_AUTH');
    setIsAuthenticated(false);
    onClose();
  };

  // 1. Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfile(profForm);
    localStorage.setItem('CACHED_PROFILE', JSON.stringify(profForm));

    try {
      await supabase.from('profile').upsert({ id: 1, ...profForm, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn('Supabase profile sync notice:', err);
    }

    showToast('✓ Profile updated successfully and published live!');
  };

  // 2. Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const techArray = typeof currentProject.tech_stack === 'string'
      ? currentProject.tech_stack.split(',').map((t) => t.trim()).filter(Boolean)
      : currentProject.tech_stack;

    const bulletsArray = typeof currentProject.bullets === 'string'
      ? currentProject.bullets.split('\n').map((b) => b.trim()).filter(Boolean)
      : currentProject.bullets;

    const projectPayload = {
      ...currentProject,
      tech_stack: techArray,
      bullets: bulletsArray
    };

    let updatedList;
    if (currentProject.id) {
      updatedList = projects.map((p) => (p.id === currentProject.id ? { ...p, ...projectPayload } : p));
    } else {
      const newId = Date.now();
      updatedList = [{ ...projectPayload, id: newId }, ...projects];
    }

    setProjects(updatedList);
    localStorage.setItem('CACHED_PROJECTS', JSON.stringify(updatedList));
    setIsEditingProject(false);

    try {
      await supabase.from('projects').upsert(projectPayload);
    } catch (err) {
      console.warn('Supabase project sync notice:', err);
    }

    showToast('✓ Project saved successfully!');
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem('CACHED_PROJECTS', JSON.stringify(updated));

    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete notice:', err);
    }

    showToast('✓ Project deleted.');
  };

  const handleEditProject = (p) => {
    setCurrentProject({
      ...p,
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack || '',
      bullets: Array.isArray(p.bullets) ? p.bullets.join('\n') : p.bullets || ''
    });
    setIsEditingProject(true);
  };

  // 3. Save Post / Experience
  const handleSavePost = async (e) => {
    e.preventDefault();
    const tagsArray = typeof currentPost.tags === 'string'
      ? currentPost.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : currentPost.tags;

    const postPayload = {
      ...currentPost,
      tags: tagsArray
    };

    let updatedPosts;
    if (currentPost.id) {
      updatedPosts = posts.map((p) => (p.id === currentPost.id ? { ...p, ...postPayload } : p));
    } else {
      const newId = Date.now();
      updatedPosts = [{ ...postPayload, id: newId }, ...posts];
    }

    setPosts(updatedPosts);
    localStorage.setItem('CACHED_POSTS', JSON.stringify(updatedPosts));
    setIsEditingPost(false);

    try {
      await supabase.from('posts').upsert(postPayload);
    } catch (err) {
      console.warn('Supabase post sync notice:', err);
    }

    showToast('✓ Story / Experience published successfully!');
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience/story?')) return;
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem('CACHED_POSTS', JSON.stringify(updated));

    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase post delete notice:', err);
    }

    showToast('✓ Story deleted.');
  };

  const handleEditPost = (p) => {
    setCurrentPost({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || ''
    });
    setIsEditingPost(true);
  };

  // 4. Add & Delete Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill = { id: Date.now(), category: newSkillCat, name: newSkillName.trim() };
    const updated = [...skills, newSkill];
    setSkills(updated);
    localStorage.setItem('CACHED_SKILLS', JSON.stringify(updated));
    setNewSkillName('');

    try {
      await supabase.from('skills').upsert(newSkill);
    } catch (err) {
      console.warn('Supabase skill sync notice:', err);
    }

    showToast(`✓ Added skill "${newSkill.name}"`);
  };

  const handleDeleteSkill = async (skill) => {
    const updated = skills.filter((s) => s.id !== skill.id && s.name !== skill.name);
    setSkills(updated);
    localStorage.setItem('CACHED_SKILLS', JSON.stringify(updated));

    try {
      if (skill.id) await supabase.from('skills').delete().eq('id', skill.id);
    } catch (err) {
      console.warn('Supabase skill delete notice:', err);
    }

    showToast(`✓ Removed skill "${skill.name}"`);
  };

  // 5. Change Master Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    const currHash = await computeSHA256(currPass);
    const expected = localStorage.getItem('ADMIN_PASS_HASH') || DEFAULT_PASS_HASH;

    if (currHash !== expected) {
      setPassMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }

    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    const newHash = await computeSHA256(newPass);
    localStorage.setItem('ADMIN_PASS_HASH', newHash);
    setPassMsg({ type: 'success', text: '✓ Master password changed successfully!' });
    setCurrPass('');
    setNewPass('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-60 bg-[#071d29] border border-cyan-400 text-cyan-200 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* LOGIN SCREEN (Centered Lock Overlay) */}
      {!isAuthenticated ? (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="cyber-card p-8 sm:p-10 rounded-3xl max-w-md w-full text-center relative border border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Shield className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Restricted Console</h2>
            <p className="text-xs text-slate-400 mb-6">Enter master security password to access system controls.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative text-left">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-white text-sm outline-none focus:border-cyan-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && <p className="text-xs font-semibold text-rose-400">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-[#12a9dc] hover:bg-[#0fa0d1] text-white transition-all shadow-[0_0_20px_rgba(18,169,220,0.3)] cursor-pointer"
              >
                Unlock Console
              </button>
            </form>
          </div>
        </div>
      ) : (

        /* FULL SCREEN AUTHENTICATED DASHBOARD */
        <div className="fixed inset-0 z-50 bg-[#071d29] text-slate-100 flex flex-col w-screen h-screen overflow-hidden">
          
          {/* Top Fullscreen Header */}
          <header className="px-6 py-4 border-b border-[#82c1da]/20 bg-[#061822] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></span>
              <div>
                <h1 className="font-extrabold text-white text-lg tracking-tight">
                  Arif Shahriar <span className="text-[#20b7e7]">Admin Control Dashboard</span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">Full-screen administrative workspace & content manager</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PostgreSQL Synced</span>
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock & Exit</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Close Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Fullscreen Navigation Tabs Bar */}
          <nav className="px-6 pt-3 bg-[#05131b] border-b border-[#82c1da]/15 flex gap-2 overflow-x-auto shrink-0">
            {[
              { id: 'profile', label: '👤 Profile & Bio' },
              { id: 'projects', label: '🚀 Projects' },
              { id: 'skills', label: '⚡ Skills' },
              { id: 'blog', label: '📝 Stories & Experiences' },
              { id: 'settings', label: '⚙️ Security & Database' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditingProject(false);
                  setIsEditingPost(false);
                }}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-cyan-300 bg-[#071d29] border-t-2 border-x border-cyan-400 border-b-transparent shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Fullscreen Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#071d29]">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-[#0b2433] p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Personal Details & Hero Copy</h3>
                    <p className="text-xs text-slate-400">Update your headline, bio, photo filename, and social handles.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={profForm.name || ''}
                          onChange={(e) => setProfForm({ ...profForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Primary Email</label>
                        <input
                          type="email"
                          value={profForm.email || ''}
                          onChange={(e) => setProfForm({ ...profForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Eyebrow Headline</label>
                      <input
                        type="text"
                        value={profForm.eyebrow || ''}
                        onChange={(e) => setProfForm({ ...profForm, eyebrow: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Hero Subtitle</label>
                      <textarea
                        rows="3"
                        value={profForm.hero_sub || ''}
                        onChange={(e) => setProfForm({ ...profForm, hero_sub: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Currently Exploring</label>
                        <input
                          type="text"
                          value={profForm.currently_exploring || ''}
                          onChange={(e) => setProfForm({ ...profForm, currently_exploring: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Profile Image Path / URL</label>
                        <input
                          type="text"
                          value={profForm.profile_image || ''}
                          onChange={(e) => setProfForm({ ...profForm, profile_image: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">GitHub URL</label>
                        <input
                          type="text"
                          value={profForm.github_url || ''}
                          onChange={(e) => setProfForm({ ...profForm, github_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">LinkedIn URL</label>
                        <input
                          type="text"
                          value={profForm.linkedin_url || ''}
                          onChange={(e) => setProfForm({ ...profForm, linkedin_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Facebook URL</label>
                        <input
                          type="text"
                          value={profForm.facebook_url || ''}
                          onChange={(e) => setProfForm({ ...profForm, facebook_url: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 transition-all hover:shadow-lg cursor-pointer"
                    >
                      Save Profile & Publish
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Project Catalog ({projects.length})</h3>
                      <p className="text-xs text-slate-400">Create, edit, and organize featured projects.</p>
                    </div>

                    {!isEditingProject && (
                      <button
                        onClick={() => {
                          setCurrentProject({
                            id: null,
                            title: '',
                            badge: 'Project',
                            category: 'Full-Stack',
                            description: '',
                            tech_stack: '',
                            bullets: '',
                            image_url: '',
                            github_url: '',
                            demo_url: ''
                          });
                          setIsEditingProject(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Project</span>
                      </button>
                    )}
                  </div>

                  {!isEditingProject ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id || proj.title} className="p-5 rounded-2xl bg-[#0b2433] border border-cyan-500/20 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                                {proj.category}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleEditProject(proj)}
                                  className="p-1.5 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-1.5 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-white text-base mb-1">{proj.title}</h4>
                            <p className="text-xs text-slate-300 line-clamp-2 mb-3">{proj.description}</p>
                          </div>
                          <div className="text-[11px] text-cyan-400/80 font-mono truncate">
                            {(Array.isArray(proj.tech_stack) ? proj.tech_stack : []).join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Project Edit Form */
                    <form onSubmit={handleSaveProject} className="bg-[#0b2433] p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <h4 className="font-bold text-white text-base">
                          {currentProject.id ? 'Edit Project' : 'New Project'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={currentProject.title}
                            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                          <select
                            value={currentProject.category}
                            onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          >
                            <option value="Full-Stack">Full-Stack</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Cyber & Networking">Cyber & Networking</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                        <textarea
                          rows="3"
                          value={currentProject.description}
                          onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={currentProject.tech_stack}
                          onChange={(e) => setCurrentProject({ ...currentProject, tech_stack: e.target.value })}
                          placeholder="React, Laravel, MySQL..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Feature Bullets (one per line)</label>
                        <textarea
                          rows="3"
                          value={currentProject.bullets}
                          onChange={(e) => setCurrentProject({ ...currentProject, bullets: e.target.value })}
                          placeholder="Feature 1&#10;Feature 2..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Image URL / File Name</label>
                          <input
                            type="text"
                            value={currentProject.image_url}
                            onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">GitHub Link</label>
                          <input
                            type="text"
                            value={currentProject.github_url}
                            onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 cursor-pointer"
                      >
                        Save Project
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="bg-[#0b2433] p-6 rounded-2xl border border-cyan-500/20">
                    <h3 className="text-xl font-bold text-white mb-4">Add New Skill</h3>
                    <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={newSkillCat}
                        onChange={(e) => setNewSkillCat(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                      >
                        <option value="Languages">Languages</option>
                        <option value="Frameworks">Frameworks</option>
                        <option value="Database">Database</option>
                        <option value="Tools">Tools</option>
                        <option value="Machine Learning">Machine Learning</option>
                      </select>

                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="Skill name (e.g. Next.js, Docker, Kubernetes)..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                        required
                      />

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 cursor-pointer shrink-0"
                      >
                        + Add Skill
                      </button>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Languages', 'Frameworks', 'Database', 'Tools', 'Machine Learning'].map((cat) => {
                      const catSkills = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
                      return (
                        <div key={cat} className="p-5 rounded-2xl bg-[#0b2433] border border-cyan-500/15">
                          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">{cat}</h4>
                          <div className="flex flex-wrap gap-2">
                            {catSkills.map((sk) => (
                              <span
                                key={sk.id || sk.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-cyan-500/20 text-slate-200"
                              >
                                <span>{sk.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(sk)}
                                  className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: BLOG & EXPERIENCES */}
              {activeTab === 'blog' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Articles, Hackathons & Competitions ({posts.length})</h3>
                      <p className="text-xs text-slate-400">Publish your contest experiences, problem solving writeups, and hackathon highlights.</p>
                    </div>

                    {!isEditingPost && (
                      <button
                        onClick={() => {
                          setCurrentPost({
                            id: null,
                            title: '',
                            category: 'Hackathons',
                            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                            badge: 'Finalist',
                            summary: '',
                            image_url: '',
                            content: '',
                            tags: ''
                          });
                          setIsEditingPost(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Write New Story</span>
                      </button>
                    )}
                  </div>

                  {!isEditingPost ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <div key={post.id || post.title} className="p-5 rounded-2xl bg-[#0b2433] border border-cyan-500/20 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                                {post.category}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="p-1.5 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1.5 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-white text-base mb-1">{post.title}</h4>
                            <p className="text-xs text-slate-300 line-clamp-2 mb-3">{post.summary}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-2.5">
                            <span>{post.date}</span>
                            <span className="text-cyan-300 font-semibold">{post.badge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Post Edit Form */
                    <form onSubmit={handleSavePost} className="bg-[#0b2433] p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                        <h4 className="font-bold text-white text-base">
                          {currentPost.id ? 'Edit Story / Experience' : 'Write New Story / Experience'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingPost(false)}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">Story Title</label>
                          <input
                            type="text"
                            value={currentPost.title}
                            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                            placeholder="National Hackathon: Building CRpilot..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                          <select
                            value={currentPost.category}
                            onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          >
                            <option value="Hackathons">Hackathons</option>
                            <option value="Competitions">Competitions</option>
                            <option value="Articles">Articles</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Date</label>
                          <input
                            type="text"
                            value={currentPost.date}
                            onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                            placeholder="Nov 2025"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Award / Milestone Badge</label>
                          <input
                            type="text"
                            value={currentPost.badge}
                            onChange={(e) => setCurrentPost({ ...currentPost, badge: e.target.value })}
                            placeholder="Top 10 Finalist, 1st Runner Up..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Summary (Short Hook)</label>
                        <textarea
                          rows="2"
                          value={currentPost.summary}
                          onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                          placeholder="Brief 2-line summary of what you tackled and learned..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Story & Key Learnings</label>
                        <textarea
                          rows="6"
                          value={currentPost.content}
                          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                          placeholder="Detailed paragraphs explaining the challenge, your team's role, and results..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Cover Image Path / URL</label>
                          <input
                            type="text"
                            value={currentPost.image_url}
                            onChange={(e) => setCurrentPost({ ...currentPost, image_url: e.target.value })}
                            placeholder="ChatGPT Image... or URL"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={currentPost.tags}
                            onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value })}
                            placeholder="Hackathon, Java, MySQL..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 cursor-pointer"
                      >
                        Publish Experience Story
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Supabase Status */}
                  <div className="p-5 rounded-2xl bg-[#0b2433] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Supabase PostgreSQL Connection</h4>
                      <p className="text-xs text-slate-400">Database ID: <code className="text-cyan-400">vadqmzthctvykdgeqqqu</code></p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 self-start sm:self-center">
                      ● Cloud Database Connected & Active
                    </span>
                  </div>

                  {/* Change Master Password */}
                  <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#0b2433] border border-cyan-500/20 space-y-4">
                    <h4 className="text-base font-bold text-white">🔐 Change Master Password</h4>
                    <p className="text-xs text-slate-400">Update your console access credentials. Encrypted via SHA-256.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={currPass}
                          onChange={(e) => setCurrPass(e.target.value)}
                          placeholder="Current password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">New Password (min 6 chars)</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="New password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        />
                      </div>
                    </div>

                    {passMsg.text && (
                      <p className={`text-xs font-semibold ${passMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {passMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </main>

        </div>
      )}

    </div>
  );
}
