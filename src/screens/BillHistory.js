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
        </ScrollView>
    );
};
 
export default BillHistory;
