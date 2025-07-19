import { Html } from '@react-three/drei';

interface XRHelpIndicatorProps {
  isXRMode: boolean;
  modelLoaded: boolean;
}

export function XRHelpIndicator({ isXRMode, modelLoaded }: XRHelpIndicatorProps) {
  if (!isXRMode || !modelLoaded) return null;

  return (
    <Html position={[0, 2, 0]} center>
      <div className="bg-blue-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-center">
        <div className="text-sm font-medium">🎮 XR Controls Active</div>
        <div className="text-xs mt-1 opacity-90">
          Trigger to grab • Grip to scale • Move around to explore
        </div>
      </div>
    </Html>
  );
}
