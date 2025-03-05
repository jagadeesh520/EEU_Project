import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Image, Modal, TouchableOpacity, Alert, ActivityIndicator }  from 'react-native';
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
import RNFS from 'react-native-fs';  // Import RNFS
import { constant } from '../CommonComponent/Constant';


// create a component
const LoadChange = ({navigation}) => {
    const { t, i18n } = useTranslation();
    const { theme, styles, changeTheme} = Styles();
    const [accountData, setAccountData] = useState({});
    const [BPVal, setBP] = useState("");
    const [CAVal, setCA] = useState("");
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
    const [ selectedImage2, setSelectedImage2] = useState("");
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [ selectedCategory1, setSelectedCategory1] = useState("");
    const Category1Option = useMemo(
      () => [
        { label: "Load enhancement", value: "ZL01" },
        { label: "Load reduction", value: "ZL02" },
        { label: "Load enhancement with Tariff change", value: "ZL03" },
        { label: "Load reduction with Tariff change", value: "ZL04" },
      ],
      []
    );
  
    const MeterReplacementReqOption = useMemo(
      () => [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      []
    );
    const [ selectedReplacementReq, setSelectedReplacementReq] = useState("");
    const [ selectedMeterType, setSelectedMeterType] = useState("");
    const MeterTypeOption = useMemo(
      () => [
        { label: "Single Phase", value: "Single Phase" },
        { label: "Three Phase", value: "Three Phase" },
        { label: "Active Reactive", value: "Active Reactive" },
      ],
      []
    );
  
    const installTypeOptions = useMemo(
      () => [
        { label: "Active Staff Consumption", value: "001" },
        { label: "Domestic", value: "023" },
        { label: "Food Process", value: "029" },
        { label: "Mix building", value: "082" },
        { label: "Street light", value: "086" },
        { label: "Bottled water factory", value: "089" },
      ],
      []
    );
  
      const phaseTypeOptions = useMemo(
        () => [
          { label: "Single Phase", value: "1" },
          { label: "Three Phase", value: "2" },
        ],
        []
      );
    const [ selectedInstallType, setSelectedInstallType ] = useState('');
    const [ selectedPhaseType, setSelectedPhaseType ] = useState('');
    const [ appliedLoad, setAppliedLoad ] = useState('');
    const IDTypeOptions = useMemo(
      () => [
        { label: "Passport", value: "Passport" },
        { label: "Residential ID", value: "Residential ID" },
        { label: "Active / Retired Staff ID", value: "Active / Retired Staff ID" },
        { label: "Tax Payer ID", value: "Tax Payer ID" },
        { label: "Investment License ID", value: "Investment License ID" },
        { label: "Govt. Official Letter", value: "Govt. Official Letter" },
        { label: "Driving License ID", value: "Driving License ID" },
        { label: "Trade License ID", value: "Trade License ID" },
        { label: "Citizenship ID", value: "Citizenship ID" },
        { label: "Non EEU Employee ID", value: "Non EEU Employee ID" },
      ],
      []
    );
  
    const OwnershipTypeOptions = useMemo(
      () => [
        { label: "Sale Deed", value: "Sale Deed" },
        { label: "Heir Ship Certificate", value: "Heir Ship Certificate" },
        { label: "Valid Power of Attorney", value: "Valid Power of Attorney" },
        { label: "NOC - Local Authority", value: "NOC - Local Authority" },
        { label: "Succession", value: "Succession" },
        { label: "Deed of Last Will", value: "Deed of Last Will" },
        { label: "Partnership Deed", value: "Partnership Deed" },
        { label: "List of Directors in case of Limited Company", value: "List of Directors in case of Limited Company" },
        { label: "Government Allotment Letter", value: "Government Allotment Letter" },
        { label: "Order Copy of Court in case of Litigation", value: "Order Copy of Court in case of Litigation" },
      ],
      []
    );
      const [ invalidCategory1, setInvalidCategory1] = useState("");
      const [ invalidIDType, setInvalidIDType] = useState("");
      const [ invalidIDProof, setInvalidIDProof] = useState("");
      const [invalidAppliedLoad, setInvalidAppliedLoad] = useState("");
      const [invalidInstallType, setInvalidInstallType] = useState("");
      const [invalidPhaseType, setInvalidPhaseType] = useState("");
      const [invalidMeterType, setInvalidMeterType] = useState("");
      const [invalidMeterReqType, setInvalidMeterReqType] = useState("");
      const [isLoading, setLoading]= useState(false);

    useEffect(() => {
        retrieveData();
    }, []); // Empty array ensures this runs only once

    const onBackPress = () => {
        navigation.goBack("ServiceRequest");
    };

    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('accountData');
            if (value !== null) {
                const data = JSON.parse(value);
                setAccountData(data);
                setBP(data.BP_No); // Set BP from stored data
                setCA(data.CA_No); // Set CA from stored data
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
           <Text style={styles.LoginSubTxt}>{t(name) + (name === "Middle Name" ? "" : " *")}</Text>   
            <TextInput
            placeholder={t(placeholder)}
            value={value}
            keyboardType={"phone-pad"}
            style={[styles.LoginTextInput, {backgroundColor: '#FFFFFF'}]}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
               if (name === "Applied load" && text !== "") {
                const numericValue = parseFloat(text); // Convert text to number for comparison
               
                if(numericValue <= 7.5) {
                  setSelectedPhaseType("1")
                  // setPhaseType("Single Phase")
                  setInvalidPhaseType("");
                  updateState(numericValue);
                } else if(numericValue > 7.5) {
                  setSelectedPhaseType("2")
                  setInvalidPhaseType("");
                  // setPhaseType("Three Phase")
                  updateState(numericValue);
                }
               
              } else if( name === "Applied load" && text == "") {
                setErrorMsg("")
                setSelectedPhaseType("")
              } else {
                updateState(text) 
              }
              if(ErrorMsg?.length > 0 && text != "" && name != "Applied load") {
                setErrorMsg("")
              }
            }}
           />
           <Text style={styles.ErrorMsg}>{ErrorMsg}</Text>
          </View> 
         </View> 
        )
    }
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
       
        // Ensure Base64 is sanitized
        const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
        console.log('Sanitized Base64:', sanitizedBase64);
  
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
       
        // Ensure Base64 is sanitized
        const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
        console.log('Sanitized Base64:', sanitizedBase64);
  
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
       
        const selectedFile = res[0];
        setSelectedImage(null);
    
        console.log('Selected File:', selectedFile);
    
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
          console.log("denied");
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

        // Ensure Base64 is sanitized
        const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
        console.log('Sanitized Base64:', sanitizedBase64);
  
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
        // Ensure Base64 is sanitized
        const sanitizedBase64 = image.data.replace(/(\r\n|\n|\r)/gm, '');
        console.log('Sanitized Base64:', sanitizedBase64);
  
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
        const selectedFile = res[0];
        // setFile(selectedFile);
        setSelectedImage(null);
    
        console.log('Selected File:', selectedFile);
    
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
      if (appliedLoad === '') {
        setInvalidAppliedLoad(t("Applied Load can't be empty"));
        valid = false;
      } else {
        setInvalidAppliedLoad('');
      }
      if (selectedInstallType === '') {
        setInvalidInstallType(t("Install Type can't be empty"));
        valid = false;
      } else {
        setInvalidInstallType('');
      }
      if (selectedPhaseType === '') {
        setInvalidPhaseType(t("Phase Type can't be empty"));
        valid = false;
      } else {
        setInvalidPhaseType('');
      }
      if (selectedMeterType === '') {
        setInvalidMeterType(t("Meter Type can't be empty"));
        valid = false;
      } else {
        setInvalidMeterType('');
      }
      if (selectedReplacementReq === '') {
        setInvalidMeterReqType(t("Meter Replacement Req can't be empty"));
        valid = false;
      } else {
        setInvalidMeterReqType('');
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
      setSelectedMeterType("");
      setSelectedInstallType("");
      setSelectedPhaseType("");
      setSelectedReplacementReq("");
      setAppliedLoad("");
      setSelectedCategory1("");

    } 
    const onPressSubmitBtn = () => {
      var validate = validateInputs()
      if (validate) { 
      setLoading(true);
      var url = constant.BASE_URL + constant.LOAD_CHANGE
      var idProof = selectedImage ? selectedImage : file ? file : ""
      var ownerShipProof = selectedImage2 ? selectedImage2 : file2 ? file2 : ""
      console.log(url, "url")
      var data = {
        "BP": (accountData.BP_No).toString(),
        "CA": (accountData.CA_No).toString(),
        "Description": "Load Change Request from Mobile App",
        "Category1": selectedCategory1,
        "AppliedLoad": appliedLoad,
        "InstallType": selectedInstallType,
        "Phase": selectedPhaseType,
        "MeterType": selectedMeterType,
        "MeterReplacementReq": selectedReplacementReq,
        "IDType": selectedIDType,
        "IDProof": idProof,
        "OwnershipProofType": selectedOwnerShipType,
        "OwnershipProofUpload": ownerShipProof
      }
      console.log(data, "data----->")
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            "BP": (accountData.BP_No).toString(),
            "CA": (accountData.CA_No).toString(),
            "Description": "Load Change Request from Mobile App",
            "Category1": selectedCategory1,
            "AppliedLoad": appliedLoad,
            "InstallType": selectedInstallType,
	        	"Phase": selectedPhaseType,
	        	"MeterType": selectedMeterType,
	        	"MeterReplacementReq": selectedReplacementReq,
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
          var data = responseData.Record
          setLoading(false);
          console.log(responseData, "responseData--->")
          Alert.alert(
            '',
            t('Your request successfully submitted.....! ') + t(" and Service Request Number: ") + String(data[0].SR_Number),
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
         <CommonHeader title={t("Load Change")} onBackPress ={onBackPress} navigation={navigation}/>
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
              <Text style={styles.DashBoradProfilAccText}>{"Load Change Request from Mobile App"}</Text>
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
                    if( (item.value)?.length > 0 ) {
                      setInvalidCategory1("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCategory1}</Text>
           </View>
           {renderTextInput("Applied load", "Enter Applied load", appliedLoad, setAppliedLoad, invalidAppliedLoad, setInvalidAppliedLoad)}
           <View style={styles.Margin_10} pointerEvents={'none'}>
            <Text style={styles.LoginSubTxt}>{t("Phase type") + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Phase type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={phaseTypeOptions}
                value={selectedPhaseType}
                onChange={item => {
                    setSelectedPhaseType(item.value);
                    // setPhaseType(item.label)
                    if( (item.value)?.length > 0 ) {
                      setInvalidPhaseType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidPhaseType}</Text>
           </View>
           <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t("Install type") + (" *")}</Text>   
           <Dropdown
               placeholderStyle={styles.RaiseComplaintDropdownTxt}
               selectedTextStyle={styles.RaiseComplaintDropdownTxt}
               inputSearchStyle={styles.RaiseComplaintDropdownTxt}
               iconStyle={styles.RaiseComplaintDropdownTxt}
               labelField="label"
               valueField="value"
               placeholder={t("Select the install type")}
               style={styles.QuesComplaintDropdown}
               renderItem={renderItem}
               data={installTypeOptions}
               value={selectedInstallType}
               onChange={item => {
                   setSelectedInstallType(item.value);
                //    setInsType(item.label);
                   if( (item.value)?.length > 0 ) {
                     setInvalidInstallType("")
                   }
               }}               
          />
           <Text style={styles.ErrorMsg}>{invalidInstallType}</Text>
          </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Meter Type")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Meter Type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={MeterTypeOption}
                value={selectedMeterType}
                onChange={item => {
                    setSelectedMeterType(item.value);
                    if( (item.value)?.length > 0 ) {
                      setInvalidMeterType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidMeterType}</Text>
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Meter Replacement Req")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Meter Replacement Req")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={MeterReplacementReqOption}
                value={selectedReplacementReq}
                onChange={item => {
                    setSelectedReplacementReq(item.value);
                    if( (item.value)?.length > 0 ) {
                      setInvalidMeterReqType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidMeterReqType}</Text>
           </View>
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
              </View> : <Text style={[styles.ErrorMsg, { marginTop: 20 }]}>{invalidIDProof}</Text>  
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
                    if( (item.value)?.length > 0 ) {
                      setInvalidIDType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidIDType}</Text>
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
                        setDocumentOption1(false);
                        handleCameraCapture2(); 
                    }}
                  >
                    <Camera name={"camera"} size={25} color={"#F29037"}/>
                    <Text style={[styles.modalText, { marginLeft: 10 }]}>{t("Take Photo")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false);
                        handleImagePicker2();
                    }}
                  >
                    <Gallery name={"photo-library"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("Take from Gallery")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false);
                        handlePDFUpload2(); 
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

export default LoadChange;
 
 