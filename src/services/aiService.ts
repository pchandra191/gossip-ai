import OpenAI from 'openai';
import { Persona } from '../types';

// Initialize OpenAI client lazily
let openai: OpenAI | null = null;

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
  const { topic, conversationHistory, persona, isResponse = false, previousMessage = '' } = context;

  try {
    return await generateOpenAIResponse(context);
  } catch (error) {
    console.error(`Error generating OpenAI response:`, error);
    
    // Fallback responses
    return `I apologize, but I'm having trouble connecting to OpenAI's servers right now. Let me try to respond based on the topic "${topic}" - this is certainly an interesting discussion point that deserves careful consideration.`;
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

// API key validation
export const validateApiKeys = async () => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!openaiKey || openaiKey.trim() === '') {
    return {
      openai: false,
      hasAnyKey: false,
      error: 'No API key configured'
    };
  }

  try {
    // Test the API key with a simple request
    const client = getOpenAIClient();
    const testCompletion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });
    
    return {
      openai: true,
      hasAnyKey: true,
      error: null
    };
  } catch (error) {
    console.error('API key validation failed:', error);
    return {
      openai: false,
      hasAnyKey: false,
      error: 'Invalid API key or API error'
    };
  }
}