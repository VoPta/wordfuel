import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize the Gemini API client
// API key for Gemini API
const API_KEY = 'AIzaSyARW0yAExai0dj3KoTHwJkVwIUhmonOTzA';
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings to be more permissive
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Sample texts for fallback when API calls fail
const SAMPLE_TEXTS = {
  English: [
    {
      title: "The Old Man and the Sea",
      source: "Ernest Hemingway",
      type: "Novel excerpt",
      style: "Concise, direct, with powerful imagery",
      content: "He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish. In the first forty days a boy had been with him. But after forty days without a fish the boy's parents had told him that the old man was now definitely and finally salao, which is the worst form of unlucky, and the boy had gone at their orders in another boat which caught three good fish the first week.",
      wordCount: 84,
      themes: "Perseverance, struggle against nature, dignity in defeat, isolation",
      motifs: "The sea, fishing, luck and superstition, mentorship",
      interpretation: "This opening passage introduces the central conflict of man versus nature, and establishes the old man's determination despite his apparent failure. The absence of the boy emphasizes the fisherman's isolation, while setting up their relationship as an important element of the story."
    },
    {
      title: "Sonnet 18",
      source: "William Shakespeare",
      type: "Poem",
      style: "Lyrical, romantic, rhythmic",
      content: "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate.\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date.\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimmed;\nAnd every fair from fair sometime declines,\nBy chance, or nature's changing course, untrimmed;",
      wordCount: 67,
      themes: "Eternal beauty, love transcending time, art as preservation",
      motifs: "Seasons, nature's impermanence, celestial imagery",
      interpretation: "Shakespeare's sonnet explores how poetry immortalizes beauty that would otherwise fade with time. By comparing his beloved to summer (but noting their superiority), he highlights the imperfections and transience of nature while suggesting that his verse will preserve the beloved's beauty eternally."
    },
    {
      title: "Letter from Birmingham Jail",
      source: "Martin Luther King Jr.",
      type: "Letter/Essay",
      style: "Persuasive, eloquent, powerful",
      content: "We know through painful experience that freedom is never voluntarily given by the oppressor; it must be demanded by the oppressed. Frankly, I have yet to engage in a direct action campaign that was \"well timed\" in the view of those who have not suffered unduly from the disease of segregation. For years now I have heard the word \"Wait!\" It rings in the ear of every Negro with piercing familiarity.",
      wordCount: 69,
      themes: "Justice, civil disobedience, moral urgency, racial inequality",
      motifs: "Time and waiting, disease as metaphor for injustice, voice and silence",
      interpretation: "King's powerful argument rejects the call for patience in the face of injustice. Through his ethical appeal to shared values and emotional imagery, he makes the case that oppression must be actively confronted rather than passively accepted. His reference to waiting emphasizes the psychological toll of delayed justice."
    }
  ],
  Czech: [
    {
      title: "Proměna",
      source: "Franz Kafka",
      type: "Novel excerpt",
      style: "Surreal, psychological, detailed",
      content: "Když se Řehoř Samsa jednoho rána probudil z nepokojných snů, shledal, že se v posteli proměnil v jakýsi nestvůrný hmyz. Ležel na hřbetě tvrdém jak pancíř, a když trochu nadzvedl hlavu, uviděl své vyklenuté, hnědé břicho rozdělené obloukovitými výztuhami, na jehož vrcholu se sotva ještě držela přikrývka a tak tak že úplně nesklouzla dolů.",
      wordCount: 56,
      themes: "Alienation, transformation, identity, existential crisis",
      motifs: "Insects, dreams, physical confinement, body as prison",
      interpretation: "Kafka's famous opening line immediately establishes the surreal premise while treating it with mundane practicality. This juxtaposition creates a sense of disorientation and absurdity that mirrors Gregor's own experience of suddenly being trapped in an unfamiliar body, reflecting deeper anxieties about self-identity and social alienation."
    },
    {
      title: "Máj",
      source: "Karel Hynek Mácha",
      type: "Poem",
      style: "Romantic, lyrical, nature-focused",
      content: "Byl pozdní večer – první máj –\nvečerní máj – byl lásky čas.\nHrdliččin zval ku lásce hlas,\nkde borový zaváněl háj.\nO lásce šeptal tichý mech;\nkvetoucí strom lhal lásky žel,\nsvou lásku slavík růži pěl,\nrůžinu jevil vonný vzdech.",
      wordCount: 42,
      themes: "Romantic love, beauty of nature, cyclical time, melancholy",
      motifs: "Evening, spring, birdsong, forest imagery, personification of nature",
      interpretation: "Mácha's lyrical poem celebrates the beauty of May evening while connecting it to romantic love. Through rich sensory imagery and personification of natural elements, he creates an immersive atmosphere of longing and passion. The poem's musicality and rhythm capture the emotional intensity characteristic of Czech Romanticism."
    }
  ]
};

