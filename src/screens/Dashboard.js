import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, BackHandler, Alert, Modal, StatusBar, ImageBackground } from 'react-native';
import Styles from './../CommonComponent/Styles';
import { ImagePath } from './../CommonComponent/ImagePath';
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Profile from 'react-native-vector-icons/Ionicons';
import TipIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeIcon from 'react-native-vector-icons/Feather';
import { RadioButton } from 'react-native-paper';

import { Dropdown } from 'react-native-element-dropdown';
import MultipleOption from '../CommonComponent/MultipleOption';
import { availableLanguage } from '../../Languages/i18next';
import { useFocusEffect } from '@react-navigation/native';
import { constant } from '../CommonComponent/Constant';
import moment from 'moment';
import useTheme from '../CommonComponent/ThemeProvider';


// create a component
const Dashboard = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const themeList = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ];
  const languageOption = [
    { label: "Eng",  value:"Eng" },
    { label: "አማርኛ", value:"አማርኛ"}
  ] 
  const { theme, themeObj } = useThemes();
  const { styles, changeTheme } = Styles()
  const [accountData, setAccountData] = useState({})
  const [energySavingTips, setEnergySavingTips] = useState([
    'Switch to LED Bulbs',
    'Unplug Unused Devices',
    'Use Energy-Efficient Appliances',
    'Adjust Thermostat Settings',
  ])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(false);
  const [visible, setVisible] = useState(false);

  
  const [unpaidDueData, setUnpaidDueData] = useState({});
  const [unpaidDemandData, setUnpaidDemandData] = useState([]);
  const [sumdDemandData, setSumDemandData] = useState(0);
  const [isThemeOpen, setThemeOpen] = useState(false);
  const [checked, setChecked] = useState(theme);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [billHistoryData, setBillHistoryData] = useState([]);
  const [ selectedLang, setSelectedLang] = useState('');
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
    retrieveData();
    const transitionDuration = 4000; // Duration between transitions in milliseconds
    const displayDuration = 1500; // Duration to display each value in milliseconds
    checkInternetConnection(); // Check on component mount

    const transitionInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % energySavingTips.length);
    }, transitionDuration);
  
    const displayInterval = setInterval(() => {
      setDisplayText(true);
      setTimeout(() => {
        setDisplayText(false);
      }, displayDuration);
    }, transitionDuration);

    const interval = setInterval(() => {
      checkInternetConnection();
    }, 10000);

    return () => {
      clearInterval(transitionInterval);
      clearInterval(displayInterval);
      clearInterval(interval);
    };
    if (theme) {
      setChecked(theme);
    }

   

  }, [currentMessageIndex, theme]);
  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to logout?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [navigation])
  );

  useEffect(() => {
    if (theme != null) {
      setChecked(theme);
    }
  }, [theme]);

  const getCurrentBill = (value) => {
    var url = constant.BASE_URL + constant.INVOICE_BILL + '/' + value.CA_No
    fetch(url, {
    })
      .then((response) =>
        response.json())
      .then(responseData => {
        setUnpaidDueData(responseData.MT_InvoiceDetails_OUT)
      })
  }

  const getDemandBill = async (value) => {
    var url = constant.BASE_URL + constant.UNPAID_DEMAND_NOTE
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        Record: {
          ContractAccount: value.CA_No,
        }
      }),
    })
      .then((response) =>
        response.json())
      .then(responseData => {
        var data = responseData.MT_UnpaidDemandNote_Res.Record
        setUnpaidDemandData(data);
        console.log(responseData, "Dashboard---->", data)
        const totalAmount = data.reduce((total, item) => {
          // Parse Amount as a number and add to the total
          const amount = parseFloat(item.Amount.trim());
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);        
        console.log(`Total Amount: ${totalAmount.toFixed(2)}`);
        setSumDemandData(totalAmount);
     
      })
  }
  const getPaymentHistory = (value) => {
    var url = constant.BASE_URL + constant.PAYMENT_HISTORY_GET
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        Record: {
          ContractAccount: value.CA_No,
        }
      }),
    })
      .then((response) =>
        response.json())
      .then(responseData => {
        setPaymentHistoryData(responseData.Record)
      })
  }
  const getBillHistory = (value) => {
    var url = constant.BASE_URL + constant.BILL_HISTORY_GET
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        Record: {
          ContractAccount: value.CA_No,
        }
      }),
    })
      .then((response) =>
        response.json())
      .then(responseData => {
        setBillHistoryData(responseData.Record);
      })
  }
 
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('accountData');
      if (value !== null) {
        setAccountData(JSON.parse(value));
        getCurrentBill(JSON.parse(value))
        getDemandBill(JSON.parse(value));
        getPaymentHistory(JSON.parse(value));
        getBillHistory(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const renderQuickLinks = (buttonImage, buttonText, navigationName) => {
    return (
      <View>
        <TouchableOpacity style={styles.DashboardQuickLinkCon}
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
              navigation.navigate(navigationName)
            }  
          }}
          >
          <Image source={buttonImage} style={styles.DashboardQuickLinkImage} />
          <Text style={styles.DashboardQuickLnkText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const renderItem = (item) => {
    return (
      <View style={styles.RaiseComplaintItem}>
        <Text style={styles.RaiseComplaintDropdownTxt}>{item.value}</Text>
      </View>
    );
  };
  const onPressThemeOk = async () => {
    setThemeOpen(!isThemeOpen)
    changeTheme(checked);
  }
  
  return (
    <ScrollView style={styles.DashBoardMain}>
      {/* Profile Bar */}
      <StatusBar animated={true} barStyle={'dark-content'} backgroundColor={styles.statusBarColor} />
      <ImageBackground 
          source={ImagePath.FlagImageBackground} // Replace with your image URL
          style={styles.flagBackground}
          imageStyle={{ resizeMode: 'cover' }}
        >
      <View style={styles.DashboardProContainer}>
       
        <View style={styles.DashboardProSubContainer}>
          <Profile name='person-circle-outline' size={48} color={'#666666'} />
          {/* <Image source={ImagePath.Profile} style={styles.DashboardProfileImage} /> */}
          <View>
            <Text style={styles.DashBoradWelcomText}>{t("Welcome")}</Text>
            <Text style={styles.DashBoradProfileText}>{accountData.Name}</Text>
          </View>
        </View>
        <View style={styles.DashboardNotificationContainer}>

          {/* <Image source={ImagePath.Flag} style={styles.DashboardProfileFlag} /> */}
          {/* <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => { setVisible(true) }}>
                      <Image source={theme.mode == "dark" ? ImagePath.Notification : ImagePath.Notification_Light} style={styles.DashboardProfileNotification} />
                    </TouchableOpacity> */}
        </View>

      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ marginLeft: 10 }}>
        <MultipleOption navigation={navigation} showLogout={true} resetPwd={true} />
      </View>
      <View style={styles.LanguageContainer}>
        <TouchableOpacity style={styles.ThemeButton} onPress={() => { setThemeOpen(!isThemeOpen) }}>
          <ThemeIcon name={"sun"} size={25} color={'#666666'} />
        </TouchableOpacity>
        <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Language")}
                style={styles.LanguageDropdown}
                renderItem={renderItem}
                data={languageOption}
                value={selectedLang}
                onChange={item => {
                  setSelectedLang(item.value);
                  i18n.changeLanguage(item.value)
                }}               
           />
        <TouchableOpacity style={styles.callButton} onPress={() => { Linking.openURL(`tel:${905}`) }} >
          <Image source={require("../../assets/Call.png")} style={styles.CallIcon} />
          <Text style={styles.CallText}>{905}</Text>
        </TouchableOpacity>
      </View>
      </View>
      </ImageBackground>
      {/* Account Number Bar */}
      <View style={styles.DashboardAccContainer}>
        <Text style={styles.DashBoradProfilAccText}>{t("BP") + ": " + accountData.BP_No}</Text>
        <Image source={ImagePath.Line} />
        <Text style={styles.DashBoradProfilAccText}>{t("Account No") + ": " + accountData.CA_No}</Text>
        {/* <TouchableOpacity>
                  <Image source={ImagePath.DownArrow} style={styles.DashboardDownArrow} />
                </TouchableOpacity>   */}
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
        {energySavingTips.map((value, index) => {
          return (
            <View style={{ display: index === currentIndex ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TipIcon name="lightbulb-on" size={25} color={themeObj.energySavingIcon}></TipIcon>
              <Text key={index} style={{ display: index === currentIndex ? 'flex' : 'none', color: themeObj.energySavingText, marginLeft: 10 }}>{value}</Text>
            </View>
          )
        })}
      </View>
      <View style={{ padding: 20 }}>

        {/* Latest Payment Details */}
        <View style={styles.DashboardPaymentCon}>
          <View style={styles.DashboardPaymentSub}>
            <Text style={styles.DashboardHeaderTxt1}>{t("Pending Invoice") + " "+( unpaidDueData?.BILL_MONTH ? moment(unpaidDueData.BILL_MONTH, "YYYY/MM").format("MMMM YYYY") : "")}</Text>
            {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
          </View>
          <View style={styles.DashboardPayBillMain}>
            <View>
              <Text style={styles.DashboardSubHeaderTxt1}>{t("Amount Due") + " : "}</Text>
              <Text style={styles.DashboardUSDTxt}>{"ETB "+ (unpaidDueData?.Invoice_Amount ? unpaidDueData?.Invoice_Amount : 0)}</Text>
            </View>
            <TouchableOpacity style={styles.DashboardPayBillBtn} 
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
                navigation.navigate('BillDue')
              }  
            }}>
              <Text style={styles.DashboardPayBillBtnTxt}>{t("VIEW DETAILS")}</Text>
              <Image style={{ tintColor: 'white' }} source={ImagePath.RightArrow} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.DashboardPaymentInvoice}>
            <View style={styles.DashboardPaymentSub}>
              <Text style={styles.DashboardHeaderTxt1}>{t("Pending Demand Note")}</Text>
              {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
            </View>
            <View style={styles.DashboardPayBillMain}>
              <View>
               {/*  <Text style={styles.DashboardSubHeaderTxt1}>{t("ETB") + " : " + ( unpaidDemandData.Amount ? unpaidDemandData.Amount : 0 )}</Text> */}
                <Text style={styles.DashboardSubHeaderTxt1}>{t("ETB") + " : " + (sumdDemandData ? sumdDemandData : 0)}</Text>
                {/*  <Text style={styles.DashboardUSDTxt}>{"ETB "+ unpaidDueData ? unpaidDueData.Invoice_Amount :''}</Text> */}
              </View>
              <TouchableOpacity style={styles.DashboardPayBillBtn}
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
                    navigation.navigate('Payment')
                  }  
                }}
              >
                <Text style={styles.DashboardPayBillBtnTxt}>{t("VIEW DETAILS")}</Text>
                <Image style={{ tintColor: 'white' }} source={ImagePath.RightArrow} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Previous Payment Section */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.DashboardPaymentInvoice}>
            <View style={styles.DashboardPaymentSub}>
              <Text style={styles.DashboardHeaderTxt1}>{t("Last Paid")}</Text>
              {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
            </View>
            <View style={styles.DashboardPayBillMain}>
              <View>
                <Text style={styles.DashboardSubHeaderTxt1}>{t("ETB") + " : " + ( paymentHistoryData ? (paymentHistoryData[0]?.PaymentAmount ? (paymentHistoryData[0]?.PaymentAmount).trim() : 0) : 0 )}</Text>
                {/*  <Text style={styles.DashboardUSDTxt}>{"ETB "+ unpaidDueData ? unpaidDueData.Invoice_Amount :''}</Text> */}
              </View>
              <TouchableOpacity style={styles.DashboardPayBillBtn}
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
                    navigation.navigate('PaymentHistory')
                  }  
                }}
              >
                <Text style={styles.DashboardPayBillBtnTxt}>{t("VIEW ALL")}</Text>
                <Image style={{ tintColor: 'white' }} source={ImagePath.RightArrow} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.DashboardPaymentInvoice}>
            <View style={styles.DashboardPaymentSub}>
              <Text style={styles.DashboardHeaderTxt1}>{t("Last Bill")}</Text>
              {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
            </View>
            <View style={styles.DashboardPayBillMain}>
              <View>
                <Text style={styles.DashboardSubHeaderTxt1}>{t("ETB") + " : " + billHistoryData ? (billHistoryData[0]?.Amount ? (billHistoryData[0]?.Amount).trim() : 0) : 0}</Text>
                {/*  <Text style={styles.DashboardUSDTxt}>{"ETB "+ unpaidDueData ? unpaidDueData.Invoice_Amount :''}</Text> */}
              </View>
              <TouchableOpacity style={styles.DashboardPayBillBtn} onPress={() => { navigation.navigate("BillHistory") }}
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
                    navigation.navigate('BillHistory')
                  }  
                }}
              >
                <Text style={styles.DashboardPayBillBtnTxt}>{t("VIEW ALL")}</Text>
                <Image style={{ tintColor: 'white' }} source={ImagePath.RightArrow} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        

        {/* Previous Payment Section
        <View style={{ marginTop: 20 }}>
          <View style={styles.DashboardMainContainer}>
            <Text style={styles.DashboardSubHeaderTxt}>{t("Previous payment")}</Text>
            <TouchableOpacity onPress={() => { navigation.navigate("PaymentHistory") }}>
              <View style={styles.DashboardViewCon}>
                <Text style={styles.DashboardViewallTxt}>{t("View all")}</Text>
                <Image source={ImagePath.RightArrow} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.DashBoardSubHeader}>
            <View>
              <Text style={styles.DashboardSubHeaderPaidTxt}>{t("Last Bill")}</Text>
              <Text style={styles.DashboardUSDTxt}>{"ETB " + paymentHistoryData ? (paymentHistoryData[0]?.PaymentAmount ? (paymentHistoryData[0]?.PaymentAmount).trim() : 0) : 0}</Text>
            </View>
            <TouchableOpacity style={styles.DashboardViewAllBtn} onPress={() => { navigation.navigate("PaymentHistory") }}>
              <Text style={styles.DashboardViewAllBtnTxt}>{t("VIEW ALL")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.DashboardMainContainer}>
            <Text style={styles.DashboardSubHeaderTxt}>{t("Previous Bill")}</Text>
          </View>
        <View style={styles.DashBoardSubHeader}>
            <View>
              <Text style={styles.DashboardSubHeaderPaidTxt}>{t("Previous Bill")}</Text>
              <Text style={styles.DashboardUSDTxt}>{"ETB " + billHistoryData ? (billHistoryData[0]?.Amount ? (billHistoryData[0]?.Amount).trim() : 0) : 0}</Text>
            </View>
            <TouchableOpacity style={styles.DashboardViewAllBtn} onPress={() => { navigation.navigate("BillHistory") }}>
              <Text style={styles.DashboardViewAllBtnTxt}>{t("VIEW ALL")}</Text>
            </TouchableOpacity>
        </View> */}

        {/* Quick Link Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.DashboardSubHeaderTxt}>{t("Quick links")}</Text>
          <View style={styles.DashBoardSubHeader}>
            {renderQuickLinks(ImagePath.Bill_History, t('Bill History'), "BillHistory")}
            {renderQuickLinks(ImagePath.PaymentHistory, t('Payment History'), "PaymentHistory")}
            {renderQuickLinks(ImagePath.Complaints, t('Complaints'), "Complaints")}
            {renderQuickLinks(ImagePath.UnpaidDemandNote, t('Service Request'), "ServiceRequestStatus")}
          </View>
        </View>

        {/* <View style={[styles.DashboardMainContainer, {marginTop: 20} ]}>
                   <Text style={styles.DashboardSubHeaderTxt}>{t("Recent activities")}</Text>
                   <TouchableOpacity>
                     <View  style={styles.DashboardViewCon}>
                      <Text style={styles.DashboardViewallTxt}>{t("View all")}</Text>
                      <Image source={ImagePath.RightArrow}/>
                     </View>  
                   </TouchableOpacity>
                </View> */}

        <Modal
          // animationType="slide"
          transparent={true}
          visible={isThemeOpen}
          onRequestClose={() => {
            setThemeOpen(!isThemeOpen);
          }}
        >
          <View style={styles.modalMainView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose theme</Text>
              <View style={{ marginTop: 10 }}>
                {themeList.map((themeItem) => (
                  <View key={themeItem.value} style={styles.radioContainer}>
                    <RadioButton
                      value={themeItem.value}
                      status={checked === themeItem.value ? 'checked' : 'unchecked'}
                      onPress={() => { setChecked(themeItem.value) }}
                    />
                    <Text style={styles.modalText}>{themeItem.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setThemeOpen(!isThemeOpen)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => { onPressThemeOk() }}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
