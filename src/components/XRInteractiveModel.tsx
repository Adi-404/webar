import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXREvent, useController } from '@react-three/xr';
import { Group, Vector3, Mesh, MeshStandardMaterial } from 'three';

interface XRInteractiveModelProps {
  children: React.ReactNode;
  isXRMode: boolean;
}

export function XRInteractiveModel({ children, isXRMode }: XRInteractiveModelProps) {
  const groupRef = useRef<Group>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [grabOffset] = useState(new Vector3());
  const [currentScale, setCurrentScale] = useState(1);
  
  const rightController = useController('right');

  // Handle controller interactions
  useXREvent('selectstart', (event) => {
    if (groupRef.current && isXRMode) {
      setIsGrabbed(true);
      // Calculate offset between controller and object
      const controllerPosition = event.target.position;
      const objectPosition = groupRef.current.position;
      grabOffset.subVectors(objectPosition, controllerPosition);
    }
  });

  useXREvent('selectend', () => {
    setIsGrabbed(false);
  });

  useXREvent('squeezestart', () => {
    // Scale up on squeeze
    if (isXRMode) {
      setCurrentScale(prev => Math.min(prev * 1.2, 3));
    }
  });

  useXREvent('squeezeend', () => {
    // Scale down when squeeze is released
    if (isXRMode) {
      setCurrentScale(prev => Math.max(prev / 1.2, 0.5));
    }
  });

  useFrame(() => {
    if (groupRef.current && isXRMode) {
      // Update scale
      groupRef.current.scale.setScalar(currentScale);

      // Handle grabbing and moving
      if (isGrabbed && rightController) {
        const newPosition = rightController.position.clone().add(grabOffset);
        groupRef.current.position.copy(newPosition);
        
        // Add visual feedback when grabbed (slight glow effect through material emission)
        groupRef.current.traverse((child) => {
          const mesh = child as Mesh;
          if (mesh.isMesh && mesh.material) {
            const material = mesh.material as MeshStandardMaterial;
            if (material.emissive) {
              material.emissive.setHex(0x444444);
            }
          }
        });
      } else {
        // Remove glow when not grabbed
        groupRef.current.traverse((child) => {
          const mesh = child as Mesh;
          if (mesh.isMesh && mesh.material) {
            const material = mesh.material as MeshStandardMaterial;
            if (material.emissive) {
              material.emissive.setHex(0x000000);
            }
          }
        });
      }

      // Add subtle floating animation when not grabbed
      if (!isGrabbed) {
        groupRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.002;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
