import { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (url: string, filename: string) => void;
  currentFile: string | null;
  onClearFile: () => void;
}

export function FileUpload({ onFileSelect, currentFile, onClearFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = (file: File) => {
    if (file.name.toLowerCase().endsWith('.obj')) {
      const url = URL.createObjectURL(file);
      setFileName(file.name);
      onFileSelect(url, file.name);
    } else {
      alert('Please select a .obj file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClear = () => {
    setFileName('');
    onClearFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4">
      {!currentFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-indigo-400 bg-indigo-500/10' 
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".obj"
            className="hidden"
            onChange={handleInputChange}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Upload 3D Model
          </h3>
          <p className="text-gray-300 mb-4">
            Drag and drop your .obj file here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports .obj format • Max file size: 50MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-indigo-400" />
            <span className="text-white font-medium">{fileName}</span>
          </div>
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}