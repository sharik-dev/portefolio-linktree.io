import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  screenshots: string[];
  landscape?: boolean;
}

export default function TabletViewer({ screenshots, landscape = false }: Props) {
  const deviceRef = useRef<HTMLDivElement>(null);

  // ── Rotation state ─────────────────────────────────────────────
  const rot = useRef({ y: landscape ? -25 : 22, x: landscape ? -6 : -8 });
  const vel = useRef({ y: 0.07, x: 0 });
  const drag = useRef({ active: false, lx: 0, ly: 0 });
  const rafRef = useRef<number>(0);

  // ── Auto-slide screenshots ──────────────────────────────────────
  const [imgIndex, setImgIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

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
        // Force de rappel quand Y dépasse ±50° pour éviter la vue latérale (corner gaps)
        if (Math.abs(rot.current.y) > 50) {
          vel.current.y += -Math.sign(rot.current.y) * 0.10;
        } else {
          vel.current.y = vel.current.y * 0.997 + 0.07 * 0.003;
        }
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
    if (Math.abs(vel.current.y) < 0.05) vel.current.y = 0.07;
  }, []);

  // ── Device geometry ─────────────────────────────────────────────
  // Portrait = iPhone proportions (ratio ~0.47)
  // Landscape = iPad proportions for Guidor
  const W     = landscape ? 380 : 210;
  const H     = landscape ? 268 : 448;
  const DEPTH = 10;
  const R     = landscape ? 22 : 38;  // iPhone has very round corners

  // Bezels — iPhone style for portrait, iPad for landscape
  const topB  = landscape ? 12 : 10;   // thin top bezel (modern iPhone)
  const botB  = landscape ? 12 : 10;   // thin bottom bezel
  const sideB = landscape ? 12 : 10;   // thin side bezels
  const showHomeBtn = false;            // modern iPhone = no home button

  // Colors
  const FRONT_BG   = '#1a1a1c';
  const EDGE_COLOR = '#b0b0b4';
  const EDGE_DARK  = '#8a8a8e';
  const alumGrad     = `linear-gradient(145deg, #d0d0d4 0%, ${EDGE_COLOR} 40%, #c2c2c6 65%, ${EDGE_DARK} 100%)`;
  const alumGradBack = `linear-gradient(145deg, #cacace 0%, #b8b8bc 50%, #c0c0c4 100%)`;

  const containerH = landscape ? 340 : 520;

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
          position: 'absolute',
          inset: '-1px',           // 1px outset to seal corner gaps against edges
          borderRadius: `${R + 1}px`,
          background: FRONT_BG,
          // outer ring in body color seals sub-pixel corner gaps
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.07), 0 0 0 5px #c2c2c6`,
          transform: `translateZ(${DEPTH / 2}px)`,
          overflow: 'hidden',
        }}>
          {/* Dynamic Island / Camera pill (portrait) or dot (landscape) */}
          {!landscape && (
            <div style={{
              position: 'absolute',
              top: '14px', left: '50%',
              transform: 'translateX(-50%)',
              width: '80px', height: '26px',
              borderRadius: '13px',
              backgroundColor: '#000',
              border: '1px solid #2a2a2a',
              zIndex: 2,
            }} />
          )}
          {landscape && (
            <div style={{
              position: 'absolute',
              right: '14px', top: '50%',
              transform: 'translateY(-50%)',
              width: '7px', height: '7px',
              borderRadius: '50%',
              backgroundColor: '#0a0a0a',
              border: '1px solid #333',
            }} />
          )}

          {/* Screen */}
          <div style={{
            position: 'absolute',
            top: `${topB}px`, left: `${sideB}px`,
            right: `${landscape ? botB : sideB}px`,
            bottom: `${landscape ? topB : botB}px`,
            backgroundColor: '#000',
            overflow: 'hidden',
            borderRadius: landscape ? '4px' : `${R - sideB}px`,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.6)',
          }}>
            <img
              key={screenshots[imgIndex]}
              src={screenshots[imgIndex]}
              alt=""
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: landscape ? 'center center' : 'center top',
                display: 'block',
                opacity: fadeIn ? 1 : 0,
                transition: 'opacity 0.22s ease',
              }}
            />
            {/* Glass sheen */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Home button — hidden for modern iPhone */}
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
          position: 'absolute', inset: '-1px',
          borderRadius: `${R + 1}px`,
          background: alumGradBack,
          transform: `translateZ(-${DEPTH / 2}px) rotateY(180deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg viewBox="0 0 814 1000" style={{ width: '40px', height: '40px', fill: 'rgba(255,255,255,0.18)' }}>
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.5-317.7 99.8 0 160.6 63.4 215.2 63.4 52.4 0 121.7-67.1 232.6-67.1zM614.2 19.7C642-12.6 660.4-56.2 660.4-99.8c0 0 0-1.3 0-1.3-61.9 2.6-136.3 41.5-181.3 89.9C449.2 26.9 426 74 426 116.8c0 1.3 0 2.6.3 3.9 3.2.3 8.4 1 13.6 1 57.1 0 128.9-37 174.3-102z"/>
          </svg>
        </div>

        {/* ── EDGES ────────────────────────────────────────────── */}
        {/* Top/bottom span full width → seal all 4 corners */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateY(-${DEPTH / 2}px) rotateX(90deg)`,
          transformOrigin: 'top center',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateY(${DEPTH / 2}px) rotateX(-90deg)`,
          transformOrigin: 'bottom center',
        }} />
        {/* Left/right restricted to interior height → top/bottom edges cap the corners */}
        <div style={{
          position: 'absolute',
          left: 0, top: `${DEPTH}px`, bottom: `${DEPTH}px`,
          width: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateX(-${DEPTH / 2}px) rotateY(-90deg)`,
          transformOrigin: 'left center',
        }} />
        <div style={{
          position: 'absolute',
          right: 0, top: `${DEPTH}px`, bottom: `${DEPTH}px`,
          width: `${DEPTH}px`,
          background: alumGrad,
          transform: `translateX(${DEPTH / 2}px) rotateY(90deg)`,
          transformOrigin: 'right center',
        }} />

        {/* Drop shadow */}
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
