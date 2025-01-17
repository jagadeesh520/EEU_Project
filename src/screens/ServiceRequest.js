import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { sha256, sha256Bytes } from 'react-native-sha256';
// create a component
const ServiceRequest = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
    const [ unpaidDueData, setUnpaidDueData ] = useState({});
    const [ isPayment, setIsPayment ] = useState(false);
    const [ isPaymentResponse, setIsPaymentResponse ] = useState(false);
    const [ mobileNo, setMobileNo ] = useState('');
  

    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }

    const renderQuickLinks = (buttonImage, buttonText, navigationName) => {
        return (
          <View style={{marginRight: buttonText === "Miscellaneous" ? 120 : null}}>
            <TouchableOpacity style={styles.ServiceQuickLinkCon} onPress={() => { navigation.navigate(navigationName) }}>
              <Image source={buttonImage} style={styles.ServiceQuickLinkImage} />
              <Text style={styles.ServiceQuickLnkText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        )
      }
    
    return (
        <View>
            <CommonHeader title={t("Service Request")} onBackPress ={onBackPress} navigation={navigation}/>
            <View style={{ marginTop: 20 }}>
          <Text style={styles.ServiceSubHeaderTxt}>{t("Services")}</Text>
          <View style={styles.ServiceSubHeader}>
            {renderQuickLinks(ImagePath.Bill_History, t('Service Shifting'), "ServiceShifting")}
            {/* {renderQuickLinks(ImagePath.PaymentHistory, t('Name Change'), "NameChange")} */}
             {renderQuickLinks(ImagePath.Complaints, t('Load Change'), "LoadChange")}
            {renderQuickLinks(ImagePath.UnpaidDemandNote, t('Dis/Reconnection'), "DisOrReconnection")}
            {renderQuickLinks(ImagePath.UnpaidDemandNote, t('Move Out SR'), "MoveOutServiceRequest")}
            {renderQuickLinks(ImagePath.UnpaidDemandNote, t('Miscellaneous'), "Miscellaneous")}
          </View>
        </View>
             
        </View>
    );
};

export default ServiceRequest;
 