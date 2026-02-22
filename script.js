// Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// Year
$("#year").textContent = new Date().getFullYear();

// Mobile menu
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close menu after clicking a link on mobile
$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Active nav link on scroll
const sections = ["home","about","skills","projects","contact"].map(id => document.getElementById(id));
const navMap = new Map();
$$(".nav-link").forEach(a => navMap.set(a.getAttribute("href").replace("#",""), a));

const setActive = (id) => {
  $$(".nav-link").forEach(a => a.classList.remove("active"));
  const link = navMap.get(id);
  if (link) link.classList.add("active");
};

const sectionObserver = new IntersectionObserver((entries) => {
  // choose the most visible section
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(visible.target.id);
}, { threshold: [0.25, 0.5, 0.7] });

sections.forEach(sec => sec && sectionObserver.observe(sec));

// Scroll reveal
const revealEls = $$(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// Typing effect
function startTyping() {
  const el = $("#typedText");
  if (!el) return;

  let phrases = [];
  try {
    phrases = JSON.parse(el.dataset.typed || "[]");
  } catch {
    phrases = ["Software Developer"];
  }
  if (!phrases.length) phrases = ["Software Developer"];

  let pIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 50;
  const deleteSpeed = 32;
  const holdTime = 950;

  const tick = () => {
    const current = phrases[pIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, holdTime);
      }
      return setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      el.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        return setTimeout(tick, 300);
      }
      return setTimeout(tick, deleteSpeed);
    }
  };

  tick();
}
startTyping();

// Animated counters when About stats visible
const counters = $$(".counter");
let countersStarted = false;

function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const val = Math.round(from + (target - from) * eased);
    el.textContent = String(val);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const aboutSection = $("#about");
if (aboutSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry && entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(c => {
        const target = parseInt(c.dataset.target || "0", 10);
        animateCounter(c, isNaN(target) ? 0 : target);
      });
      counterObserver.disconnect();
    }
  }, { threshold: 0.35 });

  counterObserver.observe(aboutSection);
}

// Fake CV download
$("#downloadCvBtn").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Replace this with your real CV file link.\nExample: href='assets/Bravo42-CV.pdf'");
});

// Contact form behavior
const form = $("#contactForm");
const formStatus = $("#formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in all fields.";
    return;
  }

  // No backend included. You can connect EmailJS or your PHP handler later.
  formStatus.textContent = "Message ready. Connect backend (EmailJS or PHP) to actually send.";
  form.reset();

  setTimeout(() => {
    formStatus.textContent = "";
  }, 3500);
});