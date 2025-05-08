import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Card, Text, Title, Paragraph, Divider, Chip } from 'react-native-paper';
import { scrollbarStyle } from '../globalStyles';
import { getLocalizedString } from '../localization';

/**
 * TextCard Component
 * Displays a single text with its metadata in a card format
 * 
 * @param {Object} props
 * @param {Object} props.text - The text object to display
 * @param {string} props.text.title - The title of the text
 * @param {string} props.text.source - The source or author of the text
 * @param {string} props.text.type - The type of text (e.g., essay, poem)
 * @param {string} props.text.style - Description of the text's style
 * @param {string} props.text.content - The actual text content
 * @param {number} props.text.wordCount - Word count of the text
 * @param {boolean} props.isDark - Whether dark mode is enabled
 * @param {string} props.language - The selected language (English or Czech)
 */
const TextCard = ({ text, isDark = false, language = 'English' }) => {
  // Function to get localized strings
  const t = (key, params = {}) => getLocalizedString(language, key, params);
  
  // Additional Czech translations for content not handled by the API
  const czechTranslations = {
    // Common themes translations
    "Loss": "Ztráta",
    "Melancholy": "Melancholie", 
    "Autumn": "Podzim",
    "Love": "Láska",
    "Nature": "Příroda",
    "Time": "Čas",
    "Memory": "Paměť",
    // Types
    "Novel excerpt": "Úryvek z románu",
    "Poem": "Báseň",
    "Essay": "Esej",
    "Short story": "Povídka",
    "Quote": "Citát",
    "Text": "Text",
    "Song": "Píseň",
    // Styles
    "Surreal": "Surrealistický",
    "Psychological": "Psychologický",
    "Lyrical": "Lyrický",
    "Romantic": "Romantický",
    "Evocative": "Evokativní",
    "Concise": "Stručný",
    "Direct": "Přímý",
    "Detailed": "Detailní"
  };
  
  // Helper function to translate any text that might not have been translated by the API
  const ensureCzech = (text) => {
    if (language !== 'Czech' || !text) return text;
    
    // Skip if already mostly Czech (contains Czech diacritics)
    const czechChars = ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř', 'š', 'ť', 'ú', 'ů', 'ý', 'ž'];
    const containsMostlyCzech = czechChars.filter(char => text.toLowerCase().includes(char)).length > 2;
    if (containsMostlyCzech) return text;
    
    // Translate the text
    let translated = text;
    Object.keys(czechTranslations).forEach(english => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translated = translated.replace(regex, czechTranslations[english]);
    });
    
    // Remove English articles and prepositions
    translated = translated
      .replace(/\b(the|a|an)\s+/gi, '')
      .replace(/\band\b/gi, 'a')
      .replace(/\bof\b/gi, 'z')
      .replace(/\bin\b/gi, 'v')
      .replace(/\bwith\b/gi, 's');
    
    return translated;
  };
  
  // Define dynamic styles based on dark mode
  const dynamicStyles = {
    card: {
      backgroundColor: isDark ? '#2d2d2d' : 'white',
      borderColor: isDark ? '#444' : '#e0e0e0',
    },
    text: {
      color: isDark ? '#e0e0e0' : '#333',
    },
    divider: {
      backgroundColor: isDark ? '#444' : '#e0e0e0',
    }
  };
  
  // Check if text is valid
  if (!text || typeof text !== 'object') {
    return (
      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title style={[styles.title, dynamicStyles.text]}>
            {t('invalidTextData')}
          </Title>
          <Paragraph style={[styles.content, dynamicStyles.text]}>
            {t('textDisplayError')}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  }

  // Format content for display
  const contentText = typeof text.content === 'string' 
    ? text.content
    : JSON.stringify(text.content, null, 2);

  return (
    <Card style={[styles.card, dynamicStyles.card]}>
      <Card.Content>
        <Title style={[styles.title, dynamicStyles.text]}>
          {text.title || t('untitled')}
        </Title>
        
        <View style={styles.metadataContainer}>
          <Chip icon="account" style={styles.chip} labelStyle={styles.chipLabel}>
            {t('author')}: {text.source || t('unknown')}
          </Chip>
          <Chip icon="book-open-variant" style={styles.chip} labelStyle={styles.chipLabel}>
            {t('type')}: {ensureCzech(text.type) || t('text')}
          </Chip>
        </View>
        
        <View style={styles.styleContainer}>
          <Text style={[styles.styleLabel, dynamicStyles.text]}>{t('style')}:</Text>
          <Text style={[styles.styleText, dynamicStyles.text]}>
            {ensureCzech(text.style) || t('notSpecified')}
          </Text>
        </View>
        
        <Divider style={[styles.divider, dynamicStyles.divider]} />
        
        <ScrollView 
          style={[styles.contentScrollView, scrollbarStyle]}
          contentContainerStyle={styles.contentContainer}
        >
          <Paragraph style={[styles.content, dynamicStyles.text]}>
            {contentText}
          </Paragraph>
        </ScrollView>
        
        <View style={styles.footer}>
          <Text style={[styles.wordCount, dynamicStyles.text]}>
            {t('words')}: {text.wordCount || contentText.split(/\s+/).length}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 4,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 28,
    textAlign: 'center',
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'center',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipLabel: {
    fontSize: 16,
  },
  styleContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  styleLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 18,
  },
  styleText: {
    fontStyle: 'italic',
    flex: 1,
    fontSize: 18,
  },
  divider: {
    marginVertical: 16,
    height: 1.5,
  },
  contentScrollView: {
    maxHeight: 450,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  content: {
    lineHeight: 30,
    marginBottom: 10,
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: 'left',
    whiteSpace: Platform.OS === 'web' ? 'pre-wrap' : undefined,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  wordCount: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default TextCard; 