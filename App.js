  import React, { useState, useEffect, useRef } from 'react';
  import { Image, StatusBar, AppState, Alert } from 'react-native';
  import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

  // Screens
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
  import ServiceRequest from './src/screens/ServiceRequest';
  import ServiceShifting from './src/screens/ServiceShifting';
  import NameChange from './src/screens/NameChange';
  import LoadChange from './src/screens/LoadChange';
  import DisOrReconnection from './src/screens/DisOrReconnection';
  import MoveOutServiceRequest from './src/screens/MoveOutServiceRequest';
  import Miscellaneous from './src/screens/Miscellaneous';
  import FindCSC from './src/screens/FindCSC';
  import ServiceRequestStatus from './src/screens/ServiceRequestStatus';
  import CANumberTrack from './src/screens/CANumberTrack';
  import DocumentUpload from './src/screens/DocumentUpload';
  import CommonComponent from './src/CommonComponent/CommonComponent';
  import { ImagePath } from './src/CommonComponent/ImagePath';
  import MultipleOption from './src/CommonComponent/MultipleOption';
  import { useTranslation } from 'react-i18next';
  import { ToastProvider } from 'react-native-toast-notifications';
  import { Provider } from 'react-native-paper';
  import Styles from './src/CommonComponent/Styles';

  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import Location from 'react-native-vector-icons/FontAwesome5';

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const navigationRef = React.createRef();

  // ✅ Idle Timer Component
  const IdleTimer = ({ navigation, currentRoute }) => {
    const [lastActive, setLastActive] = useState(Date.now());
    const appState = useRef(AppState.currentState);
    const alertShown = useRef(false);
    const sessionExpired = useRef(false);
    const ignoreUntil = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
      global.resetIdleTimer = () => {
        setLastActive(Date.now());
        alertShown.current = false;
        sessionExpired.current = false;
        ignoreUntil.current = Date.now() + 30000; // 30 seconds grace period
      };
    }, []);

    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          setLastActive(Date.now());
          alertShown.current = false;
          sessionExpired.current = false;
          ignoreUntil.current = Date.now() + 30000;
        }
        appState.current = nextAppState;
      };

      const appStateListener = AppState.addEventListener('change', handleAppStateChange);

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastActive;
        console.log("welcomr",elapsed)

        if (
          elapsed >= 120000 && // 2.5 min 
          currentRoute !== 'Login' &&
          currentRoute !== 'StartScreen' &&
          !alertShown.current &&
          !sessionExpired.current &&
          now > ignoreUntil.current // prevent alert if within grace period
        ) {
          alertShown.current = true;

          Alert.alert(
            '',
            'Your session is about to expire due to inactivity, or the server is not responding or is slow. Do you want to continue ?',
            [
              {
                text: 'Logout',
                onPress: () => {
                  sessionExpired.current = true;
                  alertShown.current = false;
                  navigation.navigate('Login');
                },
                style: 'destructive',
              },
              {
                text: 'Continue',
                onPress: () => {
                  setLastActive(Date.now());
                  alertShown.current = false;
                  sessionExpired.current = false;
                  ignoreUntil.current = Date.now() + 30000; // extend silence
                },
              },
            ],
            { cancelable: false }
          );
        }
      }, 120000);

      return () => {
        appStateListener.remove();
        clearInterval(intervalRef.current);
      };
    }, [currentRoute]);

    return null;
  };

  // 🔄 Recursive active route fetch
  const getActiveRouteName = (state) => {
    if (!state || !state.routes) return null;
    const route = state.routes[state.index];
    if (route.state) return getActiveRouteName(route.state);
    return route.name;
  };

  // Bottom Tabs
  const BottomTab = () => {
    const { t } = useTranslation();

    return (
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 13 },
          tabBarStyle: { paddingVertical: 10 },
          tabBarActiveTintColor: '#F29037',
        }}
      >
        <Tab.Screen
          name={t("Home")}
          component={Dashboard}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                tintColor={focused ? '#F29037' : "#666666"}
                source={ImagePath.Home_Image}
                style={{ width: 22, height: 23 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t("FAQ")}
          component={FAQ}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={ImagePath.FQA}
                tintColor={focused ? '#F29037' : "#666666"}
                style={{ width: 22, height: 23 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t("Find CSC")}
          component={FindCSC}
          options={{
            tabBarIcon: ({ focused }) => (
              <Location
                name="search-location"
                size={17}
                color={focused ? '#F29037' : "#666666"}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t("Contact Us")}
          component={ContactUs}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={ImagePath.ContactUs}
                tintColor={focused ? '#F29037' : "#666666"}
                style={{ width: 15, height: 20 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  // Main Stack Navigation
  const RootNavigator = ({ currentRoute }) => {
    return (
      <>
        {currentRoute && (
          <IdleTimer
            navigation={navigationRef.current}
            currentRoute={currentRoute}
          />
        )}
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
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
          <Stack.Screen name="ViewPaymentHistoryTable" component={ViewPaymentHistoryTable} />
          <Stack.Screen name="NewRegisteration" component={NewRegisteration} />
          <Stack.Screen name="Payment" component={Payment} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="ServiceRequest" component={ServiceRequest} />
          <Stack.Screen name="ServiceShifting" component={ServiceShifting} />
          <Stack.Screen name="NameChange" component={NameChange} />
          <Stack.Screen name="LoadChange" component={LoadChange} />
          <Stack.Screen name="DisOrReconnection" component={DisOrReconnection} />
          <Stack.Screen name="MoveOutServiceRequest" component={MoveOutServiceRequest} />
          <Stack.Screen name="Miscellaneous" component={Miscellaneous} />
          <Stack.Screen name="ServiceRequestStatus" component={ServiceRequestStatus} />
          <Stack.Screen name="CANumberTrack" component={CANumberTrack} />
          <Stack.Screen name="DocumentUpload" component={DocumentUpload} />
        </Stack.Navigator>
      </>
    );
  };

  // App Component
  const App = () => {
    const { styles } = Styles();
    const [currentRoute, setCurrentRoute] = useState(null);

    useEffect(() => {
      checkForUpdate(UpdateFlow.IMMEDIATE).catch(() => {});
    }, []);

    const onStateChange = () => {
      const state = navigationRef.current?.getRootState();
      const activeRoute = getActiveRouteName(state);
      setCurrentRoute(activeRoute);
    };

    return (
      <ToastProvider>
        <Provider>
          <StatusBar animated={true} barStyle={'dark-content'} backgroundColor={styles.statusBarColor} />
          <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
            <RootNavigator currentRoute={currentRoute} />
          </NavigationContainer>
        </Provider>
      </ToastProvider>
    );
  };

  export default App;
