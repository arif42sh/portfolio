/**
 * Admin Console Logic
 * 100% Functional & Logical: Supports Cloud Mode (Supabase) and Local Server Mode (PHP + data.json)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const connectionStatus = document.getElementById('connectionStatus');
  const toastNotice = document.getElementById('toastNotice');

  /* ----------------------------------------------------
   * 0. Security Authentication Guard
   * ---------------------------------------------------- */
  const authGate = document.getElementById('authGate');
  const authForm = document.getElementById('authForm');
  const masterPasswordInput = document.getElementById('masterPassword');
  const authError = document.getElementById('authError');
  const togglePassBtn = document.getElementById('togglePasswordVisibility');
  const adminHeader = document.getElementById('adminHeader');
  const adminLayout = document.getElementById('adminLayout');
  const lockConsoleBtn = document.getElementById('lockConsoleBtn');

  // SHA-256 Web Crypto Helper
  async function computeSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Master authorization hash
  const DEFAULT_PASS_HASH = '9e6c69d9c081151935be2cb3090e4607a161cb3e6f09518264c5dae1dbc255d2';

  function getStoredPasswordHash() {
    return localStorage.getItem('ADMIN_PASS_HASH') || DEFAULT_PASS_HASH;
  }

  let failedAttempts = 0;
  let lockoutTimer = null;

  function unlockConsole() {
    sessionStorage.setItem('ADMIN_AUTH', 'true');
    authGate.classList.add('unlocked');
    adminHeader.style.display = 'block';
    adminLayout.style.display = 'flex';
    loadAllData();
  }

  function lockConsole() {
    sessionStorage.removeItem('ADMIN_AUTH');
    authGate.classList.remove('unlocked');
    adminHeader.style.display = 'none';
    adminLayout.style.display = 'none';
    if (masterPasswordInput) {
      masterPasswordInput.value = '';
      masterPasswordInput.focus();
    }
  }

  // Check active session
  if (sessionStorage.getItem('ADMIN_AUTH') === 'true') {
    unlockConsole();
  } else {
    lockConsole();
  }

  // Toggle eye icon
  if (togglePassBtn && masterPasswordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = masterPasswordInput.type === 'password';
      masterPasswordInput.type = isPass ? 'text' : 'password';
      togglePassBtn.textContent = isPass ? '🔒' : '👁️';
    });
  }

  // Verify master password on submit
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (lockoutTimer) return;

      const enteredPass = masterPasswordInput.value;
      const enteredHash = await computeSHA256(enteredPass);
      const expectedHash = getStoredPasswordHash();

      if (enteredHash === expectedHash) {
        failedAttempts = 0;
        authError.textContent = '';
        unlockConsole();
        showToast('✓ Access granted! Welcome, Arif.');
      } else {
        failedAttempts++;
        authError.textContent = `Incorrect password. Attempt ${failedAttempts} of 5.`;

        if (failedAttempts >= 5) {
          const submitBtn = document.getElementById('authSubmitBtn');
          submitBtn.disabled = true;
          let remaining = 30;
          authError.textContent = `Too many failed attempts! Locked out for ${remaining}s.`;
          lockoutTimer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(lockoutTimer);
              lockoutTimer = null;
              failedAttempts = 0;
              submitBtn.disabled = false;
              authError.textContent = '';
            } else {
              authError.textContent = `Too many failed attempts! Locked out for ${remaining}s.`;
            }
          }, 1000);
        }
      }
    });
  }

  // Lock button in header
  if (lockConsoleBtn) {
    lockConsoleBtn.addEventListener('click', () => {
      lockConsole();
      showToast('🔒 Console locked.');
    });
  }

  // Navigation Tabs
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // Toast Function
  const showToast = (message, duration = 3000) => {
    toastNotice.textContent = message;
    toastNotice.style.display = 'block';
    setTimeout(() => {
      toastNotice.style.display = 'none';
    }, duration);
  };

  // Connection Status Checker
  const updateConnectionStatus = () => {
    const sb = window.PortfolioAPI.getSupabase();
    if (sb) {
      connectionStatus.className = 'status-badge';
      connectionStatus.textContent = '● Connected to Supabase Cloud';
    } else {
      connectionStatus.className = 'status-badge offline';
      connectionStatus.textContent = '● Local Server Mode (data.json)';
    }
  };

  // Config setup
  const cfgUrlInput = document.getElementById('cfgSupabaseUrl');
  const cfgKeyInput = document.getElementById('cfgSupabaseKey');
  const saveConfigBtn = document.getElementById('saveSupabaseConfigBtn');

  const currentCfg = window.PortfolioAPI.getConfig();
  if (cfgUrlInput) cfgUrlInput.value = currentCfg.url || 'https://vadqmzthctvykdgeqqqu.supabase.co';
  if (cfgKeyInput) cfgKeyInput.value = currentCfg.key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZHFtenRoY3R2eWtkZ2VxcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3ODMwNzksImV4cCI6MjEwNzM1OTA3OX0.PN4DUz-SMcYkJ8grxBwk_ejXiYbwERUKx-OltH1pSs0';

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', () => {
      const url = cfgUrlInput.value.trim();
      const key = cfgKeyInput.value.trim();
      window.PortfolioAPI.saveConfig(url, key);
      updateConnectionStatus();
      showToast('✓ Supabase connection settings saved!');
      loadAllData();
    });
  }

  /* ----------------------------------------------------
   * 1. Profile Manager
   * ---------------------------------------------------- */
  const profName = document.getElementById('profName');
  const profEyebrow = document.getElementById('profEyebrow');
  const profHeroSub = document.getElementById('profHeroSub');
  const profExploring = document.getElementById('profExploring');
  const profEmail = document.getElementById('profEmail');
  const profGithub = document.getElementById('profGithub');
  const profLinkedin = document.getElementById('profLinkedin');
  const profResume = document.getElementById('profResume');
  const profImageUrl = document.getElementById('profImageUrl');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
  const profImageFile = document.getElementById('profImageFile');
  const avatarUploadStatus = document.getElementById('avatarUploadStatus');

  const loadProfile = async () => {
    const profile = await window.PortfolioAPI.getProfile();
    if (profile) {
      profName.value = profile.name || '';
      profEyebrow.value = profile.eyebrow || '';
      profHeroSub.value = profile.hero_sub || '';
      profExploring.value = profile.currently_exploring || '';
      profEmail.value = profile.email || '';
      profGithub.value = profile.github_url || '';
      profLinkedin.value = profile.linkedin_url || '';
      profResume.value = profile.resume_url || '';
      profImageUrl.value = profile.profile_image || '';
      if (avatarUploadStatus) {
        avatarUploadStatus.textContent = `Current: ${profile.profile_image || 'profile.png'}`;
      }
    }
  };

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = 'Saving...';

      const updatedProfile = {
        name: profName.value.trim(),
        eyebrow: profEyebrow.value.trim(),
        hero_sub: profHeroSub.value.trim(),
        currently_exploring: profExploring.value.trim(),
        email: profEmail.value.trim(),
        github_url: profGithub.value.trim(),
        linkedin_url: profLinkedin.value.trim(),
        resume_url: profResume.value.trim(),
        profile_image: profImageUrl.value.trim() || 'profile.png',
        updated_at: new Date().toISOString()
      };

      await window.PortfolioAPI.saveProfile(updatedProfile);
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = 'Save Profile';
      showToast('✓ Profile updated and saved to portfolio!');
    });
  }

  // Upload Profile Avatar
  if (uploadAvatarBtn && profImageFile) {
    uploadAvatarBtn.addEventListener('click', async () => {
      const file = profImageFile.files[0];
      if (!file) {
        showToast('Please choose an image file first.');
        return;
      }

      uploadAvatarBtn.disabled = true;
      uploadAvatarBtn.textContent = 'Uploading...';

      try {
        const res = await window.PortfolioAPI.uploadImage(file);
        profImageUrl.value = res.url;
        avatarUploadStatus.textContent = `Uploaded: ${res.url}`;
        showToast('✓ Image uploaded! Click "Save Profile" to apply.');
      } catch (err) {
        showToast('⚠️ Upload failed: ' + err.message);
      } finally {
        uploadAvatarBtn.disabled = false;
        uploadAvatarBtn.textContent = 'Upload Photo';
      }
    });
  }

  /* ----------------------------------------------------
   * 2. Projects Manager
   * ---------------------------------------------------- */
  const adminProjectsList = document.getElementById('adminProjectsList');
  const projectModal = document.getElementById('projectModal');
  const openNewProjectModalBtn = document.getElementById('openNewProjectModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const projectForm = document.getElementById('projectForm');
  const modalTitle = document.getElementById('modalTitle');

  // Modal Inputs
  const projId = document.getElementById('projId');
  const projTitle = document.getElementById('projTitle');
  const projBadge = document.getElementById('projBadge');
  const projDesc = document.getElementById('projDesc');
  const projTechStack = document.getElementById('projTechStack');
  const projBullets = document.getElementById('projBullets');
  const projImageUrl = document.getElementById('projImageUrl');
  const projGithub = document.getElementById('projGithub');
  const projDemo = document.getElementById('projDemo');
  const uploadProjImgBtn = document.getElementById('uploadProjImgBtn');
  const projImageFile = document.getElementById('projImageFile');
  const projImgUploadStatus = document.getElementById('projImgUploadStatus');

  let currentProjects = [];

  const loadProjects = async () => {
    adminProjectsList.innerHTML = '<p style="color: var(--admin-muted);">Loading projects...</p>';
    currentProjects = await window.PortfolioAPI.getProjects();

    if (!currentProjects || currentProjects.length === 0) {
      adminProjectsList.innerHTML = '<p style="color: var(--admin-muted);">No projects found. Click "+ Add Project" to create one!</p>';
      return;
    }

    adminProjectsList.innerHTML = '';
    currentProjects.forEach(proj => {
      const item = document.createElement('div');
      item.className = 'admin-project-item';
      item.innerHTML = `
        <div class="proj-meta">
          <div class="proj-thumb">
            ${proj.image_url ? `<img src="${proj.image_url}" alt="${proj.title}">` : '🚀'}
          </div>
          <div class="proj-info">
            <h4>${proj.title}</h4>
            <span class="proj-badge">${proj.badge || 'Project'}</span>
          </div>
        </div>
        <div class="proj-actions">
          <button class="btn-ghost edit-proj-btn" data-id="${proj.id}">✏️ Edit</button>
          <button class="btn-danger del-proj-btn" data-id="${proj.id}">🗑️ Delete</button>
        </div>
      `;
      adminProjectsList.appendChild(item);
    });

    // Edit Listeners
    adminProjectsList.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const project = currentProjects.find(p => String(p.id) === String(id));
        if (project) openProjectModal(project);
      });
    });

    // Delete Listeners
    adminProjectsList.querySelectorAll('.del-proj-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Are you sure you want to delete this project?')) {
          currentProjects = currentProjects.filter(p => String(p.id) !== String(id));
          await window.PortfolioAPI.saveProjects(currentProjects);
          showToast('✓ Project deleted.');
          loadProjects();
        }
      });
    });
  };

  const openProjectModal = (proj = null) => {
    projectForm.reset();
    if (projImgUploadStatus) projImgUploadStatus.textContent = '';

    if (proj) {
      modalTitle.textContent = 'Edit Project';
      projId.value = proj.id;
      projTitle.value = proj.title || '';
      projBadge.value = proj.badge || '';
      projDesc.value = proj.description || '';
      projTechStack.value = Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : (proj.tech_stack || '');
      projBullets.value = Array.isArray(proj.bullets) ? proj.bullets.join('\n') : (proj.bullets || '');
      projImageUrl.value = proj.image_url || '';
      projGithub.value = proj.github_url || '';
      projDemo.value = proj.demo_url || '';
    } else {
      modalTitle.textContent = 'Add New Project';
      projId.value = '';
    }

    projectModal.classList.add('open');
  };

  const closeProjectModal = () => {
    projectModal.classList.remove('open');
  };

  if (openNewProjectModalBtn) openNewProjectModalBtn.addEventListener('click', () => openProjectModal());
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProjectModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeProjectModal);

  // Upload Project Image
  if (uploadProjImgBtn && projImageFile) {
    uploadProjImgBtn.addEventListener('click', async () => {
      const file = projImageFile.files[0];
      if (!file) {
        showToast('Please choose an image file.');
        return;
      }

      uploadProjImgBtn.disabled = true;
      uploadProjImgBtn.textContent = 'Uploading...';

      try {
        const res = await window.PortfolioAPI.uploadImage(file);
        projImageUrl.value = res.url;
        if (projImgUploadStatus) projImgUploadStatus.textContent = `Uploaded: ${res.url}`;
        showToast('✓ Image uploaded successfully!');
      } catch (err) {
        showToast('⚠️ Upload failed: ' + err.message);
      } finally {
        uploadProjImgBtn.disabled = false;
        uploadProjImgBtn.textContent = 'Upload';
      }
    });
  }

  // Save Project Handler
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = projId.value;
      const techStackArray = projTechStack.value.split(',').map(s => s.trim()).filter(Boolean);
      const bulletsArray = projBullets.value.split('\n').map(s => s.trim()).filter(Boolean);

      const projectData = {
        title: projTitle.value.trim(),
        badge: projBadge.value.trim() || 'Project',
        description: projDesc.value.trim(),
        tech_stack: techStackArray,
        bullets: bulletsArray,
        image_url: projImageUrl.value.trim(),
        github_url: projGithub.value.trim() || '#contact',
        demo_url: projDemo.value.trim() || '#contact'
      };

      if (id) {
        // Edit existing
        currentProjects = currentProjects.map(p => String(p.id) === String(id) ? { ...p, ...projectData } : p);
      } else {
        // Add new
        currentProjects.push({
          id: Date.now(),
          ...projectData,
          order_index: currentProjects.length + 1
        });
      }

      await window.PortfolioAPI.saveProjects(currentProjects);
      closeProjectModal();
      showToast('✓ Project saved and published to portfolio!');
      loadProjects();
    });
  }

  /* ----------------------------------------------------
   * 3. Skills Manager (Add & Delete Skills)
   * ---------------------------------------------------- */
  const adminSkillsContainer = document.getElementById('adminSkillsContainer');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const newSkillCategory = document.getElementById('newSkillCategory');
  const newSkillName = document.getElementById('newSkillName');

  let currentSkills = [];

  const loadSkills = async () => {
    currentSkills = await window.PortfolioAPI.getSkills();
    adminSkillsContainer.innerHTML = '';

    const categories = ['Languages', 'Frameworks', 'Database', 'Tools', 'Machine Learning'];

    categories.forEach(cat => {
      const catSkills = currentSkills.filter(s => s.category.toLowerCase() === cat.toLowerCase());
      const catDiv = document.createElement('div');
      catDiv.className = 'skills-category-group';

      let pillsHtml = '';
      catSkills.forEach(s => {
        pillsHtml += `
          <span class="admin-pill">
            ${s.name}
            <button class="pill-del-btn" data-category="${s.category}" data-name="${s.name}" title="Remove skill">✕</button>
          </span>
        `;
      });

      catDiv.innerHTML = `
        <h4 class="category-title">${cat}</h4>
        <div class="skills-pill-box">
          ${pillsHtml || '<span style="color: var(--admin-muted); font-size: 0.85rem;">No skills added yet</span>'}
        </div>
      `;
      adminSkillsContainer.appendChild(catDiv);
    });

    // Delete skill buttons
    adminSkillsContainer.querySelectorAll('.pill-del-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        const category = btn.dataset.category;
        
        currentSkills = currentSkills.filter(s => !(s.name === name && s.category === category));
        await window.PortfolioAPI.saveSkills(currentSkills);
        showToast(`✓ Removed "${name}"`);
        loadSkills();
      });
    });
  };

  if (addSkillBtn && newSkillName) {
    addSkillBtn.addEventListener('click', async () => {
      const name = newSkillName.value.trim();
      const category = newSkillCategory.value;

      if (!name) {
        showToast('Please enter a skill name.');
        newSkillName.focus();
        return;
      }

      // Check if already exists in this category
      const exists = currentSkills.some(
        s => s.name.toLowerCase() === name.toLowerCase() && s.category.toLowerCase() === category.toLowerCase()
      );

      if (exists) {
        showToast(`"${name}" is already in ${category}.`);
        return;
      }

      currentSkills.push({
        id: Date.now(),
        category,
        name
      });

      await window.PortfolioAPI.saveSkills(currentSkills);
      newSkillName.value = '';
      showToast(`✓ Added "${name}" to ${category}!`);
      loadSkills();
    });

    // Add skill on Enter key press
    newSkillName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkillBtn.click();
      }
    });
  }

  /* ----------------------------------------------------
   * 4. Change Master Password
   * ---------------------------------------------------- */
  const currentMasterPass = document.getElementById('currentMasterPass');
  const newMasterPass = document.getElementById('newMasterPass');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const changePassStatus = document.getElementById('changePassStatus');

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async () => {
      const currentVal = currentMasterPass.value;
      const newVal = newMasterPass.value;

      if (!currentVal || !newVal) {
        changePassStatus.style.color = '#ef4444';
        changePassStatus.textContent = 'Please fill out both password fields.';
        return;
      }

      const currentHash = await computeSHA256(currentVal);
      if (currentHash !== getStoredPasswordHash()) {
        changePassStatus.style.color = '#ef4444';
        changePassStatus.textContent = 'Current password is incorrect.';
        return;
      }

      if (newVal.length < 6) {
        changePassStatus.style.color = '#ef4444';
        changePassStatus.textContent = 'New password must be at least 6 characters long.';
        return;
      }

      const newHash = await computeSHA256(newVal);
      localStorage.setItem('ADMIN_PASS_HASH', newHash);

      changePassStatus.style.color = '#10b981';
      changePassStatus.textContent = '✓ Master password changed successfully!';
      currentMasterPass.value = '';
      newMasterPass.value = '';

      setTimeout(() => {
        changePassStatus.textContent = '';
      }, 5000);
    });
  }

  /* ----------------------------------------------------
   * Load Everything
   * ---------------------------------------------------- */
  const loadAllData = () => {
    updateConnectionStatus();
    loadProfile();
    loadProjects();
    loadSkills();
  };
});
