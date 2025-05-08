/**
 * Localization strings for the WordFuel app
 * Provides translations for UI elements in English and Czech
 */

export const translations = {
  English: {
    // Text screen
    home: "Home",
    totalWords: "Total Words",
    textPageOf: "Text {current} of {total}",
    loadingTexts: "Finding the best texts...",
    noTextsFound: "No texts found. Try another language or mode.",
    retryButton: "Retry",
    goBackButton: "Go Back",
    closeButton: "Close",
    
    // Info modal
    themes: "Themes",
    motifs: "Motifs",
    interpretation: "Interpretation",
    
    // Home screen
    appTitle: "WordFuel",
    appSubtitle: "Expand your vocabulary with daily curated real-world texts",
    selectLanguage: "Select Language",
    selectMode: "Select Daily Mode",
    getDailyDose: "Get Daily Dose",
    
    // Error messages
    errorFetchingTexts: "Error fetching texts. Please try again.",
    invalidTextData: "Invalid Text Data",
    textDisplayError: "The text could not be displayed properly.",
    
    // Funny loading messages
    funnyLoadingMessages: [
      "Hunting for literary treasures...",
      "Making Shakespeare jealous...",
      "Scanning libraries at the speed of light...",
      "Negotiating with literary agents...",
      "Bribing bookworms for recommendations...",
      "Stealing words from the dictionary...",
      "Brewing a strong cup of inspiration...",
      "Dusting off ancient manuscripts...",
      "Reading faster than your English teacher...",
      "Judging books by their covers (then reading them anyway)..."
    ],
    
    // TextCard metadata labels
    author: "Author",
    type: "Type",
    style: "Style",
    words: "Words",
    unknown: "Unknown",
    untitled: "Untitled",
    notSpecified: "Not specified",
    text: "Text",
    
    // Info box fallback content
    defaultThemes: "Language learning, vocabulary acquisition, comprehension",
    defaultMotifs: "Cultural elements, communication patterns, everyday scenarios",
    defaultInterpretation: "This text aims to help you understand and practice common vocabulary and phrases in context. Pay attention to how ideas are connected and how the language is structured to convey meaning effectively."
  },
  
  Czech: {
    // Text screen
    home: "Domů",
    totalWords: "Celkem slov",
    textPageOf: "Text {current} z {total}",
    loadingTexts: "Hledání nejlepších textů...",
    noTextsFound: "Žádné texty nenalezeny. Zkuste jiný jazyk nebo režim.",
    retryButton: "Zkusit znovu",
    goBackButton: "Zpět",
    closeButton: "Zavřít",
    
    // Info modal
    themes: "Témata",
    motifs: "Motivy",
    interpretation: "Interpretace",
    
    // Home screen
    appTitle: "WordFuel",
    appSubtitle: "Rozšiřte svou slovní zásobu s denně kurátovanými texty z reálného světa",
    selectLanguage: "Vyberte jazyk",
    selectMode: "Vyberte denní režim",
    getDailyDose: "Získat denní dávku",
    
    // Error messages
    errorFetchingTexts: "Chyba při načítání textů. Zkuste to prosím znovu.",
    invalidTextData: "Neplatná data textu",
    textDisplayError: "Text nelze správně zobrazit.",
    
    // Funny loading messages
    funnyLoadingMessages: [
      "Lovíme literární poklady...",
      "Čapek by nám záviděl...",
      "Prohledáváme knihovny rychlostí světla...",
      "Vyjednáváme s literárními agenty...",
      "Uplácíme knihomoly o doporučení...",
      "Krademe slova ze slovníku...",
      "Vaříme silnou kávu inspirace...",
      "Oprašujeme staré rukopisy...",
      "Čteme rychleji než váš učitel češtiny...",
      "Posuzujeme knihy podle obalu (a pak je stejně čteme)..."
    ],
    
    // TextCard metadata labels
    author: "Autor",
    type: "Typ",
    style: "Styl",
    words: "Slov",
    unknown: "Neznámý",
    untitled: "Bez názvu",
    notSpecified: "Neurčeno",
    text: "Text",
    
    // Info box fallback content
    defaultThemes: "Výuka jazyka, rozšiřování slovní zásoby, porozumění",
    defaultMotifs: "Kulturní prvky, komunikační vzorce, každodenní situace",
    defaultInterpretation: "Tento text vám pomůže porozumět a procvičit běžnou slovní zásobu a fráze v kontextu. Věnujte pozornost tomu, jak jsou myšlenky propojeny a jak je jazyk strukturován, aby efektivně předával význam."
  }
};

/**
 * Get localized string based on the selected language
 * @param {string} language - 'English' or 'Czech'
 * @param {string} key - The translation key
 * @param {Object} params - Parameters to replace in the string (e.g., {current: 1, total: 3})
 * @returns {string} - The localized string
 */
export function getLocalizedString(language, key, params = {}) {
  // Default to English if language not supported
  const selectedLanguage = translations[language] ? language : 'English';
  const translationSet = translations[selectedLanguage];
  
  if (!translationSet || !translationSet[key]) {
    console.warn(`Translation missing for key: ${key} in language: ${selectedLanguage}`);
    // Try to get English version as fallback
    if (selectedLanguage !== 'English' && translations.English && translations.English[key]) {
      return translations.English[key];
    }
    return key; // Return the key itself if translation not found
  }
  
  let translatedString = translationSet[key];
  
  // Replace parameters in string if any
  Object.keys(params).forEach(param => {
    const regex = new RegExp(`{${param}}`, 'g');
    translatedString = translatedString.replace(regex, params[param]);
  });
  
  return translatedString;
} 