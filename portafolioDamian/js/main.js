// ── THEME TOGGLE ──
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  themeBtn.style.transform = 'scale(1.2) rotate(20deg)';
  setTimeout(() => themeBtn.style.transform = '', 300);
});

// ── CURSOR GLOW ──
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── AVATAR FALLBACK ──
function initials() {
  return '<span style="font-size:40px;font-weight:700;color:#fff;">RC</span>';
}

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.bar-anim').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── CONTADORES ANIMADOS ──
function animateCounter(el, end, suffix, duration = 1800) {
  let current = 0;
  const step = end / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, end);
    el.textContent = Math.floor(current) + suffix;
    if (current >= end) clearInterval(timer);
  }, duration / 60);
}
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounter(document.getElementById('s1'), 120, '+');
    animateCounter(document.getElementById('s2'), 85,  '%');
    animateCounter(document.getElementById('s3'), 10,  '+');
    animateCounter(document.getElementById('s4'), 1,   '+');
    statsObs.disconnect();
  }
}, { threshold: 0.5 });
statsObs.observe(document.querySelector('.stats'));

// ── EFECTO DE ESCRITURA ──
const titles  = ['QA Engineer', 'Quality Assurance', 'Test Analyst', 'QA Specialist'];
let titleIdx  = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-title');
function typeEffect() {
  const word = titles[titleIdx];
  if (!isDeleting) {
    charIdx++;
    typedEl.innerHTML = word.slice(0, charIdx) + '<span class="cursor-blink"></span>';
    if (charIdx === word.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
  } else {
    charIdx--;
    typedEl.innerHTML = word.slice(0, charIdx) + '<span class="cursor-blink"></span>';
    if (charIdx === 0) { isDeleting = false; titleIdx = (titleIdx + 1) % titles.length; }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 100);
}
setTimeout(typeEffect, 1200);

// ── QR CODE & ACCORDION ──
const VCARD_DATA = 'MECARD:N:Calderon Avila,Robinson Damian;TEL:+573123575092;EMAIL:rcalderonavila@gmail.com;URL:https://www.linkedin.com/in/robinson-damian-calderon-avila-6a754516a/;NOTE:QA Engineer;;';
let qrGenerated = false;

function toggleAccordion() {
  const body    = document.getElementById('accordionBody');
  const chevron = document.getElementById('accChevron');
  const btn     = document.getElementById('accordionBtn');
  const isOpen  = body.classList.contains('open');

  body.classList.toggle('open', !isOpen);
  chevron.classList.toggle('rotated', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));

  // Generar QR la primera vez que se abre
  if (!isOpen && !qrGenerated) {
    setTimeout(() => {
      new QRCode(document.getElementById('qrcode'), {
        text: VCARD_DATA,
        width: 150,
        height: 150,
        colorDark: '#0a1628',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
      qrGenerated = true;
    }, 120);
  }
}

// ── DESCARGAR VCARD ──
function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Robinson Damian Calderon Avila',
    'N:Calderon Avila;Robinson Damian;;;',
    'ORG:Soft One Group S.A.S',
    'TITLE:QA Engineer',
    'EMAIL;TYPE=INTERNET:rcalderonavila@gmail.com',
    'TEL;TYPE=CELL:+573123575092',
    'URL:https://www.linkedin.com/in/robinson-damian-calderon-avila-6a754516a/',
    'NOTE:QA Engineer - Bogota, Colombia',
    'END:VCARD'
  ].join('\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'Damian_Calderon_QA.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// ── BACK TO TOP ──
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});
// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  navOverlay.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});
function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// ── FORMULARIO CONTACTO ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');
  const nombre  = document.getElementById('nombre').value;
  const email   = document.getElementById('email').value;
  const asunto  = document.getElementById('asunto').value;
  const mensaje = document.getElementById('mensaje').value;

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Abrir mailto como fallback (funciona siempre)
  const body = `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`;
  const mailtoLink = `mailto:rcalderonavila@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink);

  setTimeout(() => {
    msg.style.display = 'block';
    msg.style.background = 'rgba(48,209,88,0.12)';
    msg.style.color = '#30d158';
    msg.style.border = '0.5px solid rgba(48,209,88,0.3)';
    msg.textContent = '✅ ¡Mensaje listo! Se abrió tu cliente de correo. Si no se abrió, escríbeme a rcalderonavila@gmail.com';
    btn.textContent = '✓ Enviado';
    btn.style.background = '#30d158';
    document.getElementById('contactForm').reset();
  }, 800);
}