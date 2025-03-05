import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, Modal, TouchableOpacity, ActivityIndicator }  from 'react-native';
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
import moment from 'moment';
import RNFS from 'react-native-fs';  // Import RNFS
import { constant } from '../CommonComponent/Constant';
// create a component
const Miscellaneous = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
    const [accountData, setAccountData] = useState({});
    const [isLoading, setLoading]= useState(false);

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
    const [show, setShow] = useState(false);
    const [defferal_Doc_Reference, setDefferal_Doc_Reference] = useState("");
    const [collective_Bill_AC, setCollective_Bill_AC] = useState("");
    const [transfer_CA, setTransfer_CA] = useState("");
    const [transfer_Doc_Ref, setTransfer_Doc_Ref] = useState("");
    const [no_of_PF_Device, setNo_of_PF_Device] = useState("");

    const [ invalidIDType, setInvalidIDType] = useState("");
    const [ invalidIDProof, setInvalidIDProof] = useState("");
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
    const [invalidTemp_Conn_Ext_Date, setInvalidTemp_Conn_Ext_Date] = useState("");
    const [invalidTemp_Conn_Type, setInvalidTemp_Conn_Type] = useState("");
    const [invalidDefferal_Date , setInvalidDefferal_Date ] = useState("");
    const [invalidDefferal_Doc_Reference, setInvalidDefferal_Doc_Reference] = useState("");
    const [ invalidCollectiveBilling, setInvalidCollectiveBilling ] = useState("");
    const [ invalidCollective_Bill_AC, setInvalidCollective_Bill_AC ] = useState("");
    const [ invalidBB_No_of_Months, setInvalidBB_No_of_Months ] = useState("");
    const [ invalidTransfer_CA, setInvalidTransfer_CA ] = useState("");
    const [ invalidTransfer_Doc_Ref, setInvalidTransfer_Doc_Ref ] = useState("");
    const [ invalidNo_of_PF_Device, setInvalidNo_of_PF_Device ] = useState("");
    const [ invalidPF_Corrector, setInvalidPF_Corrector ] = useState("");
    const [ invalidCategory1, setInvalidCategory1 ] = useState("");
    const [ invalidPartnerType, setInvalidPartnerType] = useState("");
    const [ invalidRequestDes, setInvalidRequestDes ] = useState("");

    const [ requestDes, setRequestDes ] = useState("");
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
        { label: "Name correction",  value:"M01" },
        { label: "Address correction",  value:"M02" },
        { label: "Request for instalment plan",  value:"M03" },
        { label: "Post-paid: Property/meter number correction",  value:"M06" },
        { label: "Pre-paid : Property/meter number correction",  value:"M07" },
        { label: "Temporary connection extension",  value:"M08" },
        { label: "Clearance request",  value:"M10" },
        { label: "Date correction prepaid meter",  value:"M11" },
        { label: "Requesting evidence",  value:"M12" },
        { label: "Request for due date deferral",  value:"M13" },
        { label: "Unscheduled (interim) billing",  value:"M15" },
        { label: "Group billing",  value:"M16" },
        { label: "Budget billing",  value:"M17" },
        { label: "Direct debit",  value:"M18" },
        { label: "Transfer of open items",  value:"M19" },
        { label: "Failure of online payments",  value:"M20" },
        { label: "Power factor device purchase",  value:"M99" },
        { label: "Others",  value:"M21" },
        { label: "Update BP Type",  value:"M22" },
        { label: "Tin number updating",  value:"M23" },
    ]);
    const [ Temp_Conn_Type_Option, setTemp_Conn_Type_Option ] = useState([
        { label: "Construction",  value:"Construction" },
        { label: "Others",  value:"Others" }
    ]);
    const [ selected_Temp_Conn_Type, setSelected_Temp_Conn_Type ] = useState("");
    const [ PF_CorrectorOption, setPF_CorrectorOption ] = useState([
        { label: "IHPF_LV50",  value:"IHPF_LV50" },
        { label: "IHPF_LV500 + 100",  value:"IHPF_LV500 + 100" },
        { label: "IHPF_LV500 + 200",  value:"IHPF_LV500 + 200" },
        { label: "IHPF_LV500 + 300",  value:"IHPF_LV500 + 300" },
        { label: "IHPF_LV500 + 400",  value:"IHPF_LV500 + 400" },
        { label: "IHPF_LV500X2",  value:"IHPF_LV500X2" },
        { label: "IHPF_LV75",  value:"IHPF_LV75" },
        { label: "IHPF_LV100",  value:"IHPF_LV100" },
        { label: "IHPF_LV150",  value:"IHPF_LV150" },
        { label: "IHPF_LV200",  value:"IHPF_LV200" },
        { label: "IHPF_LV250",  value:"IHPF_LV250" },
        { label: "IHPF_LV300",  value:"IHPF_LV300" },
        { label: "IHPF_LV400",  value:"IHPF_LV400" },
        { label: "IHPF_LV500",  value:"IHPF_LV500" },
    ]);
    const [selectedPF_Corrector, setSelectedPF_Corrector] = useState("");
    const [ partnerTypeOptions, setPartnerTypeOptions ] = useState([
        { label: "EEU Active Staff",  value:"EEU Active Staff" },
        { label: "EEU Retried Staff",  value:"EEU Retried Staff" },
        { label: "Others",  value:"Others" },
        { label: "VIP",  value:"VIP" },
        { label: "VVIP",  value:"VVIP" }
    ]);
    const [selectPartnerType, setSelectPartnerType] = useState("");
    const [TIN_Number, setTIN_Number] = useState("");
    const [invalidTIN_Number, setInvalidTIN_Number] = useState("");

    const [selectedIDType, setSelectedIDType] = useState("");
    const [selectedOwnerShipType, setSelectedOwnerShipType] = useState("");
    const [isDocumentOption, setDocumentOption] = useState(false);
    const [isDocumentOption1, setDocumentOption1] = useState(false);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [imageName, setImageName] = useState(null);
    const [imageName2, setImageName2] = useState(null);
    const { themes, themeObj } = useThemes();
    const [ selectedImage, setSelectedImage ] = useState("");
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);

    const [ IDTypeOptions, setIDTypeOptions ] = useState([
        { label: "Passport",  value:"Passport" },
        { label: "Residential ID",  value:"Residential ID" },
        { label: "Active / Retried Staff ID",  value:"Active / Retried Staff ID" },
        { label: "Tax Payer ID",  value:"Tax Payer ID" },
        { label: "Investment License ID",  value:"Investment License ID" },
        { label: "Govt. Official Letter",  value:"Govt. Official Letter" },
        { label: "Driving License ID",  value:"Driving License ID" },
        { label: "Trade License ID",  value:"Trade License ID" },
        { label: "Citizenship ID",  value:"Citizenship ID" },
        { label: "Non EEU Employee ID",  value:"Non EEU Employee ID" },
        { label: "Active / Retired Staff ID",  value:"Active / Retired Staff ID" },
      ]);
    const [ OwnershipTypeOptions, setOwnershipTypeOptions ] = useState([
        { label: "Sale Deed",  value:"Sale Deed" },
        { label: "Heir Ship Certificate",  value:"Heir Ship Certificate" },
        { label: "Valid Power of Attorney",  value:"Valid Power of Attorney" },
        { label: "NOC - Local Authority",  value:"NOC - Local Authority" },
        { label: "Succession",  value:"Succession" },
        { label: "Deed of Last Will",  value:"Deed of Last Will" },
        { label: "Partnership Deed",  value:"Partnership Deed" },
        { label: "List of Directors in case of Limited Company",  value:"List of Directors in case of Limited Company" },
        { label: "Government Allotment Letter",  value:"Government Allotment Letter" },
        { label: "Order Copy of Court in case of Litigation",  value:"Order Copy of Court in case of Litigation" },
      ]);
    const [ selectedImage2, setSelectedImage2] = useState("");
    const [ SelectedCategoryValue, setSelectedCategoryValue ] = useState("");
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
      const requestPermission = async (permission) => {
        try {
          const result = await request(permission);
          return result === RESULTS.GRANTED;
        } catch (error) {
          console.error("Permission request error:", error);
          return false;
        }
      };
      const checkAndRequestPermissions = async () => {
        const cameraGranted = await requestPermission(PERMISSIONS.ANDROID.CAMERA);
        const storageGranted = await requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    
        return cameraGranted && storageGranted;
      };
      const handleImagePicker = async () => {
        const isPermitted = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        console.log(isPermitted);
        if (isPermitted !== RESULTS.GRANTED) {
           const isGranted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
           console.log(isGranted);
           if(isGranted !== RESULTS.GRANTED) {
            // Alert.alert(
            //   '',
            //   "The Gallery storage access is denied",
            //   [
            //     { text: 'OK', onPress: () =>{} },
            //   ]
            // );
           } 
        }
        openGallery()
      };
      const openGallery = () => {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,
          mediaType: 'photo',
        }).then(async image => {
          // setHeight(height);
          // setWidth(width);
          // setDocumentOption(false)
          // const imagePathParts = image.path.split('/');
          // const imageFileName = imagePathParts[imagePathParts.length - 1];
          // setImageName(imageFileName);
  
          // setSelectedImage(`data:${image.mime};base64,${image.data}`);
  
  
          // Ensure Base64 is sanitized
          const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
    
          // Handle other properties
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
    
          setHeight(image.height);
          setWidth(image.width);
          setDocumentOption(false);
          setImageName(imageFileName);
          setSelectedImage(`data:${image.mime};base64,${sanitizedBase64}`);
        }).catch(error => {
          console.log(error);
        });
      }
      const openCamera = () => {
        ImagePicker.openCamera({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,  
          mediaType: 'photo',
        }).then(async image => {
          // setHeight(height);
          // setWidth(width);
          // setDocumentOption(false)
          // setSelectedImage(`data:${image.mime};base64,${image.data}`)
          // const imagePathParts = image.path.split('/');
          // const imageFileName = imagePathParts[imagePathParts.length - 1];
          // setImageName(imageFileName);
  
  
          // Ensure Base64 is sanitized
          const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
    
          // Handle other properties
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
    
          setHeight(image.height);
          setWidth(image.width);
          setDocumentOption(false);
          setImageName(imageFileName);
          setSelectedImage(`data:${image.mime};base64,${sanitizedBase64}`);
         
        }).catch(error => { 
          console.log(error);
        });
      }
      const handlePDFUpload = async () => { 
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
          });
          // setFile(res);
          // const selectedFile = res[0];
          // setFile(selectedFile);
          // setSelectedImage(null);
          // console.log(selectedFile, selectedFile.name)
          // setImageName(selectedFile.name);
          const selectedFile = res[0];
          // setFile(selectedFile);
          setSelectedImage(null);
      
      
          // Read the file as Base64
          const base64Content = await RNFS.readFile(selectedFile.uri, 'base64');
      
          // Ensure no wrapping
          const sanitizedBase64 = base64Content.replace(/(\r\n|\n|\r)/gm, '');
      
          // Set the sanitized Base64
          setImageName(selectedFile.name); // Set file name
          setFile(sanitizedBase64);
  
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            throw err;
          }
        }
      }
      const handleCameraCapture2 = async () => {
        const isPermitted = await check(PERMISSIONS.ANDROID.CAMERA);
        console.log(isPermitted);
        if (isPermitted !== RESULTS.GRANTED) {
           const isGranted = await request(PERMISSIONS.ANDROID.CAMERA);
           console.log(isGranted);
           if(isGranted !== RESULTS.GRANTED) {
            console.log("denied")
            //  Alert.alert(
            //   '',
            //   "The Camera access is denied",
            //   [
            //     { text: 'OK', onPress: () =>{}  },
            //   ]
            // );
           } 
        }
        openCamera2()
      };
      
      const handleCameraCapture = async () => {
        const isPermitted = await check(PERMISSIONS.ANDROID.CAMERA);
        console.log(isPermitted);
        if (isPermitted !== RESULTS.GRANTED) {
           const isGranted = await request(PERMISSIONS.ANDROID.CAMERA);
           console.log(isGranted);
           if(isGranted !== RESULTS.GRANTED) {
            console.log("denied")
            //  Alert.alert(
            //   '',
            //   "The Camera access is denied",
            //   [
            //     { text: 'OK', onPress: () =>{}  },
            //   ]
            // );
           } 
        }
        openCamera()
      };
      const handleImagePicker2 = async () => {
        const isPermitted = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        console.log(isPermitted);
        if (isPermitted !== RESULTS.GRANTED) {
           const isGranted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
           console.log(isGranted);
           if(isGranted !== RESULTS.GRANTED) {
            // Alert.alert(
            //   '',
            //   "The Gallery storage access is denied",
            //   [
            //     { text: 'OK', onPress: () =>{} },
            //   ]
            // );
           } 
        }
        openGallery2()
       
      };
      openGallery2 = () => {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,
          mediaType: 'photo',
        }).then(async image => {
          console.log('Image captured:', image.data);
          // setHeight(height);
          // setWidth(width);
          // setDocumentOption1(false)
          // const imagePathParts = image.path.split('/');
          // const imageFileName = imagePathParts[imagePathParts.length - 1];
          // setImageName2(imageFileName);
          // setSelectedImage1(`data:${image.mime};base64,${image.data}`);
          // console.log('Image captured:', image.data);
  
          // Ensure Base64 is sanitized
          const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
    
          // Handle other properties
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
    
          setHeight(image.height);
          setWidth(image.width);
          setDocumentOption1(false);
          setImageName2(imageFileName);
          setSelectedImage2(`data:${image.mime};base64,${sanitizedBase64}`);
        }).catch(error => {
          console.log(error);
        });
      }
     
      const openCamera2 = () => {
        ImagePicker.openCamera({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,  
          mediaType: 'photo',
        }).then(async image => {
          // setHeight(height);
          // setWidth(width);
          // setDocumentOption1(false)
          // setSelectedImage2(`data:${image.mime};base64,${image.data}`)
          // const imagePathParts = image.path.split('/');
          // const imageFileName = imagePathParts[imagePathParts.length - 1];
          // setImageName2(imageFileName);
  
  
          // Ensure Base64 is sanitized
          const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
    
          // Handle other properties
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
    
          setHeight(image.height);
          setWidth(image.width);
          setDocumentOption1(false);
          setImageName2(imageFileName);
          setSelectedImage2(`data:${image.mime};base64,${sanitizedBase64}`);
         
        }).catch(error => { 
          console.log(error);
        });
      }
      
      const handlePDFUpload2 = async () => { 
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
          });
          // setFile2(res);
          // const selectedFile = res[0];
          // setFile2(selectedFile);
          // setImageName2(selectedFile.name);
          // setSelectedImage1(null);
  
          const selectedFile = res[0];
          // setFile(selectedFile);
          setSelectedImage(null);
      
      
          // Read the file as Base64
          const base64Content = await RNFS.readFile(selectedFile.uri, 'base64');
      
          // Ensure no wrapping
          const sanitizedBase64 = base64Content.replace(/(\r\n|\n|\r)/gm, '');
      
          // Set the sanitized Base64
          setImageName2(selectedFile.name); // Set file name
          setFile2(sanitizedBase64); // Store Base64 data
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            throw err;
          }
        }
      }
      const validateInputs = () => {
        let valid = true;
        if (selectedCategory1 === '') {
          setInvalidCategory1(t("Category1 can't be empty"));
          valid = false;
        } else {
          setInvalidCategory1('');
        }
        if (requestDes === '') {
          setInvalidRequestDes(t("Request Description can't be empty"));
          valid = false;
        } else {
          setInvalidRequestDes('');
        }
        if (selectedCategory1 === 'Name correction' && firstName === '' ) {
          setInvalidFirstName(t("First Name can't be empty"));
          valid = false;
        } else {
          setInvalidFirstName('');
        }
        if (selectedCategory1 === 'Name correction' && lastName === '' ) {
          setInvalidLastName(t("Last Name can't be empty"));
          valid = false;
        } else {
          setInvalidLastName('');
        }
        if (selectedCategory1 === 'Address correction' && floor === '' ) {
          setInvalidFloor(t("Floor can't be empty"));
          valid = false;
        } else {
          setInvalidFloor('');
        }
        if (selectedCategory1 === 'Address correction' && woreda === '' ) {
          setInvalidWoreda(t("Woreda can't be empty"));
          valid = false;
        } else {
          setInvalidWoreda('');
        }
        if (selectedCategory1 === 'Address correction' && kebele === '' ) {
          setInvalidKebele(t("Kebele can't be empty"));
          valid = false;
        } else {
          setInvalidKebele('');
        }
        if (selectedCategory1 === 'Address correction' && room === '' ) {
          setInvalidRoom(t("Room can't be empty"));
          valid = false;
        } else {
          setInvalidRoom('');
        }
        if (selectedCategory1 === 'Address correction' && gote_Ketena === '' ) {
          setInvalidGote_Ketena(t("Gote_Ketena can't be empty"));
          valid = false;
        } else {
          setInvalidGote_Ketena('');
        }
        if (selectedCategory1 === 'Address correction' && apartment_Name === '' ) {
          setInvalidApartment_Name(t("Apportment name can't be empty"));
          valid = false;
        } else {
          setInvalidApartment_Name('');
        }
        if (selectedCategory1 === 'Address correction' && city === '' ) {
          setInvalidCity(t("City can't be empty"));
          valid = false;
        } else {
          setInvalidCity('');
        }
        if (selectedCategory1 === 'Address correction' && district === '' ) {
          setInvalidDistrict(t("District can't be empty"));
          valid = false;
        } else {
          setInvalidDistrict('');
        }
        if (selectedCategory1 === 'Address correction' && house_Number === '' ) {
          setInvalidHouse_Number(t("House number can't be empty"));
          valid = false;
        } else {
          setInvalidHouse_Number('');
        }
        if (selectedCategory1 === 'Address correction' && landmark === '' ) {
          setInvalidLandmark(t("Landmark can't be empty"));
          valid = false;
        } else {
          setInvalidLandmark('');
        }
        if (selectedCategory1 === 'Address correction' && street === '' ) {
          setInvalidStreet(t("Street can't be empty"));
          valid = false;
        } else {
          setInvalidStreet('');
        }
        if (selectedCategory1 === 'Request for instalment plan' && no_of_Installment === '' ) {
          setInvalidNo_of_Installment(t("No of installment can't be empty"));
          valid = false;
        } else {
          setInvalidNo_of_Installment('');
        }
        if (selectedCategory1 === 'Request for instalment plan' && install_Doc_Reference === '' ) {
          setInvalidInstall_Doc_Reference(t("Install doc reference can't be empty"));
          valid = false;
        } else {
          setInvalidInstall_Doc_Reference('');
        }
        if (selectedCategory1 === 'Temporary connection extension' && selected_Temp_Conn_Type === '' ) {
          setInvalidTemp_Conn_Type(t("Temporary Connection extension can't be empty"));
          valid = false;
        } else {
          setInvalidTemp_Conn_Type('');
        }
        if (selectedCategory1 === 'Temporary connection extension' && temp_Conn_Ext_Date === '' ) {
          setInvalidTemp_Conn_Ext_Date(t("Temporary Connection extension Date can't be empty"));
          valid = false;
        } else {
          setInvalidTemp_Conn_Ext_Date('');
        }
        if (selectedCategory1 === 'Request for due date deferral' && defferal_Date === '' ) {
          setInvalidDefferal_Date(t("Defferal Date can't be empty"));
          valid = false;
        } else {
          setInvalidDefferal_Date('');
        }
        if (selectedCategory1 === 'Request for due date deferral' && defferal_Doc_Reference === '' ) {
          setInvalidDefferal_Doc_Reference(t("Defferal Doc Reference can't be empty"));
          valid = false;
        } else {
          setInvalidDefferal_Doc_Reference('');
        }

        if (selectedCategory1 === 'Group billing' && selectedCollectiveBilling === '' ) {
          setInvalidCollectiveBilling(t("Collective Billing Doc Reference can't be empty"));
          valid = false;
        } else {
          setInvalidCollectiveBilling('');
        }

        if (selectedCategory1 === 'Group billing' && collective_Bill_AC === '' ) {
          setInvalidCollective_Bill_AC(t("Collective Bill AC can't be empty"));
          valid = false;
        } else {
          setInvalidCollective_Bill_AC('');

        }
        if (selectedCategory1 === 'Budget billing' && selectedBB_No_of_Months === '' ) {
          setInvalidBB_No_of_Months(t("BB No of Months can't be empty"));
          valid = false;
        } else {
          setInvalidBB_No_of_Months('');
        }
        if (selectedCategory1 === 'Transfer of open items' && transfer_CA === '' ) {
          setInvalidTransfer_CA(t("Transfer CA can't be empty"));
          valid = false;
        } else {
          setInvalidTransfer_CA('');

        }
        if (selectedCategory1 === 'Transfer of open items' && transfer_Doc_Ref === '' ) {
          setInvalidTransfer_Doc_Ref(t("Transfer Doc Ref can't be empty"));
          valid = false;
        } else {
          setInvalidTransfer_Doc_Ref('');
        }
        if (selectedCategory1 === 'Power factor device purchase' && no_of_PF_Device=== '' ) {
          setInvalidNo_of_PF_Device(t("No of PF device can't be empty"));
          valid = false;
        } else {
          setInvalidNo_of_PF_Device('');
        }
        if (selectedCategory1 === 'Power factor device purchase' && selectedPF_Corrector === '' ) {
          setInvalidPF_Corrector(t("PF corrector can't be empty"));
          valid = false;
        } else {
          setInvalidPF_Corrector('');

        }

        if (selectedCategory1 === 'Update BP Type' && selectPartnerType === '' ) {
          setInvalidPartnerType(t("Partner Type can't be empty"));
          valid = false;
        } else {
          setInvalidPartnerType('');
        }

        if (selectedCategory1 === 'Tin number updating' && TIN_Number === '' ) {
          setInvalidTIN_Number(t("Tin number can't be empty"));
          valid = false;
        } else {
          setInvalidTIN_Number('');
        }
        if (selectedIDType === '') {
          setInvalidIDType(t("ID Type can't be empty"));
          valid = false;
        } else {
          setInvalidIDType('');
        }
      
        if ( imageName == null && file == null) {
          setInvalidIDProof(t("ID proof can't be empty"));
          valid = false;
        } else {
          setInvalidIDProof('');
        }
       
        return valid;
      }
      const clearData = () => {
        setSelectedIDType("");
        setSelectedOwnerShipType("");
        setImageName(null);
        setImageName2(null);
        setFile(null);
        setFile2(null);
        setSelectedImage(null);
        setSelectedImage2(null);
        setSelectedCategory1("");
  
      } 
      const onPressSubmitBtn = () => {
        var validate = validateInputs()
        console.log(validate, "entered")
        if (validateInputs()) { 
        setLoading(true);
        var url = constant.BASE_URL + constant.MISCELLANEOUS;
        var idProof = selectedImage ? selectedImage : file ? file : null;
        var ownerShipProof = selectedImage2 ? selectedImage2 : file2 ? file2 : null;
        var data = {
          "BP": (accountData.BP_No).toString(),
          "CA": (accountData.CA_No).toString(),
          "Description": requestDes,
          "Category1": SelectedCategoryValue,
          "First_Name": firstName,
          "Middle_Name": middleName,
          "Last_Name": lastName,
          "Floor": floor,
          "Woreda": woreda,
          "Kebele": kebele,
          "Room": room,
          "Gote_Ketena": gote_Ketena,
          "Apartment_Name": apartment_Name,
          "City": city,
          "District": district,
          "House_Number": house_Number,
          "Landmark": landmark,
          "Street": street,
          "No_of_Installment": no_of_Installment,
          "Install_Doc_Reference": install_Doc_Reference,
          "Temp_Conn_Type": selected_Temp_Conn_Type,
          "Temp_Conn_Ext_Date": moment(temp_Conn_Ext_Date).format('DD-MM-YYYY'),
          "Defferal_Date": moment(defferal_Date).format('DD-MM-YYYY'),
          "Defferal_Doc_Reference": defferal_Doc_Reference,
          "Collective_Billing": selectedCollectiveBilling,
          "Collective_Bill_AC": collective_Bill_AC,
          "BB_No_of_Months": selectedBB_No_of_Months,
          "Transfer_CA": transfer_CA,
          "Transfer_Doc_Ref": transfer_Doc_Ref,
          "No_of_PF_Device": no_of_PF_Device,
          "PF_Corrector": selectedPF_Corrector,
          "Partner_Type": selectPartnerType,
          "TIN_Number": TIN_Number,
          "IDType": selectedIDType,
          "IDProof": idProof,
          "OwnershipProofType": selectedOwnerShipType,
          "OwnershipProofUpload": ownerShipProof
        }
        console.log(data, "missss", url);
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            Record: {
              "BP": (accountData.BP_No).toString(),
              "CA": (accountData.CA_No).toString(),
              "Description": requestDes,
              "Category1": SelectedCategoryValue,
              "First_Name": firstName,
		          "Middle_Name": middleName,
	           	"Last_Name": lastName,
		          "Floor": floor,
		          "Woreda": woreda,
		          "Kebele": kebele,
		          "Room": room,
		          "Gote_Ketena": gote_Ketena,
		          "Apartment_Name": apartment_Name,
	            "City": city,
		          "District": district,
		          "House_Number": house_Number,
		          "Landmark": landmark,
		          "Street": street,
		          "No_of_Installment": no_of_Installment,
		          "Install_Doc_Reference": install_Doc_Reference,
              "Temp_Conn_Type": selected_Temp_Conn_Type,
	          	"Temp_Conn_Ext_Date": moment(temp_Conn_Ext_Date).format('DD-MM-YYYY'),
		          "Defferal_Date": moment(temp_Conn_Ext_Date).format('DD-MM-YYYY'),
		          "Defferal_Doc_Reference": defferal_Doc_Reference,
		          "Collective_Billing": selectedCollectiveBilling,
		          "Collective_Bill_AC": collective_Bill_AC,
	            "BB_No_of_Months": selectedBB_No_of_Months,
		          "Transfer_CA": transfer_CA,
		          "Transfer_Doc_Ref": transfer_Doc_Ref,
		          "No_of_PF_Device": no_of_PF_Device,
		          "PF_Corrector": selectedPF_Corrector,
	            "Partner_Type": selectPartnerType,
		          "TIN_Number": TIN_Number,
              "IDType": selectedIDType,
              "IDProof": idProof,
              "OwnershipProofType": selectedOwnerShipType,
              "OwnershipProofUpload": ownerShipProof
            }
          }),
        })
          .then((response) =>
            response.json())
          .then(responseData => {
            var data = responseData.Record;
            setLoading(false);
            console.log(responseData, "response")
            Alert.alert(
              '',
              t('Your request successfully submitted.....! ') + t(" and Service Request Number: ") + String(data.SR_Number),
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigation.navigate("ServiceRequest");
                  },
                },
              ]
            );
            clearData()
          })
        }
      }
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
          {renderTextInput("Request Description", "Enter the reuest description", requestDes, setRequestDes, invalidRequestDes, setInvalidRequestDes)} 
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
                value={SelectedCategoryValue}
                onChange={item => {
                    setSelectedCategory1(item.label);
                    setSelectedCategoryValue(item.value);
                   
                    if( (item.value)?.length > 0 ) {
                      setInvalidCategory1("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCategory1}</Text>
           </View>
           { selectedCategory1 && selectedCategory1 == "Name correction" ? 
           <View>
           {renderTextInput("First Name", "Enter first name", firstName, setFirstName, invalidFirstName, setInvalidFirstName)}
           {renderTextInput("Middle Name", "Enter middle name", middleName, setMiddleName)}
           {renderTextInput("Last Name", "Enter last name", lastName, setLastName, invalidLastName, setInvalidLastName)}
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Address correction" ? 
           <View>
           {renderTextInput("Floor", "Enter the floor", floor, setFloor, invalidFloor, setInvalidFloor)}
           {renderTextInput("Woreda", "Enter the woreda", woreda, setWoreda, invalidWoreda, setInvalidWoreda)}
           {renderTextInput("Kebele", "Enter kebele", kebele, setKebele, invalidKebele, setInvalidKebele)}
           {renderTextInput("Room", "Enter the Room", room, setRoom, invalidRoom, setInvalidRoom)}
           {renderTextInput("Gote_Ketena", "Enter the Gote_Ketena", gote_Ketena, setGote_Ketena, invalidGote_Ketena, setInvalidGote_Ketena)}
           {renderTextInput("Apartment_Name", "Enter the Apartment_Name", apartment_Name, setApartment_Name, invalidApartment_Name, setInvalidApartment_Name)}
           {renderTextInput("City", "Enter the City", city, setCity, invalidCity, setInvalidCity)}
           {renderTextInput("District", "Enter the District", district, setDistrict, invalidDistrict, setInvalidDistrict)}
           {renderTextInput("House_Number", "Enter the House_Number", house_Number, setHouse_Number, invalidHouse_Number, setInvalidHouse_Number)}
           {renderTextInput("Landmark", "Enter the Landmark", landmark, setLandmark, invalidLandmark, setInvalidLandmark)}
           {renderTextInput("Street", "Enter the Street", street, setStreet, invalidStreet, setInvalidStreet)}
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Request for instalment plan" ? 
           <View>
           {renderTextInput("No_of_Installment", "Enter the No_of_Installment", no_of_Installment, setNo_of_Installment, invalidNo_of_Installment, setInvalidNo_of_Installment)}
           {renderTextInput("Install_Doc_Reference", "Enter the Install_Doc_Reference", install_Doc_Reference, setInstall_Doc_Reference, invalidInstall_Doc_Reference, setInvalidInstall_Doc_Reference)}
           </View> : null}
           { selectedCategory1 && selectedCategory1 == "Temporary connection extension" ? 
           <View>
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
                   
                    if( (item.value)?.length > 0 ) {
                      setInvalidTemp_Conn_Type("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidTemp_Conn_Type}</Text>
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
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Request for due date deferral" ?
           <View>
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
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Group billing" ?
           <View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Collective_Billing")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Collective Billing")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={Collective_Billing_Option }
                value={selectedCollectiveBilling}
                onChange={item => {
                    setselectedCollectiveBilling(item.value);
                   
                    if( (item.value)?.length > 0 ) {
                      setInvalidCollectiveBilling("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCollectiveBilling}</Text>
           </View>
           {renderTextInput("Collective_Bill_AC", "Enter the Collective_Bill_AC", collective_Bill_AC, setCollective_Bill_AC, invalidCollective_Bill_AC, setInvalidCollective_Bill_AC)}
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Budget billing" ? 
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
                   
                    if( (item.value)?.length > 0 ) {
                      setInvalidBB_No_of_Months("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidBB_No_of_Months}</Text>
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Transfer of open items" ? 
           <View>
           {renderTextInput("Transfer_CA", "Enter the Transfer_CA", transfer_CA, setTransfer_CA, invalidTransfer_CA, setInvalidTransfer_CA)}
           {renderTextInput("Transfer_Doc_Ref", "Enter the Transfer_Doc_Ref", transfer_Doc_Ref, setTransfer_Doc_Ref, invalidTransfer_Doc_Ref, setInvalidTransfer_Doc_Ref)}
           </View> : null }
           { selectedCategory1 && selectedCategory1 == "Power factor device purchase" ?
           <View>
           {renderTextInput("No_of_PF_Device", "Enter the No_of_PF_Device", no_of_PF_Device, setNo_of_PF_Device, invalidNo_of_PF_Device, setInvalidNo_of_PF_Device)}

           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("PF_Corrector")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the PF_Corrector")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={PF_CorrectorOption }
                value={selectedPF_Corrector}
                onChange={item => {
                    setSelectedPF_Corrector(item.value);
                   
                    if( (item.value)?.length > 0 ) {
                      setInvalidPF_Corrector("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidPF_Corrector}</Text>
           </View>
           </View> : null }
           { selectedCategory1 == "Update BP Type" ? 
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Partner Type") + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the partner type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={partnerTypeOptions}
                value={selectPartnerType}
                onChange={item => {
                    setSelectPartnerType(item.value);
                    // setPartnerType(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidPartnerType('');
                    }
                    
                }}               
           />
           <Text style={styles.ErrorMsg}>{invalidPartnerType}</Text>
           </View> : null }
           { selectedCategory1 == "Tin number updating" ? 
           <View>
            {renderTextInput("TIN_Number", "Enter the TIN_Number", TIN_Number, setTIN_Number, invalidTIN_Number, setInvalidTIN_Number)}
           </View> : null }

           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("ID type")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the ID type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={IDTypeOptions}
                value={selectedIDType}
                onChange={item => {
                    setSelectedIDType(item.value);
                    if( (item.value)?.length > 0 ) {
                      setInvalidIDType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidIDType}</Text>
           </View>
           <View>
           {imageName && imageName ?
              <View style={styles.NewServiceDocument}> 
                <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName}</Text> 
                <TouchableOpacity style={[ styles.Margin_10, {marginLeft: 5} ]} onPress={() => { setImageName('') }}>
                    <Close name="closecircle" size={20} color={"black"}/>
                </TouchableOpacity>
              </View> : null 
             }
              </View>
              <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption(true); }}>
                <Text style={styles.RegisterBtnTxt}>{t("ID Proof Upload")}</Text>
                <Upload name={'upload'} size={25}/>
              </TouchableOpacity> 
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Ownership Proof Type")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the ID type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={OwnershipTypeOptions}
                value={selectedOwnerShipType}
                onChange={item => {
                    setSelectedOwnerShipType(item.value);
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
           </View>
           <View>
           {imageName2 && imageName2 ?
              <View style={styles.NewServiceDocument}> 
                <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName2}</Text> 
                <TouchableOpacity style={[ styles.Margin_10, {marginLeft: 5} ]} onPress={() => { setImageName2('') }}>
                    <Close name="closecircle" size={20} color={"black"}/>
                </TouchableOpacity>
              </View> : null 
             }
              </View>
              <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption1(true); }}>
                <Text style={styles.RegisterBtnTxt}>{t("Ownership Proof Upload")}</Text>
                <Upload name={'upload'} size={25}/>
              </TouchableOpacity>
              {isLoading &&
                   < View style={[styles.NewLoader, { marginLeft: 10, display: 'flex', flexDirection: 'row' }]}>
                     <ActivityIndicator size="small" />
                     <Text style={{ marginLeft: 10, marginBottom: 10}} >Processing....</Text>
                    </View>
              }  
              <TouchableOpacity disabled={isLoading} style={[styles.RegisterBtn, { backgroundColor: isLoading ? '#DCDCDC' : '#63AA5A', display:'flex', flexDirection: 'row' }]}
                onPress={() => { onPressSubmitBtn() }}
              >
                <Text style={styles.RegisterBtnTxt}>{t("SUBMIT")}</Text>
              </TouchableOpacity> 
         </View>
         <Modal
            transparent={true}
            visible={isDocumentOption}
            onRequestClose={() => {
                setDocumentOption(false);
            }}
          >
            <View style={styles.modalMainView}>
               <View style={styles.modalViewCamera}> 
                  <Text style={styles.modalHeaderText}>{t("Select photo / pdf file to upload")}</Text>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption(false)
                        handleCameraCapture() 
                    }}
                  >
                    <Camera name={"camera"} size={25} color={"#F29037"}/>
                    <Text style={[styles.modalText, { marginLeft: 10 }]}>{t("Take Photo")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption(false)
                        handleImagePicker() 
                    }}
                  >
                    <Gallery name={"photo-library"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("Take from Gallery")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption(false)
                        handlePDFUpload() 
                    }}
                  >
                    <FileUpload name={"file-upload"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("PDF Upload")}</Text>
                  </TouchableOpacity>
               </View> 
            </View>
          </Modal>  
          <Modal
            transparent={true}
            visible={isDocumentOption1}
            onRequestClose={() => {
                setDocumentOption1(false);
            }}
          >
            <View style={styles.modalMainView}>
               <View style={styles.modalViewCamera}> 
                  <Text style={styles.modalHeaderText}>{t("Select photo / pdf file to upload")}</Text>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false)
                        handleCameraCapture2() 
                    }}
                  >
                    <Camera name={"camera"} size={25} color={"#F29037"}/>
                    <Text style={[styles.modalText, { marginLeft: 10 }]}>{t("Take Photo")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false)
                        handleImagePicker2() 
                    }}
                  >
                    <Gallery name={"photo-library"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("Take from Gallery")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false)
                        handlePDFUpload2() 
                    }}
                  >
                    <FileUpload name={"file-upload"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("PDF Upload")}</Text>
                  </TouchableOpacity>
               </View> 
            </View>
          </Modal>  
        </ScrollView>  
    );
};

export default Miscellaneous;
 