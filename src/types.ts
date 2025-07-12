export interface Persona {
  id: string;
  name: string;
  description: string;
  color: string;
  avatar: string;
  traits: string[];
  responseStyle: 'informative' | 'creative' | 'logical' | 'sarcastic' | 'empathetic';
  model: 'openai' | 'gemini';
  systemPrompt: string;
}

export interface Message {
  id: string;
  personaId: string;
  content: string;
  timestamp: Date;
  isUser?: boolean;
}

export interface Conversation {
  id: string;
  topic: string;
  messages: Message[];
  personas: [Persona, Persona];
  startTime: Date;
  status: 'active' | 'paused' | 'ended';
}

export interface AppSettings {
  darkMode: boolean;
  voiceEnabled: boolean;
  animationsEnabled: boolean;
  toneMode: 'casual' | 'formal';
  autoPlay: boolean;
  responseDelay: number;
}

export interface ModerationAction {
  type: 'refocus' | 'changeTopic' | 'summarize' | 'clarify' | 'pause' | 'resume' | 'continue';
  payload?: string;
}