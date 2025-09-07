
import React from 'react';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="py-6 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center gap-4">
          <StarIcon className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
          <h1 className="text-3xl md:text-5xl font-black text-yellow-300 tracking-tight text-shadow">
            Hào Khí Việt Nam
          </h1>
          <StarIcon className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
        </div>
        <p className="text-yellow-100/80 mt-2 text-md md:text-lg">
          Tạo ảnh mừng Quốc Khánh 02/09
        </p>
      </div>
    </header>
  );
};
