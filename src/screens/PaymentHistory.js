//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, FlatList, ActivityIndicator, ScrollView,  Platform, Alert } from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';  // Import RNFS
import { ToWords } from 'to-words';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';


 // create a component
const PaymentHistory = ({navigation}) => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [ accountData, setAccountData ] = useState({})
  const [ paymentHistoryData, setPaymentHistoryData ] = useState([])
  const [ currentPage, setCurrentPage ] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [ totalData, setTotalData ] = useState([])
  
    const {theme, styles, changeTheme} = Styles()
    const onBackPress = () => {
      navigation.navigate("BottomTab")
    }
    const toWords = new ToWords({
      localeCode: 'en-US', // Use 'en-US' or 'en-GB' for English
      converterOptions: {
        currency: true,
        ignoreDecimal: false,             // Ensure decimal (Cents) are included
        ignoreZeroCurrency: false,        // Include zero values
        doNotAddOnly: false,              // Adds "Only" at the end of the conversion
        currencyOptions: {
          name: 'Birr',
          plural: 'Birrs',
          symbol: 'ETB',
          fractionalUnit: {
            name: 'Cent',
            plural: 'Cents',
            symbol: '',
          },
        },
      },
    });
    useEffect(() => {
      retrieveData();
    }, []);
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          setAccountData(JSON.parse(value));
          getPaymentHistory(JSON.parse(value));
          console.log(JSON.parse(value), "JSON.parse(value)")
        }
      } catch (error) {
        // console.error(error);
      }
    };
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
          setLoading(false)
          setPaymentHistoryData(responseData.Record)
          setTotalData(responseData.Record)
        })  
    }
    const getPaginatedData = () => {
      const startIndex = currentPage * 1;
      const endIndex = startIndex + 1 ;
      return paymentHistoryData.slice(startIndex, endIndex);
    };
    const nextPage = () => {
      if (currentPage < Math.ceil(paymentHistoryData.length / 1) - 1 && paymentHistoryData.length > 0 ) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 0 && paymentHistoryData.length > 0 ) {
        setCurrentPage(currentPage - 1);
      }
    };
    const getBase64Logo = async (path) => {
      try {
        if (path.startsWith('http')) {
          // For Android: Use fetch to retrieve the image and convert to base64
          const response = await fetch(path);
          const blob = await response.blob();
          const reader = new FileReader();
    
          return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          // For file paths, use readFile (works on iOS or direct file paths)
          return await readFile(path, 'base64');
        }
      } catch (error) {
        console.log('Error loading logo:', error.message);
      }
    };
    const requestStoragePermission = async () => {
      let storagePermission;
  
      // Determine the appropriate permission based on Android version
      if (Platform.OS === 'android') {
        storagePermission =
          Platform.Version >= 30
            ? PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
            return true;
      } else {
        Alert.alert(
          'Permission Error',
          'Storage permission is only applicable on Android devices.'
        );
        return false;
      }
  
      try {
        // Check if the permission is already granted
        const isPermitted = await check(storagePermission);
        console.log('Permission Check Result:', isPermitted);
  
        if (isPermitted === RESULTS.GRANTED) {
          console.log('Storage permission already granted.');
          return true;
        }
  
        // If permission is not granted, display an alert
        Alert.alert(
          'Storage Permission Required',
          'This app needs access to your storage to save files. Please allow storage access.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Permission Denied'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                // Request permission when the user agrees
                const isGranted = await request(storagePermission);
                console.log('Permission Request Result:', isGranted);
  
                if (isGranted === RESULTS.GRANTED) {
                  console.log('Storage permission granted.');
                  Alert.alert('Permission Granted', 'You can now save files to storage.');
                  return true;
                } else {
                  console.log('Storage permission denied.');
                  Alert.alert(
                    'Permission Denied',
                    'Cannot save files without storage access.'
                  );
                  return false;
                }
              },
            },
          ]
        );
  
        // Return false until the user explicitly allows permission
        return false;
      } catch (error) {
        console.error('Permission request error:', error);
        Alert.alert('Error', 'Failed to request storage permission.');
        return false;
      }
    };
  const createPDF = async () => {
  const permissionGranted = await requestStoragePermission();
  console.log(permissionGranted, "permissionGranted")
  // if (!permissionGranted) {
  //   Alert.alert('Permission Denied', 'Cannot save the file without permission.', permissionGranted);
  //   return;
  // } else {

    const logoPath = Image.resolveAssetSource(require('../../assets/EEULogo.jpg')).uri;
    const logoBase64 = await getBase64Logo(logoPath);
    const logoImage = `data:image/jpeg;base64,${logoBase64}`;
    console.log('Base64 logo image:', paymentHistoryData, currentPage );  // Use this in your HTML
    const amount = paymentHistoryData[currentPage]?.PaymentAmount
    console.log("amountInWords", amount, accountData)

    const cleanedAmount = parseFloat(amount.replace(/,/g, '').trim());

    // Step 2: Convert the cleaned amount to words with currency formatting
    const amountInWords = toWords.convert(cleanedAmount, { currency: true });
    const htmlContent = `
      <!DOCTYPE html>
       <html lang="en">
       <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt Voucher</title>
        <style>
         body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f0f0f0;
         }
        .container {
          max-width: 100%;
          margin: 0 auto;
          background-color: #fff;
          border: 1px solid #000;
          padding: 10px;
        }
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .header-left {
          display: flex;
          justify-content: center;
          align-items: center;
          align-self: center;
        }
        .header-right {
          width: 50%;
          text-align: center;
          background-color: #9ACD32; /* Green background */
          padding: 10px;
        }
        .header-left img {
          height: 30%;
          width: 30%;
        }
        .title {
          text-align: center;
          margin-top: 10px;
          font-size: 20px;
          font-weight: bold;
        }
        .amharic-text {
          font-size: 18px;
          color: black;
          font-weight: bold;
          line-height: 1.5;
        }
        .receipt {
          border: 1px solid black;
          padding: 20px;
          max-width: 100%;
        }
        .receipt-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .region, .date, .voucher {
          font-weight: bold;
         }
        .receipt1 {
          border: 1px solid black;
          padding: 20px;
          max-width: 100%;
        }
        .receipt-header1 {
          display: flex;
          justify-content: space-between;
        }
        .from-section, .customer-section {
          width: 48%;
        }
        .bold {
          font-weight: bold;
        }
        .from-section div, .customer-section div {
          margin-bottom: 5px;
        }
        .customer-section .right-align {
          text-align: right;
        }
        .receipt3 {
          border: 1px solid black;
          padding: 20px;
          max-width: 100%;
        }
        .section {
          margin-bottom: 15px;
        }
        .bold {
          font-weight: bold;
        }
        .collected-amount {
          display: inline-block;
          padding: 2px 5px;
          border: 2px solid blue;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
      </style>
   </head>
  <body>

<div class="container">
  <!-- Header Section -->
  <div class="header">
      <div class="header-left">
              <img src="${logoImage}" alt="Ethiopian Electric Utility Logo" />
      </div>
  </div>

  <!-- Title Section -->
  <div class="title">
      RECEIPT VOUCHER
  </div>
</div>
<div class="receipt">
      <!-- <div class="receipt-header">
          <div class="region">REGION: A - ADDIS ABABA REGION ELECTRIC UTILITY</div>
      </div> -->
      <div class="receipt-header">
          <!-- <div class="csc">CSC: AA01 - EAST ADDIS ABABA CSC-NO.2</div> -->
          <div class="date">Date: ${moment(paymentHistoryData[currentPage].PaymentDate, "YYYY/MM/DD").format("DD/MM/YYYY")}</div>
          <div class="voucher">Receipt Voucher No.: ${paymentHistoryData[currentPage].DocumentNo}</div>
      </div>
  </div>
  <div class="receipt1">
      <div class="receipt-header1">
          <!-- From Section -->
          <div class="from-section">
              <div class="bold">From:</div>
              <div>ETHIOPIAN ELECTRIC UTILITY</div>
              <div class="bold">Address/City/Town:</div>
              <div>A.AZone/SubCity: Arada</div>
              <div>Woreda: K 01/02 H.N.</div>
              <div class="bold">Suppliers TIN No.: 0041052177</div>
          </div>

          <!-- Customer Section -->
          <div class="customer-section right-align">
              <div class="bold">Customer Name:</div>
              <div>${accountData.Name}</div>
              <div class="bold">Business Partner No:</div>
              <div>${accountData.BP_No}</div>
              <div class="bold">Contract Account No:</div>
              <div>${paymentHistoryData[currentPage].ContractAccount}</div>
              <!-- <div>Woreda: <span>Kebele: </span><span>H.No: </span></div>
              <div>VAT Reg. No: <span>Date of Reg:</span></div>
              <div>TIN No: </div> -->
          </div>
      </div>
  </div>
  <div class="receipt3">
      <div class="section">
          <span class="bold">Payment Description:</span> Received amount against the reference no. ${paymentHistoryData[currentPage].AdditionalInfo}
      </div>
      <div class="section">
          <span class="bold">Payment Date:</span>${moment(paymentHistoryData[currentPage].PaymentDate, "YYYY/MM/DD").format("DD/MM/YYYY")}
      </div>
      <div class="section">
          <span class="bold">Collected Amount:</span> 
          <span class="collected-amount">${(paymentHistoryData[currentPage].PaymentAmount).trim()}</span>
      </div>
      <div class="section">
          <span class="bold">In Word:</span> ${amountInWords}
      </div>
      <div class="section">
          <span class="bold">Mode of Payment:</span> ${paymentHistoryData[currentPage].PayDocType}
      </div>
  </div>
</body>
</html>
` ;
      let options = {
        html: htmlContent,
        fileName: 'PaymentHistory',
        directory: 'Download',
      };
  
      let file = await RNHTMLtoPDF.convert(options)
      // console.log(file.filePath);
      alert(file.filePath);
    // }   
  }
    return (
      <ScrollView style={styles.DashBoardMain}>
            <CommonHeader title={"Payment History"} onBackPress ={onBackPress} navigation={navigation}/>
            {isLoading &&
              < View style={styles.Loader}>
                <ActivityIndicator size="large" />
              </View>
            }   
            { paymentHistoryData && paymentHistoryData.length > 0 && paymentHistoryData[0].Remarks != "No Bills Generated Yet" ? 
             <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => navigation.navigate('ViewPaymentHistoryTable')} style={styles.linkButton}>
               <Text style={styles.linkButtonText}>{t('Click Here for Table View')}</Text>
            </TouchableOpacity> 

            </View> : null }
            { paymentHistoryData && paymentHistoryData.length > 0 && paymentHistoryData[0].Remarks != "No Bills Generated Yet" ? 
              <FlatList
                data={getPaginatedData()}
                renderItem={(list , index) => {
                  const formattedDate = moment(list.item.PaymentDate, "YYYY/MM/DD").format("MMM / YYYY");
                return( 
            <View style={{ padding: 20, width: '100%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <TouchableOpacity onPress={() => { prevPage()}} disabled={currentPage === 0}>
                 <Image source={ImagePath.RoundRightArrow} />
               </TouchableOpacity>  
               <View>
                <TouchableOpacity style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 3 }} onPress={() => setOpen(true)} >
                  <Text style={{ color: '#000' }}>{formattedDate}</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={open}
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false)
                    var date = new Date(date)
                    setDate(date)
                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
                 />
               </View>
                <TouchableOpacity onPress={() => { nextPage() }} disabled={currentPage === Math.ceil(paymentHistoryData.length / 1) - 1}>
                {/* <Image source={ImagePath.RoundLeftArrow} /> */}
                 <Icon name = {"rightcircle"} color={'#F29037'} size={35}/>
                </TouchableOpacity> 
              </View>
              <View style={styles.BillHistoryMain}>
                <View>  

                 <View style={styles.BillHistorySub}>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Document No")}</Text>
                    <Text style={styles.BillHistoryTxt}>{list?.item?.DocumentNo}</Text>
                  </View>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Payment Date")}</Text>
                    <Text style={styles.BillHistoryTxt}>{moment(list.item.PaymentDate, "YYYY/MM/DD").format("DD/MM/YYYY")}</Text>
                  </View>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Payment Amount")}</Text>
                    <Text style={styles.BillHistoryTxt}>{list?.item?.PaymentAmount}</Text>
                  </View>

                 </View>

                 <View style={styles.BillHistoryLine}/>

                  <View style={styles.BillHistorySub2}>

                   <View style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("AdditionalInfo")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.AdditionalInfo}</Text>
                   </View>

                   <View  style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Pay Document Type")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.PayDocType}</Text>
                   </View>

                  </View>
                 </View> 
                 
                 <View style={styles.BillHistoryLine}/>
                  {/* <TouchableOpacity> */}
                     <View style={styles.BillHistoryMainShare}>
                        <Text style={styles.BillHistoryShareTxt}>{(currentPage + 1)  + " / " + (totalData.length)}</Text>
                     </View>
                  {/* </TouchableOpacity> */}
                 </View>
               </View> 
               )}}
                 keyExtractor={(list) => list?.item?.DocumentNo.toString()}
                /> : <Text style={styles.NotFound}>{t('Data does not exists')}</Text> }
                {/* { paymentHistoryData && paymentHistoryData.length > 0 && paymentHistoryData[0].Remarks != "No Bills Generated Yet" ? */}
                 {/* <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress = {() => { createPDF() }} style={{ backgroundColor: 'orange', padding: 10, borderRadius: 3 }}>
                      <Text>{"Create PDF"}</Text>
                    </TouchableOpacity>
                 </View>  */}
                 {/* : null } */}
        </ScrollView>
    );
};
 
export default PaymentHistory;