/**
 * Fetches curated real-world texts based on the language and mode
 * @param {string} language - The language for the texts (e.g., 'English', 'Czech')
 * @param {string} mode - The difficulty mode ('EASY', 'MEDIUM', 'GRIND')
 * @returns {Promise<Array>} - Array of text objects
 */
export const getTexts = async (language, mode) => {
  try {
    // Define word count based on mode
    let wordCount;
    switch (mode) {
      case 'EASY':
        wordCount = 200;
        break;
      case 'MEDIUM':
        wordCount = 400;
        break;
      case 'GRIND':
        wordCount = 700;
        break;
      default:
        wordCount = 200;
    }

    // Try to use the simplest, most recent model
    try {
      console.log("Attempting to use Gemini API...");
      
      // Use a simpler model
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings,
      });
      
      // Simplify the prompt to reduce potential issues
      const simplePrompt = `Select high-quality real-world texts in ${language} with a TOTAL of EXACTLY ${wordCount} words (very important!) to help improve expressiveness, vocabulary, and emotional depth for songwriting and lyric writing.

Focus on:
- Language richness with diverse, poetic, or emotionally powerful vocabulary
- Expressive writing that conveys emotions vividly (sadness, longing, joy, doubt)
- Stylistic variety (lyrical, poetic, journalistic, introspective, metaphorical)
- Rhythm and flow with musical or rhythmic phrasing for lyric inspiration
- Imagery and metaphors that paint pictures with words
- Emotional tone ranging from raw/personal to dreamy/abstract
- Only authentic content from real sources

ENSURE DIVERSITY:
- MUST INCLUDE at least one meaningful quote from a writer, philosopher, or public figure
- Include lesser-known works, not just the most famous pieces
- Include works from diverse authors, time periods, and cultural backgrounds
- Explore both classic and contemporary sources
- Mix well-known with more obscure but high-quality texts

Include:
- Short song lyrics (a few lines)
- Excerpts from poems, novels, essays
- Deep or artistic quotes
- Literary or emotional fragments from classic or modern authors
- Works from lesser-known but talented writers

IMPORTANT GUIDELINES:
- Each text should be a COMPLETE, COHESIVE piece from a SINGLE source
- If including a quote, ONLY USE ONE QUOTE per text entry
- Each text should represent a single work/source, not a collection of quotes
- Avoid AI-generated texts, dry news articles or technical texts
- Texts should have emotional or stylistic depth
- Avoid repetition of texts that appear frequently in previous selections

${language === 'Czech' ? 
`IMPORTANT: Since the user has selected Czech, ALL content including titles, author names, metadata descriptions, themes, motifs, interpretation, and style must be IN CZECH LANGUAGE ONLY.
- Ensure ALL metadata (title, type, style, themes, motifs, interpretation) is written in Czech
- NO English words should appear anywhere in the response
- Make sure to use proper Czech diacritics and grammar
- Translate any English quotes or concepts into Czech` : ''}

IMPORTANT: The total word count across all texts MUST be exactly ${wordCount} words.

Provide each text in this JSON format:
[
  {
    "title": "Title of text",
    "source": "Author name",
    "type": "Essay/Poem/Song/etc",
    "style": "Brief style description (e.g. lyrical, introspective)",
    "content": "The full text content",
    "wordCount": 150,
    "themes": "Key themes in the text, such as love, loss, nature, etc.",
    "motifs": "Recurring symbols, images, or concepts in the text",
    "interpretation": "A brief analysis of the text's meaning, literary significance, and emotional impact"
  }
]`;
      
      // Set a longer timeout for the API call
      const generationConfig = {
        temperature: 1.0, // Increase temperature for more variety
        topK: 80, // Increase topK to consider more tokens
        topP: 0.98, // Slightly increase diversity
        maxOutputTokens: 8192,
      };
      
      console.log("Sending request to Gemini API...");
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: simplePrompt }] }],
        generationConfig,
      });
      
      const response = await result.response;
      const text = response.text();
      console.log("Received response from Gemini API");
      
      // Process the parsed data to validate and fix common errors
      const validateAndFixTextData = (texts, selectedLanguage) => {
        // When language is not Czech, no need for translation
        if (selectedLanguage !== 'Czech') {
          return texts.map(text => {
            // Still do the validation for attribution errors, word count, etc.
            const correctedText = { ...text };
            
            // Fix common attribution errors
            if (correctedText.title && correctedText.source) {
              // Fix Karel Havlíček Borovský attribution - common error
              if (correctedText.title.includes("Borovský") || 
                  correctedText.title.includes("Havlíček") || 
                  correctedText.title.includes("K.H.B")) {
                if (correctedText.source.includes("Mácha") || 
                    correctedText.source.includes("Kundera") || 
                    correctedText.source.includes("Unknown")) {
                  console.log(`Correcting attribution for "${correctedText.title}" from "${correctedText.source}" to "Karel Havlíček Borovský"`);
                  correctedText.source = "Karel Havlíček Borovský";
                }
              }
              
              // Fix other known misattributions
              const commonMisattributions = {
                "Karel Hynek Mácha": {
                  verify: (title) => title.includes("Máj") || title.includes("Mácha"),
                  correctName: "Karel Hynek Mácha"
                },
                "Franz Kafka": {
                  verify: (title) => title.includes("Proměna") || title.includes("Zámek") || title.includes("Proces"),
                  correctName: "Franz Kafka"
                },
                "Božena Němcová": {
                  verify: (title) => title.includes("Babička") || title.includes("Němcová"),
                  correctName: "Božena Němcová"
                },
                "Karel Čapek": {
                  verify: (title) => title.includes("Čapek") || title.includes("R.U.R"),
                  correctName: "Karel Čapek"
                },
                "Ralph Ellison": {
                  verify: (title) => title.includes("Neviditelný") || title.includes("Invisible"),
                  correctName: "Ralph Ellison"
                },
                "Karel Havlíček Borovský": {
                  verify: (title) => title.includes("Borovský") || title.includes("Havlíček"),
                  correctName: "Karel Havlíček Borovský"
                }
              };
              
              // Check and correct author names
              Object.keys(commonMisattributions).forEach(author => {
                const authorInfo = commonMisattributions[author];
                if (authorInfo.verify(correctedText.title) && correctedText.source !== authorInfo.correctName) {
                  console.log(`Correcting attribution for "${correctedText.title}" from "${correctedText.source}" to "${authorInfo.correctName}"`);
                  correctedText.source = authorInfo.correctName;
                }
              });
            }
            
            // Ensure wordCount matches actual content
            if (correctedText.content) {
              const actualWordCount = correctedText.content.split(/\s+/).length;
              if (Math.abs(actualWordCount - (correctedText.wordCount || 0)) > 3) {
                console.log(`Correcting word count for "${correctedText.title}" from ${correctedText.wordCount} to ${actualWordCount}`);
                correctedText.wordCount = actualWordCount;
              }
            }
            
            // Ensure themes and motifs are properly formatted and not empty
            if (!correctedText.themes || correctedText.themes.trim() === "") {
              correctedText.themes = "Literary themes, personal reflection";
            }
            
            if (!correctedText.motifs || correctedText.motifs.trim() === "") {
              correctedText.motifs = "Literární prostředky, obraznost";
            }
            
            return correctedText;
          });
        }
        
        // Add more comprehensive Czech translations
        const czechTranslations = {
          // Common themes translations
          "Loss": "Ztráta",
          "Melancholy": "Melancholie", 
          "Autumn": "Podzim",
          "Love": "Láska",
          "Nature": "Příroda",
          "Time": "Čas",
          "Death": "Smrt",
          "Life": "Život",
          "Memory": "Paměť",
          "Identity": "Identita",
          "Freedom": "Svoboda",
          "Alienation": "Odcizení",
          "Loneliness": "Samota",
          "Hope": "Naděje",
          "Despair": "Zoufalství",
          "Language learning": "Výuka jazyka",
          "Vocabulary acquisition": "Rozšiřování slovní zásoby",
          "Comprehension": "Porozumění",
          "Literary themes": "Literární témata",
          "Personal reflection": "Osobní reflexe",
          
          // Common motifs translations
          "Falling leaves": "Padající listí",
          "Silence": "Ticho",
          "Darkness": "Tma",
          "Light": "Světlo",
          "Water": "Voda",
          "Birds": "Ptáci",
          "Dreams": "Sny",
          "Journey": "Cesta",
          "Mirrors": "Zrcadla",
          "Seasons": "Roční období",
          "Cultural elements": "Kulturní prvky",
          "Communication patterns": "Komunikační vzorce",
          "Everyday scenarios": "Každodenní situace",
          "Literary devices": "Literární prostředky",
          "Imagery": "Obraznost",
          "Text structure": "Struktura textu",
          "Linguistic patterns": "Jazykové vzorce",
          
          // Common type translations
          "Novel excerpt": "Úryvek z románu",
          "Poem": "Báseň",
          "Essay": "Esej",
          "Short story": "Povídka",
          "Quote": "Citát",
          "Text": "Text",
          "Song": "Píseň",
          "Letter/Essay": "Dopis/Esej",
          
          // Common style translations
          "Surreal": "Surrealistický",
          "Psychological": "Psychologický",
          "Detailed": "Detailní",
          "Romantic": "Romantický",
          "Lyrical": "Lyrický",
          "Nature-focused": "Zaměřený na přírodu",
          "Concise": "Stručný",
          "Direct": "Přímý",
          "Evocative": "Evokativní",
          "Not specified": "Neurčeno",
          "Selected from literature": "Vybraný z literatury",
          
          // Additional word translations for more comprehensive coverage
          "Sun": "Slunce",
          "Shadow": "Stín",
          "Fading": "Vytrácející se",
          "Simple": "Jednoduchý",
          "Yet": "Přesto",
          "Bittersweet": "Hořkosladký",
          "Feelings": "Pocity",
          "Nostalgia": "Nostalgie",
          "Passage": "Plynutí",
          "Of": "Z",
          "The": "",
          "And": "A",
          "In": "V",
          "From": "Od",
          "To": "K",
          "With": "S",
          "For": "Pro",
          "By": "Od",
          "On": "Na",
          "At": "U",
          "This": "Tento",
          "That": "Ten",
          "These": "Tyto",
          "Those": "Ty",
          "But": "Ale",
          "Or": "Nebo",
          "As": "Jako",
          "If": "Pokud",
          "So": "Tak",
          "When": "Když",
          "Where": "Kde",
          "Why": "Proč",
          "How": "Jak",
          "What": "Co",
          "Who": "Kdo",
          "Expressing": "Vyjadřující",
          "Lyrics": "Text písně",
          
          // Additional translations to ensure full coverage
          "expressing the bittersweet feelings": "vyjadřující hořkosladké pocity",
          "bittersweet feelings of nostalgia": "hořkosladké pocity nostalgie",
          "passage of time": "plynutí času",
          "simple yet evocative lyrics": "jednoduchý, přesto evokativní text písně",
          "simple yet evocative": "jednoduchý, přesto evokativní",
          "fading love": "vytrácející se láska",
          "sun and shadow": "slunce a stín",
          "reflects on": "zamýšlí se nad",
          "showcases": "ukazuje",
          "highlights": "zdůrazňuje",
          "explores": "zkoumá",
          "demonstrates": "demonstruje",
          "illustrates": "ilustruje",
          "technique": "technika",
          "structure": "struktura",
          "imagery": "obraznost",
          "metaphor": "metafora",
          "symbolism": "symbolika",
          "literary significance": "literární význam",
          "emotional impact": "emocionální dopad"
        };

        // Helper function to translate text if language is Czech
        const translateToCzech = (text) => {
          if (selectedLanguage !== 'Czech' || !text) return text;
          
          // Add more phrases that need translation
          const additionalTranslations = {
            "expressing the bittersweet feelings": "vyjadřující hořkosladké pocity",
            "passage of time": "plynutí času",
            "simple yet evocative": "jednoduchý, přesto evokativní",
            "fading love": "vytrácející se láska",
            "sun and shadow": "slunce a stín",
            "emotional impact": "emocionální dopad"
          };
          
          // Merge the dictionaries
          const allTranslations = {...czechTranslations, ...additionalTranslations};
          
          // First try to translate the entire text if it's a common phrase
          if (allTranslations[text.trim()]) {
            return allTranslations[text.trim()];
          }
          
          // Split text by common separators
          const parts = text.split(/[,.;:]/).map(part => part.trim());
          const translatedParts = parts.map(part => {
            // Try to find this exact phrase in our dictionary
            if (allTranslations[part]) {
              return allTranslations[part];
            }
            
            // Try to match multi-word phrases first (longer phrases get priority)
            let translated = part;
            const phrases = Object.keys(allTranslations)
              .filter(key => key.includes(' '))
              .sort((a, b) => b.length - a.length);
              
            phrases.forEach(phrase => {
              const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              const regex = new RegExp(escapedPhrase, 'gi');
              translated = translated.replace(regex, allTranslations[phrase]);
            });
            
            // Then translate individual words (longer words get priority)
            const words = Object.keys(allTranslations)
              .filter(key => !key.includes(' '))
              .sort((a, b) => b.length - a.length);
            
            words.forEach(word => {
              const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
              translated = translated.replace(regex, allTranslations[word]);
            });
            
            return translated;
          });
          
          // Reconstruct text with original separators
          let result = '';
          let currentIndex = 0;
          
          for (let i = 0; i < translatedParts.length; i++) {
            const partIndex = text.indexOf(parts[i], currentIndex);
            if (partIndex >= 0) {
              const separator = text.substring(currentIndex, partIndex);
              result += separator + translatedParts[i];
              currentIndex = partIndex + parts[i].length;
            } else {
              // Fallback if we can't find the original position
              result += (i > 0 ? ', ' : '') + translatedParts[i];
            }
          }
          
          // Add any remaining text
          if (currentIndex < text.length) {
            result += text.substring(currentIndex);
          }
          
          // Final check for any remaining English and clean it up
          // Replace common English articles and conjunctions
          const commonEnglishReplacements = [
            [/\b(the|a|an)\s+/gi, ''],
            [/\band\b/gi, 'a'],
            [/\bof\b/gi, 'z'],
            [/\bin\b/gi, 'v'],
            [/\bwith\b/gi, 's'],
            [/\bby\b/gi, 'od'],
            [/\bfor\b/gi, 'pro'],
            [/\bon\b/gi, 'na'],
            [/\bat\b/gi, 'u'],
            [/\bfrom\b/gi, 'od'],
            [/\bto\b/gi, 'k']
          ];
          
          for (const [pattern, replacement] of commonEnglishReplacements) {
            result = result.replace(pattern, replacement);
          }
          
          return result;
        };
        
        // Convert all texts to Czech
        return texts.map(text => {
          const correctedText = { ...text };
          
          // Translate title using special title function
          correctedText.title = translateToCzech(correctedText.title);
          
          // Translate all other metadata fields using the enhanced translation function
          correctedText.themes = translateToCzech(correctedText.themes);
          correctedText.motifs = translateToCzech(correctedText.motifs);
          correctedText.interpretation = translateToCzech(correctedText.interpretation);
          correctedText.type = translateToCzech(correctedText.type);
          correctedText.style = translateToCzech(correctedText.style);
          
          // Fix common attribution errors
          if (correctedText.title && correctedText.source) {
            // Fix Karel Havlíček Borovský attribution - common error
            if (correctedText.title.includes("Borovský") || 
                correctedText.title.includes("Havlíček") || 
                correctedText.title.includes("K.H.B")) {
              if (correctedText.source.includes("Mácha") || 
                  correctedText.source.includes("Kundera") || 
                  correctedText.source.includes("Unknown")) {
                console.log(`Correcting attribution for "${correctedText.title}" from "${correctedText.source}" to "Karel Havlíček Borovský"`);
                correctedText.source = "Karel Havlíček Borovský";
              }
            }
            
            // Fix other known misattributions
            const commonMisattributions = {
              "Karel Hynek Mácha": {
                verify: (title) => title.includes("Máj") || title.includes("Mácha"),
                correctName: "Karel Hynek Mácha"
              },
              "Franz Kafka": {
                verify: (title) => title.includes("Proměna") || title.includes("Zámek") || title.includes("Proces"),
                correctName: "Franz Kafka"
              },
              "Božena Němcová": {
                verify: (title) => title.includes("Babička") || title.includes("Němcová"),
                correctName: "Božena Němcová"
              },
              "Karel Čapek": {
                verify: (title) => title.includes("Čapek") || title.includes("R.U.R"),
                correctName: "Karel Čapek"
              },
              "Ralph Ellison": {
                verify: (title) => title.includes("Neviditelný") || title.includes("Invisible"),
                correctName: "Ralph Ellison"
              },
              "Karel Havlíček Borovský": {
                verify: (title) => title.includes("Borovský") || title.includes("Havlíček"),
                correctName: "Karel Havlíček Borovský"
              }
            };
            
            // Check and correct author names
            Object.keys(commonMisattributions).forEach(author => {
              const authorInfo = commonMisattributions[author];
              if (authorInfo.verify(correctedText.title) && correctedText.source !== authorInfo.correctName) {
                console.log(`Correcting attribution for "${correctedText.title}" from "${correctedText.source}" to "${authorInfo.correctName}"`);
                correctedText.source = authorInfo.correctName;
              }
            });
          }
          
          // Ensure wordCount matches actual content
          if (correctedText.content) {
            const actualWordCount = correctedText.content.split(/\s+/).length;
            if (Math.abs(actualWordCount - (correctedText.wordCount || 0)) > 3) {
              console.log(`Correcting word count for "${correctedText.title}" from ${correctedText.wordCount} to ${actualWordCount}`);
              correctedText.wordCount = actualWordCount;
            }
          }
          
          // Ensure themes and motifs are properly formatted and not empty
          if (!correctedText.themes || correctedText.themes.trim() === "") {
            correctedText.themes = "Literární témata, osobní reflexe";
          }
          
          if (!correctedText.motifs || correctedText.motifs.trim() === "") {
            correctedText.motifs = "Literární prostředky, obraznost";
          }
          
          return correctedText;
        });
      };
      
      try {
        // First try to find a JSON array directly
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          console.log("Found JSON in response");
          const jsonText = jsonMatch[0];
          const parsedData = JSON.parse(jsonText);
          console.log(`Parsed ${parsedData.length} texts from JSON response`);
          
          // Validate and fix any common errors
          const validatedData = validateAndFixTextData(parsedData, language);
          
          return validatedData;
        } else {
          // If no direct match, try to extract any valid JSON
          console.log("No JSON array found, looking for other JSON structures");
          const jsonObjects = text.match(/\{[\s\S]*?\}/g);
          if (jsonObjects && jsonObjects.length > 0) {
            console.log("Found individual JSON objects");
            const validObjects = [];
            for (const obj of jsonObjects) {
              try {
                const parsed = JSON.parse(obj);
                if (parsed.title && parsed.content) {
                  validObjects.push(parsed);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
            if (validObjects.length > 0) {
              console.log("Created array from individual JSON objects");
              return validateAndFixTextData(validObjects, language);
            }
          }
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError.message);
      }
      
      // If we can't extract JSON but still have text, create a simple text object
      if (text.length > 100) {
        console.log("Creating text object from raw response");
        // Try to extract a title and content from the raw text
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const title = lines[0] || "Untitled Text";
        const content = lines.slice(1).join('\n') || text;
        
        let textObj = {
          title,
          source: "Selected Text",
          type: "Text",
          style: "Selected from literature",
          content,
          wordCount: content.split(/\s+/).length,
          themes: "Literary expression, language study",
          motifs: "Text structure, linguistic patterns",
          interpretation: "This text showcases important literary techniques and linguistic structures that help develop understanding of how ideas are conveyed in written form."
        };
        
        // Apply validation to this single text as well
        const singleTextArray = validateAndFixTextData([textObj], language);
        return singleTextArray;
      }
      
    } catch (apiError) {
      console.error("API error:", apiError.message);
    }
    
    // If we get here, all API attempts failed
    console.log("All API attempts failed, using fallback data");
    return getFallbackTexts(language, mode);
    
  } catch (error) {
    console.error('Error fetching texts:', error);
    
    // Localized error messages
    const errorTitle = language === 'Czech' ? "Chyba" : "Error";
    const errorSource = language === 'Czech' ? "Systém" : "System";
    const errorType = language === 'Czech' ? "Chyba" : "Error";
    const errorStyle = language === 'Czech' ? "Chyba" : "Error";
    const errorContent = language === 'Czech' 
      ? `Nastal problém: ${error.message}. Používají se ukázkové texty.`
      : `We encountered a problem: ${error.message}. Using sample texts instead.`;
    const errorThemes = language === 'Czech'
      ? "Technické obtíže, zpracování chyb"
      : "Technical difficulties, error handling";
    const errorMotifs = language === 'Czech'
      ? "Systémové zprávy, oznámení o chybách"
      : "System messages, error notifications";
    const errorInterpretation = language === 'Czech'
      ? "Tato zpráva označuje, že aplikace narazila na problém při načítání textů. Chyba byla zaznamenána a systém používá záložní texty."
      : "This message indicates that the application encountered an issue while trying to fetch texts. The error has been logged and the system is using fallback texts.";
      
    return [
      {
        title: errorTitle,
        source: errorSource,
        type: errorType,
        style: errorStyle,
        content: errorContent,
        wordCount: language === 'Czech' ? 10 : 20,
        themes: errorThemes,
        motifs: errorMotifs,
        interpretation: errorInterpretation
      }
    ];
  }
};

