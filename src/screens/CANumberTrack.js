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
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';

// Component
const CANumberTrack = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { theme, styles, changeTheme } = Styles();
  const startDate = new Date();
  const startResult = startDate.setDate(startDate.getDate());

  const [applicationNo, setApplicationNo] = useState('');
  const [applicationNoError, setApplicationNoError] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [mobileNoError, setMobileNoError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [emailID, setEmailID] = useState('');
  const [emailIDError, setEmailIDError] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date(startResult));
  const [showDateStartpicker , setShowDateStartpicker] = useState(false);
  const [isOthers, setIsOthers] = useState(false);

  
 
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

  const onChangeApplicationDate = (event, selectedDate) => {
    const currentDate = selectedDate || applicationDate;
    console.log("currentDate",currentDate,selectedDate)
    setShowDateStartpicker(false)
    setApplicationDate(currentDate);
    //setShow(false)
  };
  const validateInputs = () => {
    let valid = true;

    if (applicationNo === '' && !isOthers) {
      setApplicationNoError(t("Application number can't be empty"));
      valid = false;
    } else {
       setApplicationNoError('');
    }

    if (firstName === '' && isOthers) {
      setFirstNameError(t("First name can't be empty"));
      valid = false;
    } else {
        setFirstNameError('');
    }
    if (mobileNo === '' && isOthers) {
        setMobileNoError(t("Mobile number can't be empty"));
        valid = false;
    } else {
        setMobileNoError('');
    }
    if (emailID === '' && isOthers) {
        setEmailIDError(t("Email ID can't be empty"));
        valid = false;
    } else {
        setEmailIDError('');
    }

    return valid;
  };
  const submitOnClick = () => {
    var data =  {
        "ApplicationNo": applicationNo,
        "ApplicationDate": isOthers ? moment(applicationDate).format('DD/MM/YYYY') : "",
        "MobNo": mobileNo,
        "Email": emailID,
        "FirstName": firstName
  }
  console.log(data, "data---->")
    if (validateInputs()) {
      fetch(constant.BASE_URL + constant.APPLICATION_TRACK, {
        method: 'POST',
        body: JSON.stringify({
            Record: {
              "ApplicationNo": applicationNo,
              "ApplicationDate": isOthers ? moment(applicationDate).format('DD/MM/YYYY') : "",
              "MobNo": mobileNo,
              "Email": emailID,
              "FirstName": firstName
        }
     }),
      })
        .then((response) => response.json())
        .then(async (responseData) => {
          console.log(responseData, "responseData")
          var data = responseData.Root;
          if(data.Status == "Application Received Successfully") { 
            Alert.alert(
             '',
             t(' Your Application received successfully and will be processed soon …!!! '),
             [
               {
                 text: '',
                 onPress: () => {
                  //  Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                  // navigation.navigate("DocumentUpload", {applicationDetails: data});
                },
               },
             ]
           );            
          } else if(data.Status == "CA and SR Created") { 
           Alert.alert(
            '',
            t('Your application successfully processed, Please attached your ID proof  to complete your application'),
            [
              {
                text: '',
                onPress: () => {
                  // Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                  navigation.navigate("DocumentUpload", {applicationDetails: data});
                },
              },
            ]
          );            
         } else if(data.Status == "BP Created"){
          Alert.alert(
            '',
            t('Your Application under process Business partner has created and Service Request creation is in progress, Please check the status after sometime'),
            [
              {
                text: '',
                onPress: () => {
                  // Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                  // navigation.navigate("DocumentUpload", {applicationDetails: data});
                },
              },
            ]
          );       
         } else if(data.Status == "Document Pending") { 
          Alert.alert(
           '',
           t('Your Application is successfully processed..!!! Please attached your ID proof  to complete your application') ,
           [
             {
               text: '',
               onPress: () => {
                //  Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                 navigation.navigate("DocumentUpload", {applicationDetails: data});
               },
             },
           ]
         );            
        } else if(data.Status == "Error") { 
          Alert.alert(
           '',
           t('Your Application is successfully processed..!!! Please attached your ID proof  to complete your application') ,
           [
             {
               text: '',
               onPress: () => {
                //  Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                navigation.navigate("DocumentUpload", {applicationDetails: data});
              },
             },
           ]
         );            
        } else if(data.Status == "FINISHED") { 
          Alert.alert(
           '',
           t('Your Apllication is fully processed, please create your Mob App login account using your CA number and proceed for payment after login.') ,
           [
             {
               text: 'COPY CA Number',
               onPress: () => {
                 Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                 navigation.navigate("Registration");
               },
             },
           ]
         );            
        } else {
          Alert.alert(
            '',
             responseData.Root.Status,
            [
              {
                text: '',
                onPress: () => {
                 //  Clipboard.setString(String(data.CA)); // Copy CA Number as a string
                 // navigation.navigate("DocumentUpload", {applicationDetails: data});
               },
              },
            ]
          );   
        }
    })
        .catch((error) => {
          console.log(error, "error")
          // showToast('error', error);
        });
    }
   }
  return (
    <View style={styles.StartMain}>
      <View style={styles.StartSubContainer}>
        <Image source={ImagePath.Logo} />
        <Text style={styles.StartMainHeader}>{t("Ethiopian Electric Utility")}</Text>
      </View>
      <ScrollView style={styles.StartSubContainer1}>
        <View style={styles.StartSub}>
          <Text style={styles.StartMainHeader}>{t("CA Number Tracking")}</Text>
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <Text style={styles.LoginSubTxt}>{t("Application Tracking with Other Details")}</Text>     
            <Switch 
              trackColor={{ false: "#D3D3D3", true: "#63AA5A" }}
              thumbColor={isOthers ? "#F29037" : "#63AA5A"}
              value={isOthers} 
              onValueChange={() =>{
                setIsOthers(!isOthers);
                setApplicationNo("");
                setMobileNo("");
                setEmailID("");
                setFirstName("");
              }} 
             />
         </View>
          { isOthers && isOthers ?
        //   <Text style={{ color: '#F29037', fontSize: 25, margin: 15 }}>{"OR"}</Text>
        <View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("First Name")}</Text>
            <TextInput
              placeholder={t("Enter first name")}
              value={firstName}
              style={styles.LoginTextInput}
              onChangeText={(text) => {
                setFirstName(text);
                if (firstNameError && text !== '') {
                  setFirstNameError('');
                }
              }}
              placeholderTextColor="#9E9E9E"
            />
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{firstNameError}</Text>
          </View>
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Application date")}</Text>   
            <TouchableOpacity onPress={() => setShowDateStartpicker(true)} style={styles.QuesComplaintDropdown}>
               <TextInput
                 style={{color: '#666666', fontSize: 12, height:37}}
                 value={applicationDate.toLocaleDateString()}
                 placeholder={t("Select Date")}
                 editable={false}
              />
             </TouchableOpacity>
            { showDateStartpicker && (
             <DateTimePicker
               testID="startDatePicker"
               value={applicationDate}
               mode="date"
               display="default"
               onChange={onChangeApplicationDate}
             />
            )}
           </View> 
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Mobile number")}</Text>
            <TextInput
              placeholder={t("Enter Mobile number")}
              value={mobileNo}
              style={styles.LoginTextInput}
              onChangeText={(text) => {
                setMobileNo(text);
                if (mobileNo && text !== '') {
                  setMobileNoError('');
                }
              }}
              keyboardType="phone-pad"
              placeholderTextColor="#9E9E9E"
              maxLength={12}
            />
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{mobileNoError}</Text>
          </View>
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Email ID")}</Text>
            <TextInput
              placeholder={t("Enter Email ID")}
              value={emailID}
              style={styles.LoginTextInput}
              onChangeText={(text) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              
                // Check if the input is empty first
               
                // If input is not empty, check for valid email pattern
                if (!emailRegex.test(text)) {
                  // Invalid email entered, set error message
                  setEmailIDError('Please enter a valid email address.');
                } else {
                    setEmailIDError("");
                }
                if( text && text == "" ){
                    setEmailIDError('');
                }
                setEmailID(text);
              }}
              placeholderTextColor="#9E9E9E"
            />
            <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{emailIDError}</Text>
          </View>
          </View> :
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Application number")}</Text>
           <TextInput
             placeholder={t("Enter application number")}
             value={applicationNo}
             style={styles.LoginTextInput}
             onChangeText={(text) => {
               setApplicationNo(text);
               if (applicationNoError && text !== '') {
                setApplicationNoError('');
               }
             }}
             keyboardType="phone-pad"
             placeholderTextColor="#9E9E9E"
             maxLength={12}
           />
           <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{applicationNoError}</Text>
         </View>
        }
          <TouchableOpacity style={styles.RegisterBtn} onPress={submitOnClick}>
            <Text style={styles.RegisterBtnTxt}>{t("Submit")}</Text>
          </TouchableOpacity>
        </View>
     </ScrollView>
   </View>
  );
};
export default CANumberTrack;
