import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from "i18next-browser-languagedetector";
import Eng from "./english.json";
import አማርኛ from "./amharic.json";




const resources = {
    Eng,
    አማርኛ,
  };

export const availableLanguage = Object.keys(resources);

i18n.use(initReactI18next)
.init({
    compatibilityJSON: 'v3', 
    resources,
    lng: 'English',
    defaultNS: "translations",
    fallbackLng: "English"
})