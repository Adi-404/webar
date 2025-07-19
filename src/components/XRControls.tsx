import { Monitor } from 'lucide-react';
import { VRButton, ARButton } from '@react-three/xr';

interface XRControlsProps {
  isXRMode: boolean;
  onXRModeChange: (mode: boolean) => void;
  onXRTypeChange?: (type: 'ar' | 'vr' | 'none') => void;
  xrSupported?: { ar: boolean; vr: boolean };
}

export function XRControls({ isXRMode, onXRModeChange, onXRTypeChange, xrSupported = { ar: false, vr: false } }: XRControlsProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        <button
          onClick={() => {
            onXRModeChange(false);
            onXRTypeChange?.('none');
          }}
          className={`
            p-2 rounded-md transition-all duration-200 flex items-center space-x-2
            ${!isXRMode 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          <Monitor className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:block">Desktop</span>
        </button>
        
        {/* Note: VR/AR buttons are now inside the 3D viewer */}
        <div className="flex items-center space-x-2">
          {/* VR Button */}
          <VRButton 
            onSelect={() => {
              console.log('VR button clicked');
              onXRTypeChange?.('vr');
              onXRModeChange(true);
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: xrSupported.vr 
                ? 'rgba(59, 130, 246, 0.95)' 
                : 'rgba(107, 114, 128, 0.95)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: xrSupported.vr ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: xrSupported.vr ? 1 : 0.6,
              minHeight: '36px',
              minWidth: '80px',
              justifyContent: 'center'
            }}
          >
            🥽 VR
          </VRButton>
          
          {/* AR Button */}
          <ARButton 
            onSelect={() => {
              console.log('AR button clicked');
              onXRTypeChange?.('ar');
              onXRModeChange(true);
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: xrSupported.ar 
                ? 'rgba(16, 185, 129, 0.95)' 
                : 'rgba(107, 114, 128, 0.95)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: xrSupported.ar ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: xrSupported.ar ? 1 : 0.6,
              minHeight: '36px',
              minWidth: '80px',
              justifyContent: 'center'
            }}
          >
            📱 AR
          </ARButton>
        </div>
      </div>
    </div>
  );
}