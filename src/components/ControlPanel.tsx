import { useState } from 'react';
import { Settings, RotateCcw, ZoomIn, Move, Eye, Hand } from 'lucide-react';

interface ControlPanelProps {
  isXRMode: boolean;
}

export function ControlPanel({ isXRMode }: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-4 left-4">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-white hover:text-indigo-300 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">
            {isXRMode ? 'XR Controls' : 'Controls'}
          </span>
        </button>
        
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {isXRMode ? (
              <div className="text-sm text-gray-300 space-y-2">
                <div className="text-white font-medium mb-3">XR Interaction Guide</div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span>Look around to view the model</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hand className="h-4 w-4 text-green-400" />
                  <span>Point and click trigger to grab & move</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="h-4 w-4 text-purple-400" />
                  <span>Squeeze grip buttons to scale up/down</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-orange-400" />
                  <span>Walk around for different angles</span>
                </div>
                <div className="mt-3 p-2 bg-blue-500/20 rounded text-xs text-blue-200">
                  💡 Use your VR controllers to grab and manipulate the model in 3D space
                </div>
                <div className="mt-2 p-2 bg-green-500/20 rounded text-xs text-green-200">
                  🎮 Trigger = Grab/Move • Grip = Scale • Move around = Different views
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Move className="h-4 w-4" />
                  <span>Left click + drag to rotate</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <ZoomIn className="h-4 w-4" />
                  <span>Scroll to zoom</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Right click + drag to pan</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}