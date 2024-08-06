import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';

// create a component
const BillDue = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles()
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    const [ unpaidDueData, setUnpaidDueData ] = useState({})

    const getCurrentBill = (value) => {
      var url = constant.BASE_URL + constant.INVOICE_BILL + '/' + value.CA_No
      console.log(url, "url")
      fetch(url, {
      })
        .then((response) =>
          response.json())
        .then(responseData => {
          setUnpaidDueData(responseData.MT_InvoiceDetails_OUT)
          console.log(responseData, "responseData")
        })
    }
    useEffect (()=> {
      retrieveData()
    }, [])
  
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          getCurrentBill(JSON.parse(value));
        }
      } catch (error) {
        console.error(error);
      }
    };
    return (
        <View>
            <CommonHeader title={t("Bill Due")} onBackPress ={onBackPress} navigation={navigation}/>
            { unpaidDueData && Object.keys(unpaidDueData).length > 0 ?
            <View>
            <View style={styles.BillDueMain}> 
             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
               <View>
                  <Text style={styles.BillDueTitle}>{t("Account No")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.CA_Number}</Text>
               </View>
               <View>
                  <Text style={styles.BillDueTitle}>{t("Customer Name")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.Customer_Name}</Text>
               </View>
             </View>  
             <View style={{ marginVertical: 20 }}><Image source={ImagePath.DotLines}/></View>

            
           <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Billing Month")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.BILL_MONTH}</Text>
               </View>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Cs Code")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.CSC_CODE}</Text>
               </View>
             </View> 
             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Invoice Date")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.INVOICE_DATE}</Text>
               </View>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Invoice number")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.Invoice_Number}</Text>
               </View>
             </View>   
             <View style={{ marginVertical: 20 }}><Image source={ImagePath.DotLines}/></View>
             <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Invoice Amount")}</Text>
                  <Text style={styles.BillDueTxt}>{ unpaidDueData && Object.keys(unpaidDueData).length > 0 ? unpaidDueData.Invoice_Amount ? (((unpaidDueData?.Invoice_Amount).toString()).trim()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" : ""}</Text>
               </View>
               {/* <TouchableOpacity style={styles.BillDuePayBillBtn} onPress={() =>{ navigation.navigate("BillDue") }}>
                  <Text style={styles.BillDuePayBillBtnTxt}>{"MAKE PAYMENT"}</Text>
               </TouchableOpacity>  */}
             </View>   
            </View>
            </View>: null }
        </View>
    );
};

export default BillDue;
 