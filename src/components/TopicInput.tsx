import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface TopicInputProps {
  onTopicSubmit: (topic: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  onTopicSubmit,
  disabled = false,
  placeholder = "Enter a topic for the AIs to discuss..."
}) => {
  const [topic, setTopic] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !disabled) {
      onTopicSubmit(topic.trim());
      setTopic('');
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Note: Voice input would require additional implementation
    // For now, this is a UI placeholder
  };

  const suggestedTopics = [
    "Should AI have rights and legal protections?",
    "Is remote work better than traditional office work?",
    "Does pineapple belong on pizza?",
    "Should social media platforms be regulated by government?",
    "Is cryptocurrency the future of money?",
    "Are electric cars really better for the environment?",
    "Should college education be free for everyone?",
    "Is artificial intelligence a threat to humanity?"
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Choose Your Debate Topic
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
          />
          <div className="absolute right-2 top-2 flex space-x-2">
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={disabled}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              type="submit"
              disabled={disabled || !topic.trim()}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Popular Debate Topics:
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedTopics.map((suggestedTopic, index) => (
            <button
              key={index}
              onClick={() => setTopic(suggestedTopic)}
              disabled={disabled}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {suggestedTopic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};