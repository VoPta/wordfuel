import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, useColorScheme, ScrollView, Modal, Pressable, Platform } from 'react-native';
import { Text, Button, Appbar, Title, useTheme, IconButton, Portal, Surface } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { scrollbarStyle } from './globalStyles';
import { getLocalizedString } from './localization';
import Head from '../components/Head';

import { getTexts } from './api';
import TextCard from './components/TextCard';

export default function TextScreen() {
  const { language, mode } = useLocalSearchParams();
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getModeColor = (modeValue) => {
    switch (modeValue) {
      case 'EASY':
        return '#4CAF50'; // Green
      case 'MEDIUM':
        return '#FF9800'; // Orange
      case 'GRIND':
        return '#F44336'; // Red
      default:
        return theme.colors.primary;
    }
  };

  // Define dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    text: {
      color: isDark ? '#e0e0e0' : '#333',
    },
  };

  const fetchTexts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch texts based on the selected language and mode
      const response = await getTexts(language, mode);
      console.log(`Received ${response.length} texts from API`);
      
      // Debug the structure of what we received
      if (response && Array.isArray(response)) {
        response.forEach((text, i) => {
          console.log(`Text ${i+1}:`, JSON.stringify({
            title: text.title,
            source: text.source,
            wordCount: text.wordCount,
            contentPreview: text.content ? text.content.substring(0, 50) + '...' : 'No content'
          }));
        });
      } else {
        console.error("Response is not an array:", response);
      }
      
      if (response && Array.isArray(response) && response.length > 0) {
        setTexts(response);
        
        // Calculate total word count
        const total = response.reduce((sum, text) => sum + (text.wordCount || 0), 0);
        setTotalWordCount(total);
        
        // Reset to first text
        setCurrentTextIndex(0);
      } else {
        setError('No texts found for this language and mode');
      }
    } catch (err) {
      console.error("Error fetching texts:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, [language, mode]);

  useEffect(() => {
    if (!loading) return;
    
    // Set initial message
    setLoadingMessage(getRandomLoadingMessage());
    
    // Change message every 3 seconds
    const interval = setInterval(() => {
      setLoadingMessage(getRandomLoadingMessage());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [loading, language]);

  const handleBack = () => {
    router.replace('/');
  };

  const handleReload = () => {
    fetchTexts();
  };

  const handlePrevious = () => {
    console.log(`Navigating from text ${currentTextIndex + 1} to ${currentTextIndex}`);
    if (currentTextIndex > 0) {
      setCurrentTextIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNext = () => {
    console.log(`Navigating from text ${currentTextIndex + 1} to ${currentTextIndex + 2}`);
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(prevIndex => prevIndex + 1);
    }
  };

  // Get the current text
  const currentText = texts.length > 0 ? texts[currentTextIndex] : null;

  // Additional Czech translations for text data
  const czechTranslations = {
    // Common themes translations
    "Loss": "Ztráta",
    "Melancholy": "Melancholie", 
    "Autumn": "Podzim",
    "Love": "Láska",
    "Nature": "Příroda",
    "Time": "Čas",
    "Memory": "Paměť",
    "Sun": "Slunce",
    "Shadow": "Stín",
    "Fading": "Vytrácející se",
    // Common phrases
    "Simple yet": "Jednoduchý přesto",
    "Evocative lyrics": "Evokativní text písně",
    "Expressing the bittersweet feelings": "Vyjadřující hořkosladké pocity",
    "Bittersweet feelings of nostalgia": "Hořkosladké pocity nostalgie",
    "Passage of time": "Plynutí času"
  };
  
  // Helper function to translate any remaining English text to Czech
  const ensureCzechText = (text) => {
    if (language !== 'Czech' || !text) return text;
    
    // If text already contains several Czech characters, assume it's mostly Czech
    const czechChars = ['á', 'č', 'ď', 'é', 'ě', 'í', 'ň', 'ó', 'ř', 'š', 'ť', 'ú', 'ů', 'ý', 'ž'];
    if (czechChars.filter(char => text.includes(char)).length > 3) return text;
    
    // Try to translate by word and phrases
    let result = text;
    
    // First try phrases (longer first)
    Object.keys(czechTranslations)
      .filter(key => key.includes(' '))
      .sort((a, b) => b.length - a.length)
      .forEach(phrase => {
        const regex = new RegExp(phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
        result = result.replace(regex, czechTranslations[phrase]);
      });
    
    // Then try individual words
    Object.keys(czechTranslations)
      .filter(key => !key.includes(' '))
      .sort((a, b) => b.length - a.length)
      .forEach(word => {
        const regex = new RegExp(`\\b${word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
        result = result.replace(regex, czechTranslations[word]);
      });
    
    // Clean up common English words
    result = result
      .replace(/\b(the|a|an)\s+/gi, '')
      .replace(/\band\b/gi, 'a')
      .replace(/\bof\b/gi, 'z')
      .replace(/\bin\b/gi, 'v')
      .replace(/\bwith\b/gi, 's')
      .replace(/\bfrom\b/gi, 'od')
      .replace(/\bto\b/gi, 'k');
    
    return result;
  };

  // Modal toggle function
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  // Ensure modal stays closed
  const closeModal = () => {
    setModalVisible(false);
  };

  // Get localized strings based on selected language
  const t = (key, params = {}) => getLocalizedString(language, key, params);

  // Function to get a random funny loading message
  const getRandomLoadingMessage = () => {
    const messages = t('funnyLoadingMessages');
    if (Array.isArray(messages) && messages.length > 0) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      return messages[randomIndex];
    }
    return t('loadingTexts');
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <Head 
        title={`WordFuel - ${mode} Mode Texts`}
        description={`Read curated texts in ${language} to expand your vocabulary and improve your language skills`}
        language={language}
      />
      <View style={styles.backButtonContainer}>
        <Button
          mode="outlined"
          onPress={handleBack}
          style={[styles.homeButton, { borderColor: getModeColor(mode) }]}
          contentStyle={styles.homeButtonContent}
          icon="home"
          labelStyle={{ color: getModeColor(mode) }}
        >
          {t('home')}
        </Button>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={getModeColor(mode)} />
            <Text style={[styles.loadingText, dynamicStyles.text]}>{loadingMessage}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="contained" onPress={fetchTexts} style={styles.retryButton}>
              {t('retryButton')}
            </Button>
          </View>
        ) : texts.length === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.emptyText, dynamicStyles.text]}>{t('noTextsFound')}</Text>
            <Button mode="contained" onPress={handleBack} style={styles.retryButton}>
              {t('goBackButton')}
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.contentWrapper}>
              <ScrollView 
                contentContainerStyle={styles.contentScrollContainer}
                style={scrollbarStyle}
              >
                <View style={styles.centeredContentContainer}>
                  <View style={styles.textCenteringContainer}>
                    <View style={styles.cardContainer}>
                      <TextCard text={currentText} isDark={isDark} language={language} />
                    </View>
                    
                    {/* Navigation directly under the text content */}
                    <View style={styles.navigationContainer}>
                      <View style={styles.paginationContainer}>
                        {currentTextIndex > 0 ? (
                          <Button 
                            mode="outlined" 
                            onPress={handlePrevious}
                            style={[styles.navButton, { borderColor: getModeColor(mode) }]}
                            contentStyle={styles.navButtonContent}
                            labelStyle={{ fontSize: 0 }}
                          >
                            <Text style={[styles.navButtonIcon, { color: getModeColor(mode) }]}>‹</Text>
                          </Button>
                        ) : (
                          <View style={styles.navButtonPlaceholder} />
                        )}
                        
                        <Text style={[styles.paginationText, dynamicStyles.text]}>
                          {t('textPageOf', { current: currentTextIndex + 1, total: texts.length })}
                        </Text>
                        
                        {currentTextIndex < texts.length - 1 ? (
                          <Button 
                            mode="outlined" 
                            onPress={handleNext}
                            style={[styles.navButton, { borderColor: getModeColor(mode) }]}
                            contentStyle={styles.navButtonContent}
                            labelStyle={{ fontSize: 0 }}
                          >
                            <Text style={[styles.navButtonIcon, { color: getModeColor(mode) }]}>›</Text>
                          </Button>
                        ) : (
                          <View style={styles.navButtonPlaceholder} />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.wordCountContainer}>
                <View style={styles.wordCountRow}>
                  <Text style={[styles.wordCountText, dynamicStyles.text, { opacity: 0.7 }]}>
                    {t('totalWords')}: {totalWordCount}
                  </Text>
                  <IconButton
                    icon="information-outline"
                    size={20}
                    iconColor={isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"}
                    onPress={toggleModal}
                  />
                </View>
              </View>

              {/* Modal for text insights */}
              <Portal>
                <Modal
                  visible={modalVisible}
                  onDismiss={closeModal}
                  transparent={true}
                  animationType="none"
                >
                  <View style={StyleSheet.absoluteFill}>
                    {modalVisible && (
                      <BlurView
                        intensity={Platform.OS === 'ios' ? 25 : 50}
                        tint={isDark ? 'dark' : 'light'}
                        style={[StyleSheet.absoluteFill, styles.blurView]}
                      />
                    )}
                  </View>
                  <Pressable 
                    style={[
                      styles.modalPressable,
                      { opacity: modalVisible ? 1 : 0 }
                    ]} 
                    onPress={closeModal}
                  >
                    <Pressable 
                      onPress={(e) => e.stopPropagation()}
                      style={styles.modalContentWrapper}
                    >
                      <Surface style={[
                        styles.modalContent, 
                        dynamicStyles.container,
                        { transform: [{ scale: modalVisible ? 1 : 0.95 }] }
                      ]}>
                        <View style={styles.modalHeader}>
                          <IconButton
                            icon="information-outline"
                            size={26}
                            iconColor={isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"}
                          />
                          <IconButton
                            icon="close"
                            size={24}
                            onPress={closeModal}
                            iconColor={isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"}
                          />
                        </View>
                        
                        {currentText && (
                          <ScrollView 
                            style={[styles.modalScrollContent, scrollbarStyle]}
                          >
                            <View style={styles.insightSection}>
                              <Text style={[styles.insightTitle, dynamicStyles.text]}>
                                {t('themes')}
                              </Text>
                              <Text style={[styles.insightText, dynamicStyles.text]}>
                                {ensureCzechText(currentText.themes || t('defaultThemes'))}
                              </Text>
                            </View>
                            
                            <View style={styles.insightSection}>
                              <Text style={[styles.insightTitle, dynamicStyles.text]}>
                                {t('motifs')}
                              </Text>
                              <Text style={[styles.insightText, dynamicStyles.text]}>
                                {ensureCzechText(currentText.motifs || t('defaultMotifs'))}
                              </Text>
                            </View>
                            
                            <View style={styles.insightSection}>
                              <Text style={[styles.insightTitle, dynamicStyles.text]}>
                                {t('interpretation')}
                              </Text>
                              <Text style={[styles.insightText, dynamicStyles.text]}>
                                {ensureCzechText(currentText.interpretation || t('defaultInterpretation'))}
                              </Text>
                            </View>
                          </ScrollView>
                        )}
                        
                        <Button 
                          mode="outlined" 
                          onPress={closeModal}
                          style={[styles.closeButton, { borderColor: getModeColor(mode) }]}
                          labelStyle={{ color: getModeColor(mode) }}
                        >
                          {t('closeButton')}
                        </Button>
                      </Surface>
                    </Pressable>
                  </Pressable>
                </Modal>
              </Portal>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  homeButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    elevation: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  homeButtonContent: {
    paddingHorizontal: 12,
    height: 40,
  },
  content: {
    flex: 1,
    position: 'relative',
    paddingTop: 16, // Add top padding since we removed the AppBar
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  contentScrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 70, // Increase to account for word count container
    justifyContent: 'center', // Center content vertically
    display: 'flex',
  },
  centeredContentContainer: {
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center', // Center content vertically
    display: 'flex',
  },
  textCenteringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
  },
  navigationContainer: {
    marginTop: 16,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  paginationText: {
    fontSize: 18,
    opacity: 0.7,
    marginHorizontal: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderWidth: 2,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  navButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  navButtonContent: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  navButtonIcon: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 38,
    fontWeight: 'bold',
  },
  wordCountContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  wordCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  retryButton: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    opacity: 0.7,
    padding: 20,
  },
  
  // Modal styles
  blurView: {
    opacity: 1,
  },
  modalPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transition: Platform.OS === 'web' ? 'opacity 0.2s ease-out' : undefined,
  },
  modalContentWrapper: {
    width: '90%',
    maxWidth: 480,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    maxHeight: '85%',
    elevation: 5,
    overflow: Platform.OS === 'web' ? 'auto' : 'hidden',
    transition: Platform.OS === 'web' ? 'transform 0.2s ease-out' : undefined,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalScrollContent: {
    marginBottom: 20,
    maxHeight: Platform.OS === 'web' ? 'calc(100vh - 200px)' : undefined,
  },
  insightSection: {
    marginBottom: 24,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 17,
    lineHeight: 26,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
}); 