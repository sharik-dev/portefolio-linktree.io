import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    useGLTF,
    useTexture,
    OrbitControls,
    Environment,
    ContactShadows,
    PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import type { ObjectMap } from '@react-three/fiber';

// ─── Proxy Vite pour éviter CORS WebGL ─────────────────────────────────────
function toProxyUrl(url: string): string {
    if (url.startsWith('https://img.freepik.com'))
        return url.replace('https://img.freepik.com', '/img-proxy/freepik');
    if (url.startsWith('https://cdn-icons-png.flaticon.com'))
        return url.replace('https://cdn-icons-png.flaticon.com', '/img-proxy/flaticon');
    return url;
}

// ─── Placeholder noir pour compiler le shader avec 'map' dès le départ ──────
function makePlaceholderTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 4; canvas.height = 4;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 4, 4);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

// ─── Modèle 3D ──────────────────────────────────────────────────────────────
function TabletModel({ screenshotUrl }: { screenshotUrl: string }) {
    const gltf = useGLTF(`${import.meta.env.BASE_URL}model/tablet.glb`) as GLTF & ObjectMap & {
        materials: Record<string, THREE.Material>;
    };
    const texture = useTexture(toProxyUrl(screenshotUrl));
    const placeholder = useMemo(makePlaceholderTexture, []);

    // ── Collecter les UUID du matériau "Pre-Screen" dans la scène originale ──
    const greenScreenUUIDs = useMemo(() => {
        const uuids = new Set<string>();
        // Méthode 1 : accès direct par nom via gltf.materials
        if (gltf.materials?.['Pre-Screen']) {
            uuids.add(gltf.materials['Pre-Screen'].uuid);
        }
        // Méthode 2 : fallback traversal — nom + couleur verte
        gltf.scene.traverse((obj: THREE.Object3D) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh || !mesh.material) return;
            const mats = Array.isArray(mesh.material)
                ? (mesh.material as THREE.Material[])
                : [mesh.material as THREE.Material];
            mats.forEach((m) => {
                const mat = m as THREE.MeshStandardMaterial;
                const byName = mat.name === 'Pre-Screen' || mat.name.trim() === 'Pre-Screen';
                const byColor = mat.color && mat.color.g > 0.4 && mat.color.r < 0.08 && mat.color.b < 0.08;
                if (byName || byColor) uuids.add(mat.uuid);
            });
        });
        return uuids;
    }, [gltf.scene, gltf.materials]);

    // ── Cloner la scène UNE SEULE FOIS
    //    SEUL le matériau Pre-Screen est remplacé — tout le reste reste intact ─
    const clonedScene = useMemo(() => {
        const clone = gltf.scene.clone(true);

        clone.traverse((obj: THREE.Object3D) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh || !mesh.material) return;

            // Vérifier si ce mesh appartient au cylindre (bord décoratif)
            // Pre-Screen est partagé entre le cube (écran) ET le cylindre (bord)
            // → on ne remplace QUE sur les meshes du cube principal
            let ancestor = mesh.parent;
            let isCylinder = false;
            while (ancestor) {
                // "Цилиндр" = Cylinder en russe (nom du node dans le GLB)
                if (ancestor.name.includes('Цилиндр') || ancestor.name.includes('ylinder')) {
                    isCylinder = true;
                    break;
                }
                ancestor = ancestor.parent;
            }

            const processMat = (m: THREE.Material): THREE.Material => {
                if (!greenScreenUUIDs.has(m.uuid) || isCylinder) return m; // ← laissé intact
                const sm = new THREE.MeshStandardMaterial({
                    map: placeholder,
                    roughness: 0.55, // plus élevé = texture visible (pas de miroir blanc)
                    metalness: 0.0,
                });
                sm.userData.isScreen = true;
                return sm;
            };

            if (Array.isArray(mesh.material)) {
                mesh.material = (mesh.material as THREE.Material[]).map(processMat);
            } else {
                const m = mesh.material as THREE.Material;
                if (greenScreenUUIDs.has(m.uuid) && !isCylinder) {
                    const sm = new THREE.MeshStandardMaterial({
                        map: placeholder,
                        roughness: 0.55,
                        metalness: 0.0,
                    });
                    sm.userData.isScreen = true;
                    mesh.material = sm;
                }
            }
        });

        return clone;
    }, [gltf.scene, greenScreenUUIDs, placeholder]);

    // ── Mise à jour de la texture quand l'app change (sans remonte du modèle) ─
    useEffect(() => {
        const t = texture.clone();
        t.colorSpace = THREE.SRGBColorSpace;
        t.flipY = false;
        t.needsUpdate = true;

        clonedScene.traverse((obj: THREE.Object3D) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material)
                ? (mesh.material as THREE.Material[])
                : [mesh.material as THREE.Material];
            mats.forEach((m) => {
                if (!m?.userData?.isScreen) return;
                const sm = m as THREE.MeshStandardMaterial;
                if (sm.map && sm.map !== placeholder) sm.map.dispose();
                sm.map = t;
            });
        });

        return () => { t.dispose(); };
    }, [clonedScene, texture, placeholder]);

    return (
        <primitive
            object={clonedScene}
            scale={8.6}
            position={[0, -0.2, 0]}
            rotation={[0.05, 0.2, 0]}
        />
    );
}

// ─── Loading placeholder ─────────────────────────────────────────────────────
function LoadingBox() {
    return (
        <mesh>
            <boxGeometry args={[1.2, 1.8, 0.08]} />
            <meshStandardMaterial color="#1c1c1e" />
        </mesh>
    );
}

// ─── Canvas principal ────────────────────────────────────────────────────────
export default function TabletViewer({ screenshotUrl }: { screenshotUrl: string }) {
    return (
        <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]}
                shadows={false}
                style={{ background: 'transparent' }}
            >
                <PerspectiveCamera makeDefault fov={36} position={[0, 0.2, 3.6]} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 5, 4]} intensity={1.5} />
                <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#a0a0ff" />

                <Suspense fallback={<LoadingBox />}>
                    <Environment preset="city" />
                    <TabletModel screenshotUrl={screenshotUrl} />
                    <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={7} blur={2} far={3.5} />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 5}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate
                    autoRotateSpeed={1.3}
                    target={[0, 0.05, 0]}
                />
            </Canvas>
        </div>
    );
}

useGLTF.preload(`${import.meta.env.BASE_URL}model/tablet.glb`);
