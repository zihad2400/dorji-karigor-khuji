'use client';
import { FiUser } from 'react-icons/fi';
import { FaFemale, FaMale } from 'react-icons/fa';

export default function ProfileAvatar({ gender, size = 'large', className = '' }) {
  const isFemale = gender === 'female' || gender === 'মহিলা';
  const isMale = gender === 'male' || gender === 'পুরুষ';

  const sizeClass = size === 'large' ? 'w-28 h-28' : size === 'medium' ? 'w-16 h-16' : 'w-10 h-10';
  const iconSize = size === 'large' ? 48 : size === 'medium' ? 28 : 18;

  return (
    <div className={`${sizeClass} rounded-full border-4 relative z-10 flex items-center justify-center ${className} ${
      isFemale 
        ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-pink-500/50 text-pink-400' 
        : isMale 
          ? 'bg-gradient-to-br from-blue-500/20 to-teal-600/20 border-blue-500/50 text-blue-400'
          : 'bg-gray-800 border-primary text-gray-400'
    }`}>
      {isFemale ? (
        <FaFemale size={iconSize} />
      ) : isMale ? (
        <FaMale size={iconSize} />
      ) : (
        <FiUser size={iconSize} />
      )}
    </div>
  );
}
