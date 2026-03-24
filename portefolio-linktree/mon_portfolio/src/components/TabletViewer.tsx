import React, { Suspense, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── Error boundary ─────────────────────────────────────────────────────────
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: unknown) { console.warn('[TabletViewer] WebGL error:', e); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// ── Screen texture ─────────────────────────────────────────────────────────
function ScreenTexture({ src, args, position }: {
  src: string;
  args: [number, number]; position: [number, number, number];
}) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={position}>
      <planeGeometry args={args} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

// ── Responsive camera: adjusts Z so model always fits the canvas ────────────
function CameraController({ landscape }: { landscape: boolean }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const fovRad = camera.fov * Math.PI / 180;
    const aspect = size.width / size.height;
    const hFovRad = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
    // Model bounding box with slight padding
    const mW = landscape ? 2.70 : 1.18;
    const mH = landscape ? 2.00 : 2.22;
    const zW = (mW / 2) / Math.tan(hFovRad / 2);
    const zH = (mH / 2) / Math.tan(fovRad / 2);
    camera.position.z = Math.max(zW, zH) * 1.18;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, landscape]);
  return null;
}

interface Props {
  screenshots: string[];
  landscape?: boolean;
}

interface RotState {
  y: number; x: number;
  vy: number; vx: number;
  dragging: boolean;
  isIdle: boolean;
  targetY: number; targetX: number;
}

// ── Apple logo ─────────────────────────────────────────────────────────────
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
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = -1;
  tex.offset.x = 1;
  return tex;
}

