import React, { useEffect, useRef } from 'react';
import { Message, Persona } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  personas: [Persona | null, Persona | null];
  isLoading?: boolean;
  darkMode?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  personas,
  isLoading = false,
  darkMode = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPersonaByMessage = (message: Message): Persona | null => {
    return personas.find(p => p?.id === message.personaId) || null;
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Ready for the Show?
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Select your AI debaters and give them a topic to discuss!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-96 flex flex-col">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🎙️</span>
            Live Discussion
          </h2>
          <div className="text-white text-sm">
            {messages.length} messages
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const persona = getPersonaByMessage(message);
          if (!persona) return null;

          const isFirstPersona = persona.id === personas[0]?.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isFirstPersona ? 'justify-start' : 'justify-end'} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  isFirstPersona ? 'mr-auto' : 'ml-auto'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">{persona.avatar}</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {persona.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                    {persona.model.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isFirstPersona
                      ? 'bg-blue-500 text-white rounded-tl-none'
                      : 'bg-green-500 text-white rounded-tr-none'
                  }`}
                  style={{
                    backgroundColor: isFirstPersona ? personas[0]?.color : personas[1]?.color
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};