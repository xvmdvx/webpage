const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const nextBtn = document.getElementById('next');
const stepText = document.getElementById('stepText');

let step = 0;

const steps = [
  { text: 'Paso 1: El círculo representa la unidad y el comienzo.', draw: drawCircle },
  { text: 'Paso 2: La Semilla de la Vida surge de siete círculos entrelazados.', draw: drawSeedOfLife },
  { text: 'Paso 3: La Flor de la Vida expande el patrón, revelando armonía.', draw: drawFlowerOfLife }
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
