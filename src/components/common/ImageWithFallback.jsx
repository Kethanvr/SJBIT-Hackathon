import React from 'react';
import { FiImage } from 'react-icons/fi';

const ImageWithFallback = ({ src, alt, className = '', fallbackSrc = "/assests/Mediscan-qr.jpg" }) => (
  src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={e => {
        e.target.onerror = null;
        e.target.src = fallbackSrc;
      }}
    />
  ) : (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
      <FiImage className="w-8 h-8 text-gray-400" />
    </div>
  )
);

export default ImageWithFallback;
