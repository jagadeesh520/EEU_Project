import React, { useState, useEffect, useRef } from 'react'; 
import { Image, StatusBar, AppState, Alert } from 'react-native';
// pages
import Dashboard from './src/screens/Dashboard';
import StartScreen from './src/screens/StartScreen';
import Login from './src/screens/Login';
import BillHistory from './src/screens/BillHistory';
import Support from './src/screens/Support';
import Complaints from './src/screens/Complaints';
import BillDue from './src/screens/BillDue';
import Registration from './src/screens/Registration';
import Reset from './src/screens/Reset';
import PaymentHistory from './src/screens/PaymentHistory';
import ContactUs from './src/screens/ContactUs';
import FAQ from './src/screens/FAQ';
import ViewBillHistoryTable from './src/screens/ViewBillHistoryTable';
import ViewPaymentHistoryTable from './src/screens/ViewPaymentHistoryTable';
import NewRegisteration from './src/screens/NewRegistration';
import Payment from './src/screens/Payment';
import ForgetPassword from './src/screens/ForgetPassword';
import CommonComponent from './src/CommonComponent/CommonComponent';
import { ImagePath } from './src/CommonComponent/ImagePath'; 
import MultipleOption from './src/CommonComponent/MultipleOption'; 
import { useTranslation } from 'react-i18next';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-native-paper';
import Styles from './src/CommonComponent/Styles';
// Navigation
import { NavigationContainer, useNavigation, useIsFocused } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Idle Timer Component
const IdleTimer = ({ navigation }) => {
  const [idleTime, setIdleTime] = useState(0);
  const appState = useRef(AppState.currentState);
  const idleTimer = useRef(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        const currentTime = Date.now();
        const elapsed = currentTime - idleTime;

        if (elapsed >= 300000) { // 5 minutes in milliseconds
          Alert.alert(
              '',
              "Your session has expired due to inactivity. Please log in again to resume.",
              [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
              ]
            );
        }
      }

      if (nextAppState.match(/inactive|background/)) {
        setIdleTime(Date.now());
      } else {
        setIdleTime(0);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (idleTimer.current) {
        clearInterval(idleTimer.current);
      }
    };
  }, [idleTime, navigation]);

  return null; // This component doesn't render anything
};

// App Component
const App = () => {
  const { theme, styles, changeTheme } = Styles();
  const { t } = useTranslation();

  const BottomTab = () => {
    return (
      <Tab.Navigator initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarStyle: {
            paddingVertical: 10,
          },
          tabBarActiveTintColor: '#F29037'
        }}  
      >
        <Tab.Screen name={t("Home")} component={Dashboard} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image tintColor={focused ? '#F29037' : "#666666"} source={ImagePath.Home_Image} style={{ width: 22, height: 23 }} />
          )
        }}/>
        <Tab.Screen name={t("FAQ")} component={FAQ} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image source={ImagePath.FQA} tintColor={focused ? '#F29037' : "#666666"} style={{ width: 22, height: 23 }} />
          )
        }}
        />
        <Tab.Screen name={t("Contact Us")} component={ContactUs} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image source={ImagePath.ContactUs} tintColor={focused ? '#F29037' : "#666666"} style={{ width: 15, height: 20 }} />
          )
        }}/>
      </Tab.Navigator>
    );
  };

  const RootNavigator = () => {
    const navigation = useNavigation();

    return (
      <>
        <IdleTimer navigation={navigation} />
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="BillHistory" component={BillHistory} />
          <Stack.Screen name="Support" component={Support} /> 
          <Stack.Screen name="Complaints" component={Complaints} /> 
          <Stack.Screen name="BottomTab" component={BottomTab} /> 
          <Stack.Screen name="BillDue" component={BillDue} /> 
          <Stack.Screen name="Reset" component={Reset} /> 
          <Stack.Screen name="Registration" component={Registration} /> 
          <Stack.Screen name="CommonComponent" component={CommonComponent} /> 
          <Stack.Screen name="PaymentHistory" component={PaymentHistory} /> 
          <Stack.Screen name="MultipleOption" component={MultipleOption} /> 
          <Stack.Screen name="ContactUs" component={ContactUs} /> 
          <Stack.Screen name="FAQ" component={FAQ} />
          <Stack.Screen name="ViewBillHistoryTable" component={ViewBillHistoryTable} /> 
          <Stack.Screen name="ViewPaymentHistoryTable" component={ViewBillHistoryTable} /> 
          <Stack.Screen name="NewRegisteration" component={NewRegisteration} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        </Stack.Navigator>
      </>
    );
  };

  return (
    <ToastProvider>
      <Provider>
        <StatusBar animated={true} barStyle={'dark-content'} backgroundColor={styles.statusBarColor} />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </ToastProvider>
  );
};

export default App;
