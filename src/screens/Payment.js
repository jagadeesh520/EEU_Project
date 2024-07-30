import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

// create a component
const Payment = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const {theme, styles, changeTheme} = Styles()
    const [ unpaidDueData, setUnpaidDueData ] = useState({})
    const [ asyncData, setAsyncData ] = useState({})
    const [ isPayment, setIsPayment ] = useState(false)
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    const [ unpaidDueData, setUnpaidDueData ] = useState({})
    useEffect (()=> {
      retrieveData()
    }, [])
    const getCurrentBill = (value)=>{
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
        const data = responseData.MT_UnpaidDemandNote_Res
        setUnpaidDueData(data.Record)
      })
    }
    
  
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          getCurrentBill(JSON.parse(value));
          setAsyncData(JSON.parse(value))
        }
      } catch (error) {
        console.error(error);
      }
    };
    const onPressPaymentProceed = () =>{
      var url = constant.PAY_BASE_URL + constant.UNPAID_DEMAND_NOTE_PAYMENT;
      console.log(url, "unpaid")
      fetch(url, {
        method: 'POST',
          body: JSON.stringify({
            Record: {
              merchantCode: '220261',
              merchantTillNumber: '22026100',
              requestId: '',
              requestSignature: 'a4504fb1-428f-4365-8e01-947013be9f36',
              PaymentRequest: '',
              externalReference: asyncData.CA_No,
            }
          }),
        })
      .then((response) =>
          response.json())
      .then(responseData => {
        console.log(responseData, "responseData--->")
      })
    }
    return (
        <View>
            <CommonHeader title={t("Unpaid Demand Note")} onBackPress ={onBackPress}/>
            { unpaidDueData && Object.keys(unpaidDueData).length > 0 ?
            <View>
            <View style={styles.BillDueMain}> 
             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
               <View>
                  <Text style={styles.BillDueTitle}>{t("Account No")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.CA}</Text>
               </View>
               <View>
                  <Text style={styles.BillDueTitle}>{t("BP")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.BP}</Text>
               </View>
             </View>  
             <View style={{ marginVertical: 20 }}><Image source={ImagePath.DotLines}/></View>
 
             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
               <View style={styles.BillDueSubCon}> 
                  <Text style={styles.BillDueTitle}>{t("Post Date")}</Text>
                  <Text style={styles.BillDueTxt}>{ moment(unpaidDueData.PostDate, "YYYY/MM/DD").format("DD-MM-YYYY")}</Text>
               </View>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Document Type")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.Doc_Type}</Text>
               </View>
             </View> 
             <View style={{ marginVertical: 20 }}><Image source={ImagePath.DotLines}/></View>
             <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              
              <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Reference number")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData?.Ref_No ? unpaidDueData?.Ref_No : ""}</Text>
               </View>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Amount")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.Amount}</Text>
              </View>
               {/* 
             </View>   
             <View style={{ marginVertical: 20 }}><Image source={ImagePath.DotLines}/></View>
             <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
               <View style={styles.BillDueSubCon}>
                  <Text style={styles.BillDueTitle}>{t("Invoice Amount")}</Text>
                  <Text style={styles.BillDueTxt}>{unpaidDueData.Invoice_Amount ? ((unpaidDueData.Invoice_Amount).trim()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text>
               </View> */}
             </View> 
             <View style={styles.BillDuePayBillMain}> 
               <TouchableOpacity style={styles.BillDuePayBillBtn} 
                onPress={() =>{ 
                  setIsPayment(true)
                  onPressPaymentProceed()
                }}
               >
                  <Text style={styles.BillDuePayBillBtnTxt}>{"PROCEED TO PAYMENT"}</Text>
               </TouchableOpacity>
             </View>    
            </View>
            </View>: null }
            <Modal
              // animationType="slide"
              transparent={true}
              visible={isPayment}
              onRequestClose={() => {
                setIsPayment(!isPayment);
              }}
            >
            <TouchableWithoutFeedback onPress={() => setIsPayment(false)}>  
             <View style={styles.modalMainView}>
                <View style={styles.unpaidModalView}>
                   <Text style={{color: '#666666', fontSize: 20, }}>{"PAYMENT DETAILS"}</Text>
                   <View style={styles.unpaidModalContainer}>
                       <Text style={styles.UnpaidModalTitle}>{t("Date Approved")}</Text>
                       <Text style={styles.UnpaidModalText}>{" : " +"Testdfdfdf"}</Text>
                    </View>  
                    <View style={styles.unpaidModalContainer}> 
                       <Text style={styles.UnpaidModalTitle}>{t("Date Requested")}</Text>
                       <Text style={styles.UnpaidModalText}>{ " : " + "Testdfdfdf"}</Text>
                    </View> 
                    <View style={styles.unpaidModalContainer}> 
                       <Text style={styles.UnpaidModalTitle}>{t("External Request")}</Text>
                       <Text style={styles.UnpaidModalText}>{" : " + "Testdfdfdf"}</Text>
                     </View>
                     <View style={styles.unpaidModalContainer}>  
                       <Text style={styles.UnpaidModalTitle}>{t("Payer Phone")}</Text>
                       <Text style={styles.UnpaidModalText}>{ " : " + "Testdfdfdf"}</Text>
                     </View>
                     <View style={styles.unpaidModalContainer}> 
                       <Text style={styles.UnpaidModalTitle}>{t("Return Code")}</Text>
                       <Text style={styles.UnpaidModalText}>{" : " +"Testdfdfdf"}</Text>
                     </View>
                     <View style={styles.unpaidModalContainer}> 
                       <Text style={styles.UnpaidModalTitle}>{t("Return Message")}</Text>
                       <Text style={styles.UnpaidModalText}>{" : " +"Testdfdfdf"}</Text>
                     </View>
                </View>
             </View>
            </TouchableWithoutFeedback> 
            </Modal>     
        </View>
    );
};

export default Payment;
 