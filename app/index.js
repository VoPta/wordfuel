import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, useColorScheme, Platform } from 'react-native';
import { Text, Button, RadioButton, Title, Surface, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { applyGlobalWebStyles, scrollbarStyle } from './globalStyles';
import { getLocalizedString } from './localization';
import Head from '../components/Head';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Czech', label: 'Čeština' }
];

const modes = [
  { value: 'EASY', label: 'EASY ~200 words', color: '#4CAF50' },
  { value: 'MEDIUM', label: 'MEDIUM ~400 words', color: '#FF9800' },
  { value: 'GRIND', label: 'GRIND ~600-700 words', color: '#F44336' }
];

export default function HomeScreen() {
  const [language, setLanguage] = useState(languages[0].value);
  const [mode, setMode] = useState(modes[0].value);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Apply global styles for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      applyGlobalWebStyles();
    }
  }, []);

  // Function to get localized strings
  const t = (key, params = {}) => getLocalizedString(language, key, params);

  const getModeColor = (modeValue) => {
    const selectedMode = modes.find(m => m.value === modeValue);
    return selectedMode ? selectedMode.color : theme.colors.primary;
  };

  const handleGetDailyDose = () => {
    // Navigate to the TextScreen with the selected language and mode
    router.push({
      pathname: '/text',
      params: { language, mode }
    });
  };

  // Define dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? '#121212' : '#f5f5f5',
    },
    mainContent: {
      backgroundColor: isDark ? '#1e1e1e' : 'white',
      borderColor: isDark ? '#333' : '#e0e0e0',
    },
    text: {
      color: isDark ? '#e0e0e0' : '#333',
    },
    section: {
      backgroundColor: isDark ? '#2d2d2d' : '#fff',
      borderColor: isDark ? '#444' : '#e0e0e0',
    },
    divider: {
      borderColor: isDark ? '#444' : '#f0f0f0',
    }
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <Head 
        title="WordFuel - Expand Your Vocabulary" 
        description="Improve your vocabulary with daily curated real-world texts in multiple languages"
        language={language}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={scrollbarStyle}
      >
        <View style={[styles.mainContentContainer, dynamicStyles.mainContent]}>
          <View style={styles.headerContainer}>
            <Title style={[styles.headerTitle, dynamicStyles.text]}>{t('appTitle')}</Title>
            <Text style={[styles.headerSubtitle, dynamicStyles.text]}>
              {t('appSubtitle')}
            </Text>
          </View>

          <Surface style={[styles.section, dynamicStyles.section]}>
            <Title style={[styles.sectionTitle, dynamicStyles.text]}>{t('selectLanguage')}</Title>
            <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
              {languages.map((lang) => (
                <RadioButton.Item 
                  key={lang.value}
                  label={lang.label} 
                  value={lang.value}
                  style={[styles.radioItem, dynamicStyles.divider]}
                  labelStyle={[styles.radioItemLabel, dynamicStyles.text]}
                />
              ))}
            </RadioButton.Group>
          </Surface>

          <Surface style={[styles.section, dynamicStyles.section]}>
            <Title style={[styles.sectionTitle, dynamicStyles.text]}>{t('selectMode')}</Title>
            <RadioButton.Group onValueChange={value => setMode(value)} value={mode}>
              {modes.map((modeOption) => (
                <RadioButton.Item 
                  key={modeOption.value}
                  label={modeOption.label} 
                  value={modeOption.value}
                  style={[styles.radioItem, dynamicStyles.divider]}
                  labelStyle={{...styles.radioItemLabel, color: modeOption.color}}
                  uncheckedColor={modeOption.color}
                  color={modeOption.color}
                />
              ))}
            </RadioButton.Group>
          </Surface>

          <Button
            mode="contained"
            onPress={handleGetDailyDose}
            style={[styles.button, {backgroundColor: getModeColor(mode)}]}
            labelStyle={styles.buttonLabel}
          >
            {t('getDailyDose')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContentContainer: {
    width: '100%',
    maxWidth: 600, // Limit width on larger screens
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 42, // Increased font size even more
    fontWeight: 'bold',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 18, // Increased font size
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    maxWidth: 400,
  },
  section: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 24, // Increased font size
    marginBottom: 16,
    fontWeight: 'bold',
  },
  radioItem: {
    paddingVertical: 12, // Increased vertical padding
    borderBottomWidth: 1,
  },
  radioItemLabel: {
    fontSize: 18, // Added larger font size for radio labels
    fontWeight: '500',
  },
  button: {
    padding: 8,
    marginTop: 16,
    width: '100%',
    borderRadius: 8,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    padding: 6,
  },
}); 