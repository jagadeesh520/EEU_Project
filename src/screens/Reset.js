import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, Platform, AlertIOS  } from 'react-native';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { constant } from '../CommonComponent/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';

const Reset = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles()
    const [ newPassword, setNewPassword] = useState("")
    const [ answer, setAnswer] = useState("")
    const [ newPwdError, setNewPwdError ] = useState("")
    const [ answerError, setAnswerError ] = useState("")
    const [ accountNo, setAccountNo ] = useState("")

    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          setAccountNo(JSON.parse(value));
          console.log(accountNo, value, "value")
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      retrieveData();
    }, []);
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

      if (newPassword == '') {
        setNewPwdError(t("New password can't be empty"));
          valid = false;
      } else if (newPassword.length < 5) {
        setNewPwdError(t("New Password must be at least 5 characters long"));
        valid = false;
      } else {
        setNewPwdError('');
    }

      if (answer == '') {
        setAnswerError(t("Answer can't be empty"));
          valid = false;
      } else {
        setAnswerError('');
      }

      return valid;
  }; 
    const resetOnClick = () => {
      if (validateInputs()) {
        fetch(constant.BASE_URL + constant.RESET_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({
                Record: {
                  ContractAccount: accountNo.CA_No,
                  SecretAnswer: answer,
                  Password: newPassword,
                },
            }),
        })
            .then((response) => response.json())
            .then(async (responseData) => {
                console.log(responseData, "responseData---->", responseData.Record.ValidationStatus)
                if (responseData.Record.ValidationStatus === 'Password Successfully Updated') {
                  showToast('success', responseData.Record.ValidationStatus);
                  navigation.navigate("Login")
                  setNewPassword("")
                  setAnswer("")
                } else {
                  showToast('error', responseData.Record.ValidationStatus);
                }
            })
            .catch((error) => {
              notifyMessage(error)
            });
    }
    }
    return (
        <View style={styles.StartMain}>
           <View style={styles.ResetMainContainer}>
             <TouchableOpacity style={{ left: 0, position: 'absolute', top: 30 }} onPress={() =>{ navigation.navigate("Login") }}>
                   <Image source={ImagePath.Left} />
             </TouchableOpacity>
             <Image source={ImagePath.Logo} />
             <Text style={styles.StartMainHeader}>{t("Ethiopian Electric Utility")}</Text>
           </View>
           <View style={styles.ResetSubContainer1}>
           <Text style={styles.StartMainHeader}>{t("Reset Password")}</Text>
          <View style={styles.Margin_20}>
          <Text style={styles.LoginSubTxt}>{t("New Password")}</Text>  
          <TextInput
            placeholder={t("Enter new password")}
            value={newPassword}
            style={styles.LoginTextInput}
            onChangeText={(text) =>{ 
              setNewPassword(text) 
              if(newPwdError == "Password can't be empty" && text != "") {
                setNewPwdError("")
              }
            }}
            keyboardType={"phone-pad"}
            placeholderTextColor="#9E9E9E"
            maxLength={12}
           />
           <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{newPwdError}</Text>
           </View>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Answer")}</Text>   
            <TextInput
            placeholder={t("Enter password")}
            value={answer}
            maxLength={15}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ setAnswer(text) }}
           />
           <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{answerError}</Text>
           </View>
           <TouchableOpacity style={styles.RegisterBtn} onPress={() => { resetOnClick() }}>
              <Text style={styles.RegisterBtnTxt}>{t("RESET")}</Text>
           </TouchableOpacity> 
           </View>
          
        </View>
    );
};

export default Reset;
