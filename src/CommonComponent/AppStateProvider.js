// AppStateProvider.js
import React, { createContext, useEffect, useState } from "react";
import { AppState, Alert } from "react-native";
import { useTranslation } from "react-i18next";

export const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let previousAppState = AppState.currentState;

    const handleAppStateChange = (nextAppState) => {
      const wasBackground = previousAppState.match(/inactive|background/);
      const isNowActive = nextAppState === "active";

      if (wasBackground && isNowActive) {
        console.log("App returned to foreground");
        // Delay ensures isUploading has time to reset (if it's been scheduled with setTimeout)
        setTimeout(() => {
          if (!isUploading) {
            Alert.alert(t("Welcome Back!"), t("You returned to the app."));
          }
        }, 100); // small buffer after returning
      }

      previousAppState = nextAppState;
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [isUploading]); // only re-run if upload status changes

  return (
    <AppStateContext.Provider value={{ appState, isUploading, setIsUploading }}>
      {children}
    </AppStateContext.Provider>
  );
};
