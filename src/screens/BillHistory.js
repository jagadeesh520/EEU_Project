//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, FlatList, ActivityIndicator, ScrollView } from 'react-native';
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

 // create a component
const BillHistory = ({navigation}) => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [ accountData, setAccountData ] = useState({})
  const [ billHistoryData, setBillHistoryData ] = useState([])
  const [ currentPage, setCurrentPage ] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [ totalData, setTotalData ] = useState([])

  const {theme, styles, changeTheme} = Styles()
    const onBackPress = () => {
      navigation.goBack("BottomTab")
    }
    useEffect(() => {
      retrieveData();
    }, []);
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          setAccountData(JSON.parse(value));
          getBillHistory(JSON.parse(value));
        }
      } catch (error) {
        // console.error(error);
      }
    };
   
    const getBillHistory = (value) => {
      var url = constant.BASE_URL + constant.BILL_HISTORY_GET
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
          setTotalData(responseData.Record)
          setBillHistoryData(responseData.Record)
          setLoading(false)
        })
    }
    const getPaginatedData = () => {
      const startIndex = currentPage * 1;
      const endIndex = startIndex + 1 ;
      return billHistoryData.slice(startIndex, endIndex);
    };
    const nextPage = () => {
      if (currentPage < Math.ceil(billHistoryData.length / 1) - 1 && billHistoryData.length > 0 ) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 0 && billHistoryData.length > 0 ) {
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

    const createPDF = async () => {
      const logoPath = Image.resolveAssetSource(require('../../assets/EEULogo.jpg')).uri;
      const logoBase64 = await getBase64Logo(logoPath);
      const logoImage = `data:image/jpeg;base64,${logoBase64}`;
      console.log('Base64 logo image:', logoImage);  // Use this in your HTML

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
        <div class="receipt-header">
            <div class="region">REGION: A - ADDIS ABABA REGION ELECTRIC UTILITY</div>
        </div>
        <div class="receipt-header">
            <div class="csc">CSC: AA01 - EAST ADDIS ABABA CSC-NO.2</div>
            <div class="voucher">Receipt Voucher No.: 403000000011</div>
        </div>
        <div class="date">Date: 13.02.2019</div>
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
                <div>ATO ESAYASE AYELEM</div>
                <div class="bold">Business Partner No:</div>
                <div>20000002292</div>
                <div class="bold">Contract Account No:</div>
                <div>100000002784</div>
                <div>Woreda: <span>Kebele: </span><span>H.No: </span></div>
                <div>VAT Reg. No: <span>Date of Reg:</span></div>
                <div>TIN No: </div>
            </div>
        </div>
    </div>
    <div class="receipt3">
        <div class="section">
            <span class="bold">Payment Description:</span> Received amount against the reference no. 200000000246
        </div>
        <div class="section">
            <span class="bold">Collected Amount:</span> 
            <span class="collected-amount">270.13</span>
        </div>
        <div class="section">
            <span class="bold">In Word:</span> TWO HUNDRED SEVENTY BIRR THIRTEEN CENTS
        </div>
        <div class="section">
            <span class="bold">Mode of Payment:</span> CASH
        </div>
        <div class="section">
            <span class="bold">Cashier ID:</span> SBAWA
        </div>
        <div class="signature-section">
            <div><span class="bold">Signature:</span></div>
        </div>
    </div>
</body>
</html>
` ;
        let options = {
          html: htmlContent,
          fileName: 'BillHistory',
          directory: 'Download',
        };
    
        let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        alert(file.filePath);
    }
    return (
        <ScrollView style={styles.DashBoardMain}>
            <CommonHeader title={t("Bill History")} onBackPress ={onBackPress} navigation={navigation}/>
            {isLoading &&
              < View style={styles.Loader}>
                <ActivityIndicator size="large" />
              </View>
            }  
           <View style={styles.DarkTheme}> 
           { billHistoryData && billHistoryData.length > 0 && billHistoryData[0].Remarks != "No Bills Generated Yet" ?    
             <View style={{ padding: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewBillHistoryTable')} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>{t('Click Here for Table View')}</Text>
              </TouchableOpacity>
             </View> : null 
           }
            { billHistoryData && billHistoryData.length > 0 && billHistoryData[0].Remarks != "No Bills Generated Yet"? 
              <FlatList
                data={getPaginatedData()}
                renderItem={(list , index) => {
                  const formattedDate = moment(list.item.PostingDate, "YYYY/MM/DD").format("MMM / YYYY");
                return( 
            <View style={{ padding: 20, width: '100%' }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <TouchableOpacity onPress={prevPage} disabled={currentPage === 0}>
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
                <TouchableOpacity onPress={nextPage} disabled={currentPage === Math.ceil(billHistoryData.length / 1) - 1}>
                {/* <Image source={ImagePath.RoundLeftArrow} /> */}
                 <Icon name = {"rightcircle"} color={'#F29037'} size={35}/>
                </TouchableOpacity> 
              </View>
              <View style={styles.BillHistoryMain}>
                <View>  

                 <View style={styles.BillHistorySub}>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Invoice No")}</Text>
                    <Text style={styles.BillHistoryTxt}>{list?.item?.DocumentNo}</Text>
                  </View>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Invoice Date")}</Text>
                    <Text style={styles.BillHistoryTxt}>{list?.item?.PostingDate}</Text>
                  </View>

                  <View>
                    <Text style={styles.BillHistoryTitle}>{t("Amt(ETB)")}</Text>
                    <Text style={styles.BillHistoryTxt}>{ list?.item?.Amount ? ((list?.item?.Amount).trim()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text>
                  </View>

                 </View>

                 <View style={styles.BillHistoryLine}/>

                  <View style={styles.BillHistorySub2}>

                   <View style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Due Date")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.NetDueDate}</Text>
                   </View>

                   <View  style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Billing Month")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.BillingPeriod}</Text>
                   </View>

                  </View>

                 <View style={styles.BillHistorySub2}>

                  <View  style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Curr. Load(KW)")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.CurrentLoad ? list.item.CurrentLoad : '-'}</Text>
                  </View>

                  <View  style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Pre. Read(KWH)")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.PreviousRead}</Text>
                  </View>

                 </View>

                 <View style={styles.BillHistorySub2}>

                  <View  style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Curr. Read(KW)")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.CurrentRead}</Text>
                  </View>

                  <View style={styles.BillHistorySubCon}>
                    <Text style={styles.BillHistorySub2Title}>{t("Consumption(KWH)")}</Text>
                    <Text style={styles.BillHistorySub2Txt}>{list?.item?.Consumption}</Text>
                  </View>

                 </View>

                 </View> 
                 
                 <View style={styles.BillHistoryLine}/>
                     <View style={styles.BillHistoryMainShare}>
                        <Text style={styles.BillHistoryShareTxt}>{(currentPage + 1)  + " / " + (totalData.length)}</Text>
                     </View>
                 </View>
               </View> 
               )}}
                 keyExtractor={(list) => list?.item?.DocumentNo.toString()}
                /> 
              : <Text style={styles.NotFound}>{t('Data does not exists')}</Text> } 
            </View> 
            {/* <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress = {() => { createPDF() }} style={{ backgroundColor: 'orange', padding: 10, borderRadius: 3 }}>
                 <Text>{"Create PDF"}</Text>
            </TouchableOpacity>
            </View>  */}
        </ScrollView>
    );
};
 
export default BillHistory;
