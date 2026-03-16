import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  screenshots: string[];
  landscape?: boolean;
}

export default function TabletViewer({ screenshots, landscape = false }: Props) {
  const deviceRef = useRef<HTMLDivElement>(null);

  // ── Rotation state ─────────────────────────────────────────────
  const rot = useRef({ y: landscape ? -25 : 18, x: landscape ? -6 : -8 });
  const vel = useRef({ y: 0.30, x: 0 });
  const drag = useRef({ active: false, lx: 0, ly: 0 });
  const rafRef = useRef<number>(0);

  // ── Auto-slide screenshots ──────────────────────────────────────
  const [imgIndex, setImgIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // Cycle screenshots every 3.5 s
  useEffect(() => {
    if (screenshots.length <= 1) return;
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setImgIndex(i => (i + 1) % screenshots.length);
        setFadeIn(true);
      }, 200);
    }, 3500);
    return () => clearInterval(id);
  }, [screenshots]);

  // Reset to first image when app changes
  useEffect(() => {
    setImgIndex(0);
    setFadeIn(true);
  }, [screenshots]);

  // ── Transform apply ─────────────────────────────────────────────
  const apply = useCallback(() => {
    if (!deviceRef.current) return;
    deviceRef.current.style.transform =
      `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
  }, []);

  // ── Animation loop ──────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      if (!drag.current.active) {
        rot.current.y += vel.current.y;
        rot.current.x += vel.current.x;
        vel.current.y = vel.current.y * 0.997 + 0.30 * 0.003;
        vel.current.x *= 0.92;
        rot.current.x = Math.max(-25, Math.min(25, rot.current.x));
      }
      apply();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [apply]);

  // ── Pointer handlers ────────────────────────────────────────────
  const onDown = useCallback((e: React.PointerEvent) => {
    drag.current = { active: true, lx: e.clientX, ly: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lx;
    const dy = e.clientY - drag.current.ly;
    rot.current.y += dx * 0.55;
    rot.current.x = Math.max(-25, Math.min(25, rot.current.x - dy * 0.35));
    vel.current.y = dx * 0.35;
    vel.current.x = -dy * 0.22;
    drag.current.lx = e.clientX;
    drag.current.ly = e.clientY;
    apply();
  }, [apply]);

  const onUp = useCallback(() => {
    drag.current.active = false;
    if (Math.abs(vel.current.y) < 0.15) vel.current.y = 0.30;
  }, []);

  // ── Device geometry ─────────────────────────────────────────────
  // Portrait (phone/app) vs Landscape (iPad for Guidor)
  const W      = landscape ? 360 : 240;
  const H      = landscape ? 252 : 336;
  const DEPTH  = 11;
  const R      = landscape ? 20 : 24;

  // Bezels
  const topB  = landscape ? 10 : 34;   // top / left-in-landscape
  const botB  = landscape ? 10 : 40;   // bottom / right-in-landscape  (no home btn on landscape)
  const sideB = landscape ? 10 : 9;    // sides
  const showHomeBtn = !landscape;

  // Colors
  const FRONT_BG     = '#1e1e20';
  const EDGE_COLOR   = '#b0b0b4';
  const EDGE_DARK    = '#8a8a8e';
  const alumGrad     = `linear-gradient(145deg, #d0d0d4 0%, ${EDGE_COLOR} 40%, #c2c2c6 65%, ${EDGE_DARK} 100%)`;
  const alumGradBack = `linear-gradient(145deg, #cacace 0%, #b8b8bc 50%, #c0c0c4 100%)`;

  const containerH = landscape ? 320 : 420;

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{
        width: '100%',
        height: `${containerH}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1100px',
        perspectiveOrigin: '50% 50%',
        userSelect: 'none',
        cursor: 'grab',
      }}
    >
      {/* ── 3D scene ──────────────────────────────────────────── */}
      <div
        ref={deviceRef}
        style={{
          width: `${W}px`,
          height: `${H}px`,
          position: 'relative',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transform: `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`,
        }}
      >

        {/* ── FRONT face ───────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: `${R}px`,
          background: FRONT_BG,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
          transform: `translateZ(${DEPTH / 2}px)`,
          overflow: 'hidden',
        }}>
          {/* Camera / sensor (portrait: top center · landscape: right center) */}
          <div style={{
            position: 'absolute',
            ...(landscape
              ? { right: '14px', top: '50%', transform: 'translateY(-50%)' }
              : { top: '13px', left: '50%', transform: 'translateX(-50%)' }),
            width: '7px', height: '7px',
            borderRadius: '50%',
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
          }} />

          {/* Screen */}
          <div style={{
            position: 'absolute',
            top: `${topB}px`, left: `${sideB}px`,
            right: `${landscape ? botB : sideB}px`,
            bottom: `${landscape ? topB : botB}px`,
            backgroundColor: '#000',
            overflow: 'hidden',
            borderRadius: '3px',
          }}>
            <img
              key={screenshots[imgIndex]}
              src={screenshots[imgIndex]}
              alt=""
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                opacity: fadeIn ? 1 : 0,
                transition: 'opacity 0.22s ease',
              }}
            />
            {/* Subtle glass sheen */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Home button (portrait only) */}
          {showHomeBtn && (
            <div style={{
              position: 'absolute', bottom: '11px',
              left: '50%', transform: 'translateX(-50%)',
              width: '26px', height: '26px',
              borderRadius: '50%',
              border: '2px solid #383838',
              backgroundColor: '#111',
            }} />
          )}
        </div>

        {/* ── BACK face ────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: `${R}px`,
          background: alumGradBack,
          transform: `translateZ(-${DEPTH / 2}px) rotateY(180deg)`,
        }} />

        {/* ── EDGES — full-dimension, no corner offsets ─────────
            Extending to left:0/right:0 and top:0/bottom:0
            eliminates the corner gaps that appeared previously.
            The front/back faces (at ±Z) visually cap the corners.
        ───────────────────────────────────────────────────────── */}

        {/* Top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateY(-${DEPTH / 2}px) rotateX(90deg)`,
          transformOrigin: 'top center',
        }} />
        {/* Bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateY(${DEPTH / 2}px) rotateX(-90deg)`,
          transformOrigin: 'bottom center',
        }} />
        {/* Left */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateX(-${DEPTH / 2}px) rotateY(-90deg)`,
          transformOrigin: 'left center',
        }} />
        {/* Right */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateX(${DEPTH / 2}px) rotateY(90deg)`,
          transformOrigin: 'right center',
        }} />

        {/* Drop shadow plane */}
        <div style={{
          position: 'absolute',
          bottom: '-28px', left: '8%', right: '8%',
          height: '36px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 55%, transparent 75%)',
          transform: `translateZ(-${DEPTH / 2 + 2}px) rotateX(90deg)`,
          transformOrigin: 'top center',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Screenshot dots */}
      {screenshots.length > 1 && (
        <div style={{
          display: 'flex', gap: '6px',
          marginTop: '12px',
          justifyContent: 'center',
        }}>
          {screenshots.map((_, i) => (
            <div key={i} style={{
              width: i === imgIndex ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === imgIndex ? '#0071E3' : '#C7C7CC',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
