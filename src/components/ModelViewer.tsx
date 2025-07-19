import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas} from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html } from '@react-three/drei';
import { XR, Controllers, Hands } from '@react-three/xr';
import { Group } from 'three';
import { LoadedModel } from './LoadedModel';
import { Loader } from './Loader';

interface ModelViewerProps {
  modelUrl: string | null;
  isXRMode: boolean;
  xrMode?: 'ar' | 'vr' | 'none';
  onXRSupportChange?: (support: { ar: boolean; vr: boolean }) => void;
}

export function ModelViewer({ modelUrl, isXRMode, xrMode = 'none', onXRSupportChange }: ModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);

  // Debug logging
  console.log('ModelViewer render:', { modelUrl, isXRMode, hasUrl: !!modelUrl });

  // Check WebXR support
  useEffect(() => {
    const checkXRSupport = async () => {
      if (navigator.xr) {
        try {
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          const support = { ar: arSupported, vr: vrSupported };
          onXRSupportChange?.(support);
        } catch (error) {
          console.log('WebXR not supported:', error);
          const support = { ar: false, vr: false };
          onXRSupportChange?.(support);
        }
      } else {
        const support = { ar: false, vr: false };
        onXRSupportChange?.(support);
      }
    };
    checkXRSupport();
  }, [onXRSupportChange]);

  const handleModelError = (error: string) => {
    console.error('ModelViewer: Model error:', error);
    setModelError(error);
  };

  const clearError = () => {
    console.log('ModelViewer: Clearing error, model loaded successfully');
    setModelError(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Debug Info - Hidden on mobile */}
      {modelUrl && (
        <div className="hidden md:block absolute top-2 lg:top-4 left-2 lg:left-4 bg-black/80 text-white p-2 rounded text-xs z-50 max-w-[200px] lg:max-w-none">
          <p>Model: {modelUrl ? '✓' : '✗'}</p>
          <p>XR: {isXRMode ? 'ON' : 'OFF'}</p>
          <p>Mode: {xrMode.toUpperCase()}</p>
          <p>Error: {modelError || 'None'}</p>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        frameloop="always"
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        className={xrMode === 'ar' ? "bg-transparent" : "bg-gradient-to-b from-slate-900 to-slate-800"}
      >
        {/* XR Setup for AR/VR */}
        <XR 
          referenceSpace="local-floor"
          onSessionStart={() => {
            console.log('XR Session Started');
            console.log('XR mode should enable immersive experience');
          }}
          onSessionEnd={() => {
            console.log('XR Session Ended');
          }}
        >
          <Controllers />
          <Hands />
        </XR>
        
        {/* Lighting Setup - Optimized for different XR modes */}
        <ambientLight intensity={xrMode === 'ar' ? 0.8 : xrMode === 'vr' ? 0.6 : 0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={xrMode === 'ar' ? 1.5 : xrMode === 'vr' ? 1.2 : 1} 
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={xrMode === 'ar' ? 0.8 : xrMode === 'vr' ? 0.6 : 0.5} />
        
        {/* Environment - Only remove for AR mode to show camera, keep for VR */}
        {xrMode !== 'ar' && <Environment preset="city" />}
        
        {/* Model Group - Different positioning for AR vs VR */}
        <group ref={groupRef} position={xrMode === 'ar' ? [0, 0, -1] : xrMode === 'vr' ? [0, 0, -2] : [0, 0, 0]}>
          <Suspense fallback={<Loader />}>
            {modelUrl ? (
              <LoadedModel 
                url={modelUrl} 
                onError={handleModelError}
                onLoad={clearError}
                isXRMode={isXRMode}
                xrMode={xrMode}
              />
            ) : (
              <PlaceholderScene isXRMode={isXRMode} />
            )}
          </Suspense>
        </group>
        
        {/* Ground Shadows - Only in desktop mode and VR */}
        {(xrMode === 'none' || xrMode === 'vr') && (
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />
        )}
        
        {/* Controls - Only show orbit controls in desktop mode */}
        {xrMode === 'none' && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            minDistance={1}
            maxDistance={20}
            makeDefault
          />
        )}
        
        {/* Error Display - Hidden on mobile */}
        {modelError && (
          <Html center>
            <div className="hidden md:block bg-red-500/90 text-white p-4 rounded-lg backdrop-blur-sm">
              <p className="font-medium">Error loading model:</p>
              <p className="text-sm opacity-90">{modelError}</p>
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
}

function PlaceholderScene({ isXRMode }: { isXRMode: boolean }) {
  return (
    <group>
      {/* Main demo cube - smaller in AR mode */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={isXRMode ? [0.3, 0.3, 0.3] : [1, 1, 1]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
      
      {/* Additional demo objects - only show in desktop mode */}
      {!isXRMode && (
        <>
          <mesh position={[-2, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          
          <mesh position={[2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </>
      )}
      
      <Text
        position={[0, isXRMode ? -0.5 : -2, 0]}
        fontSize={isXRMode ? 0.15 : 0.5}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
      >
        {isXRMode ? "AR Mode Active" : "Upload a .obj file to begin"}
      </Text>
      
      {!isXRMode && (
        <Text
          position={[0, -2.8, 0]}
          fontSize={0.3}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Or try the "Basic Example" to see React Three Fiber in action
        </Text>
      )}
    </group>
  );
}