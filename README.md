# 🌐 AI Medical Translator

A professional medical translation service powered by AI, designed to provide accurate and culturally sensitive medical translations across multiple languages.

## ✨ Features

- 🏥 Professional medical translations
- 🌍 Support for multiple languages including:
  - English (en)
  - Spanish (es)
  - French (fr)
  - Hindi (hi)
  - Chinese (zh)
  - Arabic (ar)
- 🔒 Built-in rate limiting and security features
- 🎯 Maintains medical accuracy and terminology
- 🤝 Culturally appropriate translations
- ⚡ Real-time translation processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key
- ResponsiveVoice API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-medical-translator.git
cd ai-medical-translator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your API keys to `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
RESPONSIVE_VOICE_KEY=your_responsive_voice_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 API Usage

The translation API endpoint is available at `/api/translate`. Here's an example request:

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The patient shows signs of hypertension",
    "sourceLanguage": "en",
    "targetLanguage": "es"
  }'
```

### Rate Limiting

- 50 requests per minute per client
- Requests exceeding this limit will receive a 429 status code

## 🛡️ Security Features

- Input validation
- Rate limiting
- Error handling
- Secure API key management
- Request method validation

## 📚 Technical Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [LangChain](https://js.langchain.com/) - LLM Framework
- [OpenAI GPT-3.5](https://openai.com/) - Language Model
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
