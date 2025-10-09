export default function initAboutBackground() {
  const canvas = document.getElementById('about-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 80;
  const MAX_DIST = 140;

  function resize() {
    const parent = canvas.parentElement || canvas;               // секция
    const rect = parent.getBoundingClientRect();                 // реальный CSS-размер
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // визуальный размер
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // размер буфера (учитываем DPR)
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // если пересоздаём размеры — перегенерим точки внутри новых габаритов
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // линии
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const a = 1 - dist / MAX_DIST;
          ctx.strokeStyle = `rgba(41,227,138,${a * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // точки + движение
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#29E38A';
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  draw();
}
