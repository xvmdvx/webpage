const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const nextBtn = document.getElementById('next');
const stepText = document.getElementById('stepText');

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

function showStep() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stepText.textContent = steps[step].text;
  steps[step].draw();
}

function drawCircle() {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
  ctx.stroke();
}

function drawSeedOfLife() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const r = 80;
  drawCircleAt(centerX, centerY, r);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    drawCircleAt(x, y, r);
  }
}

function drawFlowerOfLife() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const r = 80;
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      const x = centerX + r * j * Math.cos(angle);
      const y = centerY + r * j * Math.sin(angle);
      drawCircleAt(x, y, r);
    }
  }
  drawSeedOfLife();
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
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDivineLine() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  drawPoint();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY - 150);
  ctx.stroke();
}

function drawMetatron() {
  // Por ahora reutilizamos la Flor de la Vida como base
  drawFlowerOfLife();
  // Se pueden añadir detalles adicionales en fases futuras
}
