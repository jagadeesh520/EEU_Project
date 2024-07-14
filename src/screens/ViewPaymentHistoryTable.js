import React, { useEffect,useState } from 'react'
// import BackButton from '../components/BackButton'
import { TouchableOpacity, Image, StyleSheet, View,Text,SafeAreaView, ScrollView,ActivityIndicator, FlatList, Button} from 'react-native'
import { Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import BackIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonHeader from '../CommonComponent/CommonComponent';
import { constant } from '../CommonComponent/Constant';


export default function ViewPaymentHistoryTable ({ navigation }) {

  const [Data, setData] = useState([]);
  const [accountID, setAccountID] = useState({});
  const [isLoading, setLoading] = useState(true);
  const { t,i18n } = useTranslation();
  const [showLogout, setShowLogout] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [ energySavingTips, setEnergySavingTips ] = useState([
    'Switch to LED Bulbs',
    'Unplug Unused Devices',
    'Use Energy-Efficient Appliances',
    'Adjust Thermostat Settings',
  ])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(false);

  const animateMessage = () => {
    const message = energySavingTips[currentMessageIndex];
    const messageWidth = message.length * 12; // Adjust based on text length and styling
    const animationDuration = messageWidth * 30; // Adjust animation speed based on message length

    Animated.sequence([
      Animated.timing(messagePosition, {
        toValue: -messageWidth,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(messagePosition, {
        toValue: SCREEN_WIDTH,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === energySavingTips.length - 1 ? 0 : prevIndex + 1
      );
    });
  };
  const getPaymentHistory = (value)=>{
    fetch(constant.BASE_URL + constant.PAYMENT_HISTORY_GET, {
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
      setData(responseData.Record)
    })
  }

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('accountData');
      if (value !== null) {
        setAccountID(value);
        getPaymentHistory(JSON.parse(value));
      }
    } catch (error) {
      // console.error(error);
    }
  };
  
  useEffect(() => {
    retrieveData();
    const transitionDuration = 4000; // Duration between transitions in milliseconds
    const displayDuration = 1500; // Duration to display each value in milliseconds

    const transitionInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % energySavingTips.length);
    }, transitionDuration);

    const displayInterval = setInterval(() => {
      setDisplayText(true);
      setTimeout(() => {
        setDisplayText(false);
      }, displayDuration);
    }, transitionDuration);

    return () => {
      clearInterval(transitionInterval);
      clearInterval(displayInterval);
    };
  }, [currentMessageIndex]);
  const getPaginatedData = () => {
    const startIndex = currentPage * 10;
    const endIndex = startIndex + 10;
    return Data.slice(startIndex, endIndex);
  };

  // Function to handle navigation to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(Data.length / 10) - 1 && Data.length > 0 ) {
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
      <CommonHeader title={"Payment History"} onBackPress ={onBackPress}/>
      <View style={styles.details}>
        <ScrollView>
          <View>
            {isLoading &&
              < View style={[styles.indicator, styles.horizontal]}>
                <ActivityIndicator size="large" />
              </View>
            }
            { Data && Data?.length > 0 ? 
                <ScrollView horizontal={true}>
                <View>
                  <View style={{display: 'flex', flexDirection: 'row', backgroundColor: 'grey', padding: 10}}>
                    <View style={{width: '20%'}}><Text style={styles.headerText}>{t('Document Number')}</Text></View>
                    <View style={{width: '20%'}}><Text style={styles.headerText}>{t('PaymentAmount')}</Text></View>
                    <View style={{width: '20%'}}><Text style={styles.headerText}>{t('AdditionalInfo')}</Text></View>
                    <View style={{width: '20%'}}><Text style={styles.headerText}>{t('Pay Document Type')}</Text></View>
                    <View style={{width: '20%'}}><Text style={styles.headerText}>{t('PaymentDate')}</Text></View>
                  </View>
                    <FlatList
                      data={getPaginatedData()}
                      renderItem={({ item, index }) => { 
                        let maxPaymentAmount = Data.reduce((max, current) => {
                          return (current.PaymentAmount > max) ? current.PaymentAmount : max;
                        }, Data[0].PaymentAmount);
                        let minPaymentAmount = Data.reduce((min, current) => {
                          return (current.PaymentAmount < min) ? current.PaymentAmount : min;
                        }, Data[0].PaymentAmount);
                      return( 
                        <View style={{ display: 'flex', flexDirection: 'row', padding: 10, backgroundColor: maxPaymentAmount == item?.PaymentAmount ? '#FF817E' : minPaymentAmount === item?.PaymentAmount ? 'lightgreen' : 'white' }}>
                        <View style={{width: '20%'}}><Text>{item.DocumentNo}</Text></View>
                          <View style={{width: '20%'}}><Text>{ item?.PaymentAmount ? ((item.PaymentAmount).trim()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "" }</Text></View>
                          <View style={{width: '20%'}}><Text>{item.AdditionalInfo}</Text></View>
                          <View style={{width: '20%'}}><Text>{item.PayDocType}</Text></View>
                          <View style={{width: '20%'}}><Text>{item.PaymentDate}</Text></View>
                        </View>
                      )}}
                      keyExtractor={(item) => item.DocumentNo}
                    /> 
                </View>
             </ScrollView>
             : <Text style={styles.item}>{t('Data does not exists')}</Text>}
              { Data && Data.length > 0 ?  
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                  <Button title='Previous' onPress={prevPage} disabled={currentPage === 0} />
                  <Text>{"Page " + (currentPage + 1)}</Text>
                  <Button title='Next' onPress={nextPage} disabled={currentPage === Math.ceil(Data.length / 10) - 1} />
               </View>  
              : null } 
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      // top: 40 + getStatusBarHeight(),
      left: 30,
    },
    header:{
    height:120,
    marginTop:-80,
    width: '130%'
    },
    image: {
      width: 24,
      height: 24,
    },
    item: {
      paddingLeft: 15,
      paddingTop: 8,
      paddingBottom: 8
    },
    details: {
      display: 'flex',
      padding: 16,
      // width:350,
    },
    itemText: {
      fontSize: 24,
      color: 'black'
    },
    footer: {
      flexDirection: 'row',
      marginTop:1 ,
    },
    box :{
      backgroundColor:'white',
      
    },
    box1 :{
      backgroundColor:'#FBB034',
    },
    footext:{
      marginBottom:10,
      fontWeight:'bold',
    },
    backbutton: {
      position: 'absolute',
      // top: 40 + getStatusBarHeight(),
      right : 30,
    },
    headerText: { color: '#fff' },
  })
