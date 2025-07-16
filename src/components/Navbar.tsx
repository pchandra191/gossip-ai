import React, { useState } from 'react';
import { Settings, Info, Github, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onSettingsClick: () => void;
  onAboutClick: () => void;
  apiStatus: { openai: boolean; gemini: boolean; hasAnyKey: boolean; error: string | null };
}

export const Navbar: React.FC<NavbarProps> = ({ onSettingsClick, onAboutClick, apiStatus }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      label: 'Settings',
      icon: Settings,
      onClick: onSettingsClick,
      description: 'Configure app preferences'
    },
    {
      label: 'About',
      icon: Info,
      onClick: onAboutClick,
      description: 'Learn more about AI Gossip'
    },
    {
      label: 'GitHub',
      icon: Github,
      onClick: () => {
        window.open('https://github.com', '_blank');
      },
      description: 'View source code'
    }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Logo size="sm" />

          {/* API Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.openai ? 'bg-green-500' : 'bg-red-500'
                }`} title="OpenAI Status"></div>
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.gemini ? 'bg-green-500' : 'bg-red-500'
                }`} title="Gemini Status"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {apiStatus.hasAnyKey ? 'API Connected' : 'Demo Mode'}
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={item.description}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {/* API Status Mobile */}
            <div className="flex items-center justify-center space-x-2 mb-4 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg mx-4">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.openai ? 'bg-green-500' : 'bg-red-500'
                }`} title="OpenAI Status"></div>
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.gemini ? 'bg-green-500' : 'bg-red-500'
                }`} title="Gemini Status"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {apiStatus.hasAnyKey ? 'API Connected' : 'Demo Mode'}
              </span>
            </div>

            {/* Menu Items */}
            <div className="space-y-2 px-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon size={20} />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};