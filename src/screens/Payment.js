import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Button,
  DatePicker,
} from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {constant} from '../CommonComponent/Constant';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {sha256, sha256Bytes} from 'react-native-sha256';
// create a component
const Payment = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, styles, changeTheme} = Styles();
  const [unpaidDueData, setUnpaidDueData] = useState([]);
  const [asyncData, setAsyncData] = useState({});
  const [isPayment, setIsPayment] = useState(false);
  const [isPaymentResponse, setIsPaymentResponse] = useState(false);
  const [hashPassword, setHash] = useState('');
  const [mobileNo, setMobileNo] = useState(null);
  const [requestID, setRequestID] = useState('');
  const [isSubmit, setSubmit] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [tempCurrentData, setTempCurrentData] = useState({});
  const onBackPress = () => {
    navigation.goBack('BottomTab');
  };
  useEffect(() => {
    retrieveData();
  }, [requestID]);
  const handleHash = async data => {
    console.log(data, "handleHash" )
    let currentDateTime = moment(new Date()).format('YYDDMMHHmmss');
    var requestId = data.CA_No + '_' + currentDateTime;
    setRequestID(requestId);
    try {
      // const datas = 'a4504fb1-428f-4365-8e01-947013be9f36' + requestId; // Development 
      const datas = '7fa6a887-99b4-4fa4-b68d-b4226845274d' + requestId;   // Production
      const sha256Hash = await sha256(datas);
      setHash(sha256Hash);
    } catch (error) {
      console.error('Error generating hash:', error);
    }
  };
  const getCurrentBill = value => {
    var url = constant.BASE_URL + constant.UNPAID_DEMAND_NOTE;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        Record: {
          ContractAccount: value.CA_No,
        },
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        const data = responseData.MT_UnpaidDemandNote_Res;
        setLoading(false)
        setUnpaidDueData(data.Record);
      });
  };

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('accountData');
      if (value !== null) {
        getCurrentBill(JSON.parse(value));
        setAsyncData(JSON.parse(value));
        handleHash(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const formatNumber = number => {
    return number < 10 ? '0' + number : number.toString();
  };
  const onPressPaymentProceed = async () => {
    // var url = constant.PAY_BASE_URL + constant.UNPAID_DEMAND_NOTE_PAYMENT;
    var url = constant.PAY_BASE_URL_PROD + constant.UNPAID_DEMAND_NOTE_PAYMENT;
    console.log(url, "url")
    let amount =
      tempCurrentData && Object.keys(tempCurrentData).length > 0
        ? (tempCurrentData?.Amount).trim()
        : 0;
    let externalReference =
    tempCurrentData && Object.keys(tempCurrentData).length > 0
        ? (tempCurrentData?.Ref_No).toString()
        : '';
    let currentDateTime = moment(new Date()).format('YYDDMMHHmmss');
    // let externalRef = externalReference + "_" + currentDateTime;
    const payment_attempt_num = await AsyncStorage.getItem(
      'payment_attempt_num',
    );

    let num_of_attempt = payment_attempt_num
      ? parseInt(payment_attempt_num) + 1
      : 0;
    const num_of_attempt_convertion = formatNumber(num_of_attempt);

    await AsyncStorage.setItem(
      'payment_attempt_num',
      num_of_attempt_convertion.toString(),
    );

    let externalRef =
      asyncData.CA_No +
      '_' +
      externalReference +
      '_' +
      num_of_attempt_convertion.toString();
    //console.log(externalRef, 'externalRef---->');
    var data = {
      authorization: {
        merchantCode: '220261',
        merchantTillNumber: '22026100',
        requestId: requestID,
        requestSignature: hashPassword,
      },
      paymentRequest: {
        amount: amount,
        callbackUrl: 'http://172.16.7.252:50100/RESTAdapter/paymentDataAWAS',
        externalReference: externalRef,
        payerPhone: '251' + mobileNo,
        reason: externalReference,
      },
    };
   // console.log(data, 'data');
    if (num_of_attempt <= 100) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorization: {
            merchantCode: '220261',
            merchantTillNumber: '22026100',
            requestId: requestID,
            requestSignature: hashPassword,
          },
          paymentRequest: {
            amount: amount,
            // "callbackUrl": "http://anerpap6.ethiopianelectricutility.et:50100/RESTAdapter/paymentDataAWAS",
            "callbackUrl": "http://172.16.7.252:50100/RESTAdapter/paymentDataAWAS",
            // callbackUrl: 'http://10.10.88.144/RESTAdapter/paymentDataAWAS',
            externalReference: externalRef,
            payerPhone: '251' + mobileNo,
            reason: externalReference,
          },
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          // setIsPaymentResponse(true);
          setIsPayment(false);
          console.log(isPayment)
          if (isPayment) {
            if (responseData.returnCode == 0) {
              Alert.alert(
                'Payment request successfully Submitted',
                'Return Code: ' +
                  responseData.returnCode +
                  ' Return Message: ' +
                  responseData.returnMessage,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (responseData.returnMessage === 'Validated') {
                        navigation.navigate('BottomTab');
                      }
                    },
                  },
                ],
              );
            } else {
              Alert.alert(
                'Payment Request Failed',
                'Return Code: ' +
                  responseData.returnCode +
                  ' Return Message: ' +
                  responseData.returnMessage,
                [{text: 'OK', onPress: () => {}}],
              );
            }
          }
        }).catch = error => {
        console.log(error, 'error--->');
      };
    } else {
      Alert.alert(
        '',
        `You have exceeded the maximum number of payment attempts. Please try again later.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsPayment(false);
            },
          },
        ],
      );
    }
  };

  const getPaginatedData = () => {
    const startIndex = currentPage * 1;
    const endIndex = startIndex + 1;
    return unpaidDueData.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(unpaidDueData.length / 1) - 1 && unpaidDueData.length > 0 ) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle navigation to the previous page
  const prevPage = () => {
    if (currentPage > 0 && unpaidDueData.length > 0 ) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View>
      <CommonHeader
        title={t('Unpaid Demand Note')}
        onBackPress={onBackPress}
        navigation={navigation}
      />
      {unpaidDueData && unpaidDueData.length > 0 ? (
        <FlatList
          data={getPaginatedData()}
          renderItem={(list, index) => {
            const formattedDate = moment(
              list.item.PostDate,
              'YYYY/MM/DD',
            ).format('MMM / YYYY');
            return (
              <View style={{padding: 20, width: '100%'}}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      prevPage();
                    }}
                    disabled={currentPage === 0}>
                    <Image source={ImagePath.RoundRightArrow} />
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#FFF',
                        padding: 10,
                        borderRadius: 3,
                      }}
                      onPress={() => setOpen(true)}>
                      <Text style={{color: '#000'}}>{formattedDate}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      nextPage();
                    }}
                    disabled={
                      currentPage === Math.ceil(unpaidDueData.length / 1) - 1
                    }>
                    {/* <Image source={ImagePath.RoundLeftArrow} /> */}
                    <Icon name={'rightcircle'} color={'#F29037'} size={35} />
                  </TouchableOpacity>
                </View>
                <View style={styles.BillHistoryMain}>
                  <View>
                    <View style={styles.BillHistorySub}>
                      <View>
                        <Text style={styles.BillHistoryTitle}>
                          {t('Account No')}
                        </Text>
                        <Text style={styles.BillHistoryTxt}>
                          {list?.item?.CA}
                        </Text>
                      </View>

                      <View>
                        <Text style={styles.BillHistoryTitle}>
                          {t('Post Date')}
                        </Text>
                        <Text style={styles.BillHistoryTxt}>
                          {moment(list.item.PostDate, 'YYYY/MM/DD').format(
                            'DD/MM/YYYY',
                          )}
                        </Text>
                      </View>

                      <View>
                        <Text style={styles.BillHistoryTitle}>{t('BP')}</Text>
                        <Text style={styles.BillHistoryTxt}>
                          {list?.item?.BP}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.BillHistoryLine} />

                    <View style={styles.BillHistorySub2}>
                      <View style={styles.BillHistorySubCon}>
                        <Text style={styles.BillHistorySub2Title}>
                          {t('Document Type')}
                        </Text>
                        <Text style={styles.BillHistorySub2Txt}>
                          {list?.item?.Doc_Type}
                        </Text>
                      </View>

                      <View style={styles.BillHistorySubCon}>
                        <Text style={styles.BillHistorySub2Title}>
                          {t('Reference number')}
                        </Text>
                        <Text style={styles.BillHistorySub2Txt}>
                          {list?.item?.Ref_No}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.BillHistoryLine} />
                    <View style={styles.BillHistorySub3}>
                      <View style={styles.BillHistorySubCon}>
                        <Text style={styles.BillHistorySubAmount}>
                          {t('Amount')}
                        </Text>
                        <Text style={styles.BillHistorySub2Txt}>
                          {list?.item?.Amount}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.BillHistoryLine} />
                  {/* <TouchableOpacity> */}
                  <View style={styles.BillHistoryMainShare}>
                    <Text style={styles.BillHistoryShareTxt}>
                      {currentPage + 1 + ' / ' + unpaidDueData.length}
                    </Text>
                  </View>
                  <View style={styles.BillDuePayBillMain}> 
               <TouchableOpacity style={styles.BillDuePayBillBtn} 
                onPress={() =>{ 
                  setIsPayment(true)
                  setTempCurrentData(list?.item);

                }}
               >
                  <Text style={styles.BillDuePayBillBtnTxt}>{t("PAY VIA AWASH")}</Text>
               </TouchableOpacity>
               <Text style={styles.BillDuePayBillBtnTxt1}>{t("(Only for AWASH BANK a/c holders)")}</Text>

             </View> 
                  {/* </TouchableOpacity> */}
                </View>
              </View>
            );
          }}
          keyExtractor={list => list?.item?.Ref_No.toString()}
        />
      ) : null}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isPaymentResponse}
        onRequestClose={() => {
          setIsPaymentResponse(!isPaymentResponse);
        }}>
        <TouchableWithoutFeedback onPress={() => setIsPaymentResponse(false)}>
          <View style={styles.modalMainView}>
            <View style={styles.unpaidModalView}>
              <Text style={{color: '#666666', fontSize: 20}}>
                {'PAYMENT DETAILS'}
              </Text>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>
                  {t('Date Approved')}
                </Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
              </View>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>
                  {t('Date Requested')}
                </Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
              </View>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>
                  {t('External Request')}
                </Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
              </View>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>{t('Payer Phone')}</Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
              </View>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>{t('Return Code')}</Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
              </View>
              <View style={styles.unpaidModalContainer}>
                <Text style={styles.UnpaidModalTitle}>
                  {t('Return Message')}
                </Text>
                <Text style={styles.UnpaidModalText}>
                  {' : ' + 'Testdfdfdf'}
                </Text>
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
        }}>
        <TouchableWithoutFeedback onPress={() => setIsPayment(!isPayment)}>
          <View style={styles.modalMainView}>
            <View style={[styles.unpaidModalView, {flexDirection: 'column'}]}>
              <Text style={{color: '#666666', fontSize: 20}}>
                {t('PAY THROUGH AWASH')}
              </Text>
              <View style={styles.Margin_10}>
                <Text style={styles.LoginSubTxt}>{t('Mobile No') + ' *'}</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <TextInput
                    style={styles.countryCodeInput}
                    editable={false}
                    value={countryCode}
                  />
                  <TextInput
                    placeholder={t('Enter mobile number')}
                    value={mobileNo}
                    maxLength={9}
                    style={[styles.LoginTextInput, {width: 220}]}
                    placeholderTextColor="#9E9E9E"
                    onChangeText={text => {
                      const MobRegex = text.replace(/[^0-9]/g, '');
                      if (MobRegex.length < 10) {
                        setMobileNo(MobRegex);
                        setErrorMsg('');
                      }
                      // Set error message if the length is not valid
                      if (MobRegex.length < 9 && text.length > 1) {
                        setErrorMsg('Phone number must be 9 digits.');
                      }
                      if (text[0] == 0) {
                        setErrorMsg('Invalid mobile number');
                      }
                      if (text == '') {
                        setErrorMsg('');
                      }
                    }}
                  />
                </View>
                <Text style={styles.ErrorMsg}>{ErrorMsg}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[styles.PaymentBtn, {backgroundColor: '#63AA5A'}]}
                  onPress={() => {
                    setIsPayment(false);
                  }}>
                  <Text style={[styles.RegisterBtnTxt, {color: '#FFF'}]}>
                    {t('CANCEL')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.PaymentBtn,
                    {backgroundColor: '#63AA5A', marginLeft: 10},
                  ]}
                  onPress={() => { 
                    setSubmit(true);
                    onPressPaymentProceed();
                  }}>
                  <Text style={[styles.RegisterBtnTxt, {color: '#FFF'}]}>
                    {t('SUBMIT')}
                  </Text>
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
