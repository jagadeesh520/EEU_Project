import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const ServiceRequestStatus = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const toast = useToast();
    const [isRaiseComplaint, setIsRaiseComplaint] = useState(false)
    const [selectedType, setSelectedType] = useState({})
    const [isComplaintList, setIsComplaintList] = useState(true)
    const [complaintType, setComplaintType] = useState([
      { label: 'Select Complaint', value: '' },
      { label: 'Supply related', value: 'ZPO_MET_MEB' },
      { label: 'Meter related', value: 'ZPO_MET_MEB' },
      { label: 'Billing related', value: 'ZPO_BIL_BNG' },
      { label: 'EEU employees related', value: 'ZPO_EMP_UEE' },
      { label: 'Customer related', value: 'ZPO_CUS_CIL' },
      { label: 'EEU service related', value: 'ZPO_SER_EPN' },
      { label: 'Miscellaneous', value: 'ZPO_SER_EPN' },
      { label: 'Tariff Change', value: 'ZPO_BIL_WRT' },
    ]);
    const [ accountData, setAccountData ] = useState({})
    const [ complaintTitle, setComplaintTitle ] = useState("")
    const [ complaintDescription, setComplaintDescription ] = useState("")
    const [ complaintData, setComplaintData ] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const {theme, styles, changeTheme} = Styles()
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    useEffect (()=> {
      retrieveData()
    }, []);
  
    const getComplaintHistory = (value)=>{
      fetch(constant.BASE_URL + constant.COMPLAINT_LIST, {
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
        if (responseData?.Record) { 
          let updatedComplaint = responseData.Record.map(item => {
            return {
              ...item,
              isExpand: false
            };
          });
          setComplaintData(updatedComplaint);
        }
        console.log(responseData.Record,"responseData.Record")
        setLoading(false)
      })
    }
  
    const retrieveData = async () => {
      setIsRaiseComplaint(false)
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          getComplaintHistory(JSON.parse(value));
          setAccountData(JSON.parse(value))
        }
      } catch (error) {
        console.error(error);
      }
    };
    const clearData = () => {
      setAccountData({})
      setComplaintTitle("")
      setComplaintDescription(""),
      setSelectedType({})
    }
    const showToast = (type, message) => {
      toast.show(message, {
        type: type,
        duration: 4000,
        animationType: 'slide-in',
        placement: 'bottom',
        style: {
          backgroundColor: type === 'success' ? 'green' : 'red',
        },
        textStyle: {
          color: 'white',
        },
        closeButton: true,
      });
    };    
    const onPressSubmit = () => {
        fetch(constant.BASE_URL + constant.COMPLAINT_POST, {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            ContractAccount: accountData.CA_No,
            ComplaintCategoryCode: selectedType.value,
            ComplaintTitle: complaintTitle,
            ComplaintDescription: complaintDescription,
          }
        }),
      })
        .then((response) =>
          response.json())
        .then(async (responseData) => {
          if (responseData.Record[0].ComplaintNumber) {
            showToast('success', 'Complaint is raised successfully, Complaint Number:' +responseData.Record[0].ComplaintNumber );
            setIsRaiseComplaint(false)
            clearData()
          } 
        }) .catch(error => {
            console.log(error, "error")
        });
  
    } 
    const renderItem = (item) => {
        return (
          <View style={styles.RaiseComplaintItem}>
            <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
          </View>
        );
      };
      const toggleExpand = (index) => {
        // Map through the complaintData to toggle the isExpand property for the clicked item
        const updatedData = complaintData.map((item, idx) => {
          if (index === idx) {
            // Toggle the isExpand property only for the clicked item
            return { ...item, isExpand: !item.isExpand };
          }
          return item;
        });
    
        setComplaintData(updatedData);
      };
    
    return (
      <ScrollView style={styles.DashBoardMain}>
            <CommonHeader title={ t("Service Request Status")} onBackPress ={onBackPress} navigation={navigation}/>
            {isLoading &&
              < View style={styles.Loader}>
                <ActivityIndicator size="large" />
              </View>
            } 
             <View style={styles.container}>
    </View> 
           {complaintData && complaintData.length > 0 && !isRaiseComplaint ? 
              <View style={{ margin: 20 }}>
                <View style={styles.ComplaintListMain}>
                    <Text style={styles.ComplaintListTitle}>{t("Recent Service Status")}</Text>
                    <TouchableOpacity style={styles.ComplaintsBtn} onPress={() => { navigation.navigate("ServiceRequest"); }}>
                      <View style={styles.ComplaintListNewBntMain}> 
                       <Image source={ImagePath.PlusIcon} />  
                       <Text style={[styles.ComplaintsBtnTxt, {marginLeft: 10}]}>{t("NEW")}</Text>
                      </View> 
                    </TouchableOpacity> 
                  </View>
               
                <ScrollView style={{ height: '100%' }}>
                  { complaintData && complaintData.length > 0 && complaintData.map((data, index) =>{ 
                  return( 
                   <View style={styles.ComplaintListSub}>
                    <TouchableOpacity style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }} 
                     onPress={() => toggleExpand(index)}
                    >
                    { data?.isExpand ?
                      <Icon name={'minuscircleo'} size={20} /> : 
                      <Icon name={'pluscircleo'} size={20} />
                    }
                  </TouchableOpacity>
                   <View style={{ display: 'flex', flexDirection: 'row', flex: 1}}>  
                    <View style={{ display: 'flex', flex: 0.5}}>
                     <Text style={styles.ComplaintListHeader}>{t("Complaint No") + " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data.ComplaintNumber}</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 0.5}}>
                     <Text style={styles.ComplaintListHeader}>{t("Complaint Status") + " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data?.ComplaintStatus}</Text>
                    </View>
                   </View>
                   {data.isExpand && (
                   <View>
                   <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>  
                   <View style={{ display: 'flex', flex: 0.5, flexWrap: 'wrap'}}>
                     <Text style={styles.ComplaintListHeader}>{t("Complaint Title")+ " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data?.ComplaintTitle}</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 0.5}}>
                     <Text style={styles.ComplaintListHeader}>{t("Complaint Category")+ " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data.ComplaintCategory}</Text>
                    </View>
                   </View>
                   <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>  
                   <View style={{ display: 'flex', flex: 0.5}}>
                   <Text style={styles.ComplaintListHeader}>{t("Comp. Raised Date") + " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data?.ComplaintRaisedDate}</Text>
                    </View>
                    <View style={{ display: 'flex', flex: 0.5}}>
                     <Text style={styles.ComplaintListHeader}>{t("Comp. Closed Date") + " "}</Text>
                     <Text style={styles.ComplaintListHeaderValue}>{data?.ComplaintCloseDate}</Text>
                    </View>
                   </View>
                   <View style={styles.ComplaintListDesMain}>
                        <Text style={styles.ComplaintListHeader}>{t("Complanit Resolution") + " "}</Text>
                        <Text style={styles.RaiseComplaintTxt}>{data.ComplaintResolution}</Text>
                    </View>
                    </View>
                          )}

                    {/* <Text style={[styles.RaiseComplaintDropdownTxt, { marginRight: 5, marginTop: 20}]}>{"Complaint Raised Date: " + data?.ComplaintRaisedDate}</Text>
                    <View style={styles.ComplaintListSubHeader}>
                      <Text style={styles.RaiseComplaintDropdownTxt}>{data.ComplaintTitle}</Text>
                      {data?.ComplaintTitle ? <Image source={ImagePath.Line} style={{ height: 10, margin: 10 }}/> : null }
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                         <Text style={[styles.RaiseComplaintDropdownTxt, { marginRight: 5}]}>{data?.ComplaintCloseDate}</Text>
                         <Image source={ImagePath.Line} style={{ height: 10 }}/>
                         <View style={{marginLeft: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '50%'}}><Text style={[styles.RaiseComplaintDropdownTxt, {marginLeft: 5}]}>{t("Status") + ": " + data.ComplaintStatus}</Text></View>
                      </View>
                    </View> */}

                   
                    {/* <View style={styles.ComplaintListBtn}>
                      <TouchableOpacity style={[styles.ComplaintListEditBtn, { borderRightWidth: 1, borderRightColor: '#D9D9D' }]}>
                        <Text style={styles.ComplaintListEditTxt}>{t("Edit")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.ComplaintListEditBtn}>
                        <Text style={styles.ComplaintListDeleteTxt}>{t("Delete")}</Text>
                      </TouchableOpacity>
                   </View> */}
                   </View> ) }) } 
                  

                </ScrollView>
              </View>  : complaintData && complaintData.length == 0 && !isLoading ? 
              <View style={styles.ComplaintsMain}>
                <Image source={ImagePath.Complaint} style={styles.ComplaintsWaterMark}/>
                <Text style={styles.ComplaintsCommonTxt}>{t("Great! No service request status in last")}</Text>
                <Text style={styles.ComplaintsCommonTxt}>{t("30 days!")}</Text>
                <TouchableOpacity style={styles.ComplaintsBtn} onPress={() => { navigation.navigate("ServiceRequest")}}>
                    <Text style={styles.ComplaintsBtnTxt}>{t("RAISE A SERVICE REQUEST")}</Text>
                </TouchableOpacity> 
              </View> : null
            }
            { isRaiseComplaint  ? 
                <View>
                 <View style={styles.RaiseComplaintMain}>
                   <Text style={styles.RaiseComplaintDropdownTxt}>{t("Compliant Type")}</Text>
                   <Dropdown
                    placeholderStyle={styles.RaiseComplaintDropdownTxt}
                    selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                    inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                    iconStyle={styles.RaiseComplaintDropdownTxt}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Complaint"
                    style={styles.RaiseComplaintDropdown}
                    renderItem={renderItem}
                    data={complaintType}
                    value={selectedType}
                    onChange={item => {
                       setSelectedType(item);
                     }}               
                   />
                    <View style={{ marginTop: 15 }}>
                     <Text style={styles.RaiseComplaintDropdownTxt}>{t("Compliant Title")}</Text>
                     <TextInput 
                       placeholder={t("Enter compliant title")} 
                       placeholderTextColor={"#666666"} 
                       style={styles.RaiseComplaintDropdown} 
                       value={complaintTitle}
                       onChangeText={(text) => {  
                         setComplaintTitle(text)
                       }}
                     />
                   </View>
                   <View style={{ marginTop: 15 }}>
                     <Text style={styles.RaiseComplaintDropdownTxt}>{t("Compliant Description")}</Text>
                     <TextInput 
                       placeholder={t("Enter compliant description")} 
                       placeholderTextColor={"#666666"} 
                       style={[styles.RaiseComplaintDropdown, { height: 150  }]} 
                       value={complaintDescription}
                       onChangeText={(text) => {  
                         setComplaintDescription(text)
                       }}
                     />
                   </View>
                 </View>
                 <View style={styles.RaiseComplaintMain2}>
                   <TouchableOpacity style={styles.ComplaintsBtn1} onPress={() => { clearData() }}>
                       <Text style={styles.ComplaintsBtnTxt1}>{t("DISCARD")}</Text>
                   </TouchableOpacity> 
                   <TouchableOpacity style={styles.RaiseComplaintBtn} onPress={() =>{ onPressSubmit(true) }}>
                       <Text style={styles.RaiseComplaintBtnTxt}>{t("SUBMIT")}</Text>
                   </TouchableOpacity> 
                 </View>
                  
              </View> : null }
        </ScrollView>
    );
};

export default ServiceRequestStatus;
const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});