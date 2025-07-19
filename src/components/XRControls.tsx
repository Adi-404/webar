import { Monitor } from 'lucide-react';

interface XRControlsProps {
  isXRMode: boolean;
  onXRModeChange: (mode: boolean) => void;
}

export function XRControls({ isXRMode, onXRModeChange }: XRControlsProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        <button
          onClick={() => onXRModeChange(false)}
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
        <div className="text-xs text-gray-400 px-2">
          VR/AR buttons are in the 3D viewer
        </div>
      </div>
    </div>
  );
}