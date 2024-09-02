import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light',
  content: 'light-content',
  backgroundColor: '#E5EEE0',
  textColor: '#000',
  textColorSecondary: '#000',
  statusBarColor: '#fff',
  statusBarIconColor: '#000',
  topBarBackgroundcolor: '#FFF',
  themeBackgroundColor: '#f2f2f2',
  energySavingText: '#F29037',
  energySavingIcon: '#5FA756',
  headerBackgroundColor: '#70B767',
  headerText: '#F2F2F2',
  imageNameColor: '#000'
};

export const darkTheme = {
  mode: 'dark',
  content: 'dark-content',
  backgroundColor: '#666666',
  textColor: '#FFF',
  statusBarColor: '#63AA5A',
  statusBarIconColor: '#FFF',
  topBarBackgroundcolor: '#70B767',
  textColorSecondary: '#FFF',
  themeBackgroundColor: '#70B767',
  energySavingText: '#F29037',
  energySavingIcon: '#F29037',
  headerBackgroundColor: '#5FA756',
  headerText: '#666666',
  imageNameColor: '#666666'
};

export const useThemes = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('SelectedTheme');
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          setTheme(Appearance.getColorScheme());
        }
      } catch (error) {
        console.error('Error fetching theme from AsyncStorage:', error);
      }
    };

    fetchTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const changeTheme = async (selectedTheme) => {
    console.log(selectedTheme, "selectedTheme", theme)
    try {
      setTheme(selectedTheme);
      await AsyncStorage.setItem('SelectedTheme', selectedTheme);
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
    }
  };

  const themeObj = theme === 'dark' ? darkTheme : lightTheme;

  return { theme, themeObj, changeTheme };
};
