
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageGallery } from './components/GeneratedImageGallery';
import { Footer } from './components/Footer';
import { detectGender, generateHolidayImage } from './services/geminiService';
import { toBase64 } from './utils/fileUtils';
import type { Gender, Location } from './types';
import { LOCATIONS } from './constants';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setGeneratedImages([]);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải lên một hình ảnh trước.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    
    try {
      setProgressMessage('Đang chuyển đổi hình ảnh...');
      const { base64Data, mimeType } = await toBase64(uploadedImage);

      setProgressMessage('Đang phân tích hình ảnh...');
      const gender = await detectGender(base64Data, mimeType);

      if (gender !== 'Male' && gender !== 'Female') {
          throw new Error('Không thể xác định giới tính từ hình ảnh. Vui lòng thử một ảnh rõ hơn.');
      }
      
      const newImages: string[] = [];
      for (let i = 0; i < LOCATIONS.length; i++) {
        const location = LOCATIONS[i];
        setProgressMessage(`Đang tạo ảnh ${i + 1}/${LOCATIONS.length}: ${location.name}...`);
        
        const generatedImage = await generateHolidayImage(base64Data, mimeType, gender as Gender, location);
        
        if(generatedImage) {
            newImages.push(generatedImage);
            setGeneratedImages([...newImages]);
        }
      }
      setProgressMessage('Hoàn tất!');

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
      setProgressMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20">
          <p className="text-center text-yellow-300 mb-6 text-lg md:text-xl">
            Tải lên ảnh chân dung của bạn để AI tạo ra những khoảnh khắc hào hùng mừng Quốc Khánh 2/9 tại Hà Nội!
          </p>
          
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            preview={uploadedImagePreview}
            isLoading={isLoading}
          />

          <div className="mt-6 text-center">
            <button
              onClick={handleGenerateClick}
              disabled={!uploadedImage || isLoading}
              className="px-8 py-4 bg-yellow-400 text-red-900 font-bold text-xl rounded-lg shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Đang Xử Lý...' : 'Tạo Ảnh Ngay!'}
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>

        <GeneratedImageGallery 
          images={generatedImages}
          isLoading={isLoading}
          progressMessage={progressMessage}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
