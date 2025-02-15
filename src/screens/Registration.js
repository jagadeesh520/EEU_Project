import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useToast } from 'react-native-toast-notifications';
import { constant } from '../CommonComponent/Constant';
const Registration = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles();
    const [ newPassword, setNewPassword] = useState("");
    const [ answer, setAnswer] = useState("");
    const [ accountNo, setAccountNo ] = useState("");
    const [ mobileNo, setMobileNo ] = useState("");
    const [ ErrorMsg, setErrorMsg] = useState("");
    const [countryCode, setCountryCode] = useState("+251");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ accountStatus, setAccountStatus] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [ showPassword, setShowPassword ] = useState(true);
    const [ securityQues, setSecurityQues ] = useState([
      { label: "What is your favorite colors",  value:"favorite color" },
      { label: "What is your mother maiden name", value:"mother maiden name"}
    ]);
    const [ selectedSecutityQues, setSelectedSecurityQues ] = useState("");
    const [ invalidEmail, setInvalidEmail ] = useState("");
    const [invalidMobileNum, setInvalidMobileNum] = useState("")
    const [invalidPassword, setInvalidPassword] = useState("")
    const [invalidSecurity, setInvalidSecurity] = useState("")
    const [invalidAnswer, setInvalidAnswer] = useState("")

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
      var url = constant.BASE_URL + constant.VALIDATION
      fetch(url, {
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
          console.log(responseData, "responseData")
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
    const validateInputs = () => {
      let valid = true;
  
      if (mobileNo == '') {
        setInvalidMobileNum(t("Mobile number can't be empty"));
        valid = false;
      } else {
        setInvalidMobileNum('');
      }
      if (email == '') {
        setInvalidEmail(t("Email can't be empty"));
        valid = false;
      } else {
        setInvalidEmail('');
      }
      if (password == '') {
        setInvalidPassword(t("Password can't be empty"));
        valid = false;
      } else {
        setInvalidPassword('');
      }
      if (selectedSecutityQues == '') {
        setInvalidSecurity(t("Security question can't be empty"));
        valid = false;
      } else {
        setInvalidSecurity('');
      }
      if (answer == '') {
          setInvalidAnswer(t("Answer can't be empty"));
        valid = false;
      } else {
        setInvalidAnswer('');
      }
      return valid;
      
    } 
    const onSignUpPressed = () => {
      if (validateInputs()) { 
        var url = constant.BASE_URL + constant.NEW_REGISTRATION_POST
     return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            ContractAccount: accountNo,
            MobileNo: ( countryCode + mobileNo),
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
                // editable={!isDisabled}
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
              <Text style={styles.LoginSubTxt}>{t("Mobile No") + " *"}</Text>  
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TextInput style={styles.countryCodeInput} editable={false} value={countryCode}/> 
                <TextInput
                //  editable={isDisabled}
                 placeholder={t("Enter mobile number")}
                 value={mobileNo}
                 maxLength={9}
                 style={[styles.LoginTextInput, {width: 220}]}
                 placeholderTextColor="#9E9E9E"
                 onChangeText={(text) =>{ 
                 const MobRegex = text.replace(/[^0-9]/g, '');
                 if (MobRegex.length < 10) {
                    setMobileNo(MobRegex);
                    setInvalidMobileNum('');
                 }
                 // Set error message if the length is not valid
                 if (MobRegex.length < 9 && text.length > 1) {
                  setInvalidMobileNum('Phone number must be 9 digits.');
                 }  
                 if(text[0] == 0) {
                  setInvalidMobileNum('Invalid mobile number');
                 }
                 if(text == "" ){
                  setInvalidMobileNum('');
                 }
                 }}
                />
                </View>
                <Text style={styles.ErrorMsg}>{invalidMobileNum}</Text>
              </View>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Email*")}</Text>   
            <TextInput
            placeholder={t("Enter email ID")}
            value={email}
            // editable={isDisabled}
           // editable = {accountStatus == "VALID CA" ? true : false}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              
              // Check if the input is empty first
             
              // If input is not empty, check for valid email pattern
              if (!emailRegex.test(text)) {
                // Invalid email entered, set error message
                setInvalidEmail('Please enter a valid email address.');
              } else {
                setInvalidEmail("");
              }
              if(text == "" ){
                setInvalidEmail('');
              }
              setEmail(text) 
            }}
           />
              <Text style={styles.ErrorMsg}>{invalidEmail}</Text>
           </View>
           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Password")}</Text>   
            <TextInput
            placeholder={t("Enter password")}
            value={password}
            maxLength={15}
            // editable={isDisabled}
            secureTextEntry={showPassword}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              setPassword(text);
              setInvalidPassword('');
             }}
           />
            <Text style={styles.ErrorMsg}>{invalidPassword}</Text>
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
            <Text style={styles.LoginSubTxt}>{t("Security Questions*")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select Secret Question")}
                // editable={isDisabled}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={securityQues}
                value={selectedSecutityQues}
                onChange={item => {
                  setSelectedSecurityQues(item.value);
                  setInvalidSecurity('');
                }}               
           />
              <Text style={styles.ErrorMsg}>{invalidSecurity}</Text>
           </View>
          
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Answer*")}</Text>   
            <TextInput
            placeholder={t("Enter answer")}
            value={answer}
            editable={isDisabled}
            //editable = {accountStatus == "VALID CA" ? true : false}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              setAnswer(text);
              setInvalidAnswer('');
             }}
           />
              <Text style={styles.ErrorMsg}>{invalidAnswer}</Text>
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
