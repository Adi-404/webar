import { VRButton, ARButton } from '@react-three/xr';
import { useState, useEffect } from 'react';

interface MobileXRButtonsProps {
  xrSupported: { ar: boolean; vr: boolean };
}

export function MobileXRButtons({ xrSupported }: MobileXRButtonsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div className="fixed top-20 right-2 z-[9999] flex flex-col gap-2">
      {/* Mobile WebXR Support Check */}
      {!navigator.xr && (
        <div className="bg-orange-500/95 text-white p-2 rounded-lg text-xs max-w-[250px]">
          <p className="font-medium">WebXR Not Available</p>
          <p className="text-xs opacity-90">
            HTTPS: {location.protocol === 'https:' ? '✓' : '✗'}
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
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: xrSupported.vr ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
          opacity: xrSupported.vr ? 1 : 0.6,
          minWidth: '110px',
          minHeight: '44px',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 9999
        }}
      >
        🥽 VR
      </VRButton>
      
      {/* AR Button */}
      <ARButton
        style={{
          padding: '12px 16px',
          backgroundColor: xrSupported.ar 
            ? 'rgba(16, 185, 129, 0.95)' 
            : 'rgba(107, 114, 128, 0.95)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: xrSupported.ar ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
          opacity: xrSupported.ar ? 1 : 0.6,
          minWidth: '110px',
          minHeight: '44px',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 9999
        }}
      >
        📱 AR
      </ARButton>

      {/* Mobile Status Indicator */}
      <div className="bg-gray-900/95 text-gray-300 p-2 rounded-lg text-xs border border-gray-600">
        <div className="flex justify-between">
          <span>WebXR:</span>
          <span>{navigator.xr ? '✅' : '❌'}</span>
        </div>
        <div className="flex justify-between">
          <span>AR:</span>
          <span>{xrSupported.ar ? '✅' : '❌'}</span>
        </div>
      </div>
    </div>
  );
}
