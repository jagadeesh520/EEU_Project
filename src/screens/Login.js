// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Switch, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { constant } from '../CommonComponent/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dropdown } from 'react-native-element-dropdown';

// Component
const Login = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { theme, styles, changeTheme } = Styles();
  const languageOption = [
    { label: "Eng",  value:"Eng" },
    { label: "አማርኛ", value:"አማርኛ"}
  ];
  const [ selectedLang, setSelectedLang] = useState('');
  const [accNo, setAccNo] = useState('');
  const [password, setPassword] = useState('');
  const [accNoError, setAccNoError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberData, setRememberData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
    ]);
  };
  const checkInternetConnection = async () => {
    try {
      const response = await fetchWithTimeout('https://www.google.com', {
        method: 'HEAD',
      }, 5000); // Timeout of 5 seconds
      if (response.ok) {
        setIsConnected(true);  // Internet is available
      } else {
        setIsConnected(false); // Internet is not available
      }
    } catch (error) {
      setIsConnected(false);   // If fetch fails, no internet
    }
  };
  useEffect(() => {
    const fetchRememberData = async () => {
      const value = await AsyncStorage.getItem('rememberData');
      if (value) {
        setRememberData(JSON.parse(value));
      }
    };
    fetchRememberData();
    checkInternetConnection(); // Check on component mount

    const interval = setInterval(() => {
      checkInternetConnection();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const storeData = async (value) => {
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

  const submitOnClick = async () => {
    if(!isConnected) {
      Alert.alert(
            '',
            "No internet connection! Please check your connection,",
            [
              { text: 'OK', onPress: () =>{} },
            ]
      );
    } else {
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
          console.log(responseData, "responseData")
          if (responseData && responseData?.status >= 500) {
            console.log('Server is down. Please try again later.');
          } else {
            console.log('Failed to log in. Please try again.');
          }
          if (responseData?.Record?.Status === 'Valid Login') {
            storeData(responseData.Record);
            showToast('success', 'Login successful');
            navigation.navigate('BottomTab');

            if (rememberMe) {
              const value = await AsyncStorage.getItem('rememberData');
              const tempRememberMe = value ? JSON.parse(value) : [];
              const accountExists = tempRememberMe ? tempRememberMe.some(item => item.accNumber === accNo) : false

              if (!accountExists) {
                tempRememberMe.push({ accNumber: accNo, password: password });
                setRememberData(tempRememberMe);
                try {
                  await AsyncStorage.setItem('rememberData', JSON.stringify(tempRememberMe));
                } catch (error) {
                  console.log(error);
                }
              }
            }
          } else {
            showToast('error', 'Invalid Account No or Password');
          }
        })
        .catch((error) => {
          console.log(error, "error")
          // showToast('error', error);
        });
    }
   }
  };

  const handleRememberMeToggle = async (value) => {
    setRememberMe(value);
    if (value) {
      const storedData = await AsyncStorage.getItem('rememberData');
      if (storedData) {
        setRememberData(JSON.parse(storedData));
        // setShowModal(true);
      }
    }
  };

  const selectRememberedCredentials = (item) => {
    setAccNo(item.accNumber);
    setPassword(item.password);
    setShowModal(false);
  };

  const renderItem = ({ item }) => ( 
    <TouchableOpacity onPress={() => selectRememberedCredentials(item)} style={styles.rememberItem}>
      <Text style={{ color: '#666666', fontSize: 14 }}>{item.accNumber}</Text>
      {/* <Text>{item.password}</Text> */}
    </TouchableOpacity>
  );
  const renderItems = (item) => {
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
        <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Language")}
                style={styles.LanguageDropdown}
                renderItem={renderItems}
                data={languageOption}
                value={selectedLang}
                onChange={item => {
                  setSelectedLang(item.value);
                  i18n.changeLanguage(item.value)
                }}               
           />
      </View>
      <ScrollView style={styles.StartSubContainer1}>
        <View style={styles.StartSub}>
          <Text style={styles.StartMainHeader}>{t("Login to your account")}</Text>
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Account number")}</Text>
            <TextInput
              placeholder={t("Enter account number")}
              value={accNo}
              onFocus={() =>{
                if(rememberData && rememberData.length > 0) { 
                 setShowModal(true)
                }
              }}
              style={styles.LoginTextInput}
              onChangeText={(text) => {
                setAccNo(text);
                if (accNoError && text !== '') {
                  setAccNoError('');
                }
              }}
              keyboardType="phone-pad"
              placeholderTextColor="#9E9E9E"
              maxLength={12}
            />
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{accNoError}</Text>
          </View>
          <View style={styles.Margin_10}>
            <Text style={[styles.LoginSubTxt, { marginLeft: 36 }]}>{t("Password")}</Text>
            <View style={styles.LoginContainer}>
              <TextInput
                style={styles.LoginTextInput}
                placeholder={t("Enter password")}
                placeholderTextColor="#9E9E9E"
                secureTextEntry={showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError && text !== '') {
                    setPasswordError('');
                  }
                }}
              />
              <TouchableOpacity
                style={styles.LoginLockButton}
                onPress={() => {
                  if (password && password.length > 0) {
                    setShowPassword(!showPassword);
                    setTimeout(() => {
                      setShowPassword(true);
                    }, 1500);
                  }
                }}
              >
                <View style={styles.Margin_10}>
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5, marginLeft: 35 }}>{passwordError}</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.RememberMeText}>{t("Remember Me")}</Text>
            <Switch 
              trackColor={{ false: "#D3D3D3", true: "#63AA5A" }}
              thumbColor={rememberMe ? "#F29037" : "#63AA5A"}
              value={rememberMe} 
              onValueChange={handleRememberMeToggle} 
            />
          </View>
          <TouchableOpacity style={styles.RegisterBtn} onPress={submitOnClick}>
            <Text style={styles.RegisterBtnTxt}>{t("LOGIN")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Margin_20} 
          onPress={() =>{
            if(!isConnected) {
              Alert.alert(
                    '',
                    "No internet connection! Please check your connection,",
                    [
                      { text: 'OK', onPress: () =>{} },
                    ]
              );
            } else {
             navigation.navigate('ForgetPassword')
            }
          }}>
            <Text style={styles.LoginResetTxt}>{t("Forget Password ?")}</Text>
          </TouchableOpacity>
          <View style={styles.Margin_20}>
            <Text style={styles.LoginAccTxt}>{t("Don’t have an account?")}</Text>
          </View>
          <TouchableOpacity style={styles.LoginCreateBtn} 
          onPress={() =>{ 
            if(!isConnected) {
              Alert.alert(
                    '',
                    "No internet connection! Please check your connection,",
                    [
                      { text: 'OK', onPress: () =>{} },
                    ]
              );
            } else {
              navigation.navigate('Registration')
            }  
          }}>
            <Text style={styles.LoginCreateTxt}>{t("CREATE LOGIN ACCOUNT")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LoginCreateBtn} 
          onPress={() =>{
            if(!isConnected) {
              Alert.alert(
                    '',
                    "No internet connection! Please check your connection,",
                    [
                      { text: 'OK', onPress: () =>{} },
                    ]
              );
            } else {
              navigation.navigate('NewRegisteration')
            }  
          }}>
            <Text style={styles.LoginCreateTxt}>{t("APPLY FOR NEW SERVICE")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.LoginCreateBtn} 
          onPress={() =>{
            if(!isConnected) {
              Alert.alert(
                    '',
                    "No internet connection! Please check your connection,",
                    [
                      { text: 'OK', onPress: () =>{} },
                    ]
              );
            } else {
              navigation.navigate('CANumberTrack')
            }  
          }}>
            <Text style={styles.LoginCreateTxt}>{t("NSC APPLICATION TRACK")}</Text>
          </TouchableOpacity>
          <View style={styles.FooterContainer}>
            <Text style={styles.FooterText}>{"© Copyright 2024"}</Text>
          </View>
        </View>
      </ScrollView>
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Remembered Credentials</Text>
            <FlatList
              data={rememberData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            {/* <Button mode="contained" onPress={() => setShowModal(false)}>
              Close
            </Button> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Login;
