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
import GoogleAd from './components/GoogleAd';
import myImage from './assets/pc-fast.gif';

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
        await handleRefocusConversation();
        break;
      case 'changeTopic':
        if (action.payload) {
          handleTopicSubmit(action.payload);
        }
        break;
      case 'summarize':
        await handleSummarizeConversation();
        break;
      case 'clarify':
        if (action.payload) {
          await handleClarifyQuestion(action.payload);
        }
        break;
      default:
        break;
    }
  };

  const handleRefocusConversation = async () => {
    if (!selectedPersonas[0] || messages.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const conversationHistory = messages.map(msg => ({
        role: 'assistant' as const,
        content: msg.content,
        persona: msg.personaId
      }));

      const refocusPrompt = `Please refocus our discussion back to the main topic: "${currentTopic}". Acknowledge that we may have strayed and bring us back on track.`;
      
      let response: string;
      
      if (apiStatus.hasAnyKey) {
        response = await generateAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: selectedPersonas[0],
          isResponse: true,
          previousMessage: refocusPrompt
        });
      } else {
        response = await generateMockAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: selectedPersonas[0],
          isResponse: true,
          previousMessage: refocusPrompt
        });
      }
      
      const refocusMessage: Message = {
        id: Date.now().toString(),
        personaId: selectedPersonas[0].id,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, refocusMessage]);
      setNextResponder(1); // Next response from second persona
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error refocusing conversation:', error);
    }
  };

  const handleSummarizeConversation = async () => {
    if (!selectedPersonas[0] || messages.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Create a comprehensive summary of the conversation
      const conversationText = messages.map((msg, index) => {
        const persona = selectedPersonas.find(p => p?.id === msg.personaId);
        return `${persona?.name || 'Unknown'}: ${msg.content}`;
      }).join('\n\n');
      
      const summaryPrompt = `Please provide a comprehensive point-wise summary of our discussion about "${currentTopic}". 
      
Here's our conversation so far:
${conversationText}

Please summarize this in the following format:

## Discussion Summary: ${currentTopic}

### Key Points Discussed:
• [Point 1]
• [Point 2]
• [Point 3]

### Different Perspectives:
• [Perspective 1]
• [Perspective 2]

### Main Arguments:
• [Argument 1]
• [Argument 2]

### Conclusions/Insights:
• [Insight 1]
• [Insight 2]

Keep it concise but comprehensive, focusing on the main ideas and different viewpoints presented.`;
      
      let response: string;
      
      if (apiStatus.hasAnyKey) {
        response = await generateAIResponse({
          topic: currentTopic,
          conversationHistory: [],
          persona: selectedPersonas[0],
          isResponse: true,
          previousMessage: summaryPrompt
        });
      } else {
        // Mock summary for demo mode
        response = `## Discussion Summary: ${currentTopic}

### Key Points Discussed:
• We explored different aspects of ${currentTopic}
• Various perspectives were presented by both participants
• The discussion covered both pros and cons of the topic

### Different Perspectives:
• ${selectedPersonas[0]?.name} emphasized ${selectedPersonas[0]?.traits[0]?.toLowerCase()} viewpoints
• ${selectedPersonas[1]?.name} brought ${selectedPersonas[1]?.traits[0]?.toLowerCase()} insights

### Main Arguments:
• Strong evidence was presented for multiple sides
• Logical reasoning was applied throughout the discussion

### Conclusions/Insights:
• The topic requires nuanced understanding
• Multiple valid perspectives exist on this subject`;
      }
      
      const summaryMessage: Message = {
        id: Date.now().toString(),
        personaId: selectedPersonas[0].id,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, summaryMessage]);
      setNextResponder(1); // Next response from second persona
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating summary:', error);
    }
  };

  const handleClarifyQuestion = async (question: string) => {
    if (!selectedPersonas[1]) return;
    
    setIsLoading(true);
    
    try {
      const conversationHistory = messages.map(msg => ({
        role: 'assistant' as const,
        content: msg.content,
        persona: msg.personaId
      }));

      const clarifyPrompt = `The moderator is asking for clarification: "${question}". Please provide a clear and detailed explanation addressing this question in the context of our discussion about "${currentTopic}".`;
      
      let response: string;
      
      if (apiStatus.hasAnyKey) {
        response = await generateAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: selectedPersonas[1],
          isResponse: true,
          previousMessage: clarifyPrompt
        });
      } else {
        response = await generateMockAIResponse({
          topic: currentTopic,
          conversationHistory,
          persona: selectedPersonas[1],
          isResponse: true,
          previousMessage: `Clarification needed: ${question}`
        });
      }
      
      const clarifyMessage: Message = {
        id: Date.now().toString(),
        personaId: selectedPersonas[1].id,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, clarifyMessage]);
      setNextResponder(0); // Next response from first persona
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating clarification:', error);
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
      
      {/* User Guide */}
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">How to Use AI Gossip</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>1. Select Personas:</strong> Choose two distinct AI personalities from the left panel. These will be your debaters.</p>
            <p><strong>2. Enter a Topic:</strong> Provide a topic for the AI models to discuss. You can also use suggested topics.</p>
            <p><strong>3. Start the Debate:</strong> Click 'Start Debate' to initiate the conversation. The AI models will take turns responding.</p>
            <p><strong>4. Moderate (Optional):</strong> Use the controls below the chat to pause, resume, refocus, or summarize the discussion.</p>
            <p className="text-xs mt-3 opacity-75">
              Tip: For real AI responses, ensure your OpenAI API key is configured in the `.env` file. Otherwise, the app runs in demo mode.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

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
                <div className="text-gray-600 dark:text-gray-300">
                    <img src={myImage} alt="Description" width="100" />
                  <p className="font-medium">Prabhat Chandra</p>
                  <p className="text-sm">Full Stack Developer & AI Enthusiast</p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-sm">
                    <a href="https://commons.wikimedia.org/wiki/User:Prabhat114" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Wiki: @Prabhat114
                    </a>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

          {/* Main Content - Setup and Live Discussion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup */}
          <div className="space-y-6">
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

          {/* Right Column - Live Discussion (Chat + Moderation) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Live Discussion</h2>
            <div className="relative mb-8"> {/* Chat Interface */}
              <ChatInterface
                messages={messages}
                personas={selectedPersonas}
                isLoading={isLoading}
                darkMode={settings.darkMode}
              />
            </div>
            {/* Manual Conversation Control (Moderation Panel) */}
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
        </div>

        {/* Google Ad - After Main Content and Live Discussion */}
        <div className="my-6">
           <GoogleAd
            client="ca-pub-4366848715535129"
            slot="8400088323"
            format="auto"
            responsive={true}
            style={{ minHeight: '100px', margin: '20px 0' }}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;