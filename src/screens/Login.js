//import liraries
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput, ToastAndroid, Modal, StyleSheet } from 'react-native';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
// import { TextInput } from 'react-native-paper';
import { constant } from '../CommonComponent/Constant';
import { postAPICall } from '../CommonComponent/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { availableLanguage } from '../../Languages/i18next'
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome5';

// create a component
const Login = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles()
    const [ accNo, setAccNo] = useState("")
    const [ password, setPassword] = useState("")
    const [ accNoError, setAccNoError ] = useState("")
    const [ passwordError, setPasswordError ] = useState("")
    const [showPassword, setShowPassword] = useState(true)
    const [ language, setLanguage] = useState([
      { label: 'Select Language', value: '' },
      { label: 'English', value: 'en' },
      { label: 'Amharic', value: 'am' }
    ]);
    const [ selectLanguage, setSelectLanguage ] = useState("")
   
    const storeData = async (value) => {
      console.log(value, "value")
      try {
        await AsyncStorage.setItem('accountData', JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };
    const showToast = (type, message) => {
      toast.show(message, {
        type: type,
        duration: 4000,
        animationType: 'slide-in',
        placement: 'bottom',
        style: {
          backgroundColor: type === 'success' ? 'green' : 'red',
        },
        textStyle: {
          color: 'white',
        },
        closeButton: true,
      });
    };    
    const validateInputs = () => {
      let valid = true;

      if (accNo === '') {
          setAccNoError(t("Account number can't be empty"));
          valid = false;
      } else if (accNo.length !== 12) {
          setAccNoError(t("Account number must be 12 digits"));
          valid = false;
      } else {
          setAccNoError('');
      }

      if (password === '') {
          setPasswordError(t("Password can't be empty"));
          valid = false;
      } else if (password.length < 5) {
          setPasswordError(t("Password must be at least 5 characters long"));
          valid = false;
      } else {
          setPasswordError('');
      }

      return valid;
  }; 
  const submitOnClick = () => {
    if (validateInputs()) {
      fetch(constant.BASE_URL + constant.LOGIN_POST, {
          method: 'POST',
          body: JSON.stringify({
              Record: {
                  ContractAccount: accNo,
                  Password: password,
              },
          }),
      })
          .then((response) => response.json())
          .then(async (responseData) => {
            if (responseData.Record.Status === 'Valid Login') {
                  storeData(responseData.Record)
                  showToast('success', 'Login successful');
                  navigation.navigate('BottomTab');
              } else {  
                showToast('error', "Invalid Account No or Password");
              }
          })
          .catch((error) => {
            showToast('error', error);
          });
  }
  }
    const renderItem = (item) => {
      return (
        <View style={styles.RaiseComplaintItem}>
          <Text style={styles.RaiseComplaintDropdownTxt}>{item.value}</Text>
        </View>
      );
    };
   
    return (
      <View style={styles.StartMain}>
       <View style={styles.StartSubContainer}>
          <Image source={ImagePath.Logo} />
          <Text style={styles.StartMainHeader}>{t("Ethiopian Electric Utility")}</Text>
       </View>
       <ScrollView style={styles.StartSubContainer1}>
        <View style={styles.StartSub}>
          <Text style={styles.StartMainHeader}>{t("Login to your account")}</Text>
          <View style={styles.Margin_20}>
          <Text style={styles.LoginSubTxt}>{ t("Account number")}</Text>  
          <TextInput
            placeholder={t("Enter account number")}
            value={accNo}
            style={styles.LoginTextInput}
            onChangeText={(text) =>{
               setAccNo(text) 
               if(accNoError == "Account number can't be empty" && text != "") {
                 setAccNoError("")
               }
            }}
            keyboardType={"phone-pad"}
            placeholderTextColor="#9E9E9E"
            maxLength={12}
           />
           <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{accNoError}</Text>
           </View>
           <View style={styles.Margin_20}>
           <Text style={[styles.LoginSubTxt, {marginLeft: 35}]}>{ t("Password")}</Text>  
           <View style={styles.LoginContainer}>
               <TextInput 
                 style={styles.LoginTextInput} 
                 placeholder={t("Enter password")}
                 placeholderTextColor="#9E9E9E"
                 secureTextEntry={showPassword}
                 value={password}
                 onChangeText={(text) =>{ 
                  setPassword(text) 
                  if(passwordError == "Password can't be empty" && text != "") {
                    setPasswordError("")
                  }
                }}
               >    
               </TextInput>
               <TouchableOpacity 
                  style = {styles.LoginLockButton} 
                  onPress={() => { 
                    if(password && password.length > 0 ){
                      setShowPassword(!showPassword) 
                      setTimeout(() => {
                         setShowPassword(true) 
                      }, 1500)
                    }
                  }}
               >
                  <View style={styles.Margin_10}><Icon name={ showPassword ? "eye-slash" : "eye" } size={20}></Icon></View>
               </TouchableOpacity>
               </View> 
               <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 35 }}>{passwordError}</Text>

           </View>
           <TouchableOpacity style={styles.RegisterBtn} 
             onPress={ () => { 
              submitOnClick()
              // navigation.navigate('BottomTab');

             }}
            >
              <Text style={styles.RegisterBtnTxt}>{t("LOGIN")}</Text>
           </TouchableOpacity> 
           <TouchableOpacity style={styles.Margin_20} onPress={ () => { navigation.navigate("ForgetPassword") }}>
              <Text style={styles.LoginResetTxt}>{t("Forget Password")}</Text>
           </TouchableOpacity>
           <View style={styles.Margin_20}>
              <Text style={styles.LoginAccTxt}>{t("Don’t have an account?")}</Text>
           </View>
           <TouchableOpacity style={styles.LoginCreateBtn} onPress={ () => { navigation.navigate("Registration") }}>
              <Text style={styles.LoginCreateTxt}>{t("CREATE ACCOUNT")}</Text>
           </TouchableOpacity> 
           <TouchableOpacity style={styles.LoginCreateBtn} onPress={ () => { navigation.navigate("NewRegisteration") }}>
              <Text style={styles.LoginCreateTxt}>{t("NEW SERVICE")}</Text>
           </TouchableOpacity> 
           <View style={styles.FooterContainer}>
              <Text style={styles.FooterText}>{"© Copyright 2024"}</Text>
           </View>
       </View>
       </ScrollView>
      
      </View>    
    );
};
export default Login;
