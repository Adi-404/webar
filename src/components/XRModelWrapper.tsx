import { useRef, useEffect } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface XRModelWrapperProps {
  children: React.ReactNode;
  isXRMode: boolean;
}

export function XRModelWrapper({ children, isXRMode }: XRModelWrapperProps) {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (groupRef.current && isXRMode) {
      // In XR mode, adjust the model to be at a comfortable viewing angle
      // Rotate the model slightly to show the front/side view instead of top view
      groupRef.current.rotation.x = -Math.PI / 6; // Tilt forward 30 degrees
      groupRef.current.rotation.y = Math.PI / 8;  // Rotate slightly to show dimension
    } else if (groupRef.current && !isXRMode) {
      // Reset rotation for desktop mode
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
    }
  }, [isXRMode]);

  // Add a subtle rotation in XR mode for better viewing
  useFrame(() => {
    if (groupRef.current && isXRMode) {
      // Very subtle rotation to help see all sides of the model
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
