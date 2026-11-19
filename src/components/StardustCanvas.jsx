import React, { useEffect, useRef } from 'react';

export default function StardustCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool: mix of golden stardust and subtle crimson/rose petals
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2.2,
        speedY: 0.25 + Math.random() * 0.65,
        drift: (Math.random() - 0.5) * 0.45,
        alpha: 0.2 + Math.random() * 0.7,
        pulse: Math.random() * Math.PI * 2,
        isPetal: i % 5 === 0, // 20% are falling rose petals
        petalAngle: Math.random() * Math.PI * 2,
        petalSpin: (Math.random() - 0.5) * 0.03
      });
    }

    // Cursor breeze interaction
    let mouseX = -1000;
    let mouseY = -1000;
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.drift + Math.sin(p.pulse) * 0.25;
        p.pulse += 0.025;

        // Subtle breeze push near mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const push = (1 - dist / 100) * 1.5;
          p.x += (dx / dist) * push;
          p.y += (dy / dist) * push;
        }

        if (p.y > canvas.height + 15) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 15) p.x = -10;
        if (p.x < -15) p.x = canvas.width + 10;

        ctx.save();
        if (p.isPetal) {
          // Render miniature drifting rose petal
          p.petalAngle += p.petalSpin;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.petalAngle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 2.2, p.r * 1.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 40, 60, ${p.alpha * 0.45})`;
          ctx.fill();
        } else {
          // Render glowing golden stardust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
          ctx.fillStyle = `rgba(243, 220, 153, ${currentAlpha})`;
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = 7;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
