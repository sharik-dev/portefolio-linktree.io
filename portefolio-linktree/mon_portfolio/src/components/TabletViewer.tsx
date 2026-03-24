import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  screenshots: string[];
  landscape?: boolean;
}

interface RotState {
  y: number; x: number; vy: number; vx: number; dragging: boolean;
}

// ── Apple logo via canvas ──────────────────────────────────────────────────
const APPLE_SVG_PATH =
  'M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.5-317.7 99.8 0 160.6 63.4 215.2 63.4 52.4 0 121.7-67.1 232.6-67.1zM614.2 19.7C642-12.6 660.4-56.2 660.4-99.8 660.4-101.1 660.4-102.4 660.4-102.4 598.5-99.8 524.1-60.9 479.1-12.5 449.2 26.9 426 74 426 116.8c0 1.3 0 2.6.3 3.9 3.2.3 8.4 1 13.6 1 57.1 0 128.9-37 174.3-102z';

function makeTex(color: string): THREE.CanvasTexture {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d')!;
  const scale = (S * 0.52) / 1000;
  const tx = (S - 814 * scale) / 2;
  const ty = (S - 1000 * scale) / 2 + S * 0.04;
  ctx.save();
  ctx.translate(tx, ty);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(APPLE_SVG_PATH));
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  // Flip U so logo reads correctly when plane is rotated 180° on Y
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = -1;
  tex.offset.x = 1;
  return tex;
}

