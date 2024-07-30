import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, BackHandler, Alert, Modal, StatusBar } from 'react-native';
import Styles from './../CommonComponent/Styles';
import { ImagePath } from './../CommonComponent/ImagePath';
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Profile from 'react-native-vector-icons/Ionicons'
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

  const { theme, themeObj } = useThemes();
  const { styles, changeTheme } = Styles()
  const [selectLanguage, setSelectLanguage] = useState("");
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
  const [language, setLanguage] = useState([
    { label: 'Language', value: '' },
    { label: 'English', value: 'en' },
    { label: 'Amharic', value: 'am' }
  ]);

  const [unpaidDueData, setUnpaidDueData] = useState({})
  const [unpaidDemandData, setUnpaidDemandData] = useState({})
  const [isThemeOpen, setThemeOpen] = useState(false)
  const [checked, setChecked] = useState(theme);

  useEffect(() => {
    retrieveData();
    const transitionDuration = 4000; // Duration between transitions in milliseconds
    const displayDuration = 1500; // Duration to display each value in milliseconds

    const transitionInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % energySavingTips.length);
    }, transitionDuration);

    const displayInterval = setInterval(() => {
      setDisplayText(true);
      setTimeout(() => {
        setDisplayText(false);
      }, displayDuration);
    }, transitionDuration);

    return () => {
      clearInterval(transitionInterval);
      clearInterval(displayInterval);
    };
    if (theme) {
      setChecked(theme);
    }


  }, [currentMessageIndex, theme]);
  useFocusEffect(
    React.useCallback(() => {
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

  const getDemandBill = (value) => {
    var url = constant.BASE_URL + constant.UNPAID_DEMAND_NOTE
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
        setUnpaidDemandData(responseData.MT_UnpaidDemandNote_Res.Record)
      })
  }

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('accountData');
      if (value !== null) {
        setAccountData(JSON.parse(value));
        getCurrentBill(JSON.parse(value))
        getDemandBill(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderQuickLinks = (buttonImage, buttonText, navigationName) => {
    return (
      <View>
        <TouchableOpacity style={styles.DashboardQuickLinkCon} onPress={() => { navigation.navigate(navigationName) }}>
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

          <Image source={ImagePath.Flag} style={styles.DashboardProfileFlag} />
          {/* <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => { setVisible(true) }}>
                      <Image source={theme.mode == "dark" ? ImagePath.Notification : ImagePath.Notification_Light} style={styles.DashboardProfileNotification} />
                    </TouchableOpacity> */}
          <MultipleOption navigation={navigation} showLogout={true} resetPwd={true} />
        </View>

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
          placeholder="Language"
          style={styles.LanguageDropdown}
          renderItem={renderItem}
          data={availableLanguage.map(language => ({ label: language, value: language }))}
          value={selectLanguage}
          onChange={(item) => {
            setSelectLanguage(item.value);
            i18n.changeLanguage(item.value)
          }}
        />
        <TouchableOpacity style={styles.callButton} onPress={() => { Linking.openURL(`tel:${905}`) }} >
          <Image source={require("../../assets/Call.png")} style={styles.CallIcon} />
          <Text style={styles.CallText}>{905}</Text>
        </TouchableOpacity>
      </View>
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
            <Text style={styles.DashboardSubHeaderTxt1}>{t("Unpaid Invoice Bill ") + moment(unpaidDueData.BILL_MONTH, "YYYY/MM").format("MMMM YYYY")}</Text>
            {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
          </View>
          <View style={styles.DashboardPayBillMain}>
            <View>
              <Text style={styles.DashboardSubHeaderTxt1}>{t("Amount Due") + " : "}</Text>
              <Text style={styles.DashboardUSDTxt}>{"ETB "+ unpaidDueData.Invoice_Amount}</Text>
            </View>
            <TouchableOpacity disabled={true} style={styles.DashboardPayBillBtn} onPress={() => { navigation.navigate("BillDue") }}>
              <Text style={styles.DashboardPayBillBtnTxt}>{t("PAY BILL")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.DashboardPaymentInvoice}>
            <View style={styles.DashboardPaymentSub}>
              <Text style={styles.DashboardSubHeaderTxt1}>{t("Unpaid Demand Bill ") + (unpaidDemandData?.PostDate ?  moment(unpaidDemandData.PostDate, "YYYY/MM").format("MMMM YYYY"): "/")}</Text>
              {/* <Text style={styles.DashboardDueTxt}>{"Due in 5 days"}</Text> */}
            </View>
            <View style={styles.DashboardPayBillMain}>
              <View>
                <Text style={styles.DashboardSubHeaderTxt1}>{t("Amount Due") + " : " + ( unpaidDemandData.Amount ? unpaidDemandData.Amount : "0" )}</Text>
                {/*  <Text style={styles.DashboardUSDTxt}>{"ETB "+ unpaidDueData ? unpaidDueData.Invoice_Amount :''}</Text> */}
              </View>
              <TouchableOpacity disabled={true} style={styles.DashboardPayBillBtn} onPress={() => { navigation.navigate("BillDue") }}>
                <Text style={styles.DashboardPayBillBtnTxt}>{t("PAY BILL")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Previous Payment Section */}
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
              <Text style={styles.DashboardSubHeaderPaidTxt}>{t("Paid")}</Text>
              <Text style={styles.DashboardUSDTxt}>{"ETB 0"}</Text>
            </View>
            <TouchableOpacity style={styles.DashboardViewAllBtn} onPress={() => { navigation.navigate("BillHistory") }}>
              <Text style={styles.DashboardViewAllBtnTxt}>{t("VIEW BILL")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Link Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.DashboardSubHeaderTxt}>{t("Quick links")}</Text>
          <View style={styles.DashBoardSubHeader}>
            {renderQuickLinks(ImagePath.Bill_History, t('Bill History'), "BillHistory")}
            {renderQuickLinks(ImagePath.PaymentHistory, t('Payment History'), "PaymentHistory")}
            {renderQuickLinks(ImagePath.Complaints, t('Complaints'), "Complaints")}
            {renderQuickLinks(ImagePath.UnpaidDemandNote, t('Unpaid Demand Note'), "Payment")}
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
