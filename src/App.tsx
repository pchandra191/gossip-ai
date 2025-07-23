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
import { Persona, Message, AppSettings, ModerationAction, Conversation } from './types';
import { Share2, Download } from 'lucide-react';
import { GoogleAd } from './components/GoogleAd';

function App() {
  const [selectedPersonas, setSelectedPersonas] = useState<[Persona | null, Persona | null]>([null, null]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isCheckingApi, setIsCheckingApi] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiStatus, setApiStatus] = useState({ openai: false, hasAnyKey: false, error: null });
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    voiceEnabled: false,
    animationsEnabled: true,
    toneMode: 'casual',
    autoPlay: true,
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

      // Follow up with second persona
      setTimeout(async () => {
        if (!isConversationActive) return; // Check if still active
        
        setIsLoading(true);
        
        const updatedHistory = [...conversationHistory, {
          role: 'assistant' as const,
          content: firstResponse,
          persona: selectedPersonas[0]!.id
        }];
        
        let secondResponse: string;
        
        if (apiStatus.hasAnyKey) {
          secondResponse = await generateAIResponse({
            topic,
            conversationHistory: updatedHistory,
            persona: selectedPersonas[1]!,
            isResponse: true,
            previousMessage: firstResponse
          });
        } else {
          secondResponse = await generateMockAIResponse({
            topic,
            conversationHistory: updatedHistory,
            persona: selectedPersonas[1]!,
            isResponse: true,
            previousMessage: firstResponse
          });
        }

        const secondMessage: Message = {
          id: (Date.now() + 1).toString(),
          personaId: selectedPersonas[1]!.id,
          content: secondResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, secondMessage]);
        setIsLoading(false);
        
        // Continue conversation automatically if autoPlay is enabled
        if (settings.autoPlay && isConversationActive && messages.length >= 2) {
          setTimeout(() => {
            continueConversation();
          }, (settings.responseDelay + 1) * 1000);
        }
      }, settings.responseDelay * 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating AI response:', error);
    }
  };

  const continueConversation = async () => {
    if (!isConversationActive || !selectedPersonas[0] || !selectedPersonas[1] || messages.length === 0 || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Determine which persona should respond next
      const lastMessage = messages[messages.length - 1];
      const nextPersona = lastMessage.personaId === selectedPersonas[0].id ? selectedPersonas[1] : selectedPersonas[0];
      
      // Build conversation history
      const conversationHistory = messages.map(msg => ({
        role: 'assistant' as const,
        content: msg.content,
        persona: msg.personaId
      }));
      
     let response: string;
     
     if (apiStatus.hasAnyKey) {
       response = await generateAIResponse({
         topic: currentTopic,
         conversationHistory,
         persona: nextPersona!,
         isResponse: true,
         previousMessage: lastMessage.content
       });
     } else {
       response = await generateMockAIResponse({
         topic: currentTopic,
         conversationHistory,
         persona: nextPersona!,
         isResponse: true,
         previousMessage: lastMessage.content
       });
     }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        personaId: nextPersona!.id,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
      
      // Continue the conversation if autoPlay is still enabled
      if (settings.autoPlay && isConversationActive) {
        setTimeout(() => {
          continueConversation();
        }, (settings.responseDelay + Math.random() * 2) * 1000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error continuing conversation:', error);
    }
  };

  const handleModerationAction = async (action: ModerationAction) => {
    switch (action.type) {
      case 'continue':
        if (isConversationActive && !isLoading) {
          continueConversation();
        }
        break;
      case 'pause':
        setIsConversationActive(false);
        break;
      case 'resume':
        setIsConversationActive(true);
        // Resume conversation if autoPlay is enabled
        if (settings.autoPlay) {
          setTimeout(() => {
            continueConversation();
          }, 1000);
        }
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
      <Navbar onSettingsClick={() => setShowSettings(!showSettings)} apiStatus={apiStatus} />
      
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

        {/* Google Ad - Below Welcome Section */}
        <div className="my-6">
          <GoogleAd
            client="ca-pub-XXXXXXXXXXXXXXXX"
            slot="1234567890"
            format="auto"
            responsive={true}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup */}
          <div className="space-y-6">
            <PersonaSelector
              selectedPersonas={selectedPersonas}
              onPersonaSelect={handlePersonaSelect}
              disabled={isConversationActive}
              apiStatus={apiStatus}
            />
            
            <TopicInput
              onTopicSubmit={handleTopicSubmit}
              disabled={!canStartConversation}
              placeholder={
                !canStartConversation 
                  ? "Select both debaters first..."
                  : "Enter a topic for the debate..."
              }
            />
          </div>

          {/* Center Column - Chat */}
          <div className="lg:col-span-2">
            <ChatInterface
              messages={messages}
              personas={selectedPersonas}
              isLoading={isLoading}
              darkMode={settings.darkMode}
            />
          </div>
        </div>

        {/* Google Ad - Between Main Content and Moderation Panel */}
        <div className="my-6">
          <GoogleAd
            client="ca-pub-XXXXXXXXXXXXXXXX"
            slot="2345678901"
            format="horizontal"
            responsive={true}
          />
        </div>

        {/* Bottom Row - Moderation */}
        {(messages.length > 0 || isConversationActive) && (
          <div className="mt-8">
            <ModerationPanel
              onModerationAction={handleModerationAction}
              isActive={isConversationActive}
              messageCount={messages.length}
            />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default App;