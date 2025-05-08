import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, RadioButton, Title, Surface, useTheme } from 'react-native-paper';
import { router } from 'expo-router';

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Czech', label: 'Czech' }
];

const modes = [
  { value: 'EASY', label: 'EASY - ~200 words', color: '#4CAF50' },
  { value: 'MEDIUM', label: 'MEDIUM - ~400 words', color: '#FF9800' },
  { value: 'GRIND', label: 'GRIND - ~600-700 words', color: '#F44336' }
];

export default function HomeScreen() {
  const [language, setLanguage] = useState(languages[0].value);
  const [mode, setMode] = useState(modes[0].value);
  const theme = useTheme();

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Title style={styles.headerTitle}>WordFuel</Title>
          <Text style={styles.headerSubtitle}>
            Expand your vocabulary with daily curated real-world texts
          </Text>
        </View>

        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Select Language</Title>
          <RadioButton.Group onValueChange={value => setLanguage(value)} value={language}>
            {languages.map((lang) => (
              <RadioButton.Item 
                key={lang.value}
                label={lang.label} 
                value={lang.value}
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>
        </Surface>

        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Select Daily Mode</Title>
          <RadioButton.Group onValueChange={value => setMode(value)} value={mode}>
            {modes.map((modeOption) => (
              <RadioButton.Item 
                key={modeOption.value}
                label={modeOption.label} 
                value={modeOption.value}
                style={styles.radioItem}
                labelStyle={{color: modeOption.color}}
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
          Get Daily Dose
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  radioItem: {
    paddingVertical: 8,
  },
  button: {
    padding: 8,
    marginTop: 16,
    width: '100%',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
}); 