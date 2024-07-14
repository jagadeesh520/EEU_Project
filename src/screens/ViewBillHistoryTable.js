import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  FlatList,
  Button,
} from "react-native";
import { Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import BackIcon from "react-native-vector-icons/Ionicons";
import UpIcon from "react-native-vector-icons/AntDesign";
import DownIcon from "react-native-vector-icons/AntDesign";
import SortIcon from "react-native-vector-icons/FontAwesome";
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import { constant } from '../CommonComponent/Constant';

const ViewBillHistoryTable = ({ navigation }) => {
  const [accountID, setAccountID] = useState({});

  const [isLoading, setLoading] = useState(true);
  const [Data, setData] = useState([]);
  const { t, i18n } = useTranslation();
  const [showLogout, setShowLogout] = useState(true);
  const [tableDatas, setTableData] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [datas, setDatas] = useState([]);
  const [selectedAssOrder, setSelectedAssOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const parseAmount = (amount) => {
    // Remove whitespace and special characters except for '-'
    const cleanedAmount = amount.replace(/[^\d.-]/g, '');
    // Parse the cleaned string to a float number
    return parseFloat(cleanedAmount);
  };

  const handleSortToggle = () => {
    // Logic to sort data based on ascending/descending order
        if (selectedAssOrder == "Assending") { 
          Data.sort((a, b) => parseAmount(a.Amount) - parseAmount(b.Amount));
        } else {
          Data.sort((a, b) => parseAmount(b.Amount) - parseAmount(a.Amount));
        }
  };

  const getBillHistory = async (value) => {
    fetch(constant.BASE_URL + constant.BILL_HISTORY_GET, {
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
      setData(responseData.Record)
      console.log(responseData.Record, "responseData.Record)")
      setLoading(false)
    })
}

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('accountData');
      if (value !== null) {
        setAccountID(value);
        getBillHistory(JSON.parse(value));
      }
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  /* useEffect(async () => {
    let items = await AsyncStorage.getItem('accountID');  
    const items = JSON.parse(localStorage.getItem('accountID'));
    if (items) {
      setAccountID(items);
      
    }  
    
  }, []);*/
  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  }
 
  const getPaginatedData = () => {
    const startIndex = currentPage * 10;
    const endIndex = startIndex + 10;
    return Data.slice(startIndex, endIndex);
  };

  // Function to handle navigation to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(Data.length / 1) - 1 && Data.length > 0 ) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle navigation to the previous page
  const prevPage = () => {
    if (currentPage > 0 && Data.length > 0 ) {
      setCurrentPage(currentPage - 1);
    }
  };
  const onBackPress = () => {
    navigation.goBack("BottomTab")
  }
  return (
    <ScrollView style={styles.DashBoardMain}>
      <CommonHeader title={t("Bill History")} onBackPress ={onBackPress}/>
      <View style={styles.details}>
        {isLoading && (
              <View style={[styles.indicator, styles.horizontal]}>
                <ActivityIndicator size="large" />
              </View>
        )}
       
        {  Data && Data.length > 0 ?
        <ScrollView horizontal={true}>
          <View>
            <View style={{display: 'flex', flexDirection: 'row', backgroundColor: 'grey', padding: 10}}>
              <View style={{width: '12%'}}><Text style={styles.headerText}>{'Invoice No'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Invoice Date'}</Text></View>
               <View style={{width: '10%'}}><Text style={styles.headerText}>{'Due Date'}</Text></View>
              <View style={{width: '10%'}}>
                 <Text style={styles.headerText}>{'Invoice Amt(ETB)'}</Text>
                 {/* <TouchableOpacity onPress = {() => {
                     if(selectedAssOrder === "") {
                      setSelectedAssOrder('Assending')
                      handleSortToggle()
                     } else if(selectedAssOrder === 'Assending'){ 
                      setSelectedAssOrder('Desending') 
                      handleSortToggle()
                     } else if(selectedAssOrder === 'Desending'){
                      setSelectedAssOrder('') 
                      retrieveData()
                     }
                 }}>
                    { selectedAssOrder  == '' ? 
                     <SortIcon name = {'sort'} size={20}/> :
                      selectedAssOrder == 'Assending' ?
                     <UpIcon name = {'caretup'} size={15}/> :
                     <DownIcon name = {'caretdown'} size={15}/>
                    }
                 </TouchableOpacity> */}
               </View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Billing Month'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Bill Period'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Curr. Load(KW)'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Pre. Read(KWH)'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Curr Read(KWH)'}</Text></View>
              <View style={{width: '10%'}}><Text style={styles.headerText}>{'Consumption (KWH)'}</Text></View>         
            </View>
              <FlatList
                data={getPaginatedData()}
                // style={{ width: '120%' }}
                renderItem={({ item }) => { 
                  let maxPaymentAmount = Data.reduce((max, current) => {
                    return (current.Amount > max) ? current.Amount : max;
                   }, Data[0].Amount);
                  let minPaymentAmount = Data.reduce((min, current) => {
                    return (current.Amount < min) ? current.Amount : min;
                  }, Data[0].Amount);
                  return( 
                  <View style={{ display: 'flex', flexDirection: 'row', padding: 10, backgroundColor: maxPaymentAmount == item?.Amount ? '#FF817E' : minPaymentAmount === item?.Amount ? 'lightgreen' : 'white' }}>
                    <View style={{width: '12%'}}><Text>{item.DocumentNo}</Text></View>
                    <View style={{width: '10%'}}><Text>{item.PostingDate}</Text></View>
                    <View style={{width: '10%'}}><Text>{item.NetDueDate}</Text></View>
                    <View style={{width: '10%'}}><Text>{ item?.Amount ? ((item.Amount).trim()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text></View>
                    <View style={{width: '10%'}}><Text>{item.BillingPeriod}</Text></View>
                    <View style={{width: '10%'}}><Text>{item.BillPeriod}</Text></View>
                    <View style={{width: '10%'}}><Text>{item.CurrentLoad}</Text></View>
                    <View style={{width: '10%'}}><Text>{item?.PreviousRead ? (item.PreviousRead).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text></View>
                    <View style={{width: '10%'}}><Text>{item?.CurrentRead ? (item.CurrentRead).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text></View>
                    <View style={{width: '10%'}}><Text>{item?.Consumption ? (item.Consumption).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text></View>
                  </View>
                )}}
                    keyExtractor={(item) => item.DocumentNo.toString()}
              />
          </View>
       </ScrollView>
        : <Text style={styles.item}>{t('Data does not exists')}</Text>} 
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Button title='Previous' onPress={prevPage} disabled={currentPage === 0} />
        <Text>{"Page " + (currentPage+1) }</Text>
        <Button title='Next' onPress={nextPage} disabled={currentPage === Math.ceil(Data.length / 10) - 1} />
      </View>  
      </View>
      {/* <View style={styles.footer}>
        <Text style={styles.footext}>Powered By NuriFlex</Text>
      </View> */}
    </ScrollView>
  );
}
export default ViewBillHistoryTable;
const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   top: 40 + getStatusBarHeight(),
  //   left: 30,
  // },

  header: {
    height: 120,
    marginTop: -80,
    width: '100%',
  },
  image: {
    width: 24,
    height: 24,
  },
  item: {
    paddingVertical: 8,  
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'grey'
  },
  items: {
    fontWeight: 'bold',
  },
  details: {
    display: 'flex',
    padding: 16,
  },
  itemText: {
    fontSize: 24,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
  box: {
    backgroundColor: 'white',
  },
  box1: {
    backgroundColor: '#9bfd9b',
  },
  footext: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  backbutton: {
    position: 'absolute',
    // top: 40 + getStatusBarHeight(),
    right: 30,
  },
  tableContainer: {
    paddingTop: 30,
    backgroundColor: 'grey',
    display: 'flex',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'grey',
    marginLeft: 10
  },
 
  headerText: { color: '#fff' },
  headerButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  headerButtonText: { color: 'blue', fontSize: 16 },
 
});
