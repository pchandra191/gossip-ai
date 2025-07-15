import { GoogleGenerativeAI } from '@google/generative-ai';

let gemini: GoogleGenerativeAI | null = null;

const getGeminiClient = (): GoogleGenerativeAI => {
  if (!gemini) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Gemini API key is not configured');
    }
    gemini = new GoogleGenerativeAI(apiKey);
  }
  return gemini;
};

export const generateRandomTopics = async (count: number = 8): Promise<string[]> => {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate ${count} interesting and thought-provoking debate topics that would make for engaging AI discussions. 

Requirements:
- Topics should be current, relevant, and intellectually stimulating
- Mix of technology, society, ethics, philosophy, and contemporary issues
- Each topic should be phrased as a clear statement or question
- Avoid overly controversial or sensitive topics
- Make them suitable for AI personas to have meaningful discussions

Format: Return only the topics, one per line, without numbering or bullet points.

Examples of good topics:
- Should AI have creative rights to the art it generates?
- Is remote work making us more or less productive as a society?
- Will virtual reality replace traditional social interactions?

Generate ${count} similar topics:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into individual topics
    const topics = text
      .split('\n')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0 && !topic.match(/^\d+\.?\s/)) // Remove numbered items
      .slice(0, count); // Ensure we don't exceed requested count

    return topics.length > 0 ? topics : getFallbackTopics();
  } catch (error) {
    console.error('Error generating topics from Gemini:', error);
    return getFallbackTopics();
  }
};

const getFallbackTopics = (): string[] => [
  "Should AI have rights and legal protections?",
  "Is remote work better than traditional office work?",
  "Will cryptocurrency replace traditional banking?",
  "Should social media platforms be regulated by government?",
  "Is artificial intelligence a threat to human creativity?",
  "Are electric cars really better for the environment?",
  "Should college education be free for everyone?",
  "Will virtual reality change how we experience entertainment?"
];

export const getRandomTopic = async (): Promise<string> => {
  const topics = await generateRandomTopics(1);
  return topics[0] || "What does the future hold for human-AI collaboration?";
};