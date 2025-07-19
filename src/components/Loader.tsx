import { Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-xl backdrop-blur-sm">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
        <p className="text-white font-medium">Loading 3D model...</p>
        <p className="text-gray-300 text-sm mt-1">Please wait while we process your file</p>
      </div>
    </Html>
  );
}