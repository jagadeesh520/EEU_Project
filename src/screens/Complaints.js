import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import {ImagePath} from '../CommonComponent/ImagePath';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constant } from '../CommonComponent/Constant';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';

// create a component
const Complaints = ({navigation}) => {
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

    const {theme, styles, changeTheme} = Styles()
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    useEffect (()=> {
      retrieveData()
    }, [])
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
        setComplaintData(responseData.Record)
        setLoading(false)
      })
    }
  
    const retrieveData = async () => {
      setIsRaiseComplaint(false)
      try {
        const value = await AsyncStorage.getItem('accountData');
        if (value !== null) {
          getComplaintHistory(JSON.parse(value));
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
    return (
      <ScrollView style={styles.DashBoardMain}>
            <CommonHeader title={ isRaiseComplaint ? t("Raise Complaint") : t("Complaint")} onBackPress ={onBackPress}/>
            {isLoading &&
              < View style={styles.Loader}>
                <ActivityIndicator size="large" />
              </View>
            }  
           {complaintData && complaintData.length > 0 && !isRaiseComplaint ? 
              <View style={{ margin: 20 }}>
                <View style={styles.ComplaintListMain}>
                    <Text style={styles.ComplaintListTitle}>{t("Recent Complaints")}</Text>
                    <TouchableOpacity style={styles.ComplaintsBtn} onPress={() => { setIsRaiseComplaint(true) }}>
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
                    <Text style={styles.ComplaintListHeader}>{data.ComplaintTitle}</Text>
                    <View style={styles.ComplaintListSubHeader}>
                      <Text style={styles.RaiseComplaintDropdownTxt}>{data.ComplaintTitle}</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                         <Text style={[styles.RaiseComplaintDropdownTxt, { marginRight: 5}]}>{data.ComplaintCloseDate}</Text>
                         <Image source={ImagePath.Line} style={{ height: 10 }}/>
                         <View style={{marginLeft: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '50%'}}><Text style={[styles.RaiseComplaintDropdownTxt, {marginLeft: 5}]}>{t("Status") + ": " + data.ComplaintStatus}</Text></View>
                      </View>
                    </View>

                    <View style={styles.ComplaintListDesMain}>
                        <Text style={styles.RaiseComplaintTxt}>{data.ComplaintResolution}</Text>
                    </View>
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
                <Text style={styles.ComplaintsCommonTxt}>{t("Great! No complaints in last")}</Text>
                <Text style={styles.ComplaintsCommonTxt}>{t("30 days!")}</Text>
                <TouchableOpacity style={styles.ComplaintsBtn} onPress={() => { setIsRaiseComplaint(true) }}>
                    <Text style={styles.ComplaintsBtnTxt}>{t("RAISE A COMPLAINT")}</Text>
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

export default Complaints;
