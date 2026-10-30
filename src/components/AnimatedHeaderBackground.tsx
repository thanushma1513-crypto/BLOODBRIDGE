import { useEffect, useRef, useState } from 'react';
import screenBg from '../assets/screen.png';

export default function AnimatedHeaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset({ x, y }));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="animated-header-background screen-bg-header" aria-hidden="true">
      {/* High-Resolution Perfectly-Fitted Medical Theme Background */}
      <img
        src={screenBg}
        alt=""
        className="screen-bg-image"
        style={{
          transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px)`,
        }}
      />

      {/* Interactive Glowing Heart Ambient Pulse */}
      <div
        className="screen-heart-glow"
        style={{
          transform: `translate(${offset.x * 0.9}px, ${offset.y * 0.9}px)`,
        }}
      />

      {/* Ambient Theme Waves Glow */}
      <div className="screen-ambient-particles" />
      
      {/* Smooth Seamless Bottom Fade into Overview Home */}
      <div className="screen-edge-blend-bottom" />
    </div>
  );
}
