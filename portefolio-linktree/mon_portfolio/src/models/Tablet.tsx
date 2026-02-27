import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TabletProps {
  screenshot: string;
  color?: string;
  rotation?: [number, number, number];
}

const Tablet: React.FC<TabletProps> = ({
  screenshot,
  color = '#555555',
  rotation = [0, 0, 0]
}) => {
  const tabletRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [textureError, setTextureError] = useState(false);
  
  // Création d'une texture de secours en cas d'erreur
  const fallbackTexture = new THREE.TextureLoader().load(
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="1024" viewBox="0 0 512 1024"><rect width="512" height="1024" fill="%23333"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23fff">Image non disponible</text></svg>`,
    undefined,
    undefined,
    (error) => console.error('Erreur avec la texture de secours:', error)
  );
  
  // Chargement de la texture de capture d'écran
  let screenTexture: THREE.Texture | undefined;
  try {
    screenTexture = useTexture(screenshot);
    
    // Gestion des erreurs après le chargement
    useEffect(() => {
      const handleError = () => {
        setTextureError(true);
        console.warn('Erreur de chargement de texture, utilisant la texture de secours');
      };
      
      if (screenTexture && screenTexture.image) {
        screenTexture.image.onerror = handleError;
      }
      
      return () => {
        if (screenTexture && screenTexture.image) {
          screenTexture.image.onerror = null;
        }
      };
    }, [screenTexture]);
  } catch (error) {
    console.error('Erreur lors du chargement de la texture:', error);
    setTextureError(true);
  }
  
  // Animation de la tablette
  useFrame((state) => {
    if (tabletRef.current) {
      tabletRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2 + rotation[1];
      tabletRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05 + rotation[0];
    }
  });

  // Utiliser la texture de secours en cas d'erreur
  const textureToUse = textureError || !screenTexture ? fallbackTexture : screenTexture;

  return (
    <group ref={tabletRef} position={[0, 0, 0]} rotation={rotation}>
      {/* Corps de la tablette */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Bordures d'écran */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[1.95, 2.8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Écran */}
      <mesh ref={screenRef} position={[0, 0, 0.052]}>
        <planeGeometry args={[1.85, 2.7]} />
        <meshBasicMaterial map={textureToUse} />
      </mesh>
      
      {/* Bouton home */}
      <mesh position={[0, -1.4, 0.051]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Caméra */}
      <mesh position={[0, 1.4, 0.051]}>
        <circleGeometry args={[0.03, 32]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* Boutons latéraux */}
      <mesh position={[-1.05, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      <mesh position={[-1.05, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.05]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
};

export default Tablet; 