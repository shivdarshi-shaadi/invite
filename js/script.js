// ---------- Preloader ----------
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 600);
});

// ---------- Navbar scroll state + mobile toggle ----------
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

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

  els.days.textContent = String(days).padStart(2, '0');
  els.hours.textContent = String(hours).padStart(2, '0');
  els.mins.textContent = String(mins).padStart(2, '0');
  els.secs.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Falling petals ----------
const petalsLayer = document.getElementById('petalsLayer');
const petalColors = ['#d4af37', '#f3d576', '#e3c7e8', '#fdfaf3'];

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
