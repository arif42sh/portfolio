/**
 * Unified Portfolio Data & Storage Layer
 * Supports Supabase Cloud (PostgreSQL + Cloud Storage) & Local Server (PHP + data.json + uploads/)
 */

// Supabase configuration
const DEFAULT_SUPABASE_URL = localStorage.getItem('SP_URL') || 'https://vadqmzthctvykdgeqqqu.supabase.co';
const DEFAULT_SUPABASE_KEY = localStorage.getItem('SP_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZHFtenRoY3R2eWtkZ2VxcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODMwNzksImV4cCI6MjEwNzM1OTA3OX0.PN4DUz-SMcYkJ8grxBwk_ejXiYbwERUKx-OltH1pSs0';

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = localStorage.getItem('SP_URL') || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem('SP_KEY') || DEFAULT_SUPABASE_KEY;

  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
      return null;
    }
  }
  return null;
}

// Notify other tabs / portfolio listeners when data updates
function broadcastUpdate() {
  try {
    localStorage.setItem('PORTFOLIO_LAST_UPDATED', Date.now().toString());
    window.dispatchEvent(new CustomEvent('portfolio-updated'));
  } catch (e) {
    console.warn(e);
  }
}

/* ----------------------------------------------------
 * 1. Data Fetchers
 * ---------------------------------------------------- */
async function apiGetProfile() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('profile').select('*').limit(1).single();
      if (!error && data) {
        localStorage.setItem('CACHED_PROFILE', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase profile fetch error:', e);
    }
  }

  // Fallback to local server api.php
  try {
    const res = await fetch('api.php?type=profile');
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        localStorage.setItem('CACHED_PROFILE', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.warn('Local api.php fetch error:', e);
  }

  // Fallback to localStorage
  const cached = localStorage.getItem('CACHED_PROFILE');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  return {
    name: 'Arif Shahriar',
    eyebrow: 'CSE Student • Cyber Security Enthusiast • AI & Software Developer',
    hero_sub: 'I am passionate about Cyber Security, AI, software Development, and creating practical solutions with various technologies.',
    currently_exploring: 'Networking Fundamentals & Linux Security',
    profile_image: 'profile.png',
    resume_url: 'resume.txt',
    email: 'arifshahriar85204@gmail.com',
    github_url: 'https://github.com/arif42sh',
    linkedin_url: 'https://www.linkedin.com',
    facebook_url: 'https://facebook.com'
  };
}

async function apiGetProjects() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('projects').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem('CACHED_PROJECTS', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase projects fetch error:', e);
    }
  }

  // Fallback to local server api.php
  try {
    const res = await fetch('api.php?type=projects');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('CACHED_PROJECTS', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.warn('Local api.php projects fetch error:', e);
  }

  // Fallback to localStorage
  const cached = localStorage.getItem('CACHED_PROJECTS');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  return [];
}

async function apiGetSkills() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('skills').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem('CACHED_SKILLS', JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase skills fetch error:', e);
    }
  }

  // Fallback to local server api.php
  try {
    const res = await fetch('api.php?type=skills');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('CACHED_SKILLS', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.warn('Local api.php skills fetch error:', e);
  }

  // Fallback to localStorage
  const cached = localStorage.getItem('CACHED_SKILLS');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  return [];
}

/* ----------------------------------------------------
 * 2. Data Savers (Supabase & Local Server Sync)
 * ---------------------------------------------------- */
async function apiSaveProfile(profileData) {
  localStorage.setItem('CACHED_PROFILE', JSON.stringify(profileData));

  // Save to local server api.php
  try {
    await fetch('api.php?action=save_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
  } catch (e) {
    console.warn('api.php save profile error:', e);
  }

  // Save to Supabase if connected
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('profile').upsert({ id: 1, ...profileData });
    } catch (e) {
      console.warn('Supabase profile save error:', e);
    }
  }

  broadcastUpdate();
  return { success: true };
}

async function apiSaveProjects(projectsList) {
  localStorage.setItem('CACHED_PROJECTS', JSON.stringify(projectsList));

  // Save to local server api.php
  try {
    await fetch('api.php?action=save_projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectsList)
    });
  } catch (e) {
    console.warn('api.php save projects error:', e);
  }

  // Save to Supabase if connected
  const sb = getSupabase();
  if (sb) {
    try {
      // Upsert projects
      for (const proj of projectsList) {
        await sb.from('projects').upsert(proj);
      }
    } catch (e) {
      console.warn('Supabase projects save error:', e);
    }
  }

  broadcastUpdate();
  return { success: true };
}

async function apiSaveSkills(skillsList) {
  localStorage.setItem('CACHED_SKILLS', JSON.stringify(skillsList));

  // Save to local server api.php
  try {
    await fetch('api.php?action=save_skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillsList)
    });
  } catch (e) {
    console.warn('api.php save skills error:', e);
  }

  // Save to Supabase if connected
  const sb = getSupabase();
  if (sb) {
    try {
      for (const sk of skillsList) {
        await sb.from('skills').upsert(sk);
      }
    } catch (e) {
      console.warn('Supabase skills save error:', e);
    }
  }

  broadcastUpdate();
  return { success: true };
}

/* ----------------------------------------------------
 * 3. Unified Image Upload (Supabase Storage or Local)
 * ---------------------------------------------------- */
async function apiUploadImage(file) {
  const sb = getSupabase();

  // If Supabase is connected, upload to Cloud Storage
  if (sb) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const { data, error } = await sb.storage.from('portfolio-assets').upload(fileName, file);
      if (!error) {
        const { data: pubData } = sb.storage.from('portfolio-assets').getPublicUrl(fileName);
        return { success: true, url: pubData.publicUrl };
      }
    } catch (e) {
      console.warn('Supabase upload error, falling back to local:', e);
    }
  }

  // Otherwise, upload to local PHP uploads folder
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('api.php?action=upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    const json = await res.json();
    if (json.success) {
      return { success: true, url: json.url };
    }
    throw new Error(json.error || 'Upload failed');
  }
  throw new Error('Local server upload failed');
}

// Expose API globally
window.PortfolioAPI = {
  getSupabase,
  getProfile: apiGetProfile,
  getProjects: apiGetProjects,
  getSkills: apiGetSkills,
  saveProfile: apiSaveProfile,
  saveProjects: apiSaveProjects,
  saveSkills: apiSaveSkills,
  uploadImage: apiUploadImage,
  saveConfig: (url, key) => {
    localStorage.setItem('SP_URL', url);
    localStorage.setItem('SP_KEY', key);
    supabaseClient = null;
    broadcastUpdate();
  },
  getConfig: () => ({
    url: localStorage.getItem('SP_URL') || '',
    key: localStorage.getItem('SP_KEY') || ''
  })
};
