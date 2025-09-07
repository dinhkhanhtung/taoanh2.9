
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  preview: string | null;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, preview, isLoading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!isLoading && event.dataTransfer.files && event.dataTransfer.files[0]) {
        onImageUpload(event.dataTransfer.files[0]);
    }
  }, [isLoading, onImageUpload]);

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`
          mt-2 flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2
          border-yellow-300/50 border-dashed rounded-md transition-all duration-300
          ${preview ? 'p-0' : ''}
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
          hover:border-yellow-300
        `}
      >
        {preview ? (
          <img src={preview} alt="Xem trước" className="max-h-full h-full w-auto object-contain rounded-md" />
        ) : (
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-yellow-300/80" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-yellow-100/90">
              <p className="pl-1">Tải ảnh lên hoặc kéo và thả</p>
            </div>
            <p className="text-xs text-yellow-200/60">Chấp nhận PNG, JPG, WEBP</p>
          </div>
        )}
      </label>
      <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isLoading}/>
    </div>
  );
};