// ── Inner 3D scene ─────────────────────────────────────────────────────────
function DeviceModel({
  screenshot, opacity, landscape, rotState,
}: {
  screenshot: string; opacity: number; landscape: boolean;
  rotState: React.MutableRefObject<RotState>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [screenTex, setScreenTex] = useState<THREE.CanvasTexture | null>(null);

  // Load screenshot via native Image → canvas → CanvasTexture
  // This avoids all TextureLoader / Suspense compatibility issues
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!alive) return;
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth  || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      setScreenTex(tex);
    };
    img.src = screenshot;
    return () => { alive = false; img.onload = null; };
  }, [screenshot]);

  // Apple logo texture (memoised per component lifetime)
  const logoTex = useMemo(() =>
    makeTex(landscape ? 'rgba(180,180,180,0.35)' : 'rgba(255,255,255,0.28)'),
  [landscape]);

  // ── Accurate Apple proportions ─────────────────────────────────────────
  // iPhone 15: 71.5 × 147.6 × 7.8 mm  → scale W=1.0
  // iPad Pro 11" M4: 248.6 × 177.5 × 5.3 mm  → scale W=2.5
  const W   = landscape ? 2.50  : 1.00;
  const H   = landscape ? 1.785 : 2.065;
  const Dd  = landscape ? 0.053 : 0.109;   // depth
  const R   = landscape ? 0.055 : 0.110;   // face-corner radius
  const bev = 0.005;                         // tiny edge bevel

  // Bezels (measured from real device dims)
  const bSide = landscape ? 0.058 : 0.039;
  const bTop  = landscape ? 0.051 : 0.038;
  const bBot  = landscape ? 0.046 : 0.038;

  const SW  = W - bSide * 2;           // screen width
  const SH  = H - bTop - bBot;         // screen height
  const sOY = (bTop - bBot) / 2;       // vertical offset to center screen

  // ── Build ExtrudeGeometry for correct Apple corner radius ─────────────
  // RoundedBox forces same radius on all edges; ExtrudeGeometry lets us
  // set a large face-corner R (≈11% of W) with a tiny depth bevel.
  const bodyGeo = useMemo(() => {
    const s = new THREE.Shape();
    const hw = W / 2, hh = H / 2;
    s.moveTo(-hw + R, -hh);
    s.lineTo( hw - R, -hh);
    s.quadraticCurveTo( hw, -hh,  hw, -hh + R);
    s.lineTo( hw,  hh - R);
    s.quadraticCurveTo( hw,  hh,  hw - R,  hh);
    s.lineTo(-hw + R,  hh);
    s.quadraticCurveTo(-hw,  hh, -hw,  hh - R);
    s.lineTo(-hw, -hh + R);
    s.quadraticCurveTo(-hw, -hh, -hw + R, -hh);

    const geo = new THREE.ExtrudeGeometry(s, {
      steps: 1, depth: Dd,
      bevelEnabled: true,
      bevelThickness: bev, bevelSize: bev,
      bevelOffset: 0, bevelSegments: 3,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [W, H, Dd, R, bev]);

  // After center(): ExtrudeGeometry back cap (extruded end) is at z ≈ +Dd/2
  // → that is the face closest to camera → this is where we put the screen.
  // Front cap (original shape) is at z ≈ -Dd/2 → shows when device is rotated.

  useFrame(() => {
    if (!groupRef.current) return;
    const s = rotState.current;
    if (!s.dragging) {
      s.y += s.vy;
      if (Math.abs(s.y) > 0.87) {
        s.vy += -Math.sign(s.y) * 0.0012;
      } else {
        s.vy = s.vy * 0.997 + 0.007 * 0.003;
      }
      s.vx *= 0.93;
      s.x = Math.max(-0.43, Math.min(0.43, s.x + s.vx));
    }
    groupRef.current.rotation.y = s.y;
    groupRef.current.rotation.x = s.x;
  });

  // Body color: iPad Space Black / iPhone Natural Titanium
  const bodyCol  = landscape ? '#1d1d1f' : '#cac8c2';
  const bodyMet  = landscape ? 0.85 : 0.72;
  const bodyRgh  = landscape ? 0.18 : 0.22;

  // Front z (screen side) and back z (logo side)
  const zFront = Dd / 2 + 0.001;
  const zBack  = -(Dd / 2) - 0.001;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 6]}   intensity={1.6} />
      <directionalLight position={[-2, -1, 3]} intensity={0.45} />
      <pointLight       position={[0, 2, 8]}   intensity={0.25} />

      <group ref={groupRef}>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial color={bodyCol} metalness={bodyMet} roughness={bodyRgh} />
        </mesh>

        {/* ── Screen background ─────────────────────────────────────────── */}
        <mesh position={[0, sOY, zFront]}>
          <planeGeometry args={[SW, SH]} />
          <meshBasicMaterial color="#000" />
        </mesh>

        {/* ── Screenshot ────────────────────────────────────────────────── */}
        {screenTex && (
          <mesh position={[0, sOY, zFront + 0.001]}>
            <planeGeometry args={[SW, SH]} />
            <meshBasicMaterial map={screenTex} transparent opacity={opacity} depthWrite={false} />
          </mesh>
        )}

        {/* ── Dynamic Island — iPhone portrait ──────────────────────────── */}
        {!landscape && (() => {
          const pillW = 0.190, pillH = 0.052, pillR = 0.026;
          return (
            <RoundedBox
              args={[pillW, pillH, 0.003]}
              radius={pillR}
              smoothness={6}
              position={[0, H / 2 - bTop * 0.6, zFront + 0.002]}
            >
              <meshBasicMaterial color="#000" />
            </RoundedBox>
          );
        })()}

        {/* ── Front camera — iPad landscape (center-top edge) ───────────── */}
        {landscape && (
          <mesh position={[0, H / 2 - bTop * 0.52, zFront + 0.002]}>
            <circleGeometry args={[0.020, 20]} />
            <meshBasicMaterial color="#0a0a0a" />
          </mesh>
        )}

        {/* ── Apple logo on back ────────────────────────────────────────── */}
        {/* rotation Y=PI → normal faces -Z in local space → visible when
            device turns to show back face to camera                        */}
        <mesh position={[0, landscape ? 0 : H * 0.04, zBack]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[landscape ? 0.40 : 0.22, landscape ? 0.49 : 0.27]} />
          <meshBasicMaterial map={logoTex} transparent depthWrite={false} />
        </mesh>

        {/* ── Camera module on back — iPhone (top-left) ─────────────────── */}
        {!landscape && (
          <group position={[-W * 0.19, H * 0.30, zBack - 0.003]} rotation={[0, Math.PI, 0]}>
            {/* Module housing */}
            <RoundedBox args={[0.26, 0.26, 0.008]} radius={0.04} smoothness={6}>
              <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
            </RoundedBox>
            {/* Lens 1 */}
            <mesh position={[-0.055,  0.055, 0.005]}>
              <circleGeometry args={[0.048, 24]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[-0.055,  0.055, 0.009]}>
              <circleGeometry args={[0.032, 24]} />
              <meshStandardMaterial color="#0a1020" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Lens 2 */}
            <mesh position={[ 0.055,  0.055, 0.005]}>
              <circleGeometry args={[0.048, 24]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[ 0.055,  0.055, 0.009]}>
              <circleGeometry args={[0.032, 24]} />
              <meshStandardMaterial color="#0a1020" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Flash */}
            <mesh position={[ 0.055, -0.055, 0.006]}>
              <circleGeometry args={[0.022, 16]} />
              <meshStandardMaterial color="#f5e6b0" metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        )}

        {/* ── Camera module on back — iPad (top-right) ──────────────────── */}
        {landscape && (
          <group position={[W * 0.35, H * 0.28, zBack - 0.002]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0, 0.003]}>
              <circleGeometry args={[0.055, 24]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.007]}>
              <circleGeometry args={[0.038, 24]} />
              <meshStandardMaterial color="#0a0e18" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* LiDAR */}
            <mesh position={[0.09, 0, 0.003]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        )}

        {/* ── Power button — right edge, portrait ───────────────────────── */}
        {!landscape && (
          <mesh position={[W / 2 + Dd * 0.25, H * 0.18, 0]}>
            <boxGeometry args={[Dd * 0.6, 0.145, Dd * 0.4]} />
            <meshStandardMaterial color={landscape ? '#2e2e30' : '#c0bdb7'} metalness={0.85} roughness={0.15} />
          </mesh>
        )}

        {/* ── Volume & mute — left edge, portrait ───────────────────────── */}
        {!landscape && [
          [H * 0.250, 0.055],
          [H * 0.140, 0.090],
          [H * 0.035, 0.090],
        ].map(([y, h], i) => (
          <mesh key={i} position={[-W / 2 - Dd * 0.25, y as number, 0]}>
            <boxGeometry args={[Dd * 0.6, h as number, Dd * 0.4]} />
            <meshStandardMaterial color="#c0bdb7" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* ── Top button — iPad landscape ───────────────────────────────── */}
        {landscape && (
          <mesh position={[W * 0.35, H / 2 + Dd * 0.25, 0]}>
            <boxGeometry args={[0.130, Dd * 0.6, Dd * 0.4]} />
            <meshStandardMaterial color="#2e2e30" metalness={0.85} roughness={0.15} />
          </mesh>
        )}

      </group>
    </>
  );
}

