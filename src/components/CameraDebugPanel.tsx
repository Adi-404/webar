import { useState, useEffect } from 'react';

interface CameraInfo {
  hasGetUserMedia: boolean;
  cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  videoDevices: MediaDeviceInfo[];
  webXRSupport: {
    ar: boolean;
    vr: boolean;
    error?: string;
  };
  userAgent: string;
  isAndroid: boolean;
  isMobile: boolean;
  protocol: string;
  cameraTestResult?: 'success' | 'failed' | 'testing';
  errors: string[];
}

export function CameraDebugPanel() {
  const [cameraInfo, setCameraInfo] = useState<CameraInfo>({
    hasGetUserMedia: false,
    cameraPermission: 'unknown',
    videoDevices: [],
    webXRSupport: { ar: false, vr: false },
    userAgent: '',
    isAndroid: false,
    isMobile: false,
    protocol: '',
    errors: []
  });

  const [testingCamera, setTestingCamera] = useState(false);

  useEffect(() => {
    checkCameraCapabilities();
  }, []);

  const checkCameraCapabilities = async () => {
    const errors: string[] = [];
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    const protocol = location.protocol;

    // Check getUserMedia support
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    // Check camera permission
    let cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown' = 'unknown';
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        cameraPermission = permission.state as 'granted' | 'denied' | 'prompt';
      }
    } catch (error) {
      errors.push(`Permission check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get video devices
    let videoDevices: MediaDeviceInfo[] = [];
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');
      }
    } catch (error) {
      errors.push(`Device enumeration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check WebXR support
    let webXRSupport: { ar: boolean; vr: boolean; error?: string } = { ar: false, vr: false };
    try {
      if (navigator.xr) {
        const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
        const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
        webXRSupport = { ar: arSupported, vr: vrSupported };
      } else {
        webXRSupport = { ar: false, vr: false, error: 'navigator.xr not available' };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown WebXR error';
      webXRSupport = { ar: false, vr: false, error: errorMsg };
      errors.push(`WebXR check failed: ${errorMsg}`);
    }

    setCameraInfo({
      hasGetUserMedia,
      cameraPermission,
      videoDevices,
      webXRSupport,
      userAgent,
      isAndroid,
      isMobile,
      protocol,
      errors
    });
  };

  const testCameraAccess = async () => {
    setTestingCamera(true);
    const updatedInfo = { ...cameraInfo };
    
    try {
      console.log('Testing camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera for AR
        } 
      });
      
      console.log('Camera access successful!', stream);
      updatedInfo.cameraTestResult = 'success';
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Camera access failed:', error);
      updatedInfo.cameraTestResult = 'failed';
      const errorMsg = error instanceof Error ? error.message : 'Unknown camera error';
      updatedInfo.errors = [...updatedInfo.errors, `Camera test failed: ${errorMsg}`];
    }
    
    setCameraInfo(updatedInfo);
    setTestingCamera(false);
  };

  const clearErrors = () => {
    setCameraInfo(prev => ({ ...prev, errors: [], cameraTestResult: undefined }));
  };

  return (
    <div className="fixed bottom-2 right-2 bg-gray-900/95 text-white p-3 rounded-lg text-xs max-w-[320px] z-50 backdrop-blur-sm border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-blue-300">Camera Debug</h3>
        <button 
          onClick={clearErrors}
          className="text-gray-400 hover:text-white text-xs"
        >
          Clear
        </button>
      </div>
      
      <div className="space-y-1">
        {/* Device Info */}
        <div className="bg-gray-800/50 p-2 rounded">
          <p className="text-yellow-300 font-medium">Device Info:</p>
          <p>Android: {cameraInfo.isAndroid ? '✅' : '❌'}</p>
          <p>Mobile: {cameraInfo.isMobile ? '✅' : '❌'}</p>
          <p>HTTPS: {cameraInfo.protocol === 'https:' ? '✅' : '❌'}</p>
        </div>

        {/* Camera Capabilities */}
        <div className="bg-gray-800/50 p-2 rounded">
          <p className="text-green-300 font-medium">Camera:</p>
          <p>getUserMedia: {cameraInfo.hasGetUserMedia ? '✅' : '❌'}</p>
          <p>Permission: <span className={
            cameraInfo.cameraPermission === 'granted' ? 'text-green-400' :
            cameraInfo.cameraPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
          }>{cameraInfo.cameraPermission}</span></p>
          <p>Video Devices: {cameraInfo.videoDevices.length}</p>
        </div>

        {/* WebXR Support */}
        <div className="bg-gray-800/50 p-2 rounded">
          <p className="text-purple-300 font-medium">WebXR:</p>
          <p>Navigator.xr: {navigator.xr ? '✅' : '❌'}</p>
          <p>AR Support: {cameraInfo.webXRSupport.ar ? '✅' : '❌'}</p>
          <p>VR Support: {cameraInfo.webXRSupport.vr ? '✅' : '❌'}</p>
          {cameraInfo.webXRSupport.error && (
            <p className="text-red-400 text-xs">Error: {cameraInfo.webXRSupport.error}</p>
          )}
        </div>

        {/* Camera Test */}
        <div className="bg-gray-800/50 p-2 rounded">
          <div className="flex justify-between items-center">
            <p className="text-orange-300 font-medium">Camera Test:</p>
            <button
              onClick={testCameraAccess}
              disabled={testingCamera}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-2 py-1 rounded text-xs"
            >
              {testingCamera ? 'Testing...' : 'Test Camera'}
            </button>
          </div>
          {cameraInfo.cameraTestResult && (
            <p className={`text-xs mt-1 ${
              cameraInfo.cameraTestResult === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {cameraInfo.cameraTestResult === 'success' ? '✅ Camera access successful' : '❌ Camera access failed'}
            </p>
          )}
        </div>

        {/* Errors */}
        {cameraInfo.errors.length > 0 && (
          <div className="bg-red-900/50 p-2 rounded">
            <p className="text-red-300 font-medium">Errors:</p>
            {cameraInfo.errors.map((error, index) => (
              <p key={index} className="text-red-200 text-xs">{error}</p>
            ))}
          </div>
        )}

        {/* Android-specific instructions */}
        {cameraInfo.isAndroid && (
          <div className="bg-blue-900/50 p-2 rounded">
            <p className="text-blue-300 font-medium text-xs">Android Tips:</p>
            <ul className="text-blue-200 text-xs space-y-1">
              <li>• Ensure Chrome is updated</li>
              <li>• Allow camera permissions</li>
              <li>• Try Chrome flags: enable-webxr</li>
              <li>• Use rear camera for AR</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
