import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import React, { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const pathname = usePathname();
  
  // Help with GitHub Pages routing
  useEffect(() => {
    if (Platform.OS === 'web' && pathname && pathname.startsWith('/wordfuel')) {
      // Handle GitHub Pages route
      const cleanPath = pathname.replace('/wordfuel', '');
      if (cleanPath !== '/+not-found') {
        window.location.replace(`/wordfuel${cleanPath}`);
      }
    }
  }, [pathname]);
  
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant="headlineLarge">Page Not Found</Text>
        <Text style={styles.paragraph}>The page you're looking for doesn't exist or has been moved.</Text>
        <Link href="/" asChild>
          <Button mode="contained" style={styles.button}>
            Go to Home Screen
          </Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    marginVertical: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
  }
});
