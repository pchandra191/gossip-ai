import React, { useState } from 'react';
import { RotateCcw, MessageSquare, FileText, HelpCircle, Play, Pause, Download } from 'lucide-react';
import { ModerationAction } from '../types';

interface ModerationPanelProps {
  onModerationAction: (action: ModerationAction) => void;
  isActive?: boolean;
  messageCount?: number;
}

export const ModerationPanel: React.FC<ModerationPanelProps> = ({
  onModerationAction,
  isActive = false,
  messageCount = 0
}) => {
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [showClarifyInput, setShowClarifyInput] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [clarifyQuestion, setClarifyQuestion] = useState('');

  const handleChangeTopic = () => {
    if (newTopic.trim()) {
      onModerationAction({ type: 'changeTopic', payload: newTopic.trim() });
      setNewTopic('');
      setShowTopicInput(false);
    }
  };

  const handleClarifyQuestion = () => {
    if (clarifyQuestion.trim()) {
      onModerationAction({ type: 'clarify', payload: clarifyQuestion.trim() });
      setClarifyQuestion('');
      setShowClarifyInput(false);
    }
  };

  const moderationButtons = [
    {
      icon: RotateCcw,
      label: 'Refocus',
      action: () => onModerationAction({ type: 'refocus' }),
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Bring the conversation back on track'
    },
    {
      icon: MessageSquare,
      label: 'Change Topic',
      action: () => setShowTopicInput(true),
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Introduce a new discussion topic'
    },
    {
      icon: FileText,
      label: 'Summarize',
      action: () => onModerationAction({ type: 'summarize' }),
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Get a summary of the discussion'
    },
    {
      icon: HelpCircle,
      label: 'Clarify',
      action: () => setShowClarifyInput(true),
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Ask for clarification on a point'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Moderation Control
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {messageCount} messages
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {moderationButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            disabled={!isActive}
            className={`p-4 rounded-lg text-white transition-all duration-200 ${
              button.color
            } disabled:opacity-50 disabled:cursor-not-allowed group`}
            title={button.description}
          >
            <div className="flex flex-col items-center space-y-2">
              <button.icon size={24} />
              <span className="text-sm font-medium">{button.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => onModerationAction({ type: 'continue' } as ModerationAction)}
          disabled={!isActive || messageCount === 0}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Continue conversation"
        >
          <MessageSquare size={20} />
        </button>
        <button
          onClick={() => onModerationAction({ type: isActive ? 'pause' : 'resume' })}
          disabled={messageCount === 0}
          className={`p-3 rounded-full text-white transition-all duration-200 ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          onClick={() => onModerationAction({ type: 'export' } as ModerationAction)}
          disabled={messageCount === 0}
          className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
        </button>
      </div>

      {/* Topic Input Modal */}
      {showTopicInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Change Topic
            </h3>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter new topic..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTopicInput(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeTopic}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Change Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clarify Question Modal */}
      {showClarifyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Ask for Clarification
            </h3>
            <input
              type="text"
              value={clarifyQuestion}
              onChange={(e) => setClarifyQuestion(e.target.value)}
              placeholder="What would you like clarified?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClarifyInput(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClarifyQuestion}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};