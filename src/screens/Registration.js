import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useToast } from 'react-native-toast-notifications';

const Registration = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles()
    const [ newPassword, setNewPassword] = useState("")
    const [ answer, setAnswer] = useState("")
    const [ accountNo, setAccountNo ] = useState("")
    const [ mobileNo, setMobileNo ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ accountStatus, setAccountStatus] = useState("")
    const [isDisabled, setIsDisabled] = useState(false);
    const [ showPassword, setShowPassword ] = useState(true)
    const [ securityQues, setSecurityQues ] = useState([
      { label: "What is your favorite colors",  value:"favorite color" },
      { label: "What is your mother maiden name", value:"mother maiden name"}
    ])
    const [ selectedSecutityQues, setSelectedSecurityQues ] = useState("")

    const validAccount = () => {
      setIsDisabled(!isDisabled)
      console.log('Yes button clicked')
    }
  
    const inValidAccount = () => {
      setIsDisabled(isDisabled)
      console.log('No button clicked')
    }
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
    const onVerifyAccountId = () => {

      fetch('http://197.156.76.70:8080/CAValidationPost', {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            ContractAccount: accountNo 
          }
        }),
      })
        .then((response) =>
          response.json())
        .then(responseData => {
          setAccountStatus(responseData.Record ? responseData.Record.Status : '')
          if (responseData.Record && responseData.Record.Status == "VALID CA") {
            Alert.alert(
              'Please confirm your Account Details',
              `Name: ${responseData.Record.Name ? responseData.Record.Name : ''}\nMobile No: ${responseData.Record.MobileNo ? responseData.Record.MobileNo : ''}\nAddress: ${responseData.Record.Address ? responseData.Record.Address : ''}\nEmail: ${responseData.Record.EmailId ? responseData.Record.EmailId : ''}`,
              [
                { text: 'Yes', onPress: () => validAccount() },
                { text: 'No', onPress: () => inValidAccount(), style: 'cancel' },
              ],
              {
                cancelable: true
              }
            );
          } else {
            Alert.alert(
              '',
              "Invalid Account No",
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ]
            );
          }
        })    
    };
    const onSignUpPressed = () => {
     return fetch('http://197.156.76.70:8080/NewRegistrationPost', {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            ContractAccount: accountNo,
            MobileNo: mobileNo,
            EmailID: email,
            Password: password,
            SecretQuestion: selectedSecutityQues,
            SecretAnswer: answer,
          }
        }),
      })
        .then((response) => response.json())
        .then(responseData => {
          console.log(responseData, "Success! Registration No. Generated.")
          if (responseData.Record.Status == 'Success! Registration No. Generated.') {
            //storeData(responseData.Record.ContractAccount)
            showToast('success', responseData.Record.Status +" , Registration No: " + responseData.Record.RegistrationNo);

          }
          if (responseData.Record.Status == 'Already Registered. Please Login') {
            //storeData(responseData.Record.ContractAccount)
            Alert.alert(
              '',
              responseData.Record.Status,
              [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
              ]
            );
          }
          if (responseData.Record.Status == 'Error In No. Generation') {
            Alert.alert(
              '',
              "Registration is not successful, Please try again",
              [
                { text: 'OK', onPress: () => navigation.navigate('RegisterScreen') },
              ]
            );
          }
          /*  else {
            Alert.alert(
              '',
              "Successfully Registered, Please Login",
              [
                { text: 'OK', onPress: () => navigation.replace('Login') },
              ]
            ); 
          } */
        }).catch((error) => {
          console.error("having an error", error)
        })
    }
    const renderItem = (item) => {
      return (
        <View style={styles.RaiseComplaintItem}>
          <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
        </View>
      );
    };
    return (
        <View style={styles.StartMain}>
           <View style={styles.RegisterMainContainer}>
             <TouchableOpacity style={{ left: 0, position: 'absolute', top: 30 }} onPress={() =>{ navigation.navigate("Login") }}>
                   <Image source={ImagePath.Left} />
             </TouchableOpacity>
             <Image source={ImagePath.Logo} style={styles.StartLogo} />
             <Text style={styles.RegisterMainHeader}>{t("Ethiopian Electric Utility")}</Text>
           </View>
           <ScrollView style={styles.RegisterSubContainer1}>
           <View style={styles.RegisterSub}>
             <Text style={styles.StartMainHeader}>{t("Account verify")}</Text>
             <View style={styles.Margin_20}>
              <Text style={styles.LoginSubTxt}>{t("Account No")}</Text>  
              <TextInput
                placeholder={t("Enter Account No")}
                value={accountNo}
                style={styles.LoginTextInput}
                editable={!isDisabled}
                onChangeText={(text) =>{ setAccountNo(text) }}
                keyboardType={"phone-pad"}
                placeholderTextColor="#9E9E9E"
                maxLength={12}
              />
           </View>
           <TouchableOpacity style={[styles.RegisterBtn, { backgroundColor: isDisabled ? '#DCDCDC' : '#63AA5A' }]} disabled={isDisabled} onPress={() => { onVerifyAccountId() }}>
              <Text style={styles.RegisterBtnTxt} editable={!isDisabled  }>{t("VERIFY ACCOUNT NO")}</Text>
           </TouchableOpacity> 
           <Text style={styles.StartMainHeader}>{t("Account Create")}</Text>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Mobile Number")}</Text>   
            <TextInput
            placeholder={t("Enter mobile number")}
            value={mobileNo}
            maxLength={10}
            editable={isDisabled}
            //editable = {accountStatus == "VALID CA" ? true : false}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ setMobileNo(text) }}
           />
           </View>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Email")}</Text>   
            <TextInput
            placeholder={t("Enter email ID")}
            value={email}
            editable={isDisabled}
           // editable = {accountStatus == "VALID CA" ? true : false}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ setEmail(text) }}
           />
           </View>
           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Password")}</Text>   
            <TextInput
            placeholder={t("Enter password")}
            value={password}
            maxLength={15}
            editable={isDisabled}
            secureTextEntry={showPassword}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ setPassword(text) }}
           />
           </View>
            <TouchableOpacity 
                  style = {styles.RegisterLockButton} 
                  onPress={() => { 
                    if(password && password.length > 0 ){
                      setShowPassword(!showPassword) 
                      setTimeout(() => {
                         setShowPassword(true) 
                      }, 1500)
                    }
                  }}
               >
                  <View style={styles.Margin_40}><Icon name={ showPassword ? "eye-slash" : "eye" } size={20}></Icon></View>
               </TouchableOpacity>
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Security Questions")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select Secret Question")}
                editable={isDisabled}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={securityQues}
                value={selectedSecutityQues}
                onChange={item => {
                  setSelectedSecurityQues(item.value);
                }}               
           />
           </View>
          
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Answer")}</Text>   
            <TextInput
            placeholder={t("Enter answer")}
            value={answer}
            editable={isDisabled}
            //editable = {accountStatus == "VALID CA" ? true : false}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ setAnswer(text) }}
           />
           </View>
           <TouchableOpacity disabled = { isDisabled ? false : true } style={[styles.RegisterBtn, { backgroundColor: isDisabled ? '#63AA5A' : '#DCDCDC' }]} onPress={() => {onSignUpPressed()}}>
              <Text style={[styles.RegisterBtnTxt, { color: accountStatus == "VALID CA" ?  '#FFF' : '#666666' }]}>{t("REGISTER")}</Text>
           </TouchableOpacity> 
           </View>
          </ScrollView>
        </View>
    );
};

export default Registration;
