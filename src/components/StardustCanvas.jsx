import React, { useEffect, useRef } from 'react';

/* Falling marigold petals and drifting gold dust, pushed aside by the cursor. */
export default function StardustCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let raf;
    // 1.5x looks identical for soft particles and pushes ~45% fewer pixels than 2x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Pre-render the glowing dust dot once; drawImage is far cheaper than shadowBlur every frame.
    const GLOW = 24;
    const glow = document.createElement('canvas');
    glow.width = glow.height = GLOW * 2;
    {
      const g = glow.getContext('2d');
      const grad = g.createRadialGradient(GLOW, GLOW, 0, GLOW, GLOW, GLOW);
      grad.addColorStop(0, 'rgba(255,240,200,1)');
      grad.addColorStop(0.18, 'rgba(255,228,170,0.95)');
      grad.addColorStop(0.35, 'rgba(243,179,61,0.35)');
      grad.addColorStop(1, 'rgba(243,179,61,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, GLOW * 2, GLOW * 2);
    }

    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = w < 640 ? 22 : 40;
    const PETAL_COLORS = ['243,179,61', '224,134,28', '201,67,47', '255,210,122'];

    const particles = Array.from({ length: count }, (_, i) => {
      const alpha = 0.25 + Math.random() * 0.6;
      const color = PETAL_COLORS[i % PETAL_COLORS.length];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2,
        vy: 0.2 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.4,
        alpha,
        phase: Math.random() * Math.PI * 2,
        petal: i % 3 === 0,
        fill: `rgba(${color}, ${alpha * 0.55})`, // built once, not every frame
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        flip: Math.random() * Math.PI * 2
      };
    });

    let mx = -1000;
    let my = -1000;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let running = true;
    let last = performance.now();
    const render = (now) => {
      if (!running) return;
      // Frame-rate independent motion (1 = one 60fps frame), so 120Hz screens don't double speed.
      const k = Math.min((now - last) / 16.667, 3);
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y += p.vy * k;
        p.x += (p.drift + Math.sin(p.phase) * 0.3) * k;
        p.phase += 0.02 * k;

        const dx = p.x - mx;
        const dy = p.y - my;
        if (dx > -110 && dx < 110 && dy > -110 && dy < 110) {
          const d = Math.hypot(dx, dy);
          if (d < 110 && d > 0) {
            const push = (1 - d / 110) * 2 * k;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push;
          }
        }
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        if (p.petal) {
          p.angle += p.spin * k;
          p.flip += 0.03 * k;
          ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
          ctx.rotate(p.angle);
          ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2); // tumbling
          const s = p.r * 3;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(s * 0.9, 0, 0, s);
          ctx.quadraticCurveTo(-s * 0.9, 0, 0, -s);
          ctx.fillStyle = p.fill;
          ctx.fill();
        } else {
          const size = p.r * 5;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.phase * 2));
          ctx.drawImage(glow, p.x - size / 2, p.y - size / 2, size, size);
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Stop drawing entirely while the tab is in the background.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full will-change-transform"
      aria-hidden="true"
    />
  );
}
