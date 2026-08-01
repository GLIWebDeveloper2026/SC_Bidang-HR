import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
}
