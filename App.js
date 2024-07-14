import React, { useState } from 'react'; 
import { Image, StatusBar } from 'react-native';
// pages
import Dashboard from './src/screens/Dashboard';
import StartScreen from './src/screens/StartScreen';
import Login from './src/screens/Login';
import BillHistory from './src//screens/BillHistory';
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

import CommonComponent from './src/CommonComponent/CommonComponent';
import {ImagePath} from './src/CommonComponent/ImagePath'; 
import MultipleOption from './src/CommonComponent/MultipleOption'; 
import { useTranslation } from 'react-i18next';
import { ToastProvider } from 'react-native-toast-notifications'
import { Provider } from 'react-native-paper'
import { useThemes } from './src/CommonComponent/Theme';
import Styles from './src/CommonComponent/Styles';
// Navigation
import { NavigationContainer, useRoute } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Vector Icons
import HistoryIcon from 'react-native-vector-icons/MaterialIcons'
import FooterIcon from 'react-native-vector-icons/Entypo'
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default App = () => {
  const {theme, styles, changeTheme} = Styles()
  const { t, i18n } = useTranslation();
  
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
        {/* <Tab.Screen name={t("Support")} component={Support} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image source={ImagePath.Support} tintColor={focused ? '#F29037' : "#666666"} style={{ width: 22, height: 23 }} />
          )
        }}/>
         <Tab.Screen name={t("More")} component={Support} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image source={ImagePath.More} tintColor={focused ? '#F29037' : "#666666"} style={{ width: 22, height: 23 }} />
          )
        }}/> */}
      </Tab.Navigator>
    );
  }

  return (
      <ToastProvider>
        <Provider>
        <StatusBar animated={true} barStyle={'dark-content'} backgroundColor={ styles.statusBarColor }/>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="StartScreen" component={StartScreen}/>
              <Stack.Screen name="Dashboard" component={Dashboard}/>
              <Stack.Screen name="BillHistory" component={BillHistory}/>
              <Stack.Screen name="Support" component={Support}/> 
              <Stack.Screen name="Complaints" component={Complaints}/> 
              <Stack.Screen name="BottomTab" component={BottomTab}/> 
              <Stack.Screen name="BillDue" component={BillDue}/> 
              <Stack.Screen name="Reset" component={Reset}/> 
              <Stack.Screen name="Registration" component={Registration}/> 
              <Stack.Screen name="CommonComponent" component={CommonComponent}/> 
              <Stack.Screen name="PaymentHistory" component={PaymentHistory}/> 
              <Stack.Screen name="MultipleOption" component={MultipleOption}/> 
              <Stack.Screen name="ContactUs" component={ContactUs}/> 
              <Stack.Screen name="FAQ" component={FAQ}/>
              <Stack.Screen name="ViewBillHistoryTable" component={ViewBillHistoryTable}/> 
              <Stack.Screen name="ViewPaymentHistoryTable" component={ViewBillHistoryTable}/> 
              <Stack.Screen name="NewRegisteration"component={NewRegisteration}/>
            </Stack.Navigator> 
          </NavigationContainer>
        </Provider>
      </ToastProvider>
  )
}