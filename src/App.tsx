import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { PersonaSelector } from './components/PersonaSelector';
import { TopicInput } from './components/TopicInput';
import { ChatInterface } from './components/ChatInterface';
import { ModerationPanel } from './components/ModerationPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Footer } from './components/Footer';
import { generateAIResponse, validateApiKeys } from './services/aiService';
import { generateMockAIResponse } from './utils/mockAI';
import { Persona, Message, AppSettings, ModerationAction, Conversation, ApiStatus } from './types';
import { Share2, Download } from 'lucide-react';

function App() {
  const [selectedPersonas, setSelectedPersonas] = useState<[Persona | null, Persona | null]>([null, null]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isCheckingApi, setIsCheckingApi] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [nextResponder, setNextResponder] = useState<0 | 1 | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ openai: false, gemini: false, hasAnyKey: false, error: null });
  const [conversationEnded, setConversationEnded] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    voiceEnabled: false,
    animationsEnabled: true,
    toneMode: 'casual',
    autoPlay: false,
    responseDelay: 3
  });

  // App initialization
  useEffect(() => {
    const initializeApp = async () => {
      // Simulate app loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAppLoading(false);
    };
    
    initializeApp();
  }, []);

  // Check API status on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      setIsCheckingApi(true);
      const status = await validateApiKeys();
      setApiStatus(status);
      setIsCheckingApi(false);
    };
    
    if (!isAppLoading) {
      checkApiStatus();
    }
  }, [isAppLoading]);

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handlePersonaSelect = (persona: Persona, slot: 0 | 1) => {
    const newPersonas = [...selectedPersonas] as [Persona | null, Persona | null];
    newPersonas[slot] = persona;
    setSelectedPersonas(newPersonas);
  };

  const handleTopicSubmit = async (topic: string) => {
    if (!selectedPersonas[0] || !selectedPersonas[1]) return;
    
    setCurrentTopic(topic);
    setMessages([]);
    setIsConversationActive(true);
    setConversationEnded(false);
    setNextResponder(0); // Start with first persona
    setIsLoading(true);

    // Start conversation with first persona
    try {
      // Build conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: 'assistant' as const,
        content: msg.content,
        persona: msg.personaId
      }));

      let firstResponse: string;
      
      if (apiStatus.hasAnyKey) {
        firstResponse = await generateAIResponse({
          topic,
          conversationHistory,
          persona: selectedPersonas[0]
        });
      } else {
        firstResponse = await generateMockAIResponse({
          topic,
          conversationHistory,
          persona: selectedPersonas[0]
        });
      }

      const firstMessage: Message = {
        id: Date.now().toString(),
        personaId: selectedPersonas[0].id,
        content: firstResponse,
        timestamp: new Date()
      };

      setMessages([firstMessage]);
      setIsLoading(false);
      setNextResponder(1); // Next response should come from second persona
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating AI response:', error);
    }
  };

  const handleEndConversation = () => {
    setIsConversationActive(false);
    setConversationEnded(true);
    setNextResponder(null);
    setIsLoading(false);
  };

  const handleStartNewConversation = () => {
    setMessages([]);
    setCurrentTopic('');
    setIsConversationActive(false);
    setConversationEnded(false);
    setNextResponder(null);
    setIsLoading(false);
  };

  const getNextResponse = async () => {
    if (!isConversationActive || !selectedPersonas[0] || !selectedPersonas[1] || isLoading || nextResponder === null) return;
    
    setIsLoading(true);
    
    try {
      const nextPersona = selectedPersonas[nextResponder];
      
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: 'assistant' as const,
        content: msg.content,
        persona: msg.personaId
      }));
      
      const lastMessage = messages[messages.length - 1];
      
      let response: string;
      
      if (apiStatus.hasAnyKey) {
        response = await generateAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: nextPersona!,
          isResponse: messages.length > 0,
          previousMessage: lastMessage?.content
        });
      } else {
        response = await generateMockAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: nextPersona!,
          isResponse: messages.length > 0,
          previousMessage: lastMessage?.content
        });
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        personaId: nextPersona!.id,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setNextResponder(nextResponder === 0 ? 1 : 0); // Switch to other persona
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error continuing conversation:', error);
    }
  };

  const handleExportConversation = () => {
    if (messages.length === 0) return;
    
    const conversationData = {
      topic: currentTopic,
      personas: selectedPersonas.map(p => p ? { name: p.name, model: p.model } : null),
      messages: messages.map(msg => ({
        persona: selectedPersonas.find(p => p?.id === msg.personaId)?.name || 'Unknown',
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      })),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-gossip-conversation-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleModerationAction = async (action: ModerationAction) => {
    switch (action.type) {
      case 'pause':
        setIsConversationActive(false);
        break;
      case 'resume':
        setIsConversationActive(true);
        break;
      case 'export':
        handleExportConversation();
        break;
      case 'refocus':
        // Add a refocus instruction to the conversation
        if (selectedPersonas[0] && selectedPersonas[1]) {
          const refocusMessage: Message = {
            id: Date.now().toString(),
            personaId: selectedPersonas[0].id,
            content: "Let me refocus our discussion on the main topic...",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, refocusMessage]);
        }
        break;
      case 'changeTopic':
        if (action.payload) {
          handleTopicSubmit(action.payload);
        }
        break;
      case 'summarize':
        if (selectedPersonas[0]) {
          const summaryMessage: Message = {
            id: Date.now().toString(),
            personaId: selectedPersonas[0].id,
            content: "To summarize our discussion so far: we've covered the main points about " + currentTopic + " and explored different perspectives on this topic.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, summaryMessage]);
        }
        break;
      case 'clarify':
        if (action.payload && selectedPersonas[1]) {
          const clarifyMessage: Message = {
            id: Date.now().toString(),
            personaId: selectedPersonas[1].id,
            content: `Good question! Let me clarify: ${action.payload}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, clarifyMessage]);
        }
        break;
      default:
        break;
    }
  };

  const canStartConversation = selectedPersonas[0] && selectedPersonas[1];

  if (isAppLoading) {
    return <LoadingScreen isLoading={isAppLoading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar 
        onSettingsClick={() => setShowSettings(!showSettings)} 
        onAboutClick={() => setShowAbout(!showAbout)}
        apiStatus={apiStatus} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">          
          {/* Quick Start Guide */}
          {!apiStatus.hasAnyKey && !isCheckingApi && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                🚀 Quick Start Guide
              </h3>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <p><strong>Step 1:</strong> Choose two different debater personalities below</p>
                <p><strong>Step 2:</strong> Enter a debate topic or select from suggestions</p>
                <p><strong>Step 3:</strong> Watch the AI debate unfold!</p>
                <p className="text-xs mt-3 opacity-75">
                  Currently running in demo mode. For real AI responses, configure your OpenAI API key in the .env file.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => {/* Handle export */}}
              disabled={messages.length === 0}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              <Download size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => {/* Handle share */}}
              disabled={messages.length === 0}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        )}
        
        {/* About Panel */}
        {showAbout && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">About AI Gossip</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  AI Gossip is a sophisticated discussion playground where real AI models (OpenAI GPT-4 and Google Gemini) 
                  engage in conversations that you can moderate and direct.
                </p>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Features</h3>
                <ul className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                  <li>• Real AI Conversations between OpenAI's GPT-4 and Google's Gemini</li>
                  <li>• 6 Unique Personas with distinct personalities and response styles</li>
                  <li>• Manual Conversation Control - you decide when each AI responds</li>
                  <li>• Professional Interface with podcast studio aesthetics</li>
                  <li>• Advanced Settings including dark mode and response timing</li>
                  <li>• Export & Share conversation transcripts</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Developer</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Prabhat Chandra</strong><br/>
                    Full Stack Developer & AI Enthusiast<br/>
                    Email: <a href="mailto:pchandra114@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">pchandra114@gmail.com</a><br/>
                    GitHub: <a href="https://github.com/pchandra191" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">@pchandra191</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup */}
          <div className="space-y-6">
            {/* Overlay for disabled state */}
            {(isConversationActive || isLoading) && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 bg-opacity-75 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Conversation in Progress
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    End the current conversation to start a new one
                  </p>
                </div>
              </div>
            )}
            
            <PersonaSelector
              selectedPersonas={selectedPersonas}
              onPersonaSelect={handlePersonaSelect}
              disabled={isConversationActive || isLoading}
              apiStatus={apiStatus}
            />
            
            <TopicInput
              onTopicSubmit={handleTopicSubmit}
              disabled={!canStartConversation || isConversationActive || isLoading}
              placeholder={
                !canStartConversation && !isConversationActive
                  ? "Select both debaters first..."
                  : isConversationActive
                  ? "Conversation in progress..."
                  : "Enter a topic for the debate..."
              }
            />
          </div>

          {/* Center Column - Chat */}
          <div className="lg:col-span-2 relative">
            <ChatInterface
              messages={messages}
              personas={selectedPersonas}
              isLoading={isLoading}
              darkMode={settings.darkMode}
            />
          </div>
        </div>

        {/* Bottom Row - Moderation */}
        <div className="mt-8">
          <ModerationPanel
            onModerationAction={handleModerationAction}
            onGetNextResponse={getNextResponse}
            onEndConversation={handleEndConversation}
            onStartNewConversation={handleStartNewConversation}
            isActive={isConversationActive}
            conversationEnded={conversationEnded}
            messageCount={messages.length}
            nextResponder={nextResponder}
            personas={selectedPersonas}
            isLoading={isLoading}
            currentTopic={currentTopic}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;