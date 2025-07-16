# AI Gossip 🎭

<p align="center">
  <img src="https://commons.wikimedia.org/wiki/File:APCreations-LOGO.jpg" alt="AI Gossip - AI Debate App Screenshot" width="600">
</p>


**Where AIs talk, and you run the show.**

AI Gossip is a sophisticated discussion playground where real AI models (OpenAI GPT-4 and Google Gemini) engage in conversations that you can moderate and direct.

## Features

- **Real AI Conversations**: Watch authentic discussions between OpenAI's GPT-4 and Google's Gemini
- **6 Unique Personas**: Each with distinct personalities and response styles
- **Live Moderation**: Refocus conversations, change topics, ask for clarification, and more
- **Professional Interface**: Podcast studio aesthetics with debate arena functionality
- **Advanced Settings**: Dark mode, response timing, conversation tone, and more
- **Export & Share**: Save conversation transcripts and share discussions

## Getting Started

### Prerequisites

You'll need API keys from:
- [OpenAI](https://platform.openai.com/api-keys) - For GPT-4 based personas
- [Google AI Studio](https://makersuite.google.com/app/apikey) - For Gemini based personas

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### API Key Configuration

Add your API keys to the `.env` file in the root directory. The app will automatically detect and use them.

You can use one or both API providers:
- **OpenAI only**: Access to GPT-4 Scholar, GPT Debater, and GPT Empath
- **Gemini only**: Access to Gemini Creative, Gemini Wit, and Gemini Sage
- **Both**: Full access to all 6 personas
- **Neither**: Demo mode with mock responses

## Available Personas

### OpenAI GPT-4 Based
- **🤖 GPT-4 Scholar**: Analytical, balanced, and comprehensive
- **⚖️ GPT Debater**: Logical argumentation and structured debate
- **💝 GPT Empath**: Emotional intelligence and human connection

### Google Gemini Based
- **✨ Gemini Creative**: Innovative and broad-thinking
- **😏 Gemini Wit**: Humorous and clever observations
- **🧠 Gemini Sage**: Philosophical and contemplative

## How to Use

1. **Select Personas**: Choose two AI personalities for your discussion
2. **Set Topic**: Enter a topic or choose from suggested prompts
3. **Watch & Moderate**: Observe the conversation and use moderation tools as needed
4. **Export**: Save interesting conversations for later reference

## Moderation Tools

- **Refocus**: Bring the conversation back on track
- **Change Topic**: Introduce a new discussion subject
- **Summarize**: Get a summary of the discussion so far
- **Clarify**: Ask for clarification on specific points
- **Pause/Resume**: Control conversation flow
- **Export**: Download conversation transcripts

## Privacy & Security

- API keys are stored securely in environment variables
- Keys are never exposed to the client-side code
- All conversations happen directly between your browser and the AI providers

## Demo Mode

The app automatically runs in demo mode when no API keys are configured, using mock responses to demonstrate all features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

**Built with React, TypeScript, Tailwind CSS, and powered by OpenAI GPT-4 and Google Gemini APIs.**

## About Developer

[![AI Gossip Demo](https://commons.wikimedia.org/wiki/File:APCreations-LOGO.jpg)](https://youtu.be/KeilTftxoOA)
