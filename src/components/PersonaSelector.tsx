import React from 'react';
import { Persona } from '../types';
import { personas } from '../data/personas';

interface PersonaSelectorProps {
  selectedPersonas: [Persona | null, Persona | null];
  onPersonaSelect: (persona: Persona, slot: 0 | 1) => void;
  disabled?: boolean;
  apiStatus: { openai: boolean; gemini: boolean; hasAnyKey: boolean; error: string | null };
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonas,
  onPersonaSelect,
  disabled = false,
  apiStatus
}) => {
  const isPersonaSelected = (persona: Persona) => {
    return selectedPersonas[0]?.id === persona.id || selectedPersonas[1]?.id === persona.id;
  };

  const getAvailablePersonas = (slot: 0 | 1) => {
    const otherSlot = slot === 0 ? 1 : 0;
    const otherPersona = selectedPersonas[otherSlot];
    
    // Filter personas based on slot and API availability
    const availablePersonas = personas.filter(persona => {
      // Don't show if already selected in other slot
      if (otherPersona && persona.id === otherPersona.id) return false;
      
      // For slot 0 (ChatGPT side), show OpenAI personas
      if (slot === 0) return persona.model === 'openai';
      
      // For slot 1 (Gemini side), show Gemini personas
      if (slot === 1) return persona.model === 'gemini';
      
      return true;
    });
    
    return availablePersonas;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Choose Your Debaters
      </h2>
      
      {!apiStatus.hasAnyKey && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ API Configuration Required
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            To use real AI debates, configure your API keys in the .env file:
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 font-mono">
            VITE_OPENAI_API_KEY=your_openai_key
            <br />
            VITE_GEMINI_API_KEY=your_gemini_key
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
            Without an API key, the app will use mock responses for demonstration.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debater 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg relative">
            <h3 className="text-xl font-semibold text-white">OpenAI GPT-4</h3>
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
              apiStatus.openai ? 'bg-green-400' : 'bg-red-400'
            }`} title={apiStatus.openai ? 'Connected' : 'Not Connected'}></div>
          </div>
          
          {selectedPersonas[0] && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-blue-500">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{selectedPersonas[0].avatar}</span>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{selectedPersonas[0].name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPersonas[0].description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPersonas[0].traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            {getAvailablePersonas(0).map((persona) => (
              <button
                key={persona.id}
                onClick={() => onPersonaSelect(persona, 0)}
                disabled={disabled || isPersonaSelected(persona)}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${
                  selectedPersonas[0]?.id === persona.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                } ${disabled || isPersonaSelected(persona) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{persona.avatar}</span>
                  <div>
                    <div className="font-medium">{persona.name}</div>
                    <div className="text-sm opacity-75">{persona.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Debater 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg relative">
            <h3 className="text-xl font-semibold text-white">Google Gemini</h3>
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
              apiStatus.gemini ? 'bg-green-400' : 'bg-red-400'
            }`} title={apiStatus.gemini ? 'Connected' : 'Not Connected'}></div>
          </div>
          
          {selectedPersonas[1] && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-green-500">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{selectedPersonas[1].avatar}</span>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{selectedPersonas[1].name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPersonas[1].description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPersonas[1].traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2">
            {getAvailablePersonas(1).map((persona) => (
              <button
                key={persona.id}
                onClick={() => onPersonaSelect(persona, 1)}
                disabled={disabled || isPersonaSelected(persona)}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${
                  selectedPersonas[1]?.id === persona.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
                } ${disabled || isPersonaSelected(persona) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{persona.avatar}</span>
                  <div>
                    <div className="font-medium">{persona.name}</div>
                    <div className="text-sm opacity-75">{persona.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};