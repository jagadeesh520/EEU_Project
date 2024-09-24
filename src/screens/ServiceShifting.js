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
const ServiceShifting = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
  

    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }

    
    return (
        <View>
            <CommonHeader title={t("Service Shifting")} onBackPress ={onBackPress} navigation={navigation}/>
            <View style={{ marginTop: 20 }}>
          <Text style={styles.ServiceSubHeaderTxt}>{t("Coming Soon")}</Text>
        </View>
             
        </View>
    );
};

export default ServiceShifting;
 