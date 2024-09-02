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
const Payment = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
    const [ unpaidDueData, setUnpaidDueData ] = useState({});
    const [ asyncData, setAsyncData ] = useState({});
    const [ isPayment, setIsPayment ] = useState(false);
    const [ isPaymentResponse, setIsPaymentResponse ] = useState(false);
    const [ hashPassword, setHash ] = useState('');
    const [ mobileNo, setMobileNo ] = useState('');
    const [ requestID, setRequestID ] = useState('');
    const [ isSubmit, setSubmit ] = useState(false);

    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    useEffect (()=> {
      retrieveData()
    }, [requestID])  
    const handleHash = async (data) => {
      let currentDateTime = moment(new Date()).format('YYDDMMHHmmss');
      var requestId = (data.CA +"_"+ currentDateTime);
      setRequestID(requestId)
      try {
        const datas = ("a4504fb1-428f-4365-8e01-947013be9f36" + requestId)
        const sha256Hash = await sha256(datas);
        setHash(sha256Hash);
      } catch (error) {
        console.error('Error generating hash:', error);
      }
    };
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
        handleHash(data.Record)
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
    const formatNumber = (number) => {
      return number < 10 ? '0' + number : number.toString();
    };
    const onPressPaymentProceed = async () =>{

      var url = constant.PAY_BASE_URL + constant.UNPAID_DEMAND_NOTE_PAYMENT;
      let amount = unpaidDueData && Object.keys(unpaidDueData).length > 0 ? (unpaidDueData?.Amount).trim() : 0;
      let externalReference = unpaidDueData && Object.keys(unpaidDueData).length > 0 ? (unpaidDueData?.Ref_No).toString() : "";
      let currentDateTime = moment(new Date()).format('YYDDMMHHmmss');
      // let externalRef = externalReference + "_" + currentDateTime;               
      const payment_attempt_num = await AsyncStorage.getItem('payment_attempt_num');

      let num_of_attempt = payment_attempt_num ? parseInt(payment_attempt_num) + 1 : 0;
      const num_of_attempt_convertion = formatNumber(num_of_attempt);

      await AsyncStorage.setItem('payment_attempt_num', num_of_attempt_convertion.toString());
      
      let externalRef = externalReference + "_" + num_of_attempt_convertion.toString();
      
      var data = {
        "authorization": {
          "merchantCode": "220261",
          "merchantTillNumber": "22026100",
          "requestId": requestID,
          "requestSignature": hashPassword
      },
      "paymentRequest": {
          "amount": amount,
          "callbackUrl": "http://197.156.76.70:8080/paymentDataAWAS",
          "externalReference": externalRef,
          "payerPhone": mobileNo,
          "reason": externalReference
      }
    }
    console.log(data, "data")
    if(num_of_attempt <= 100) { 
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
              "authorization": {
                  "merchantCode": "220261",
                  "merchantTillNumber": "22026100",
                  "requestId": requestID,
                  "requestSignature": hashPassword
              },
              "paymentRequest": {
                  "amount": amount,
                  // "callbackUrl": "http://anerpap6.ethiopianelectricutility.et:50100/RESTAdapter/paymentDataAWAS",
                  "callbackUrl": "http://197.156.76.70:8080/paymentDataAWAS",
                  "externalReference": externalRef,
                  "payerPhone": mobileNo,
                  "reason": externalReference
              }
        })
      })
      .then((response) =>
          response.json())
      .then(responseData => {
        // setIsPaymentResponse(true);
        setIsPayment(false);
        if(isPayment) { 
         Alert.alert(
          '',
          "Return Code: " + responseData.returnCode + " Return Message: " + responseData.returnMessage,
          [
            { text: 'OK', onPress: () => {
              if(responseData.returnMessage === "Validated") {
                navigation.navigate("BottomTab") 
              }
            }},
          ]
         );
       } 
     
      
      }).catch = (error) =>{
        console.log(error,"error--->")
      }
    } else {
      Alert.alert(
        '',
        `You have exceeded the maximum number of payment attempts. Please try again later.`,
        [
          { text: 'OK', onPress: () => { setIsPayment(false); }},
        ]
       );
     
    }
    }
    return (
        <View>
            <CommonHeader title={t("Unpaid Demand Note")} onBackPress ={onBackPress} navigation={navigation}/>
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
                }}
               >
                  <Text style={styles.BillDuePayBillBtnTxt}>{t("PAY VIA AWASH")}</Text>
               </TouchableOpacity>
               <Text style={styles.BillDuePayBillBtnTxt1}>{t("(Only for AWASH BANK a/c holders)")}</Text>

             </View>    
            </View>
            </View>: null }
            <Modal
              // animationType="slide"
              transparent={true}
              visible={isPaymentResponse}
              onRequestClose={() => {
                setIsPaymentResponse(!isPaymentResponse);
              }}
            >
            <TouchableWithoutFeedback onPress={() => setIsPaymentResponse(false)}>  
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
            <Modal
              // animationType="slide"
              transparent={true}
              visible={isPayment}
              onRequestClose={() => {
                setIsPayment(!isPayment);
              }}
            >
            <TouchableWithoutFeedback onPress={() => setIsPayment(!isPayment)}>  
             <View style={styles.modalMainView}>
                <View style={[styles.unpaidModalView, { flexDirection: 'column' }]}>
                   <Text style={{color: '#666666', fontSize: 20, }}>{t("PAY THROUGH AWASH")}</Text>
                   <View style={styles.Margin_20}>
                     <Text style={styles.LoginSubTxt}>{t("Mobile Number")}</Text>  
                     <TextInput
                       placeholder={"+251 000000000"}
                       value={mobileNo}
                       style={styles.LoginTextInput}
                       onChangeText={(text) =>{ setMobileNo(text) }}
                       keyboardType={"phone-pad"}
                       placeholderTextColor="#9E9E9E"
                       maxLength={12}
                     />
                   </View>
                   <View style = {{ display: 'flex', flexDirection: 'row' }}>
                   <TouchableOpacity style={[styles.PaymentBtn, { backgroundColor:'#63AA5A' }]} onPress={() => { setIsPayment(false) }}>
                       <Text style={[styles.RegisterBtnTxt, { color: '#FFF' }]}>{t("CANCEL")}</Text>
                   </TouchableOpacity> 
                   <TouchableOpacity style={[styles.PaymentBtn, { backgroundColor:'#63AA5A', marginLeft: 10 }]} onPress={() => { setSubmit(true); onPressPaymentProceed() }}>
                       <Text style={[styles.RegisterBtnTxt, { color: '#FFF' }]}>{t("SUBMIT")}</Text>
                   </TouchableOpacity> 
                   </View>
                </View>
             </View>
            </TouchableWithoutFeedback> 
            </Modal>     
        </View>
    );
};

export default Payment;
 