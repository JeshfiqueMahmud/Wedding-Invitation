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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const count = window.innerWidth < 640 ? 26 : 44;
    const PETAL_COLORS = ['243,179,61', '224,134,28', '201,67,47', '255,210,122'];

    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: 1 + Math.random() * 2,
      vy: 0.2 + Math.random() * 0.55,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.25 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      petal: i % 3 === 0,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI * 2
    }));

    let mx = -1000;
    let my = -1000;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.drift + Math.sin(p.phase) * 0.3;
        p.phase += 0.02;

        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.hypot(dx, dy);
        if (d < 110 && d > 0) {
          const push = (1 - d / 110) * 2;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
        if (p.y > H() + 20) {
          p.y = -20;
          p.x = Math.random() * W();
        }
        if (p.x > W() + 20) p.x = -20;
        if (p.x < -20) p.x = W() + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.petal) {
          p.angle += p.spin;
          p.flip += 0.03;
          ctx.rotate(p.angle);
          ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2); // tumbling
          ctx.beginPath();
          const s = p.r * 3;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(s * 0.9, 0, 0, s);
          ctx.quadraticCurveTo(-s * 0.9, 0, 0, -s);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.55})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 228, 170, ${p.alpha * (0.5 + 0.5 * Math.sin(p.phase * 2))})`;
          ctx.shadowColor = '#F3B33D';
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full" aria-hidden="true" />;
}
