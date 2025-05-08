import React, { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Head component for setting document title and other head metadata on web
 * Has no effect on native platforms
 * 
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} props.description - Meta description for the page
 * @param {string} props.language - The language of the page content (en, cs, etc.)
 */
const Head = ({ title, description, language = 'en' }) => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Set page title
      if (title) {
        document.title = title;
      }
      
      // Set meta description
      if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        
        metaDescription.content = description;
      }

      // Set language
      document.documentElement.lang = language === 'Czech' ? 'cs' : 'en';
      
      // Add viewport meta tag if it doesn't exist
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(viewport);
      }
      
      // Add theme color meta tag
      let themeColor = document.querySelector('meta[name="theme-color"]');
      if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#2196F3'; // Default blue theme color
        document.head.appendChild(themeColor);
      }
    }
  }, [title, description, language]);
  
  // This component doesn't render anything
  return null;
};

export default Head; 