/**
 * Arif Shahriar Portfolio - Core Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mark document as JS-loaded for progressive enhancement
  document.body.classList.add('js-loaded');

  /* ----------------------------------------------------
   * 1. Dynamic Copyright Year
   * ---------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------
   * 2. Mobile Navigation Toggle & Outside Click
   * ---------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 720) {
          toggleMenu(false);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ----------------------------------------------------
   * 3. Dynamic Typewriter Effect for "Currently exploring"
   * ---------------------------------------------------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = [
      'Networking Fundamentals & Linux Security',
      'Artificial Intelligence & Machine Learning',
      'Secure Software Engineering & System Architecture',
      'Full-Stack Web & Android Development'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at the end of typing
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    typeLoop();
  }

  /* ----------------------------------------------------
   * 4. Scrollspy (Highlight active navbar link on scroll)
   * ---------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const onScrollSpy = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ----------------------------------------------------
   * 5. Animated Scroll Reveal using IntersectionObserver
   * ---------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------
   * 6. Animated Stats Counter
   * ---------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stats-panel-grid .mini-card strong');
  let statsCounted = false;

  const animateStats = () => {
    statNumbers.forEach((el) => {
      const rawText = el.textContent.trim();
      const targetNumber = parseInt(rawText, 10);
      const suffix = rawText.replace(/^[0-9]+/, ''); // e.g. "+" or "%"

      if (!isNaN(targetNumber)) {
        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(16, Math.floor(duration / targetNumber));
        const increment = Math.ceil(targetNumber / (duration / stepTime));

        const timer = setInterval(() => {
          current += increment;
          if (current >= targetNumber) {
            el.textContent = `${targetNumber}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${current}${suffix}`;
          }
        }, stepTime);
      }
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        statsCounted = true;
        animateStats();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ----------------------------------------------------
   * 7. Interactive Contact Form with Validation
   * ---------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      // Email format regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Reset status
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      if (name.length < 2) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please enter a valid name (at least 2 characters).';
        nameInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
      }

      if (message.length < 10) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please provide a message with at least 10 characters.';
        messageInput.focus();
        return;
      }

      // Simulate sending
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        formStatus.className = 'form-status success';
        formStatus.textContent = `Thank you, ${name}! Your message has been received. I'll get back to you soon.`;

        contactForm.reset();

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 6000);
      }, 1000);
    });
  }

  /* ----------------------------------------------------
   * 8. Dynamic Data Hydration from Supabase / PortfolioAPI
   * ---------------------------------------------------- */
  const hydratePortfolio = async () => {
    if (!window.PortfolioAPI) return;

    try {
      // 1. Profile Hydration
      const profile = await window.PortfolioAPI.getProfile();
      if (profile) {
        if (profile.name) {
          const accentName = document.querySelector('.hero-copy h1 .accent');
          if (accentName) accentName.textContent = profile.name;
        }
        if (profile.eyebrow) {
          const eyebrowEl = document.querySelector('.hero-copy .eyebrow');
          if (eyebrowEl) eyebrowEl.textContent = profile.eyebrow;
        }
        if (profile.hero_sub) {
          const heroSub = document.querySelector('.hero-sub');
          if (heroSub) heroSub.textContent = profile.hero_sub;
        }
        if (profile.profile_image) {
          const profileImg = document.querySelector('.profile-card img');
          if (profileImg) profileImg.src = profile.profile_image;
        }
        if (profile.resume_url) {
          const resumeBtn = document.querySelector('.hero-actions .btn.secondary');
          if (resumeBtn) resumeBtn.href = profile.resume_url;
        }
        if (profile.github_url) {
          const ghLink = document.querySelector('.contact-list a[href*="github.com"]');
          if (ghLink) ghLink.href = profile.github_url;
        }
      }

      // 2. Projects Hydration
      const projects = await window.PortfolioAPI.getProjects();
      const projectGrid = document.querySelector('.project-grid');
      if (projectGrid && projects && projects.length > 0) {
        projectGrid.innerHTML = projects.map(proj => {
          const techList = Array.isArray(proj.tech_stack)
            ? proj.tech_stack.map(t => `<span>${t}</span>`).join('')
            : '';
          const bulletsList = Array.isArray(proj.bullets)
            ? proj.bullets.map(b => `<li>${b}</li>`).join('')
            : '';
          const imageMarkup = proj.image_url
            ? `<img src="${proj.image_url}" alt="${proj.title} preview" />`
            : '';

          return `
            <article class="project-card reveal is-visible">
              <div class="project-media">
                ${imageMarkup}
                <span class="project-badge">${proj.badge || 'Project'}</span>
              </div>
              <div class="project-body">
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                <div class="tech-list">${techList}</div>
                <ul>${bulletsList}</ul>
                <div class="project-links">
                  <a href="${proj.github_url || '#contact'}" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="${proj.demo_url || '#contact'}" target="_blank" rel="noreferrer">Case Study / Demo</a>
                </div>
              </div>
            </article>
          `;
        }).join('');
      }

      // 3. Skills Hydration
      const skills = await window.PortfolioAPI.getSkills();
      const skillGrid = document.querySelector('.skill-grid');
      if (skillGrid && skills && skills.length > 0) {
        const categories = [...new Set(skills.map(s => s.category))];
        skillGrid.innerHTML = categories.map(cat => {
          const catSkills = skills.filter(s => s.category === cat);
          const pills = catSkills.map(s => `<span class="pill">${s.name}</span>`).join('');
          return `
            <div class="skill-card reveal is-visible">
              <h3>${cat}</h3>
              <div class="pill-list">${pills}</div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {
      console.warn('Hydration notice:', e);
    }
  };

  hydratePortfolio();

  // Real-time synchronization listeners
  window.addEventListener('portfolio-updated', () => hydratePortfolio());
  window.addEventListener('storage', (e) => {
    if (e.key === 'PORTFOLIO_LAST_UPDATED' || (e.key && e.key.startsWith('CACHED_'))) {
      hydratePortfolio();
    }
  });
  window.addEventListener('focus', () => hydratePortfolio());

  /* ----------------------------------------------------
   * 9. Secret Admin Access (Ctrl + Shift + A or Logo Double-Click)
   * ---------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.open('admin.html', '_blank');
    }
  });

  const logoEl = document.querySelector('.logo');
  if (logoEl) {
    logoEl.addEventListener('dblclick', (e) => {
      e.preventDefault();
      window.open('admin.html', '_blank');
    });
  }
});
