/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import i18next from "./Languages/i18next";
import {AppStateProvider} from './src/CommonComponent/AppStateProvider'; // Import the global state provider

const Root = () => (
  <AppStateProvider>
    <App />
  </AppStateProvider>
);

AppRegistry.registerComponent(appName, () => Root);
