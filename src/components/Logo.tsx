import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        {/* Main logo container with gradient background */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}>
          <MessageCircle 
            size={iconSizes[size]} 
            className="text-white" 
          />
        </div>
        
        {/* Sparkle accent */}
        <div className="absolute -top-1 -right-1">
          <Sparkles 
            size={size === 'sm' ? 12 : size === 'md' ? 14 : 18} 
            className="text-yellow-400 drop-shadow-sm" 
          />
        </div>
        
        {/* Animated pulse ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-20 animate-ping`}></div>
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            AI Gossip
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Where AIs talk, you run the show
            </p>
          )}
        </div>
      )}
    </div>
  );
};