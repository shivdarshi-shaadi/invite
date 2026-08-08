// ---------- Preloader ----------
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 600);
});

// ---------- Navbar scroll state + mobile toggle ----------
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// ---------- Scroll progress bar ----------
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateScrollProgress();
});
updateScrollProgress();

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Scroll reveal (fade-up + mandala) ----------
const revealTargets = document.querySelectorAll('.fade-up, .mandala-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealTargets.forEach(el => revealObserver.observe(el));

// ---------- Countdown timer ----------
// Celebrations begin with Mehndi on 7 January 2027, IST
const weddingDate = new Date('2027-01-07T00:00:00+05:30').getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  if (distance <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.mins.textContent = '00';
    els.secs.textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  setDigit(els.days, String(days).padStart(2, '0'));
  setDigit(els.hours, String(hours).padStart(2, '0'));
  setDigit(els.mins, String(mins).padStart(2, '0'));
  setDigit(els.secs, String(secs).padStart(2, '0'));
}

function setDigit(el, value) {
  if (!el || el.textContent === value) return;
  el.textContent = value;
  el.classList.remove('tick');
  // eslint-disable-next-line no-unused-expressions
  void el.offsetWidth;
  el.classList.add('tick');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Falling petals ----------
const petalsLayer = document.getElementById('petalsLayer');
const petalColors = ['#c9a66b', '#e4c98f', '#9b8bc4', '#a9b39e'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';

  const size = 8 + Math.random() * 10;
  const startX = Math.random() * 100;
  const duration = 8 + Math.random() * 7;
  const swayDuration = 2 + Math.random() * 2;
  const color = petalColors[Math.floor(Math.random() * petalColors.length)];

  petal.style.left = `${startX}vw`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.background = color;
  petal.style.animationDuration = `${duration}s, ${swayDuration}s`;

  petalsLayer.appendChild(petal);

  setTimeout(() => petal.remove(), duration * 1000);
}

setInterval(createPetal, 500);
for (let i = 0; i < 6; i++) {
  setTimeout(createPetal, i * 300);
}

// ---------- Disposable camera gate ----------
// Opens once the celebrations begin (same start as the countdown)
function updateCameraGate() {
  const cameraText = document.getElementById('cameraText');
  const cameraActions = document.getElementById('cameraActions');
  if (!cameraText || !cameraActions) return;

  if (Date.now() >= weddingDate) {
    cameraText.textContent = "Tap below to open your camera and add your shots to our shared album!";
    cameraActions.style.display = '';
  }
}

updateCameraGate();

// ---------- Delight interactions (parallax + cursor sparkles) ----------
// Skipped on touch devices and when the user prefers reduced motion.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && isFinePointer) {
  // Hero parallax: layers drift slightly opposite the cursor for depth.
  const heroEl = document.getElementById('home');
  const parallaxLayers = heroEl ? heroEl.querySelectorAll('[data-parallax]') : [];
  let parallaxRaf = null;

  if (heroEl && parallaxLayers.length) {
    heroEl.addEventListener('mousemove', (e) => {
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        const rect = heroEl.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        parallaxLayers.forEach(layer => {
          const factor = parseFloat(layer.dataset.parallax) || 0.05;
          const maxShift = 26;
          const x = Math.max(-maxShift, Math.min(maxShift, relX * factor * 100));
          const y = Math.max(-maxShift, Math.min(maxShift, relY * factor * 100));
          layer.style.setProperty('--px', `${x}px`);
          layer.style.setProperty('--py', `${y}px`);
        });
        parallaxRaf = null;
      });
    });
    heroEl.addEventListener('mouseleave', () => {
      parallaxLayers.forEach(layer => {
        layer.style.setProperty('--px', '0px');
        layer.style.setProperty('--py', '0px');
      });
    });
  }

  // Cursor sparkle trail
  let lastSpark = 0;
  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpark < 60) return;
    lastSpark = now;
    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  });
}
