import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Persona } from '../types';

// Initialize clients lazily
let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
};

const getGeminiClient = (): GoogleGenerativeAI => {
  if (!gemini) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    gemini = new GoogleGenerativeAI(apiKey);
  }
  return gemini;
};

interface ConversationContext {
  topic: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    persona?: string;
  }>;
  persona: Persona;
  isResponse?: boolean;
  previousMessage?: string;
}

export const generateAIResponse = async (context: ConversationContext): Promise<string> => {
  const { persona } = context;

  try {
    if (persona.model === 'openai') {
      return await generateOpenAIResponse(context);
    } else if (persona.model === 'gemini') {
      return await generateGeminiResponse(context);
    } else {
      throw new Error(`Unsupported model: ${persona.model}`);
    }
  } catch (error) {
    console.error(`Error generating ${persona.model} response:`, error);
    
    // Fallback responses
    return `I apologize, but I'm having trouble connecting to ${persona.model === 'openai' ? 'OpenAI' : 'Google Gemini'}'s servers right now. Let me try to respond based on the topic "${context.topic}" - this is certainly an interesting discussion point that deserves careful consideration.`;
  }
};

const generateOpenAIResponse = async (context: ConversationContext): Promise<string> => {
  const { topic, conversationHistory, persona, isResponse, previousMessage } = context;

  const client = getOpenAIClient();

  // Build conversation context
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `${persona.systemPrompt}\n\nYou are discussing the topic: "${topic}"\n\nThis is a conversation between two AI assistants. The user is moderating the discussion.`
    }
  ];

  // Add conversation history
  conversationHistory.forEach((msg, index) => {
    if (msg.persona && msg.persona !== persona.id) {
      messages.push({
        role: 'user',
        content: `Other AI (${msg.persona}): ${msg.content}`
      });
    } else if (msg.persona === persona.id) {
      messages.push({
        role: 'assistant',
        content: msg.content
      });
    }
  });

  // Add current context
  if (isResponse && previousMessage) {
    messages.push({
      role: 'user',
      content: `Other AI just said: "${previousMessage}"\n\nPlease respond to this in the context of our discussion about "${topic}".`
    });
  } else {
    messages.push({
      role: 'user',
      content: `Please start the discussion about "${topic}". Give your opening thoughts on this topic.`
    });
  }

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 150,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at this time.';
};

const generateGeminiResponse = async (context: ConversationContext): Promise<string> => {
  const { topic, conversationHistory, persona, isResponse, previousMessage } = context;

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Build conversation context for Gemini
  let prompt = `${persona.systemPrompt}\n\nYou are discussing the topic: "${topic}"\n\nThis is a conversation between two AI assistants. The user is moderating the discussion.\n\n`;

  // Add conversation history
  if (conversationHistory.length > 0) {
    prompt += "Previous conversation:\n";
    conversationHistory.forEach((msg) => {
      if (msg.persona && msg.persona !== persona.id) {
        prompt += `Other AI: ${msg.content}\n`;
      } else if (msg.persona === persona.id) {
        prompt += `You: ${msg.content}\n`;
      }
    });
    prompt += "\n";
  }

  // Add current context
  if (isResponse && previousMessage) {
    prompt += `The other AI just said: "${previousMessage}"\n\nPlease respond to this in the context of our discussion about "${topic}". Keep your response conversational and around 2-3 sentences.`;
  } else {
    prompt += `Please start the discussion about "${topic}". Give your opening thoughts on this topic. Keep your response conversational and around 2-3 sentences.`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text || 'I apologize, but I couldn\'t generate a response at this time.';
};

// API key validation
export const validateApiKeys = async () => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const hasOpenAI = openaiKey && openaiKey.trim() !== '';
  const hasGemini = geminiKey && geminiKey.trim() !== '';
  const hasAnyKey = hasOpenAI || hasGemini;

  if (!hasAnyKey) {
    return {
      openai: false,
      gemini: false,
      hasAnyKey: false,
      error: 'No API keys configured'
    };
  }

  const results = {
    openai: false,
    gemini: false,
    hasAnyKey: false,
    error: null as string | null
  };

  // Test OpenAI if key exists
  if (hasOpenAI) {
    try {
      const client = getOpenAIClient();
      await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });
      results.openai = true;
    } catch (error) {
      console.error('OpenAI API key validation failed:', error);
    }
  }

  // Test Gemini if key exists
  if (hasGemini) {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
      await model.generateContent('Hello');
      results.gemini = true;
    } catch (error) {
      console.error('Gemini API key validation failed:', error);
    }
  }

  results.hasAnyKey = results.openai || results.gemini;
  
  if (!results.hasAnyKey) {
    results.error = 'Invalid API keys or API errors';
  }

  return results;
}