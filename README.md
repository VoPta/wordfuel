# WordFuel

WordFuel is a language learning application that provides curated texts to help expand your vocabulary in English and Czech.

## Features

- Multilingual support (English and Czech)
- Three difficulty levels: Easy, Medium, and Grind
- Curated texts with themes, motifs, and interpretations
- Responsive design that works on mobile and web platforms

## Technologies Used

- React Native with Expo
- React Native Paper for UI components
- Expo Router for navigation

## Installation

1. Clone the repository
   ```
   git clone https://github.com/VoPta/wordfuel.git
   cd wordfuel
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

## Deployment

The application is hosted on GitHub Pages: [https://VoPta.github.io/wordfuel](https://VoPta.github.io/wordfuel)

To deploy updates:
```
npm run deploy
```

## 📱 App Overview

WordFuel presents users with high-quality, curated real-world texts selected based on their linguistic richness, imagery, and stylistic diversity. Users can:

- Select a target language (English, Czech)
- Choose a daily reading mode:
  - **EASY**: ~200 words
  - **MEDIUM**: ~400 words
  - **GRIND**: ~600-700 words
- Read 1-3 real texts that match their preferences

## 🚀 Features

- **Language Selection**: Choose your preferred language
- **Reading Mode**: Select the amount of content based on your available time
- **Curated Content**: Real-world texts (not AI-generated) selected via Gemini API
- **Detailed Metadata**: View information about each text's source, type, and style
- **Word Count Tracking**: See the total word count for your daily reading

## 🛠️ Tech Stack

- React Native with Expo
- React Navigation
- React Native Paper for UI components
- Google Generative AI (Gemini API)

## 🔧 Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add your Gemini API key:
   - Open `app/api.js`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key

4. Start the app:
   ```
   npm start
   ```
   
## 📂 Project Structure

- `app/(tabs)/index.js` - Home screen with language and mode selection
- `app/text.js` - Text screen displaying the curated texts
- `app/components/TextCard.js` - Reusable component for each text
- `app/api.js` - Gemini API integration

## 🎨 Design and UI

The app features a clean, minimal design with a color theme that corresponds to the selected mode:
- EASY: Green
- MEDIUM: Orange
- GRIND: Red

## 📝 Note

To use this app, you'll need to provide your own Gemini API key. The app requests curated real-world texts and does not generate content.

## 📱 Screenshots

(Screenshots will be added after the first release)
