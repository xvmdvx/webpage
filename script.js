const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const nextBtn = document.getElementById('next');
const stepText = document.getElementById('stepText');
const themeSelect = document.getElementById('theme');

function applyColors() {
  const style = getComputedStyle(document.body);
  ctx.strokeStyle = style.getPropertyValue('--line-color');
  ctx.fillStyle = style.getPropertyValue('--line-color');
}

// aplicar el tema inicial
document.body.classList.toggle('vibrant', themeSelect.value === 'vibrant');

let step = 0;

// Plan de siete fases inspirado en "Geometría Sagrada" y la filosofía
// de experiencias inmersivas de emergenceprojects.com
const steps = [
  {
    text:
      'Fase 1: Vacío Primordial. Respira profundamente y visualiza un lienzo blanco infinito.',
    draw: drawVacuum
  },
  {
    text: 'Fase 2: Punto de Origen: aparece un punto en el centro.',
    draw: drawPoint
  },
  {
    text: 'Fase 3: Línea Divina conecta el punto con el infinito.',
    draw: drawDivineLine
  },
  {
    text: 'Fase 4: Círculo de Unidad revela la primera forma.',
    draw: drawCircle
  },
  {
    text:
      'Fase 5: La Semilla de la Vida surge de siete círculos entrelazados.',
    draw: drawSeedOfLife
  },
  {
    text:
      'Fase 6: La Flor de la Vida expande el patrón, revelando armonía.',
    draw: drawFlowerOfLife
  },
  {
    text: 'Fase 7: Cubo de Metatrón integra las formas en equilibrio.',
    draw: drawMetatron
  }
];

startBtn.addEventListener('click', () => {
  step = 0;
  startBtn.hidden = true;
  nextBtn.hidden = false;
  showStep();
});

nextBtn.addEventListener('click', () => {
  step++;
  if (step < steps.length) {
    showStep();
  } else {
    stepText.textContent = 'Has completado la introducción.';
    nextBtn.hidden = true;
  }
});

themeSelect.addEventListener('change', () => {
  document.body.classList.toggle('vibrant', themeSelect.value === 'vibrant');
  showStep();
});

function showStep() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyColors();
  stepText.textContent = steps[step].text;
  steps[step].draw();
}

function animateCircle(x, y, r, duration, callback) {
  let start = null;
  function draw(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    const end = Math.min(progress * Math.PI * 2, Math.PI * 2);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, end);
    ctx.stroke();
    if (progress < 1) {
      requestAnimationFrame(draw);
    } else if (callback) {
      callback();
    }
  }
  requestAnimationFrame(draw);
}

function animateLine(x1, y1, x2, y2, duration, callback) {
  let start = null;
  function draw(timestamp) {
    if (!start) start = timestamp;
    const progress = (timestamp - start) / duration;
    const x = x1 + (x2 - x1) * Math.min(progress, 1);
    const y = y1 + (y2 - y1) * Math.min(progress, 1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (progress < 1) {
      requestAnimationFrame(draw);
    } else if (callback) {
      callback();
    }
  }
  requestAnimationFrame(draw);
}

function drawCircle() {
  animateCircle(canvas.width / 2, canvas.height / 2, 100, 1000);
}

function drawSeedOfLife() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const r = 80;
  const circles = [
    { x: centerX, y: centerY },
  ];
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    circles.push({
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    });
  }
  let idx = 0;
  function next() {
    if (idx < circles.length) {
      const c = circles[idx++];
      animateCircle(c.x, c.y, r, 600, next);
    }
  }
  next();
}

function drawFlowerOfLife() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const r = 80;
  const circles = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      circles.push({
        x: centerX + r * j * Math.cos(angle),
        y: centerY + r * j * Math.sin(angle)
      });
    }
  }
  circles.push({ x: centerX, y: centerY });
  let idx = 0;
  function next() {
    if (idx < circles.length) {
      const c = circles[idx++];
      animateCircle(c.x, c.y, r, 400, next);
    }
  }
  next();
}

function drawCircleAt(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

// --- nuevas funciones para las siete fases ---
function drawVacuum() {
  // El vacío primordial se representa como un lienzo en blanco
  // intencionalmente no se dibuja nada
}

function drawPoint() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  animateCircle(centerX, centerY, 3, 500);
}

function drawDivineLine() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  drawPoint();
  animateLine(centerX, centerY, centerX, centerY - 150, 800);
}

function drawMetatron() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const r = 80;

  const circles = [];
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    circles.push({
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    });
  }
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    circles.push({
      x: centerX + 2 * r * Math.cos(angle),
      y: centerY + 2 * r * Math.sin(angle)
    });
  }
  circles.push({ x: centerX, y: centerY });

  let idx = 0;
  function next() {
    if (idx < circles.length) {
      const c = circles[idx++];
      animateCircle(c.x, c.y, r, 300, next);
    } else {
      drawConnections();
    }
  }

  function drawConnections() {
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        animateLine(
          circles[i].x,
          circles[i].y,
          circles[j].x,
          circles[j].y,
          200
        );
      }
    }
  }

  next();
}