/**
 * Gets fallback sample texts when API calls fail
 * @param {string} language - The language for the texts
 * @param {string} mode - The difficulty mode
 * @returns {Array} - Array of sample text objects
 */
const getFallbackTexts = (language, mode) => {
  let targetWordCount;
  switch (mode) {
    case 'EASY':
      targetWordCount = 200;
      break;
    case 'MEDIUM':
      targetWordCount = 400;
      break;
    case 'GRIND':
      targetWordCount = 700;
      break;
    default:
      targetWordCount = 200;
  }

  // Get the appropriate collection of texts based on language
  const sourceTexts = language === 'Czech' 
    ? SAMPLE_TEXTS.Czech_Extended || SAMPLE_TEXTS.Czech
    : SAMPLE_TEXTS.English_Extended || SAMPLE_TEXTS.English;
  
  // Select and combine texts to match target word count
  let result = [];
  let currentWordCount = 0;

  // Add texts until we get close to the target word count
  let remainingTexts = [...sourceTexts]; // Create a copy so we can remove texts as we use them
  while (currentWordCount < targetWordCount * 0.9 && remainingTexts.length > 0) {
    // Choose a random text
    const randomIndex = Math.floor(Math.random() * remainingTexts.length);
    const selectedText = remainingTexts[randomIndex];
    
    // Remove the selected text from the pool
    remainingTexts.splice(randomIndex, 1);
    
    if (currentWordCount + selectedText.wordCount <= targetWordCount * 1.1) {
      result.push(selectedText);
      currentWordCount += selectedText.wordCount;
    }
  }
  
  // Validate and fix the texts before returning
  return validateAndFixTextData(result, language);
}; 