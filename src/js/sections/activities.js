export default function initActivitiesBackground() {
  const canvas = document.getElementById('activities-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W = 0, H = 0, t = 0;

  let LINES = 7;
  let AMP = 26;
  let SCALE_X = 240;
  let SPEED = 0.015;
  let GLOW = 8;

  function tuneBySize() {
    const w = section.clientWidth;
    if (w < 640) { LINES = 5; AMP = 18; SCALE_X = 180; GLOW = 6; }
    else if (w < 1024) { LINES = 6; AMP = 22; SCALE_X = 210; GLOW = 7; }
    else { LINES = 7; AMP = 26; SCALE_X = 240; GLOW = 8; }
  }

  function resize() {
    tuneBySize();
    const rect = section.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(section);
  resize();

  function wave(yBase, phase, alpha) {
    ctx.beginPath();
    const step = 4;
    for (let x = 0; x <= W; x += step) {
      const y = yBase + AMP * Math.sin((x / SCALE_X) + phase) * Math.cos(phase * 0.7);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(41,227,138,${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  let rafId;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.shadowColor = 'rgba(41,227,138,0.45)';
    ctx.shadowBlur = GLOW;

    const gap = H / (LINES + 1);
    for (let i = 0; i < LINES; i++) {
      const y = gap * (i + 1);
      const phase = t + i * 0.6;
      const alpha = 0.25 - i * (0.18 / LINES);
      wave(y, phase, Math.max(0.08, alpha));
    }

    ctx.restore();
    t += SPEED;
    rafId = requestAnimationFrame(draw);
  }

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  function start() { if (!mq.matches) draw(); }
  function stop()  { if (rafId) cancelAnimationFrame(rafId); }

  if (mq.addEventListener) mq.addEventListener('change', () => { stop(); start(); });
  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
}
