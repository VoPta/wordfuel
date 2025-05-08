import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

// Apply global styles for web platform
export const applyGlobalWebStyles = () => {
  if (typeof document !== 'undefined') {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      /* Custom scrollbar styling */
      ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.5);
      }
      
      /* Fix for GitHub Pages absolute path issues */
      a[href^="/"] {
        /* Replace all absolute paths with the correct base path */
        href: attr(href url('/wordfuel'));
      }
    `;
    
    // Append the style element to the head
    document.head.appendChild(style);
  }
};

// Custom scrollbar style for specific components (React Native Web)
export const scrollbarStyle = Platform.OS === 'web' ? { 
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)',
} : {}; 