// ── Outer component ────────────────────────────────────────────────────────
export default function TabletViewer({ screenshots, landscape = false }: Props) {
  const rotState = useRef<RotState>({
    y:  landscape ? -0.44 : 0.38,
    x:  landscape ? -0.10 : -0.13,
    vy: 0.007, vx: 0, dragging: false,
  });

  const lastPtr  = useRef({ x: 0, y: 0 });
  const [imgIndex, setImgIndex] = useState(0);
  const [opacity,  setOpacity]  = useState(1);

  useEffect(() => {
    if (screenshots.length <= 1) return;
    const id = setInterval(() => {
      setOpacity(0);
      setTimeout(() => { setImgIndex(i => (i + 1) % screenshots.length); setOpacity(1); }, 230);
    }, 3500);
    return () => clearInterval(id);
  }, [screenshots]);

  useEffect(() => {
    setImgIndex(0);
    setOpacity(1);
    rotState.current = { y: landscape ? -0.44 : 0.38, x: landscape ? -0.10 : -0.13, vy: 0.007, vx: 0, dragging: false };
  }, [screenshots, landscape]);

  const onDown = useCallback((e: React.PointerEvent) => {
    rotState.current.dragging = true;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!rotState.current.dragging) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    rotState.current.y  += dx * 0.009;
    rotState.current.x   = Math.max(-0.43, Math.min(0.43, rotState.current.x - dy * 0.006));
    rotState.current.vy  = dx * 0.006;
    rotState.current.vx  = -dy * 0.004;
    lastPtr.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onUp = useCallback(() => {
    rotState.current.dragging = false;
    if (Math.abs(rotState.current.vy) < 0.002) rotState.current.vy = 0.007;
  }, []);

  const containerH = landscape ? 320 : 500;
  const cameraZ    = landscape ? 5.0  : 4.4;

  return (
    <div style={{ userSelect: 'none' }}>
      <div
        style={{ width: '100%', height: `${containerH}px`, cursor: 'grab' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          style={{ background: 'transparent' }}
        >
          <DeviceModel
            screenshot={screenshots[imgIndex] ?? screenshots[0]}
            opacity={opacity}
            landscape={landscape}
            rotState={rotState}
          />
        </Canvas>
      </div>

      {screenshots.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
          {screenshots.map((_, i) => (
            <div key={i} style={{
              width: i === imgIndex ? '16px' : '6px', height: '6px', borderRadius: '3px',
              backgroundColor: i === imgIndex ? '#0071E3' : '#C7C7CC',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
