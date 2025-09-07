
import React from 'react';

interface GeneratedImageGalleryProps {
  images: string[];
  isLoading: boolean;
  progressMessage: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export const GeneratedImageGallery: React.FC<GeneratedImageGalleryProps> = ({ images, isLoading, progressMessage }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl text-center mt-8 p-8 bg-black/20 rounded-xl">
        <LoadingSpinner />
        <p className="text-yellow-300 mt-4 text-lg font-medium">{progressMessage}</p>
        {images.length > 0 && (
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((image, index) => (
                    <div key={index} className="aspect-w-9 aspect-h-16 bg-black/30 rounded-lg animate-pulse"></div>
                ))}
             </div>
        )}
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-3xl font-bold text-center text-yellow-300 mb-8">Kết quả của bạn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg border-2 border-yellow-400/50">
            <img src={image} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <a 
                href={image} 
                download={`quoc-khanh-2-9-${index + 1}.png`}
                className="px-6 py-3 bg-yellow-400 text-red-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Tải Xuống
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
