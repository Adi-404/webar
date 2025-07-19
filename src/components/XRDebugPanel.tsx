import { useState, useEffect } from 'react';

export function XRDebugPanel() {
  const [xrInfo, setXrInfo] = useState({
    hasNavigatorXR: false,
    isHTTPS: false,
    userAgent: '',
    arSupport: 'checking...',
    vrSupport: 'checking...',
    webXRPolyfill: false
  });

  useEffect(() => {
    const checkXRCapabilities = async () => {
      const hasNavigatorXR = 'xr' in navigator;
      const isHTTPS = location.protocol === 'https:';
      const userAgent = navigator.userAgent;
      
      let arSupport = 'Not supported';
      let vrSupport = 'Not supported';
      
      if (hasNavigatorXR && navigator.xr) {
        try {
          const arAvailable = await navigator.xr.isSessionSupported('immersive-ar');
          arSupport = arAvailable ? 'Supported' : 'Not supported';
        } catch (error) {
          arSupport = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }

        try {
          const vrAvailable = await navigator.xr.isSessionSupported('immersive-vr');
          vrSupport = vrAvailable ? 'Supported' : 'Not supported';
        } catch (error) {
          vrSupport = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      }

      const webXRPolyfill = !!(window as unknown as { WebXRPolyfill?: boolean }).WebXRPolyfill;

      setXrInfo({
        hasNavigatorXR,
        isHTTPS,
        userAgent,
        arSupport,
        vrSupport,
        webXRPolyfill
      });
    };

    checkXRCapabilities();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900/95 text-white p-4 rounded-lg text-xs max-w-sm z-50 backdrop-blur-sm">
      <h3 className="font-bold mb-2 text-blue-300">WebXR Debug Panel</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Navigator.xr:</span>
          <span className={xrInfo.hasNavigatorXR ? 'text-green-400' : 'text-red-400'}>
            {xrInfo.hasNavigatorXR ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>HTTPS:</span>
          <span className={xrInfo.isHTTPS ? 'text-green-400' : 'text-red-400'}>
            {xrInfo.isHTTPS ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>AR Support:</span>
          <span className={xrInfo.arSupport === 'Supported' ? 'text-green-400' : 'text-red-400'}>
            {xrInfo.arSupport === 'Supported' ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>VR Support:</span>
          <span className={xrInfo.vrSupport === 'Supported' ? 'text-green-400' : 'text-red-400'}>
            {xrInfo.vrSupport === 'Supported' ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <p className="text-gray-400">
            Device: {xrInfo.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
          </p>
        </div>

        {!xrInfo.isHTTPS && (
          <div className="mt-2 p-2 bg-orange-500/20 border border-orange-500/40 rounded">
            <p className="text-orange-300 text-xs">
              ⚠️ WebXR requires HTTPS. Run: <code>npm run dev:https</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
