import React from 'react';
import { Moon, Sun, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const settingsGroups = [
    {
      title: 'Appearance',
      settings: [
        {
          key: 'darkMode' as const,
          label: 'Dark Mode',
          icon: settings.darkMode ? Moon : Sun,
          type: 'toggle' as const,
          value: settings.darkMode,
          description: 'Switch between light and dark themes'
        },
        {
          key: 'animationsEnabled' as const,
          label: 'Animations',
          icon: settings.animationsEnabled ? Zap : ZapOff,
          type: 'toggle' as const,
          value: settings.animationsEnabled,
          description: 'Enable smooth animations and transitions'
        }
      ]
    },
    {
      title: 'Audio',
      settings: [
        {
          key: 'voiceEnabled' as const,
          label: 'Voice Output',
          icon: settings.voiceEnabled ? Volume2 : VolumeX,
          type: 'toggle' as const,
          value: settings.voiceEnabled,
          description: 'Enable text-to-speech for AI responses'
        },
        {
          key: 'autoPlay' as const,
          label: 'Auto-play Responses',
          icon: Volume2,
          type: 'toggle' as const,
          value: settings.autoPlay,
          description: 'Automatically play new responses'
        }
      ]
    },
    {
      title: 'Conversation',
      settings: [
        {
          key: 'toneMode' as const,
          label: 'Tone Mode',
          type: 'select' as const,
          value: settings.toneMode,
          options: [
            { value: 'casual', label: 'Casual' },
            { value: 'formal', label: 'Formal' }
          ],
          description: 'Set the overall tone of the conversation'
        },
        {
          key: 'responseDelay' as const,
          label: 'Response Delay',
          type: 'range' as const,
          value: settings.responseDelay,
          min: 1,
          max: 10,
          description: 'Seconds between AI responses'
        }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </h2>
      
      <div className="space-y-8">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {group.title}
            </h3>
            <div className="space-y-4">
              {group.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {setting.icon && <setting.icon size={20} className="text-gray-600 dark:text-gray-400" />}
                    <div>
                      <label className="text-sm font-medium text-gray-800 dark:text-white">
                        {setting.label}
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => updateSetting(setting.key, !setting.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    
                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={(e) => updateSetting(setting.key, e.target.value as any)}
                        className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {setting.type === 'range' && (
                      <div className="flex items-center space-x-3">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          value={setting.value}
                          onChange={(e) => updateSetting(setting.key, Number(e.target.value) as any)}
                          className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                          {setting.value}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};