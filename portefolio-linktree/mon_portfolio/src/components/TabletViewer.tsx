import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * iPhone / iPad 3D qui affiche des captures d'écran.
 *
 * - L'appareil se met en paysage tout seul quand la capture est plus large que
 *   haute (jeux en paysage) : rien n'est jamais étiré.
 * - Une capture au bon format remplit l'écran ; une capture d'un autre format
 *   (16:9 sur un iPhone) est centrée sur fond noir, comme une vidéo.
 * - Plusieurs captures défilent toutes seules, avec un fondu.
 */

export type DeviceKind = 'iphone' | 'ipad';
export interface ViewerShot { src: string; w?: number; h?: number }

interface Props {
  screenshots: (string | ViewerShot)[];
  device?: DeviceKind;
  /** Ancien usage : `landscape` = tablette. Préférer `device="ipad"`. */
  landscape?: boolean;
  /** Défilement automatique des captures (défaut : oui). */
  autoPlay?: boolean;
}

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

// ── Gabarits (unités 3D, appareil tenu en portrait) ────────────────────────
interface Spec {
  W: number; H: number; depth: number; radius: number;
  bezel: number;          // verre noir entre le bord et l'écran
  body: string; metal: number; rough: number; button: string;
}

function spec(device: DeviceKind): Spec {
  if (device === 'ipad') {
    // Écran 3:4 (2064 × 2752).
    const W = 1.80, bezel = 0.058;
    const SW = W - bezel * 2;
    return { W, H: SW / 0.75 + bezel * 2, depth: 0.052, radius: 0.105, bezel, body: '#2a2a2d', metal: 0.85, rough: 0.2, button: '#2e2e30' };
  }
  // Écran 1320 × 2868.
  const W = 1.0, bezel = 0.034;
  const SW = W - bezel * 2;
  return { W, H: SW / (1320 / 2868) + bezel * 2, depth: 0.105, radius: 0.135, bezel, body: '#cac8c2', metal: 0.72, rough: 0.22, button: '#c0bdb7' };
}

const BEVEL = 0.005;
const FADE_S = 0.35;

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const hw = w / 2, hh = h / 2;
  const rr = Math.min(r, hw, hh);
  const s = new THREE.Shape();
  s.moveTo(-hw + rr, -hh);
  s.lineTo(hw - rr, -hh);
  s.absarc(hw - rr, -hh + rr, rr, -Math.PI / 2, 0, false);
  s.lineTo(hw, hh - rr);
  s.absarc(hw - rr, hh - rr, rr, 0, Math.PI / 2, false);
  s.lineTo(-hw + rr, hh);
  s.absarc(-hw + rr, hh - rr, rr, Math.PI / 2, Math.PI, false);
  s.lineTo(-hw, -hh + rr);
  s.absarc(-hw + rr, -hh + rr, rr, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Rectangle arrondi plat dont les UV couvrent exactement 0 → 1. */
function panelGeometry(w: number, h: number, r: number): THREE.ShapeGeometry {
  const geo = new THREE.ShapeGeometry(roundedRect(w, h, r), 20);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return geo;
}

// ── Chargement des captures ────────────────────────────────────────────────
interface Loaded { src: string; tex: THREE.Texture; w: number; h: number }

/**
 * Charge la capture demandée sans jamais vider l'écran : l'ancienne reste
 * affichée (`prev`) jusqu'à ce que la nouvelle soit prête, puis sert de fond
 * au fondu.
 */
function useShotLayers(src: string | undefined) {
  const gl = useThree(s => s.gl);
  const [layers, setLayers] = useState<{ cur: Loaded | null; prev: Loaded | null }>({ cur: null, prev: null });
  const live = useRef(layers);
  live.current = layers;

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(src, tex => {
      if (!alive) { tex.dispose(); return; }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = gl.capabilities.getMaxAnisotropy();
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      const img = tex.image as { width: number; height: number };
      setLayers(l => {
        l.prev?.tex.dispose();
        return { cur: { src, tex, w: img.width, h: img.height }, prev: l.cur };
      });
    }, undefined, () => { /* image injoignable : on garde la précédente */ });
    return () => { alive = false; };
  }, [src, gl]);

  // Le fondu terminé, l'ancienne capture n'a plus à rester dessous : elle
  // dépasserait derrière une image plus étroite que l'écran.
  useEffect(() => {
    if (!layers.prev) return;
    const id = window.setTimeout(() => setLayers(l => {
      l.prev?.tex.dispose();
      return { cur: l.cur, prev: null };
    }), FADE_S * 1000 + 80);
    return () => window.clearTimeout(id);
  }, [layers.prev]);

  useEffect(() => () => {
    live.current.cur?.tex.dispose();
    live.current.prev?.tex.dispose();
  }, []);

  return layers;
}

