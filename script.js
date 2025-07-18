// Animaciones de scroll para "Del 0 al Éter"
// Se utiliza GSAP + ScrollTrigger cargados localmente

gsap.registerPlugin(ScrollTrigger);

function clear(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDot(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawTriangle(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI / 2 + i * (2 * Math.PI / 3);
    const px = x + r * Math.cos(angle);
    const py = y - r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawPentagram(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawHexagram(ctx, x, y, r) {
  drawTriangle(ctx, x, y + r * 0.4, r);
  ctx.save();
  ctx.translate(x, y - r * 0.4);
  ctx.rotate(Math.PI);
  drawTriangle(ctx, 0, 0, r);
  ctx.restore();
}

function drawCross(ctx, x, y, size) {
  drawLine(ctx, x - size, y, x + size, y);
  drawLine(ctx, x, y - size, x, y + size);
}

function drawInfinity(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.bezierCurveTo(x - r, y - r, x, y - r, x, y);
  ctx.bezierCurveTo(x, y + r, x + r, y + r, x + r, y);
  ctx.bezierCurveTo(x + r, y - r, x, y - r, x, y);
  ctx.bezierCurveTo(x, y + r, x - r, y + r, x - r, y);
  ctx.stroke();
}

const drawings = [
  // 0
  (ctx, c) => {},
  // 1
  (ctx, c) => drawDot(ctx, c.width / 2, c.height / 2, 5),
  // 2
  (ctx, c) => {
    const cx = c.width / 2;
    const cy = c.height / 2;
    drawDot(ctx, cx - 30, cy, 5);
    drawDot(ctx, cx + 30, cy, 5);
  },
  // 3
  (ctx, c) => drawTriangle(ctx, c.width / 2, c.height / 2, 60),
  // 4
  (ctx, c) => drawCross(ctx, c.width / 2, c.height / 2, 50),
  // 5
  (ctx, c) => drawPentagram(ctx, c.width / 2, c.height / 2, 60),
  // 6
  (ctx, c) => drawHexagram(ctx, c.width / 2, c.height / 2, 50),
  // 7
  (ctx, c) => drawDot(ctx, c.width / 2, c.height / 2, 80),
  // 8
  (ctx, c) => drawInfinity(ctx, c.width / 2, c.height / 2, 40),
  // 9
  (ctx, c) => {},
];

const sections = document.querySelectorAll('.chapter');
sections.forEach((section, index) => {
  const canvas = section.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  if (section.style.color === 'rgb(0, 0, 0)') {
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    onEnter: () => { clear(ctx, canvas); drawings[index](ctx, canvas); },
    onEnterBack: () => { clear(ctx, canvas); drawings[index](ctx, canvas); }
  });

  gsap.fromTo(
    section.querySelector('p'),
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});
