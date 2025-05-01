
let fireworksCanvas, ctx;
let particles = [];
let fireworksInterval;
let animationFrame;

class Particle {
  constructor(x, y, color, speed, angle, size, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.angle = angle;
    this.size = size;
    this.life = life;
    this.opacity = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.speed *= 0.98;
    this.life--;
    this.opacity = this.life / 100;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function createFirework(x, y) {
  const colors = ['#ff5252', '#ff4081', '#7c4dff', '#40c4ff', '#69f0ae', '#ffd740', '#ffab40'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    const size = Math.random() * 2 + 1;
    particles.push(new Particle(x, y, color, speed, angle, size, 100));
  }
}

function animateFireworks() {
  animationFrame = requestAnimationFrame(animateFireworks);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.update();
    p.draw();
  }
}

function startFireworks() {
  fireworksCanvas = document.getElementById('fireworksCanvas');
  if (!fireworksCanvas) return;

  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
  ctx = fireworksCanvas.getContext('2d');

  animateFireworks();
  fireworksInterval = setInterval(() => {
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height / 2;
    createFirework(x, y);
  }, 1500);
}

function stopFireworks() {
  cancelAnimationFrame(animationFrame);
  clearInterval(fireworksInterval);
}