/** Une capture posée sur l'écran : plein cadre si le format colle, centrée sinon. */
function ShotPanel({ shot, w, h, radius, z, fade }: {
  shot: Loaded; w: number; h: number; radius: number; z: number; fade: boolean;
}) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  const opacity = useRef(fade ? 0 : 1);

  const geo = useMemo(() => {
    const screen = w / h;
    const image = shot.w / shot.h;
    const ratio = image / screen;
    const tex = shot.tex;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);

    if (Math.abs(ratio - 1) < 0.09) {
      // Même format à peu de chose près : on rogne le surplus, sans déformer.
      if (ratio > 1) { tex.repeat.x = 1 / ratio; tex.offset.x = (1 - 1 / ratio) / 2; }
      else { tex.repeat.y = ratio; tex.offset.y = (1 - ratio) / 2; }
      return panelGeometry(w, h, radius);
    }
    // Autre format : image entière, bandes noires autour.
    const fw = ratio > 1 ? w : h * image;
    const fh = ratio > 1 ? w / image : h;
    return panelGeometry(fw, fh, Math.min(radius, 0.02));
  }, [shot, w, h, radius]);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, dt) => {
    if (opacity.current >= 1) return;
    opacity.current = Math.min(1, opacity.current + dt / FADE_S);
    if (mat.current) mat.current.opacity = opacity.current;
  });

  return (
    <mesh geometry={geo} position={[0, 0, z]} renderOrder={fade ? 3 : 2}>
      <meshBasicMaterial ref={mat} map={shot.tex} transparent opacity={opacity.current} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

// ── Caméra : recule juste assez pour que l'appareil tienne dans le canvas ──
function CameraController({ width, height }: { width: number; height: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const fovRad = camera.fov * Math.PI / 180;
    const aspect = size.width / size.height;
    const hFovRad = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
    const zW = (width * 1.12 / 2) / Math.tan(hFovRad / 2);
    const zH = (height * 1.08 / 2) / Math.tan(fovRad / 2);
    camera.position.z = Math.max(zW, zH) * 1.16;
    camera.near = 0.5;
    camera.far = 40;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, width, height]);
  return null;
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

function makeLogoTex(color: string): THREE.CanvasTexture {
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
function DeviceModel({ src, device, landscape, swing, rotState, onOrientation }: {
  src: string | undefined;
  device: DeviceKind;
  landscape: boolean;
  /** Demi-amplitude du balancement au repos, en radians. */
  swing: number;
  rotState: React.MutableRefObject<RotState>;
  onOrientation: (landscape: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { cur, prev } = useShotLayers(src);
  const isPad = device === 'ipad';
  const s = useMemo(() => spec(device), [device]);

  // L'orientation suit la capture réellement affichée.
  useEffect(() => {
    if (cur) onOrientation(cur.w > cur.h);
  }, [cur, onOrientation]);

  const logoTex = useMemo(() => makeLogoTex(isPad ? 'rgba(180,180,180,0.35)' : 'rgba(255,255,255,0.28)'), [isPad]);
  useEffect(() => () => logoTex.dispose(), [logoTex]);

  const bodyGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(roundedRect(s.W, s.H, s.radius), {
      steps: 1, depth: s.depth,
      bevelEnabled: true,
      bevelThickness: BEVEL, bevelSize: BEVEL,
      bevelOffset: 0, bevelSegments: 3,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [s]);

  const glassInset = 0.012;
  const glassGeo = useMemo(
    () => panelGeometry(s.W - glassInset * 2, s.H - glassInset * 2, s.radius - glassInset),
    [s],
  );
  useEffect(() => () => { bodyGeo.dispose(); glassGeo.dispose(); }, [bodyGeo, glassGeo]);

  // Écran : dimensions dans le repère du monde (donc échangées en paysage).
  const SW = s.W - s.bezel * 2;
  const SH = s.H - s.bezel * 2;
  const screenW = landscape ? SH : SW;
  const screenH = landscape ? SW : SH;
  const screenR = Math.max(0.02, s.radius - s.bezel);

  useFrame(() => {
    if (!groupRef.current) return;
    const r = rotState.current;
    if (!r.dragging) {
      const rawDy = r.targetY - r.y;
      const dyAngle = ((rawDy % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

      if (r.isIdle) {
        // Balancement lent gauche-droite autour de la pose de repos.
        r.y += r.vy;
        const relY = ((r.y - r.targetY) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        if (Math.abs(relY) > swing) r.vy += -Math.sign(relY) * 0.0012;
        else r.vy = r.vy * 0.997 + 0.003 * 0.003;
        r.vx *= 0.93;
        r.x = Math.max(-0.43, Math.min(0.43, r.x + r.vx));
      } else {
        // Retour élastique vers la pose de repos après un glisser.
        const dxAngle = r.targetX - r.x;
        r.vy = r.vy * 0.92 + dyAngle * 0.016;
        r.vx = r.vx * 0.90 + dxAngle * 0.028;
        r.y += r.vy;
        r.x = Math.max(-0.43, Math.min(0.43, r.x + r.vx));
        if (Math.abs(dyAngle) < 0.12 && Math.abs(r.vy) < 0.008) {
          r.isIdle = true;
          r.vy = 0.003;
        }
      }
    }
    groupRef.current.rotation.y = r.y;
    groupRef.current.rotation.x = r.x;
  });

  const zFront = s.depth / 2 + BEVEL + 0.001;
  const zBack = -(s.depth / 2 + BEVEL) - 0.001;
  const { W, H, depth: Dd } = s;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      <directionalLight position={[-2, -1, 3]} intensity={0.45} />
      <pointLight position={[0, 2, 8]} intensity={0.25} />

      <group ref={groupRef}>

        {/* Coque : modélisée en portrait, couchée d'un quart de tour en paysage */}
        <group rotation={[0, 0, landscape ? Math.PI / 2 : 0]}>
          <mesh geometry={bodyGeo}>
            <meshStandardMaterial color={s.body} metalness={s.metal} roughness={s.rough} />
          </mesh>

          {/* Vitre noire */}
          <mesh geometry={glassGeo} position={[0, 0, zFront]}>
            <meshStandardMaterial color="#050506" metalness={0.4} roughness={0.25} />
          </mesh>

          {/* Dynamic Island — iPhone */}
          {!isPad && (
            <RoundedBox args={[0.215, 0.062, 0.003]} radius={0.031} smoothness={6}
              position={[0, H / 2 - s.bezel - 0.062, zFront + 0.004]} renderOrder={4}>
              <meshBasicMaterial color="#000" toneMapped={false} />
            </RoundedBox>
          )}

          {/* Caméra frontale — iPad */}
          {isPad && (
            <mesh position={[0, H / 2 - s.bezel * 0.5, zFront + 0.002]}>
              <circleGeometry args={[0.014, 20]} />
              <meshBasicMaterial color="#15151a" />
            </mesh>
          )}

          {/* Logo au dos */}
          <mesh position={[0, isPad ? 0 : H * 0.04, zBack]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[isPad ? 0.40 : 0.22, isPad ? 0.49 : 0.27]} />
            <meshBasicMaterial map={logoTex} transparent depthWrite={false} />
          </mesh>

          {/* Bloc photo — iPhone */}
          {!isPad && (
            <group position={[-W * 0.19, H * 0.305, zBack - 0.003]} rotation={[0, Math.PI, 0]}>
              <RoundedBox args={[0.295, 0.295, 0.010]} radius={0.046} smoothness={8}>
                <meshStandardMaterial color="#111" metalness={0.75} roughness={0.25} />
              </RoundedBox>
              <RoundedBox args={[0.270, 0.270, 0.005]} radius={0.038} smoothness={8} position={[0, 0, 0.007]}>
                <meshStandardMaterial color="#181818" metalness={0.7} roughness={0.3} />
              </RoundedBox>
              {[
                { pos: [-0.068, 0.068] as [number, number], r: 0.052, glass: 0.038, dot: [-0.056, 0.079] as [number, number] },
                { pos: [0.068, 0.068] as [number, number], r: 0.048, glass: 0.034, dot: [0.056, 0.079] as [number, number] },
                { pos: [0.000, -0.072] as [number, number], r: 0.050, glass: 0.036, dot: [0.010, -0.061] as [number, number] },
              ].map(({ pos, r, glass, dot }, i) => (
                <group key={i}>
                  <mesh position={[pos[0], pos[1], 0.010]}><circleGeometry args={[r, 32]} /><meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} /></mesh>
                  <mesh position={[pos[0], pos[1], 0.011]}><ringGeometry args={[r - 0.008, r, 32]} /><meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.05} /></mesh>
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

          {/* Module photo — iPad */}
          {isPad && (
            <group position={[W * 0.33, H * 0.40, zBack - 0.002]} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 0, 0.003]}><circleGeometry args={[0.055, 24]} /><meshStandardMaterial color="#151515" metalness={0.9} roughness={0.15} /></mesh>
              <mesh position={[0, 0, 0.007]}><circleGeometry args={[0.038, 24]} /><meshStandardMaterial color="#0a0e18" metalness={0.95} roughness={0.05} /></mesh>
              <mesh position={[0.09, 0, 0.003]}><circleGeometry args={[0.025, 16]} /><meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} /></mesh>
            </group>
          )}

          {/* Boutons — iPhone */}
          {!isPad && (
            <>
              <mesh position={[W / 2 + 0.004, H * 0.165, 0]}>
                <boxGeometry args={[0.022, 0.165, Dd * 0.34]} />
                <meshStandardMaterial color={s.button} metalness={0.88} roughness={0.12} />
              </mesh>
              {[[0.285, 0.068], [0.170, 0.092], [0.052, 0.092]].map(([y, len]) => (
                <mesh key={y} position={[-W / 2 - 0.004, H * y, 0]}>
                  <boxGeometry args={[0.022, len, Dd * 0.34]} />
                  <meshStandardMaterial color={s.button} metalness={0.88} roughness={0.12} />
                </mesh>
              ))}
            </>
          )}

          {/* Bouton du haut — iPad */}
          {isPad && (
            <mesh position={[W * 0.35, H / 2 + 0.004, 0]}>
              <boxGeometry args={[0.130, 0.022, Dd * 0.4]} />
              <meshStandardMaterial color={s.button} metalness={0.85} roughness={0.15} />
            </mesh>
          )}
        </group>

        {/* Captures : jamais tournées, l'écran s'adapte à l'orientation */}
        {prev && cur && (prev.w > prev.h) === (cur.w > cur.h) && (
          <ShotPanel key={`p:${prev.src}`} shot={prev} w={screenW} h={screenH} radius={screenR} z={zFront + 0.0015} fade={false} />
        )}
        {cur && (
          <ShotPanel key={`c:${cur.src}`} shot={cur} w={screenW} h={screenH} radius={screenR} z={zFront + 0.0025} fade />
        )}
      </group>
    </>
  );
}

// ── Outer component ────────────────────────────────────────────────────────
const AUTOPLAY_MS = 3800;

export default function TabletViewer({ screenshots, device, landscape: legacyTablet = false, autoPlay = true }: Props) {
  const kind: DeviceKind = device ?? (legacyTablet ? 'ipad' : 'iphone');
  const shots = useMemo<ViewerShot[]>(
    () => screenshots.map(s => (typeof s === 'string' ? { src: s } : s)),
    // La liste est recréée à chaque rendu du parent : on compare son contenu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenshots.map(s => (typeof s === 'string' ? s : s.src)).join('|')],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(340);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Orientation : celle annoncée par la capture si elle est connue, corrigée
  // au chargement par les dimensions réelles de l'image.
  const hint = (shot?: ViewerShot) => (shot?.w && shot?.h ? shot.w > shot.h : undefined);
  const [landscape, setLandscape] = useState<boolean>(() => hint(shots[0]) ?? legacyTablet);

  // Nouvelle app / nouvel appareil : on repart de la première capture.
  useEffect(() => {
    setIndex(0);
    const h = hint(shots[0]);
    if (h !== undefined) setLandscape(h);
  }, [shots, kind]);

  useEffect(() => {
    if (!autoPlay || paused || shots.length < 2) return;
    const id = window.setInterval(() => setIndex(i => (i + 1) % shots.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, shots, index]);

  // Précharge la capture suivante pour que le fondu parte sans attente.
  const current = shots[Math.min(index, Math.max(shots.length - 1, 0))];
  const next = shots.length > 1 ? shots[(index + 1) % shots.length] : undefined;
  useEffect(() => {
    if (!next) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = next.src;
  }, [next]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    obs.observe(el);
    setContainerW(el.offsetWidth);
    return () => obs.disconnect();
  }, []);

  // Pose de repos peu inclinée : la capture doit rester lisible pendant le balancement.
  const restY = landscape ? -0.16 : kind === 'ipad' ? -0.20 : 0.22;
  const restX = landscape ? -0.06 : -0.10;
  const swing = landscape ? 0.26 : 0.34;

  const rotState = useRef<RotState>({
    y: restY, x: restX, vy: 0.003, vx: 0, dragging: false, isIdle: true, targetY: restY, targetX: restX,
  });

  useEffect(() => {
    rotState.current = { y: restY, x: restX, vy: 0.003, vx: 0, dragging: false, isIdle: true, targetY: restY, targetX: restX };
  }, [shots, kind, restY, restX]);

  const lastPtr = useRef({ x: 0, y: 0 });

  const onDown = useCallback((e: React.PointerEvent) => {
    // Souris : pas de sélection de texte. Doigt : surtout pas de preventDefault,
    // le navigateur doit pouvoir lancer le défilement vertical (touch-action: pan-y).
    if (e.pointerType === 'mouse') e.preventDefault();
    rotState.current.dragging = true;
    rotState.current.isIdle = false;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setPaused(true);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!rotState.current.dragging) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    rotState.current.y += dx * 0.014;
    rotState.current.x = Math.max(-0.43, Math.min(0.43, rotState.current.x - dy * 0.008));
    rotState.current.vy = dx * 0.010;
    rotState.current.vx = -dy * 0.005;
    lastPtr.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onUp = useCallback(() => {
    rotState.current.dragging = false;
    setPaused(false);
  }, []);

  const s = spec(kind);
  const modelW = landscape ? s.H : s.W;
  const modelH = landscape ? s.W : s.H;

  // Le cadre épouse l'appareil : large en paysage, étroit en portrait. Sa
  // HAUTEUR, elle, ne dépend que du type d'appareil (la plus grande des deux
  // orientations) : une capture qui bascule de portrait à paysage pendant le
  // diaporama ne doit pas faire sauter la page sous le doigt du visiteur.
  const maxW = landscape ? 560 : kind === 'ipad' ? 400 : 340;
  const landH = Math.min(360, Math.max(150, Math.min(containerW, 560) * (s.W / s.H) * 1.12));
  const portH = Math.min(kind === 'ipad' ? 440 : 460, Math.max(260, Math.min(containerW, kind === 'ipad' ? 400 : 340) * (s.H / s.W) * 0.78));
  const height = Math.max(landH, portH);

  const fallback = (
    <div style={{ width: '100%', height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {current && <img src={current.src} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '16px' }} />}
    </div>
  );

  return (
    <div ref={containerRef} style={{ userSelect: 'none', width: '100%' }}>
      <div style={{ maxWidth: `${maxW}px`, margin: '0 auto' }}>
        <CanvasErrorBoundary fallback={fallback}>
          <div
            style={{ width: '100%', height: `${height}px`, cursor: 'grab', touchAction: 'pan-y' }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 36 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
              dpr={[1, 2.5]}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
              style={{ background: 'transparent' }}
            >
              <CameraController width={modelW} height={modelH} />
              <DeviceModel
                src={current?.src}
                device={kind}
                landscape={landscape}
                swing={swing}
                rotState={rotState}
                onOrientation={setLandscape}
              />
            </Canvas>
          </div>
        </CanvasErrorBoundary>
      </div>

      {shots.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              aria-label={`${i + 1} / ${shots.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '18px' : '6px', height: '6px', borderRadius: '3px', border: 0, padding: 0,
                background: i === index ? '#0071E3' : 'rgba(134,134,139,0.45)',
                transition: 'width .25s ease, background .25s ease', cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
