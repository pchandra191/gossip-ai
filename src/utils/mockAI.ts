import { Persona } from '../types';

interface ResponseOptions {
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

export const generateMockAIResponse = async (options: ResponseOptions): Promise<string> => {
  const { topic, conversationHistory, persona, isResponse = false, previousMessage = '' } = options;
  
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Handle special cases for moderation actions
  if (previousMessage.includes('Please refocus our discussion')) {
    return getRefocusResponse(persona, topic);
  }
  
  if (previousMessage.includes('Please provide a comprehensive point-wise summary')) {
    return getSummaryResponse(persona, topic, conversationHistory);
  }
  
  if (previousMessage.includes('Clarification needed:')) {
    const question = previousMessage.replace('Clarification needed:', '').trim();
    return getClarificationResponse(persona, question, topic);
  }
  
  const responses = getResponsesByPersona(persona, topic, conversationHistory, isResponse, previousMessage);
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const getRefocusResponse = (persona: Persona, topic: string): string => {
  const responses = [
    `You're absolutely right, let me bring us back to the core of our discussion about ${topic}. I think we may have wandered a bit, so let me refocus on the main issue at hand.`,
    `Good point about refocusing. Let's get back to the heart of ${topic} and what we were originally discussing. The main question we should be addressing is...`,
    `Thanks for that reminder. Let me steer us back to the central theme of ${topic}. I believe the key aspect we should focus on is...`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const getSummaryResponse = (persona: Persona, topic: string, history: Array<{role: string; content: string; persona?: string}>): string => {
  return `## Discussion Summary: ${topic}

### Key Points Discussed:
• We explored the fundamental aspects of ${topic}
• Multiple perspectives were presented throughout our conversation
• Both theoretical and practical implications were considered
• The discussion covered various dimensions of the topic

### Different Perspectives:
• One viewpoint emphasized the ${persona.traits[0]?.toLowerCase()} approach to understanding ${topic}
• Alternative perspectives highlighted different aspects and considerations
• We examined both positive and negative implications

### Main Arguments:
• Strong evidence was presented supporting different positions
• Logical reasoning was applied to evaluate various claims
• Real-world examples were used to illustrate key points
• Counter-arguments were addressed and discussed

### Conclusions/Insights:
• The topic requires nuanced understanding and careful consideration
• Multiple valid perspectives exist and should be acknowledged
• Further discussion could explore additional dimensions
• The conversation revealed the complexity inherent in ${topic}`;
};

const getClarificationResponse = (persona: Persona, question: string, topic: string): string => {
  const responses = [
    `Great question! Let me clarify that point about ${topic}. When I mentioned that earlier, I was specifically referring to...`,
    `I'm glad you asked for clarification on "${question}". In the context of our ${topic} discussion, what I meant was...`,
    `That's an important clarification to make. Regarding "${question}" in relation to ${topic}, let me explain more clearly...`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const getResponsesByPersona = (
  persona: Persona,
  topic: string,
  history: Array<{role: 'user' | 'assistant'; content: string; persona?: string}>,
  isResponse: boolean,
  previousMessage: string
): string[] => {
  const baseResponses = getBaseResponses(persona, topic);
  
  if (isResponse && previousMessage) {
    return getResponseToMessage(persona, previousMessage, topic);
  }
  
  return baseResponses;
};

const getBaseResponses = (persona: Persona, topic: string): string[] => {
  switch (persona.responseStyle) {
    case 'informative':
      return [
        `Let me provide some context about ${topic}. From a factual standpoint, there are several key aspects to consider...`,
        `To approach ${topic} objectively, we should examine the available data and research...`,
        `I think it's important to establish a foundation of facts when discussing ${topic}...`
      ];
    
    case 'creative':
      return [
        `Oh, ${topic}! This reminds me of a kaleidoscope of possibilities. What if we looked at this from a completely different angle?`,
        `You know, ${topic} is like a canvas waiting for bold strokes. Let me paint you a picture of what I'm thinking...`,
        `${topic} sparks so many creative connections in my mind. It's fascinating how this relates to art, music, and human expression...`
      ];
    
    case 'logical':
      return [
        `Regarding ${topic}, let me present my argument with clear logical structure. First, we must define our terms...`,
        `I challenge the premise of ${topic}. Here's why this position is flawed and what evidence supports my counterargument...`,
        `To debate ${topic} effectively, we need to establish clear criteria for evaluation. I propose we examine this through three lenses...`
      ];
    
    case 'sarcastic':
      return [
        `Oh, ${topic}? Really? Well, this should be interesting. Let me guess what everyone's going to say...`,
        `Ah yes, ${topic}. Because clearly this is the most pressing issue of our time. *rolls digital eyes*`,
        `${topic}? How delightfully controversial. I'm sure this will be a perfectly civilized discussion...`
      ];
    
    case 'empathetic':
      return [
        `${topic} really touches my heart because it affects so many people in meaningful ways. I feel like we should approach this with compassion...`,
        `When I think about ${topic}, I can't help but consider the human emotions and experiences involved...`,
        `This topic about ${topic} brings up such important feelings. I think we need to be gentle and understanding as we discuss this...`
      ];
    
    default:
      return [`Let me share my thoughts on ${topic}...`];
  }
};

const getResponseToMessage = (persona: Persona, message: string, topic: string): string[] => {
  switch (persona.responseStyle) {
    case 'informative':
      return [
        `That's an interesting point. Let me add some additional context and data to support that perspective...`,
        `I appreciate that viewpoint. However, the research also shows some nuances worth considering...`,
        `Building on what you said, there are actually several studies that both support and challenge that position...`
      ];
    
    case 'creative':
      return [
        `Wow, that's like seeing ${topic} through a prism! Your perspective adds such vibrant colors to this discussion...`,
        `That reminds me of a beautiful metaphor - it's like ${topic} is a symphony, and you just added a new instrument...`,
        `Oh, I love how you're thinking about this! It's making me imagine ${topic} as a living, breathing organism...`
      ];
    
    case 'logical':
      return [
        `I must respectfully disagree with that reasoning. Here's where the logical fallacy occurs...`,
        `That argument has merit, but it's incomplete. Let me provide the missing logical links...`,
        `While you make valid points, the conclusion doesn't follow from the premises. Consider this counterexample...`
      ];
    
    case 'sarcastic':
      return [
        `Oh, absolutely! Because that's totally how ${topic} works in the real world. *chef's kiss*`,
        `Right, right. And I suppose next you'll tell me that ${topic} is actually simple and straightforward?`,
        `That's... certainly one way to look at it. Bold of you to assume such optimism about ${topic}...`
      ];
    
    case 'empathetic':
      return [
        `I can really feel the emotion behind your words. It's clear that ${topic} means a lot to you, and I want to honor that...`,
        `Your perspective on ${topic} is so moving. I think many people would feel the same way if they truly understood...`,
        `Thank you for sharing that. It's brave to be vulnerable about ${topic}, and I think your feelings are completely valid...`
      ];
    
    default:
      return [`I see your point about ${topic}. Let me share my perspective...`];
  }
};