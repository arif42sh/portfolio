import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, X, Plus, Trash2, Edit3, CheckCircle, RefreshCw, LogOut } from 'lucide-react';
import { supabase, computeSHA256 } from '../lib/supabase';

const DEFAULT_PASS_HASH = import.meta.env.VITE_ADMIN_PASS_HASH || '9e6c69d9c081151935be2cb3090e4607a161cb3e6f09518264c5dae1dbc255d2';

export default function AdminModal({ isOpen, onClose, profile, setProfile, projects, setProjects, skills, setSkills }) {
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

    // Sync to Supabase
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
      ? currentProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
      : currentProject.tech_stack;

    const bulletsArray = typeof currentProject.bullets === 'string'
      ? currentProject.bullets.split('\n').map(s => s.trim()).filter(Boolean)
      : currentProject.bullets;

    const updatedProj = {
      ...currentProject,
      tech_stack: techArray,
      bullets: bulletsArray
    };

    let newProjectList;
    if (currentProject.id) {
      newProjectList = projects.map(p => p.id === currentProject.id ? updatedProj : p);
    } else {
      newProjectList = [...projects, { ...updatedProj, id: Date.now() }];
    }

    setProjects(newProjectList);
    localStorage.setItem('CACHED_PROJECTS', JSON.stringify(newProjectList));

    try {
      await supabase.from('projects').upsert(updatedProj);
    } catch (err) {
      console.warn('Supabase project sync notice:', err);
    }

    setIsEditingProject(false);
    showToast('✓ Project saved!');
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    localStorage.setItem('CACHED_PROJECTS', JSON.stringify(filtered));

    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase project delete notice:', err);
    }
    showToast('✓ Project deleted.');
  };

  // 3. Add & Delete Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase() && s.category === newSkillCat);
    if (exists) {
      showToast(`"${newSkillName}" already exists in ${newSkillCat}.`);
      return;
    }

    const newSkill = { id: Date.now(), category: newSkillCat, name: newSkillName.trim() };
    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    localStorage.setItem('CACHED_SKILLS', JSON.stringify(updatedSkills));

    try {
      await supabase.from('skills').insert([newSkill]);
    } catch (err) {
      console.warn('Supabase skill insert notice:', err);
    }

    setNewSkillName('');
    showToast(`✓ Added "${newSkill.name}" to ${newSkillCat}!`);
  };

  const handleDeleteSkill = async (skill) => {
    const updated = skills.filter(s => s.name !== skill.name || s.category !== skill.category);
    setSkills(updated);
    localStorage.setItem('CACHED_SKILLS', JSON.stringify(updated));

    try {
      await supabase.from('skills').delete().match({ name: skill.name, category: skill.category });
    } catch (err) {
      console.warn('Supabase skill delete notice:', err);
    }
    showToast(`✓ Removed "${skill.name}"`);
  };

  // 4. Change Master Password
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-60 bg-cyan-950 border border-cyan-400 text-cyan-200 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold animate-bounce">
          {notification}
        </div>
      )}

      {/* LOGIN SCREEN */}
      {!isAuthenticated ? (
        <div className="cyber-card p-8 sm:p-10 rounded-3xl max-w-md w-full text-center relative border border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
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
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && <p className="text-xs font-semibold text-rose-400">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Unlock Console
            </button>
          </form>
        </div>
      ) : (

        /* AUTHENTICATED DASHBOARD */
        <div className="cyber-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-cyan-500/40 shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-cyan-500/20 bg-[#071d29]/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
              <h2 className="font-extrabold text-white text-lg">Arif Shahriar <span className="text-cyan-400">Admin Console</span></h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock & Exit</span>
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="px-5 pt-3 bg-slate-950/60 border-b border-cyan-500/10 flex gap-2 overflow-x-auto">
            {['profile', 'projects', 'skills', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsEditingProject(false); }}
                className={`px-4 py-2 text-xs font-bold capitalize rounded-t-lg transition-all ${
                  activeTab === tab
                    ? 'text-cyan-300 bg-[#071d29] border-t border-x border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'profile' ? '👤 Profile & Bio' : tab === 'projects' ? '🚀 Projects' : tab === 'skills' ? '⚡ Skills' : '⚙️ Security & Settings'}
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6">

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profForm.name}
                      onChange={(e) => setProfForm({ ...profForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hero Subtitle</label>
                    <input
                      type="text"
                      value={profForm.eyebrow}
                      onChange={(e) => setProfForm({ ...profForm, eyebrow: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hero Bio Description</label>
                  <textarea
                    rows="3"
                    value={profForm.hero_sub}
                    onChange={(e) => setProfForm({ ...profForm, hero_sub: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Currently Exploring Line</label>
                  <input
                    type="text"
                    value={profForm.currently_exploring}
                    onChange={(e) => setProfForm({ ...profForm, currently_exploring: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={profForm.email}
                      onChange={(e) => setProfForm({ ...profForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={profForm.github_url}
                      onChange={(e) => setProfForm({ ...profForm, github_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer shadow-md"
                >
                  Save Profile Information
                </button>
              </form>
            )}

            {/* TAB 2: PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                {!isEditingProject ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400">Manage and update your showcased projects.</p>
                      <button
                        onClick={() => {
                          setCurrentProject({ id: null, title: '', badge: 'Project', category: 'Full-Stack', description: '', tech_stack: '', bullets: '', image_url: '', github_url: '', demo_url: '' });
                          setIsEditingProject(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id || proj.title} className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                              <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">{proj.badge}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                          </div>
                          <div className="flex gap-2 pt-3 border-t border-slate-800 mt-3 justify-end">
                            <button
                              onClick={() => {
                                setCurrentProject({
                                  ...proj,
                                  tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack,
                                  bullets: Array.isArray(proj.bullets) ? proj.bullets.join('\n') : proj.bullets
                                });
                                setIsEditingProject(true);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-200 hover:text-cyan-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-950/50 text-rose-300 hover:bg-rose-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-cyan-500/20">
                      <h3 className="font-bold text-white text-sm">{currentProject.id ? 'Edit Project' : 'Add New Project'}</h3>
                      <button onClick={() => setIsEditingProject(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                        <input
                          type="text"
                          value={currentProject.title}
                          onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Badge</label>
                        <input
                          type="text"
                          value={currentProject.badge}
                          onChange={(e) => setCurrentProject({ ...currentProject, badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                        <select
                          value={currentProject.category}
                          onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
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
                        rows="2"
                        value={currentProject.description}
                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Key Feature Bullets (line separated)</label>
                      <textarea
                        rows="3"
                        value={currentProject.bullets}
                        onChange={(e) => setCurrentProject({ ...currentProject, bullets: e.target.value })}
                        placeholder="Feature 1&#10;Feature 2..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Image URL / File Name</label>
                        <input
                          type="text"
                          value={currentProject.image_url}
                          onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                          placeholder="ChatGPT Image... or URL"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">GitHub Link</label>
                        <input
                          type="text"
                          value={currentProject.github_url}
                          onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer"
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
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <select
                    value={newSkillCat}
                    onChange={(e) => setNewSkillCat(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
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
                    placeholder="Skill name (e.g. Next.js, Docker)..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    required
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shrink-0"
                  >
                    + Add Skill
                  </button>
                </form>

                <div className="space-y-4">
                  {['Languages', 'Frameworks', 'Database', 'Tools', 'Machine Learning'].map((cat) => {
                    const catSkills = skills.filter(s => s.category.toLowerCase() === cat.toLowerCase());
                    return (
                      <div key={cat} className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/15">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2.5">{cat}</h4>
                        <div className="flex flex-wrap gap-2">
                          {catSkills.map((sk) => (
                            <span
                              key={sk.id || sk.name}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 border border-cyan-500/20 text-slate-200"
                            >
                              <span>{sk.name}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(sk)}
                                className="text-slate-400 hover:text-rose-400 transition-colors"
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

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Supabase Status */}
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Supabase PostgreSQL Database</h4>
                    <p className="text-xs text-slate-400">Connected: <code className="text-cyan-400">vadqmzthctvykdgeqqqu</code></p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    ● Connected & Active
                  </span>
                </div>

                {/* Change Master Password */}
                <form onSubmit={handleChangePassword} className="p-5 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-white">🔐 Change Master Password</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currPass}
                        onChange={(e) => setCurrPass(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
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
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
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
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
