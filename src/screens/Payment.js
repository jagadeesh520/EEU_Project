import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
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
    const {theme, styles, changeTheme} = Styles();
    const [ unpaidDueData, setUnpaidDueData ] = useState({});
    const [ asyncData, setAsyncData ] = useState({});
    const [ isPayment, setIsPayment ] = useState(false);
    const [ isPaymentResponse, setIsPaymentResponse ] = useState(false);
    const [hashPassword, setHash] = useState('');
    const [ mobileNo, setMobileNo ] = useState('');
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    useEffect (()=> {
      retrieveData()
    }, [])  
    const handleHash = async (data) => {
      try {
        const datas = ("a4504fb1-428f-4365-8e01-947013be9f36" + data.Ref_No)
        const sha256Hash = await sha256(datas);
        console.log(sha256Hash, "sha256Hash------>", datas)
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
    const onPressPaymentProceed = () =>{
      var url = constant.PAY_BASE_URL + constant.UNPAID_DEMAND_NOTE_PAYMENT;
      const data = {
        "authorization": {
          "merchantCode": "220261",
          "merchantTillNumber": "22026100",
          "requestId": unpaidDueData.Ref_No,
          "requestSignature": hashPassword
      },
      "paymentRequest": {
          "payerPhone": mobileNo,
          "reason": "EEU payment",
          "amount": unpaidDueData.Amount,
          "externalReference": unpaidDueData.CA,
          "callbackUrl": ":http://anerpap6.ethiopianelectricutility.et:50100/RESTAdapter/paymentDataAWAS"
      }
      }
      console.log(url, "unpaid", data)
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
           "data" : { 
            "authorization": {
              "merchantCode": "220261",
              "merchantTillNumber": "22026100",
              "requestId": unpaidDueData.Ref_No,
              "requestSignature": hashPassword
          },
          "paymentRequest": {
              "payerPhone": mobileNo,
              "reason": "EEU payment",
              "amount": unpaidDueData.Amount,
              "externalReference": unpaidDueData.CA,
              "callbackUrl": ":http://anerpap6.ethiopianelectricutility.et:50100/RESTAdapter/paymentDataAWAS"
          }
          }
          })
        })
      .then((response) =>
          response.json())
      .then(responseData => {
        setIsPaymentResponse(true)
        console.log(responseData, "responseData--->")
      }).catch = (error) =>{
        console.log(error,"error--->")
      }
    }
    console.log(unpaidDueData, "unpaidDueData----->")
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
                  <Text style={styles.BillDuePayBillBtnTxt}>{"PAY THROUGH AWASH"}</Text>
               </TouchableOpacity>
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
                   <Text style={{color: '#666666', fontSize: 20, }}>{"PAY THROUGH AWASH"}</Text>
                   <View style={styles.Margin_20}>
                     <Text style={styles.LoginSubTxt}>{t("Mobile Number")}</Text>  
                     <TextInput
                       placeholder={"+251 - 00000000000"}
                       value={mobileNo}
                       style={styles.LoginTextInput}
                       onChangeText={(text) =>{ setMobileNo(text) }}
                       keyboardType={"phone-pad"}
                       placeholderTextColor="#9E9E9E"
                       maxLength={12}
                     />
                   </View>
                   <TouchableOpacity style={[styles.RegisterBtn, { backgroundColor:'#63AA5A' }]} onPress={() => { onPressPaymentProceed() }}>
                       <Text style={[styles.RegisterBtnTxt, { color: '#FFF' }]}>{t("SUBMIT")}</Text>
                   </TouchableOpacity> 
                </View>
             </View>
            </TouchableWithoutFeedback> 
            </Modal>     
        </View>
    );
};

export default Payment;
 