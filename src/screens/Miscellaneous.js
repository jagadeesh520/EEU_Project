import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, Modal, TouchableOpacity }  from 'react-native';
import CommonHeader from '../CommonComponent/CommonComponent';
import Styles from '../CommonComponent/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ImagePath } from '../CommonComponent/ImagePath';
import { Dropdown } from 'react-native-element-dropdown';
import Gallery from 'react-native-vector-icons/MaterialIcons';
import Upload from 'react-native-vector-icons/Feather';
import FileUpload from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-vector-icons/Entypo';
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
import Close from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';

// create a component
const Miscellaneous = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
    const [accountData, setAccountData] = useState({});

    const [ firstName, setFirstName ] = useState("");
    const [ middleName, setMiddleName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ floor, setFloor ] = useState("");
    const [ woreda, setWoreda ] = useState("");
    const [ kebele, setKebele ] = useState("");
    const [ room, setRoom ] = useState("");
    const [ gote_Ketena, setGote_Ketena ] = useState("");
    const [ apartment_Name, setApartment_Name ] = useState("");
    const [ city, setCity ] = useState("");
    const [ district, setDistrict ] = useState("");
    const [ house_Number, setHouse_Number ] = useState("");
    const [ landmark, setLandmark ] = useState("");
    const [ street, setStreet ] = useState("");
    const [ no_of_Installment, setNo_of_Installment ] = useState("");
    const [ install_Doc_Reference, setInstall_Doc_Reference ] = useState("");

    const [ invalidFirstName, setInvalidFirstName ] = useState("");
    const [ invalidLastName, setInvalidLastName ] = useState("");
    const [ invalidFloor, setInvalidFloor ] = useState("");
    const [ invalidWoreda, setInvalidWoreda ] = useState("");
    const [ invalidKebele, setInvalidKebele ] = useState("");
    const [ invalidRoom, setInvalidRoom ] = useState("");
    const [ invalidGote_Ketena, setInvalidGote_Ketena ] = useState("");
    const [ invalidApartment_Name, setInvalidApartment_Name ] = useState("");
    const [ invalidCity, setInvalidCity ] = useState("");
    const [ invalidDistrict, setInvalidDistrict ] = useState("");
    const [ invalidHouse_Number, setInvalidHouse_Number ] = useState("");
    const [ invalidInstall_Doc_Reference, setInvalidInstall_Doc_Reference ] = useState("");
    const [ invalidLandmark, setInvalidLandmark ] = useState("");
    const [ invalidStreet, setInvalidStreet ] = useState("");
    const [ invalidNo_of_Installment, setInvalidNo_of_Installment ] = useState("");

    const [ temp_Conn_Ext_Date, setTemp_Conn_Ext_Date ] = useState(new Date());
    const [ defferal_Date, setDefferal_Date] = useState(new Date());
    const [ selectedCategory1, setSelectedCategory1] = useState("");
    const [ Collective_Billing_Option, setCollective_Billing_Option] = useState([
        { label: "Create Parent CA",  value:"Create Parent CA" },
        { label: "Existing Partent CA",  value:"Existing Partent CA" }

    ]);
    const [ BB_No_of_MonthsOption, setBB_No_of_MonthsOption] = useState([
        { label: "6 Months",  value:"6 Months" },
        { label: "12 Months",  value:"12 Months" }

    ]);
    const [ selectedBB_No_of_Months, setSelectedBB_No_of_Months ]= useState("")
    const [ selectedCollectiveBilling, setselectedCollectiveBilling] = useState("");
    const [ Category1Option, setCategory1Option] = useState([
        { label: "Name correction",  value:"Name correction" },
        { label: "Address correction",  value:"Address correction" },
        { label: "Request for instalment plan",  value:"Request for instalment plan" },
        { label: "Post-paid: Property/meter number correction",  value:"Post-paid: Property/meter number correction" },
        { label: "Pre-paid : Property/meter number correction",  value:"Pre-paid : Property/meter number correction" },
        { label: "Temporary connection extension",  value:"Temporary connection extension" },
        { label: " Clearance request",  value:" Clearance request" },
        { label: "Date correction prepaid meter",  value:"Date correction prepaid meter" },
        { label: "Requesting evidence",  value:"Requesting evidence" },
        { label: "Request for due date deferral",  value:"Request for due date deferral" },
        { label: "Unscheduled (interim) billing",  value:"Unscheduled (interim) billing" },
        { label: "Group billing",  value:"Group billing" },
        { label: "Budget billing",  value:"Budget billing" },
        { label: "Direct debit",  value:"Direct debit" },
        { label: "Transfer of open items",  value:"Transfer of open items" },
        { label: "Failure of online payments",  value:"Failure of online payments" },
        { label: "Power factor device purchase",  value:"Power factor device purchase" },
        { label: "Others",  value:"Others" },
        { label: "Update BP Type",  value:" Update BP Type" },
        { label: "Tin number updating",  value:"Tin number updating" },
    ]);
    const [ Temp_Conn_Type_Option, setTemp_Conn_Type_Option ] = useState([
        { label: "Construction",  value:"Construction" },
        { label: "Others",  value:"Others" }
    ]);
    const [ selected_Temp_Conn_Type, setSelected_Temp_Conn_Type ] = useState("")
    useEffect(() => {
        retrieveData();
    }, []); // Empty array ensures this runs only once

    const onBackPress = () => {
        navigation.goBack("BottomTab");
    };

    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('accountData');
            if (value !== null) {
                const data = JSON.parse(value);
                setAccountData(data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const renderItem = (item) => {
        return (
          <View style={styles.RaiseComplaintItem}>
            <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
          </View>
        );
    };
    const renderTextInput = (name, placeholder, value, updateState, ErrorMsg, setErrorMsg) => {
        return(
          <View>
          
          <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t(name)}</Text>   
            <TextInput
            placeholder={t(placeholder)}
            value={value}
            keyboardType={"phone-pad"}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              updateState(text);
            }}
           />
           <Text style={styles.ErrorMsg}>{ErrorMsg}</Text>
          </View> 
         </View> 
        )
    }
    const onChangeTempConnection = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setTemp_Conn_Ext_Date(currentDate);
        setShow(false)
      };
    
      const showDatepickerStartConnection = () => {
        setShow(true);
      };
      const onChangeDefferalConnection = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDefferal_Date(currentDate);
        setShow(false)
      };
    
      const showDatepickerEndConnection = () => {
        setShow(true);
      };
    return (
        <ScrollView style={styles.DashBoardMain}>
         <CommonHeader title={t("Miscellaneous")} onBackPress ={onBackPress} navigation={navigation}/>
         <View style={ styles.DarkTheme, styles.serviceShiftingMain }>
          <View style={[styles.Margin_30, { width: '72%'   }]}>
            <Text style={styles.LoginSubTxt}>{t("BP") + " *"}</Text>    
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{accountData.BP_No}</Text>
            </View>
          </View> 
          <View style={[styles.Margin_10, { width: '72%'}]}>
            <Text style={styles.LoginSubTxt}>{t("CA") + " *"}</Text>     
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{accountData.CA_No}</Text>
            </View>
          </View> 
          <View style={[styles.Margin_10, { width: '72%'}]}>
            <Text style={styles.LoginSubTxt}>{t("Request Description") + " *"}</Text>     
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{"Move Out Request from Mobile App"}</Text>
            </View>
          </View>  
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Category1")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Category1")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={Category1Option}
                value={selectedCategory1}
                onChange={item => {
                    setSelectedCategory1(item.value);
                   
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
           </View>
           {renderTextInput("First Name", "Enter first name", firstName, setFirstName, invalidFirstName, setInvalidFirstName)}
           {renderTextInput("Middle Name", "Enter middle name", middleName, setMiddleName)}
           {renderTextInput("Last Name", "Enter last name", lastName, setLastName, invalidLastName, setInvalidLastName)}
           {renderTextInput("Floor", "Enter the floor", floor, setFloor, invalidFloor, setInvalidFloor)}
           {renderTextInput("Woreda", "Enter the woreda", woreda, setWoreda, invalidWoreda, setInvalidWoreda)}
           {renderTextInput("Kebele", "Enter the kebele", kebele, setKebele, invalidKebele, setInvalidKebele)}
           {renderTextInput("Room", "Enter the Room", room, setRoom, invalidRoom, setInvalidRoom)}
           {renderTextInput("Gote_Ketena", "Enter the Gote_Ketena", gote_Ketena, setGote_Ketena, invalidGote_Ketena, setInvalidGote_Ketena)}
           {renderTextInput("Apartment_Name", "Enter the Apartment_Name", apartment_Name, setApartment_Name, invalidApartment_Name, setInvalidApartment_Name)}
           {renderTextInput("City", "Enter the City", city, setCity, invalidCity, setInvalidCity)}
           {renderTextInput("District", "Enter the District", district, setDistrict, invalidDistrict, setInvalidDistrict)}
           {renderTextInput("House_Number", "Enter the House_Number", house_Number, setHouse_Number, invalidHouse_Number, setInvalidHouse_Number)}
           {renderTextInput("Landmark", "Enter the Landmark", landmark, setLandmark, invalidLandmark, setInvalidLandmark)}
           {renderTextInput("Street", "Enter the Street", street, setStreet, invalidStreet, setInvalidStreet)}
           {renderTextInput("No_of_Installment", "Enter the No_of_Installment", no_of_Installment, setNo_of_Installment, invalidNo_of_Installment, setInvalidNo_of_Installment)}
           {renderTextInput("Install_Doc_Reference", "Enter the Install_Doc_Reference", install_Doc_Reference, setInstall_Doc_Reference, invalidInstall_Doc_Reference, setInvalidInstall_Doc_Reference)}

           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Temp_Conn_Type")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Temp_Conn_Type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={Temp_Conn_Type_Option}
                value={selected_Temp_Conn_Type}
                onChange={item => {
                    setSelected_Temp_Conn_Type(item.value);
                   
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Temp_Conn_Ext_Date")}</Text>   
            <TouchableOpacity onPress={showDatepickerStartConnection} style={styles.QuesComplaintDropdown}>
               <TextInput
                 style={{color: '#666666', fontSize: 12}}
                 value={moment(temp_Conn_Ext_Date).format('DD-MM-YYYY')}
                 placeholder={t("Select Date")}
                 editable={false}
              />
             </TouchableOpacity>
            {show && (
             <DateTimePicker
               testID="dateTimePicker"
               value={connStartDate}
               mode="date"
               display="default"
               onChange={onChangeTempConnection}
             />
            )}
           </View> 
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Defferal_Date")}</Text>   
            <TouchableOpacity onPress={showDatepickerStartConnection} style={styles.QuesComplaintDropdown}>
               <TextInput
                 style={{color: '#666666', fontSize: 12}}
                 value={moment().format('DD-MM-YYYY')}
                 placeholder={t("Select Date")}
                 editable={false}
              />
             </TouchableOpacity>
            {show  && (
             <DateTimePicker
               testID="dateTimePicker"
               value={defferal_Date}
               mode="date"
               display="default"
               onChange={onChangeDefferalConnection}
             />
            )}
           </View>
           {renderTextInput("Defferal_Doc_Reference", "Enter the Defferal_Doc_Reference", defferal_Doc_Reference, setDefferal_Doc_Reference, invalidDefferal_Doc_Reference, setInvalidDefferal_Doc_Reference)}
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Collective_Billing")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Temp_Conn_Type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={Collective_Billing_Option }
                value={selectedCollectiveBilling}
                onChange={item => {
                    setselectedCollectiveBilling(item.value);
                   
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
           </View>
           {renderTextInput("Collective_Bill_AC", "Enter the Collective_Bill_AC", collective_Bill_AC, setCollective_Bill_AC, invalidCollective_Bill_AC, setInvalidCollective_Bill_AC)}
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("BB_No_of_Months")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the BB_No_of_Months")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={BB_No_of_MonthsOption }
                value={selectedBB_No_of_Months}
                onChange={item => {
                    setSelectedBB_No_of_Months(item.value);
                   
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
           </View>
         </View>
        </ScrollView>  
    );
};

export default Miscellaneous;
 