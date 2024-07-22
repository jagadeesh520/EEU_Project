import React, {useState, useEffect} from 'react';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light', // Set the mode property for the light theme
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
  mode: 'dark', // Set the mode property for the dark theme
  content: 'dark-content',
  backgroundColor: '#666666',
  textColor: '#000',
  statusBarColor: '#63AA5A',
  statusBarIconColor: '#000',
  topBarBackgroundcolor: '#70B767',
  textColorSecondary: '#FFF',
  themeBackgroundColor: '#70B767',
  energySavingText: '#F29037',
  energySavingIcon: '#F29037',
  headerBackgroundColor: '#5FA756',
  headerText: '#666666',
  imageNameColor: '#666666'

};

// Function to determine the current system theme
export const useThemes = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const onMount = async () => {
      try {
        const colorScheme = await AsyncStorage.getItem('SelectedTheme');
        setTheme(colorScheme);
      } catch (error) {
        console.error('Error resetting AsyncStorage:', error);
      }
    };

    onMount();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const onChangeTheme = async colorScheme => {
    try {
      setTheme(colorScheme);
      await AsyncStorage.setItem('SelectedTheme', colorScheme);
    } catch (error) {
      console.error('Error resetting AsyncStorage:', error);
    }
  };

  const themeObj = theme === 'dark' ? darkTheme : lightTheme;
  return {theme, themeObj, changeTheme: onChangeTheme};
};