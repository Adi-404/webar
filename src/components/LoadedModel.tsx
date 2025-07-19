import { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib';
import { Group, Box3, Vector3, MeshStandardMaterial, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface LoadedModelProps {
  url: string;
  onError: (error: string) => void;
  onLoad: () => void;
  isXRMode?: boolean;
}

export function LoadedModel({ url, onError, onLoad, isXRMode = false }: LoadedModelProps) {
  const groupRef = useRef<Group>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  console.log('LoadedModel: Rendering with URL:', url, 'XR Mode:', isXRMode);
  
  const obj = useLoader(
    OBJLoader, 
    url,
    (progress) => {
      console.log('LoadedModel: Loading progress:', progress);
    },
    (error) => {
      console.error('LoadedModel: Failed to load model:', error);
      onError(error instanceof Error ? error.message : 'Failed to load model');
    }
  );

  console.log('LoadedModel: obj loaded:', !!obj, 'isLoaded:', isLoaded);
  
  // Reset loaded state when URL changes
  useEffect(() => {
    setIsLoaded(false);
    console.log('LoadedModel: URL changed, resetting loaded state');
  }, [url]);
  
  useEffect(() => {
    if (obj && groupRef.current) {
      try {
        console.log('LoadedModel: Processing loaded object...');
        
        // Center and scale the model
        const box = new Box3().setFromObject(obj);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        console.log('LoadedModel: Model bounds:', { center, size });
        
        // Calculate scale to fit model in viewport
        const maxDim = Math.max(size.x, size.y, size.z);
        // Use smaller scale for AR mode to make models more manageable
        const targetSize = isXRMode ? 0.5 : 2;
        const scale = targetSize / maxDim;
        
        console.log('LoadedModel: Applying scale:', scale);
        
        // Apply transformations
        obj.position.sub(center);
        groupRef.current.scale.setScalar(scale);
        
        // Position the model at a comfortable viewing height for XR
        // This ensures the model appears at chest/eye level rather than on the ground
        groupRef.current.position.set(0, 0, 0);
        
        // Apply materials
        obj.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (!mesh.material) {
              mesh.material = new MeshStandardMaterial({ 
                color: '#8b5cf6',
                roughness: 0.3,
                metalness: 0.1
              });
            }
          }
        });
        
        console.log('LoadedModel: Model setup complete, calling onLoad');
        setIsLoaded(true);
        onLoad();
      } catch (error) {
        console.error('LoadedModel: Error processing model:', error);
        onError(error instanceof Error ? error.message : 'Failed to process model');
      }
    }
  }, [obj, onLoad, onError, isXRMode]);

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current && isLoaded) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  if (!obj) {
    console.log('LoadedModel: No obj loaded yet, returning null');
    return null;
  }

  console.log('LoadedModel: Rendering model, isLoaded:', isLoaded);

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
      {/* Debug helper to show model is present */}
      {isLoaded && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  );
}