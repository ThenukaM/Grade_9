/**
 * Grade 9 Live Demo Script
 * - Real-time Smash Counter with dynamic pulse animation
 * - High-performance custom Canvas Confetti Engine (zero external dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const smashBtn = document.getElementById('smash-btn');
  const counterVal = document.getElementById('counter-value');
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  let celebrationCount = 0;
  let particles = [];
  let animationId = null;

  // --- Resize Canvas Responsive Handler ---
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- Confetti Particle System ---
  const COLORS = ['#00f5d4', '#9d4edd', '#39ff14', '#f72585', '#ffe600'];

  class ConfettiParticle {
    constructor(originX, originY) {
      this.x = originX;
      this.y = originY;
      this.size = Math.random() * 8 + 5;
      
      // Initial explosive velocity bursting outward and upward
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 4; // Biased upwards

      this.gravity = 0.35;
      this.drag = 0.94;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 12;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = 1;
      this.decay = Math.random() * 0.015 + 0.015;
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.opacity -= this.decay;
    }

    draw(context) {
      if (this.opacity <= 0) return;
      context.save();
      context.translate(this.x, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.globalAlpha = Math.max(0, this.opacity);
      context.fillStyle = this.color;
      // Draw rectangular confetti sheet
      context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      context.restore();
    }
  }

  function launchConfetti(originX, originY) {
    const PARTICLE_COUNT = 75;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new ConfettiParticle(originX, originY));
    }

    if (!animationId) {
      renderConfetti();
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(renderConfetti);
    } else {
      animationId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // --- Interaction & Counter Logic ---
  smashBtn.addEventListener('click', (event) => {
    // 1. Increment Counter
    celebrationCount += 1;
    counterVal.textContent = celebrationCount;

    // 2. Visual Punch / Number Animation
    counterVal.classList.remove('bump');
    // Force reflow to re-trigger CSS keyframe
    void counterVal.offsetWidth;
    counterVal.classList.add('bump');

    // 3. Trigger Particle Explosion from Click Coordinates or Button Center
    const rect = smashBtn.getBoundingClientRect();
    const clickX = event.clientX || rect.left + rect.width / 2;
    const clickY = event.clientY || rect.top + rect.height / 2;

    launchConfetti(clickX, clickY);
  });
});