// ── 3D Device model ────────────────────────────────────────────────────────
function DeviceModel({
  screenshot, landscape, rotState,
}: {
  screenshot: string; landscape: boolean;
  rotState: React.MutableRefObject<RotState>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  const logoTex = useMemo(() =>
    makeTex(landscape ? 'rgba(180,180,180,0.35)' : 'rgba(255,255,255,0.28)'),
  [landscape]);

  const W   = landscape ? 2.50  : 1.00;
  const H   = landscape ? 1.785 : 2.065;
  const Dd  = landscape ? 0.053 : 0.109;
  const R   = landscape ? 0.055 : 0.110;
  const bev = 0.005;

  const bSide = landscape ? 0.058 : 0.039;
  const bTop  = landscape ? 0.051 : 0.038;
  const bBot  = landscape ? 0.046 : 0.038;

  const SW  = W - bSide * 2;
  const SH  = H - bTop - bBot;
  const sOY = (bTop - bBot) / 2;

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

  useFrame(() => {
    if (!groupRef.current) return;
    const s = rotState.current;
    if (!s.dragging) {
      const rawDy = s.targetY - s.y;
      const dyAngle = ((rawDy % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

      if (s.isIdle) {
        // ── Idle oscillation : rotation lente gauche-droite autour de targetY ──
        s.y += s.vy;
        const relY = ((s.y - s.targetY) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        if (Math.abs(relY) > 0.87) {
          s.vy += -Math.sign(relY) * 0.0012; // ressort aux limites
        } else {
          s.vy = s.vy * 0.997 + 0.003 * 0.003; // maintien vitesse douce
        }
        s.vx *= 0.93;
        s.x = Math.max(-0.43, Math.min(0.43, s.x + s.vx));
      } else {
        // ── Spring-back vers position optimale (après drag) ──
        const dxAngle = s.targetX - s.x;
        s.vy = s.vy * 0.92 + dyAngle * 0.016;
        s.vx = s.vx * 0.90 + dxAngle * 0.028;
        s.y += s.vy;
        s.x = Math.max(-0.43, Math.min(0.43, s.x + s.vx));
        // Transition vers idle une fois stabilisé
        if (Math.abs(dyAngle) < 0.12 && Math.abs(s.vy) < 0.008) {
          s.isIdle = true;
          s.vy = 0.003;
        }
      }
    }
    groupRef.current.rotation.y = s.y;
    groupRef.current.rotation.x = s.x;
  });

  const bodyCol = landscape ? '#1d1d1f' : '#cac8c2';
  const bodyMet = landscape ? 0.85 : 0.72;
  const bodyRgh = landscape ? 0.18 : 0.22;
  const btnCol  = landscape ? '#2e2e30' : '#c0bdb7';

  const zFront = Dd / 2 + bev + 0.001;
  const zBack  = -(Dd / 2 + bev) - 0.001;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 6]}   intensity={1.6} />
      <directionalLight position={[-2, -1, 3]} intensity={0.45} />
      <pointLight       position={[0, 2, 8]}   intensity={0.25} />

      <group ref={groupRef}>

        {/* Body */}
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial color={bodyCol} metalness={bodyMet} roughness={bodyRgh} />
        </mesh>

        {/* Screen background */}
        <mesh position={[0, sOY, zFront]}>
          <planeGeometry args={[SW, SH]} />
          <meshBasicMaterial color="#000" />
        </mesh>

        {/* Screenshot */}
        <Suspense fallback={null}>
          <ScreenTexture
            src={screenshot}
            args={[SW, SH]}
            position={[0, sOY, zFront + 0.001]}
          />
        </Suspense>

        {/* Dynamic Island — iPhone */}
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

        {/* Front camera — iPad */}
        {landscape && (
          <mesh position={[0, H / 2 - bTop * 0.52, zFront + 0.002]}>
            <circleGeometry args={[0.020, 20]} />
            <meshBasicMaterial color="#0a0a0a" />
          </mesh>
        )}

        {/* Apple logo on back */}
        <mesh position={[0, landscape ? 0 : H * 0.04, zBack]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[landscape ? 0.40 : 0.22, landscape ? 0.49 : 0.27]} />
          <meshBasicMaterial map={logoTex} transparent depthWrite={false} />
        </mesh>

        {/* iPhone triple-lens camera */}
        {!landscape && (
          <group position={[-W * 0.19, H * 0.305, zBack - 0.003]} rotation={[0, Math.PI, 0]}>
            <RoundedBox args={[0.295, 0.295, 0.010]} radius={0.046} smoothness={8}>
              <meshStandardMaterial color="#111" metalness={0.75} roughness={0.25} />
            </RoundedBox>
            <RoundedBox args={[0.270, 0.270, 0.005]} radius={0.038} smoothness={8} position={[0, 0, 0.007]}>
              <meshStandardMaterial color="#181818" metalness={0.7} roughness={0.3} />
            </RoundedBox>
            {[
              { pos: [-0.068,  0.068] as [number,number], r: 0.052, glass: 0.038, dot: [-0.056, 0.079] as [number,number] },
              { pos: [ 0.068,  0.068] as [number,number], r: 0.048, glass: 0.034, dot: [ 0.056, 0.079] as [number,number] },
              { pos: [ 0.000, -0.072] as [number,number], r: 0.050, glass: 0.036, dot: [ 0.010,-0.061] as [number,number] },
            ].map(({ pos, r, glass, dot }, i) => (
              <group key={i}>
                <mesh position={[pos[0], pos[1], 0.010]}><circleGeometry args={[r, 32]} /><meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} /></mesh>
                <mesh position={[pos[0], pos[1], 0.011]}><ringGeometry args={[r-0.008, r, 32]} /><meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.05} /></mesh>
                <mesh position={[pos[0], pos[1], 0.013]}><circleGeometry args={[glass, 32]} /><meshStandardMaterial color="#080c18" metalness={0.95} roughness={0.04} /></mesh>
                <mesh position={[dot[0], dot[1], 0.014]}><circleGeometry args={[0.007, 12]} /><meshStandardMaterial color="#3a4a6a" metalness={1} roughness={0} /></mesh>
              </group>
            ))}
            <mesh position={[0, 0.095, 0.010]}><circleGeometry args={[0.024, 20]} /><meshStandardMaterial color="#f0dfa0" metalness={0.3} roughness={0.5} emissive="#302010" emissiveIntensity={0.3} /></mesh>
            <mesh position={[0, 0.095, 0.009]}><ringGeometry args={[0.024, 0.028, 20]} /><meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} /></mesh>
            <mesh position={[0.072, -0.072, 0.010]}><circleGeometry args={[0.020, 20]} /><meshStandardMaterial color="#1a1a28" metalness={0.85} roughness={0.15} /></mesh>
            <mesh position={[0.072, -0.072, 0.011]}><ringGeometry args={[0.017, 0.020, 20]} /><meshStandardMaterial color="#2a2a3a" metalness={0.9} roughness={0.1} /></mesh>
          </group>
        )}

        {/* iPad camera module */}
        {landscape && (
          <group position={[W * 0.35, H * 0.28, zBack - 0.002]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0, 0.003]}><circleGeometry args={[0.055, 24]} /><meshStandardMaterial color="#151515" metalness={0.9} roughness={0.15} /></mesh>
            <mesh position={[0, 0, 0.007]}><circleGeometry args={[0.038, 24]} /><meshStandardMaterial color="#0a0e18" metalness={0.95} roughness={0.05} /></mesh>
            <mesh position={[0.09, 0, 0.003]}><circleGeometry args={[0.025, 16]} /><meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} /></mesh>
          </group>
        )}

        {/* iPhone right button */}
        {!landscape && (
          <mesh position={[W / 2 + Dd * 0.25, H * 0.165, 0]}>
            <boxGeometry args={[Dd * 0.55, 0.165, Dd * 0.38]} />
            <meshStandardMaterial color={btnCol} metalness={0.88} roughness={0.12} />
          </mesh>
        )}

        {/* iPhone left buttons */}
        {!landscape && (() => {
          const x = -W / 2 - Dd * 0.25;
          return (
            <>
              <mesh position={[x, H * 0.285, 0]}><boxGeometry args={[Dd * 0.55, 0.068, Dd * 0.38]} /><meshStandardMaterial color={btnCol} metalness={0.90} roughness={0.10} /></mesh>
              <mesh position={[x, H * 0.170, 0]}><boxGeometry args={[Dd * 0.55, 0.092, Dd * 0.38]} /><meshStandardMaterial color={btnCol} metalness={0.88} roughness={0.12} /></mesh>
              <mesh position={[x, H * 0.052, 0]}><boxGeometry args={[Dd * 0.55, 0.092, Dd * 0.38]} /><meshStandardMaterial color={btnCol} metalness={0.88} roughness={0.12} /></mesh>
            </>
          );
        })()}

        {/* iPad top button */}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(340);

  // Measure actual container width for responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    obs.observe(el);
    setContainerW(el.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const defaultY = landscape ? -0.44 : 0.38;
  const defaultX = landscape ? -0.10 : -0.13;

  const rotState = useRef<RotState>({
    y: defaultY, x: defaultX,
    vy: 0.003, vx: 0, dragging: false,
    isIdle: true,
    targetY: defaultY, targetX: defaultX,
  });

  const lastPtr = useRef({ x: 0, y: 0 });

  // Reset rotation when app or orientation changes
  useEffect(() => {
    const tY = landscape ? -0.44 : 0.38;
    const tX = landscape ? -0.10 : -0.13;
    rotState.current = { y: tY, x: tX, vy: 0.003, vx: 0, dragging: false, isIdle: true, targetY: tY, targetX: tX };
  }, [screenshots, landscape]);

  const onDown = useCallback((e: React.PointerEvent) => {
    rotState.current.dragging = true;
    rotState.current.isIdle = false; // sort du mode idle pendant l'interaction
    lastPtr.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!rotState.current.dragging) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    // Free 360° rotation on Y, constrained on X
    rotState.current.y  += dx * 0.008;
    rotState.current.x   = Math.max(-0.43, Math.min(0.43, rotState.current.x - dy * 0.005));
    rotState.current.vy  = dx * 0.005;
    rotState.current.vx  = -dy * 0.003;
    lastPtr.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onUp = useCallback(() => {
    rotState.current.dragging = false;
    // Spring handles return to optimal position — no manual vy needed
  }, []);

  // Responsive canvas height: adapts to container width
  const containerH = landscape
    ? Math.min(360, Math.max(200, containerW * 0.68))
    : Math.min(420, Math.max(260, containerW * 1.55));

  const fallback = (
    <div style={{ width: '100%', height: `${containerH}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
      <img src={screenshots[0]} alt="app screenshot" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '16px' }} />
    </div>
  );

  return (
    <div ref={containerRef} style={{ userSelect: 'none' }}>
      <CanvasErrorBoundary fallback={fallback}>
        <div
          style={{ width: '100%', height: `${containerH}px`, cursor: 'grab' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 36 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
            dpr={[1, 2]}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            style={{ background: 'transparent' }}
          >
            <CameraController landscape={landscape} />
            <DeviceModel
              screenshot={screenshots[0]}
              landscape={landscape}
              rotState={rotState}
            />
          </Canvas>
        </div>
      </CanvasErrorBoundary>
    </div>
  );
}
