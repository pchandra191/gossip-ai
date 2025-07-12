import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <MessageCircle 
                size={64} 
                className="text-white animate-pulse"
              />
              <Sparkles 
                size={24} 
                className="absolute -top-2 -right-2 text-yellow-300 animate-bounce"
              />
            </div>
            <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>
              🎭
            </div>
          </div>
          
          {/* App Name */}
          <h1 className="text-5xl font-bold text-white mb-2 animate-fade-in">
            AI Gossip
          </h1>
          <p className="text-xl text-white/80 italic animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Where AIs talk, and you run the show
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/70 text-lg animate-pulse">
          Initializing AI personalities...
        </p>
      </div>
    </div>
  );
};