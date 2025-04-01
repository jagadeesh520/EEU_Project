// AppStateProvider.js
import React, { createContext, useEffect, useState } from "react";
import { AppState, Alert } from "react-native";
import { useTranslation } from 'react-i18next';

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App is back in foreground!");
        Alert.alert(t("Welcome Back!"), t("You returned to the app."));
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};
