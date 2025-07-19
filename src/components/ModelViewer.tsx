import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html } from '@react-three/drei';
import { XR, Controllers, Hands, VRButton, ARButton } from '@react-three/xr';
import { Group } from 'three';
import { LoadedModel } from './LoadedModel';
import { Loader } from './Loader';

interface ModelViewerProps {
  modelUrl: string | null;
  isXRMode: boolean;
  onXRModeChange?: (mode: boolean) => void;
}

export function ModelViewer({ modelUrl, isXRMode, onXRModeChange }: ModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [xrSupported, setXrSupported] = useState({ ar: false, vr: false });

  // Debug logging
  console.log('ModelViewer render:', { modelUrl, isXRMode, hasUrl: !!modelUrl });

  // Check WebXR support
  useEffect(() => {
    const checkXRSupport = async () => {
      if (navigator.xr) {
        try {
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          setXrSupported({ ar: arSupported, vr: vrSupported });
        } catch (error) {
          console.log('WebXR not supported:', error);
          setXrSupported({ ar: false, vr: false });
        }
      }
    };
    checkXRSupport();
  }, []);

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
      {/* Debug Info */}
      {modelUrl && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <p>Model URL: {modelUrl ? '✓' : '✗'}</p>
          <p>XR Mode: {isXRMode ? 'ON' : 'OFF'}</p>
          <p>Error: {modelError || 'None'}</p>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: isXRMode ? true : true,
          preserveDrawingBuffer: true 
        }}
        className="bg-gradient-to-b from-slate-900 to-slate-800"
      >
        {/* XR Setup for AR/VR */}
        {isXRMode && (
          <XR 
            referenceSpace="local-floor"
          >
            <Controllers />
            <Hands />
          </XR>
        )}
        
        {/* Lighting Setup - Adjusted for AR */}
        <ambientLight intensity={isXRMode ? 0.8 : 0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={isXRMode ? 1.5 : 1} 
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={isXRMode ? 0.8 : 0.5} />
        
        {/* Environment - Remove for AR mode to show camera */}
        {!isXRMode && <Environment preset="city" />}
        
        {/* Simple Model Group for Testing */}
        <group ref={groupRef} position={isXRMode ? [0, 0, -1] : [0, 0, 0]}>
          <Suspense fallback={<Loader />}>
            {modelUrl ? (
              <LoadedModel 
                key={`${modelUrl}-${isXRMode}`} // Force re-render when mode changes
                url={modelUrl} 
                onError={handleModelError}
                onLoad={clearError}
                isXRMode={isXRMode}
              />
            ) : (
              <PlaceholderScene isXRMode={isXRMode} />
            )}
          </Suspense>
        </group>
        
        {/* Ground Shadows - Only in desktop mode */}
        {!isXRMode && (
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />
        )}
        
        {/* Controls - Only show orbit controls in desktop mode */}
        {!isXRMode && (
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
        
        {/* Error Display */}
        {modelError && (
          <Html center>
            <div className="bg-red-500/90 text-white p-4 rounded-lg backdrop-blur-sm">
              <p className="font-medium">Error loading model:</p>
              <p className="text-sm opacity-90">{modelError}</p>
            </div>
          </Html>
        )}
        
        {/* XR Buttons - Must be inside Canvas */}
        <Html position={[0, 0, 0]} transform={false} style={{ 
          position: 'fixed', 
          top: '90px', 
          right: '20px', 
          zIndex: 1000 
        }}>
          <div className="flex flex-col space-y-2">
            {/* WebXR Support Check */}
            {!navigator.xr && (
              <div className="bg-orange-500/90 text-white p-3 rounded-lg text-sm max-w-xs">
                <p className="font-medium">WebXR Not Available</p>
                <p className="text-xs opacity-90">
                  Using HTTPS: {location.protocol === 'https:' ? '✓' : '✗'}
                </p>
                <p className="text-xs opacity-90">
                  Device: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                </p>
              </div>
            )}
            
            {/* VR Button */}
            <VRButton 
              style={{
                padding: '12px 16px',
                backgroundColor: xrSupported.vr 
                  ? 'rgba(59, 130, 246, 0.95)' 
                  : 'rgba(107, 114, 128, 0.95)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: xrSupported.vr ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                opacity: xrSupported.vr ? 1 : 0.6
              }}
            >
              🥽 {xrSupported.vr ? 'Enter VR' : 'VR Unavailable'}
            </VRButton>
            
            {/* AR Button */}
            <ARButton 
              style={{
                padding: '12px 16px',
                backgroundColor: xrSupported.ar 
                  ? 'rgba(16, 185, 129, 0.95)' 
                  : 'rgba(107, 114, 128, 0.95)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: xrSupported.ar ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                opacity: xrSupported.ar ? 1 : 0.6
              }}
            >
              📱 {xrSupported.ar ? 'Enter AR' : 'AR Unavailable'}
            </ARButton>
            
            {/* Status Info */}
            <div className="bg-gray-900/90 text-gray-300 p-2 rounded-lg text-xs max-w-xs">
              <p className="font-medium mb-1">Status:</p>
              <p>HTTPS: {location.protocol === 'https:' ? '✅' : '❌'}</p>
              <p>WebXR: {navigator.xr ? '✅' : '❌'}</p>
              <p>VR: {xrSupported.vr ? '✅' : '❌'}</p>
              <p>AR: {xrSupported.ar ? '✅' : '❌'}</p>
            </div>
          </div>
        </Html>
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