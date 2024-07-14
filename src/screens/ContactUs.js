import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import BackIcon from 'react-native-vector-icons/Ionicons';
import Styles from '../CommonComponent/Styles';
import CommonHeader from '../CommonComponent/CommonComponent';
import { useTranslation } from 'react-i18next';

const Share = ({ navigation }) => {
  const {theme, styles, changeTheme} = Styles()
  const { t, i18n } = useTranslation();
  const onBackPress = () => {
    navigation.goBack("BottomTab")
  }
  return (
    <ScrollView style={styles.DashBoardMain}>
      <CommonHeader title={t("Contact Us")} onBackPress ={onBackPress}/>
      {/* <View style={styles.ContactheaderMain}>
        <TouchableOpacity
           style={styles.Contactbackicon}
          onPress={() => { navigation.navigate('Dashboard') }}>
          <BackIcon name="arrow-back-circle" size={25}></BackIcon>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Image
            style={styles.image}
            source={require('../assets/home-icons.png')}
          />
        </TouchableOpacity>

      </View> */}
      <Text style={styles.Contacttitle}>{t("Contact Us")}</Text>
      <View style={styles.ContactaddressContainer}>
        <Text style={styles.Contactlabel}>{t("ADDRESS")} </Text>
        <Text style={styles.ContactheaderText}>{t("ETHIOPIAN ELECTRIC UTILITY")}</Text>
        <Text style={styles.ContactaddressText}>
          {t("HEAD OFFICE, PIAZZA, ADDIS ABABA, ETHIOPIA")} </Text>
        <Text style={styles.Contactlabel}>{t("EMAIL")} </Text>
        <Text style={styles.ContactaddressText}>
          INFO@ETHIOPIANELECTRICUTILITY.GOV.ET {'\n'} 
          CONTACT@ETHIOPIANELECTRICUTILITI.GOV.ET
        </Text>
        <Text style={styles.Contactlabel}>{t("PHONE NUMBER")} </Text>
        <Text style={styles.ContactaddressText}>0111550811/12</Text>
      </View>
    </ScrollView>
  );
};


export default Share;
