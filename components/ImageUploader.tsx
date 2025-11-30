
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
      <label
        htmlFor={id}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative w-full aspect-square bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-gray-800 transition-all duration-300 overflow-hidden group shadow-inner"
      >
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
        ) : (
          <div className="text-center text-gray-500 group-hover:text-pink-400 transition-colors duration-300">
            <UploadIcon />
            <p className="mt-2">Click or drag & drop to upload</p>
          </div>
        )}
      </label>
    </div>
  );
};
