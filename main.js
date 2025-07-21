import { beepData, noiseData } from './audioData.js';

// Smooth scrolling
const lenis = new Lenis({ smooth: true });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Helper to morph SVG paths
const morphPath = document.getElementById('morphPath');
function morph(to) {
  const from = morphPath.getAttribute('d');
  if (!from) {
    morphPath.setAttribute('d', to);
    return;
  }
  const interp = flubber.interpolate(from, to);
  gsap.to({ t: 0 }, {
    t: 1,
    duration: 1,
    onUpdate() {
      morphPath.setAttribute('d', interp(this.targets()[0].t));
    }
  });
}

// Audio using Howler
const beep = new Howl({ src: [`data:audio/wav;base64,${beepData}`], volume: 0.5 });
const noise = new Howl({ src: [`data:audio/wav;base64,${noiseData}`], volume: 0.5 });
let currentSound;
function playSound(index) {
  if (currentSound) currentSound.fade(currentSound.volume(), 0, 200);
  currentSound = index % 2 ? beep : noise;
  currentSound.volume(0);
  currentSound.play();
  currentSound.fade(0, 0.5, 300);
}

// Particle system for sections five and eight
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let particleFrame;
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
function startParticles() {
  if (particleFrame) return;
  particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    particleFrame = requestAnimationFrame(draw);
  }
  draw();
}
function stopParticles() {
  if (particleFrame) {
    cancelAnimationFrame(particleFrame);
    particleFrame = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Triggered animation per section
function animateSection(sec, index) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: '+=100%',
      scrub: true,
      pin: true,
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        if (sec.dataset.shape) morph(sec.dataset.shape);
        playSound(index);
        if (index === 5 || index === 8) startParticles();
      },
      onLeave: () => { if (index === 5 || index === 8) stopParticles(); },
      onEnterBack: () => {
        if (sec.dataset.shape) morph(sec.dataset.shape);
        playSound(index);
        if (index === 5 || index === 8) startParticles();
      },
      onLeaveBack: () => { if (index === 5 || index === 8) stopParticles(); }
    }
  });

  sec.querySelectorAll('.text').forEach(t => {
    const split = new SplitType(t, { types: 'words' });
    tl.from(split.words, { opacity: 0, y: 20, stagger: 0.05, duration: 1 }, 0);
  });

  tl.from(sec.querySelectorAll('.shape'), { y: 50, opacity: 0, scale: 0.8, duration: 1 }, 0);

  if (sec.dataset.breath) {
    const breathCircle = document.getElementById('breath');
    const breathText = document.querySelector('.breath-text');
    const breathTl = gsap.timeline({ repeat: -1 });
    breathTl.to(breathCircle, { scale: 1.2, duration: 3, ease: 'sine.inOut' })
            .to(breathCircle, { scale: 1, duration: 3, ease: 'sine.inOut' });
    breathTl.call(() => breathText.textContent = 'Exhala', [], 3)
            .call(() => breathText.textContent = 'Inhala', [], 6);
    tl.add(breathTl, 0);
  }
}

// Initialize animations for all sections
gsap.utils.toArray('section').forEach((sec, i) => animateSection(sec, i));

// Navigation menu
const nav = document.getElementById('side-nav');
const toggle = document.getElementById('nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  gsap.to(nav, { x: open ? 200 : 0, duration: 0.3 });
});

// Smooth scrolling for nav links
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    nav.classList.remove('open');
    gsap.to(nav, { x: 0, duration: 0.3 });
    lenis.scrollTo(target);
  });
});

