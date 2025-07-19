import { useState } from 'react';
import { Box, Eye, Boxes } from 'lucide-react';
import { ModelViewer } from './components/ModelViewer';
import { FileUpload } from './components/FileUpload';
import { XRControls } from './components/XRControls';
import { ControlPanel } from './components/ControlPanel';
import { BasicThreeFiberExample } from './components/BasicThreeFiberExample';
import { XRDebugPanel } from './components/XRDebugPanel';

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isXRMode, setIsXRMode] = useState(false);
  const [showBasicExample, setShowBasicExample] = useState(false);

  const handleFileSelect = (url: string, name: string) => {
    setModelUrl(url);
    setFileName(name);
  };

  const handleClearFile = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl(null);
    setFileName('');
  };

  const handleXRModeChange = (mode: boolean) => {
    setIsXRMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">3D Model Viewer</h1>
              <p className="text-gray-300 text-sm">WebXR-enabled • React Three Fiber</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBasicExample(!showBasicExample)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showBasicExample
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Boxes className="h-4 w-4 inline mr-2" />
              {showBasicExample ? 'Advanced Viewer' : 'Basic Example'}
            </button>
            
            <XRControls 
              isXRMode={isXRMode}
              onXRModeChange={handleXRModeChange}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              {showBasicExample ? (
                <>
                  <Boxes className="h-5 w-5" />
                  <span>Basic Example</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  <span>Model Library</span>
                </>
              )}
            </h2>
            
            {showBasicExample ? (
              <>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-4">
                  <h3 className="text-purple-300 font-medium mb-2">React Three Fiber Features</h3>
                  <ul className="text-purple-200 text-sm space-y-1">
                    <li>• Declarative 3D with JSX</li>
                    <li>• React state management</li>
                    <li>• Interactive mesh components</li>
                    <li>• Auto-rotation with useFrame</li>
                    <li>• Click and hover events</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-blue-300 font-medium mb-2">How it works</h3>
                  <p className="text-blue-200 text-sm mb-2">
                    This example shows the core concepts from the React Three Fiber documentation:
                  </p>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• useState for component state</li>
                    <li>• useRef for direct mesh access</li>
                    <li>• useFrame for render loop</li>
                    <li>• Event handlers (onClick, onPointerOver)</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  currentFile={modelUrl}
                  onClearFile={handleClearFile}
                />
                
                {fileName && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-300 text-sm font-medium">
                      ✓ Model loaded successfully
                    </p>
                    <p className="text-green-200 text-xs mt-1">
                      Use mouse/touch controls to interact with the 3D model
                    </p>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-blue-300 font-medium mb-2">XR Features</h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• VR mode for immersive viewing</li>
                    <li>• AR mode for real-world overlay</li>
                    <li>• Hand tracking support</li>
                    <li>• Spatial interactions</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 relative">
          {showBasicExample ? (
            <>
              <BasicThreeFiberExample />
              <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <h3 className="text-white font-medium mb-2">React Three Fiber Basic Example</h3>
                <p className="text-gray-300 text-sm">
                  Click the boxes to scale them. They rotate automatically and change color on hover.
                </p>
              </div>
            </>
          ) : (
            <>
              <ModelViewer 
                modelUrl={modelUrl}
                isXRMode={isXRMode}
                onXRModeChange={handleXRModeChange}
              />
              
              <ControlPanel isXRMode={isXRMode} />
            </>
          )}
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className={`text-sm font-medium ${isXRMode ? 'text-purple-300' : 'text-green-300'}`}>
                {isXRMode ? '🥽 XR Mode' : '🖥️ Desktop Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* XR Debug Panel */}
      <XRDebugPanel />
    </div>
  );
}

export default App;