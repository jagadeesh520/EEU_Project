import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, Modal, TouchableOpacity, ActivityIndicator, Alert }  from 'react-native';
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
const DisOrReconnection = ({navigation}) => {
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
    const [ selectedCategory1, setSelectedCategory1] = useState("")
    const [ Category1Option, setCategory1Option] = useState([
        { label: "Disconnection",  value:"Disconnection" },
        { label: "Reconnection",  value:"Reconnection" }

    ]);
    const [isLoading, setLoading]= useState(false);
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [ selectedCategory2, setSelectedCategory2] = useState("")
    const [ Category2Option, setCategory2Option] = useState([
        { label: "Customer Request Disconnection",  value:"Customer Request Disconnection" },
        { label: "Customer Request Reconnection",  value:"Customer Request Reconnection" }

    ])
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
      const [ invalidCategory1, setInvalidCategory1] = useState("");
      const [ invalidCategory2, setInvalidCategory2] = useState("");
      const [ invalidIDType, setInvalidIDType] = useState("");
      const [ invalidOwnership, setInvalidOwnerShip] = useState("");
      const [ invalidIDProof, setInvalidIDProof] = useState("");
      const [ invalidOwnerShipProof, setInvalidOwnerShipProof] = useState("");
    useEffect(() => {
        retrieveData();
    }, [selectedCategory2]); // Empty array ensures this runs only once

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

        console.log('Image captured:', image.data);

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
        // setHeight(height);
        // setWidth(width);
        // setDocumentOption(false)
        // setSelectedImage(`data:${image.mime};base64,${image.data}`)
        // const imagePathParts = image.path.split('/');
        // const imageFileName = imagePathParts[imagePathParts.length - 1];
        // setImageName(imageFileName);

        console.log('Image captured:', image.data);

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
        // setFile(res);
        // const selectedFile = res[0];
        // setFile(selectedFile);
        // setSelectedImage(null);
        // console.log(selectedFile, selectedFile.name)
        // setImageName(selectedFile.name);
        const selectedFile = res[0];
        // setFile(selectedFile);
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
        console.log('Image captured:', image.data);
        // setHeight(height);
        // setWidth(width);
        // setDocumentOption1(false)
        // setSelectedImage2(`data:${image.mime};base64,${image.data}`)
        // const imagePathParts = image.path.split('/');
        // const imageFileName = imagePathParts[imagePathParts.length - 1];
        // setImageName2(imageFileName);

        console.log('Image captured:', image.data);

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
        // setFile2(res);
        // const selectedFile = res[0];
        // setFile2(selectedFile);
        // setImageName2(selectedFile.name);
        // setSelectedImage1(null);

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
      if (selectedCategory1 === "" && selectedCategory2 === '') {
        setInvalidCategory2(t("Category2 can't be empty"));
        valid = false;
      } else {
        setInvalidCategory2('');
      }
      if (selectedIDType === '') {
        setInvalidIDType(t("ID Type can't be empty"));
        valid = false;
      } else {
        setInvalidIDType('');
      }
      // if (selectedOwnerShipType === '') {
      //   setInvalidOwnerShip(t("Ownership proof type can't be empty"));
      //   valid = false;
      // } else {
      //   setInvalidOwnerShip('');
      // }
      if ( imageName == null && file == null) {
        setInvalidIDProof(t("ID proof can't be empty"));
        valid = false;
      } else {
        setInvalidIDProof('');
      }
      // if (imageName2 == null && file2 == null) {
      //   setInvalidOwnerShipProof(t("Ownership proof can't be empty"));
      //   valid = false;
      // } else {
      //   setInvalidOwnerShipProof('');
      // }
      return valid;
    }
    const clearData = () => {
      setSelectedIDType("");
      setSelectedOwnerShipType("");
      setImageName("");
      setImageName2("");
      setFile(null);
      setFile2(null);
      setSelectedImage(null);
      setSelectedImage2(null);
      setSelectedCategory1("");
      setSelectedCategory2("");

    } 
    const onPressSubmitBtn = () => {
      var validate = validateInputs()
      if (validateInputs()) { 
      setLoading(true);
      var url = constant.BASE_URL + constant.DISCONNECT_RE_CONNECT;
      var idProof = selectedImage ? selectedImage : file ? file : "";
      var ownerShipProof = selectedImage2 ? selectedImage2 : file2 ? file2 : "";
      var category1 = selectedCategory1 == "Disconnection" ? "ZDIS" : selectedCategory1 == "Reconnection" ? "ZREC" : "";
      var category2 = selectedCategory1 != "" ? "ZD01" : ""
      var data = {
            "BP": (accountData.BP_No).toString(),
            "CA": (accountData.CA_No).toString(),
            "Description": "Disconnection / Reconnection Request from Mobile App",
            "Category1": category1,
            "Category2": category2,
            "IDType": selectedIDType,
            "IDProof": idProof,
            "OwnershipProofType": selectedOwnerShipType,
            "OwnershipProofUpload": ownerShipProof
      }
      console.log(data, "data----->", url)
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          Record: {
            "BP": (accountData.BP_No).toString(),
            "CA": (accountData.CA_No).toString(),
            "Description": "Disconnection / Reconnection Request from Mobile App",
            "Category1": category1,
            "Category2": category2,
            "IDType": selectedIDType,
            "IDProof": idProof,
            "OwnershipProofType": selectedOwnerShipType,
            "OwnershipProofUpload": ownerShipProof ? ownerShipProof : ""
          }
        }),
      })
        .then((response) =>
          response.json())
        .then(responseData => {
          var data = responseData.Record
          console.log(responseData, "response", data, data.length)
          if(data && data.length > 0 ){ 
          setLoading(false);
          Alert.alert(
            '',
            t('Your request successfully submitted.....! ') + t(" and SR Number: ") + String(data[0].SR_Number),
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate("ServiceRequest");
                },
              },
            ]
          );
        }
        clearData();
        })
      }
    }

    return (
        
        <ScrollView style={styles.DashBoardMain}>
         <CommonHeader title={t("Dis/Reconnection")} onBackPress ={onBackPress} navigation={navigation}/>
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
              <Text style={styles.DashBoradProfilAccText}>{"Disconnection / Reconnection Request from Mobile App"}</Text>
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
                    if(item.value == "Disconnection") {
                        setSelectedCategory2("Customer Request Disconnection");
                        setInvalidCategory2("");
                    } 
                    if(item.value == "Reconnection"){
                        setSelectedCategory2("Customer Request Reconnection");
                        setInvalidCategory2("");
                    }    
                    if( (item.value)?.length > 0 ) {
                      setInvalidCategory1("");
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCategory1}</Text>
           </View>
           <View style={styles.Margin_10}  pointerEvents={'none'}>
            <Text style={styles.LoginSubTxt}>{t("Category2")  + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Category2")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={Category2Option}
                value={selectedCategory2}
                onChange={item => {
                    setSelectedCategory2(item.value);
                    if( (item.value)?.length > 0 ) {
                      setInvalidCategory2("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCategory2}</Text>
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
              </View> :  <Text style={[styles.ErrorMsg, { marginTop: 20 }]}>{invalidIDProof}</Text>  
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
                    if((item.value)?.length > 0 ) {
                      setInvalidOwnerShip('')
                     }   
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidOwnership}</Text>
           </View>
           <View>
           {imageName2 && imageName2 ?
              <View style={styles.NewServiceDocument}> 
                <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName2}</Text> 
                <TouchableOpacity style={[ styles.Margin_10, {marginLeft: 5} ]} onPress={() => { setImageName2('') }}>
                    <Close name="closecircle" size={20} color={"black"}/>
                </TouchableOpacity>
              </View> : <Text style={[styles.ErrorMsg, { marginTop: 20 }]}>{invalidOwnerShipProof}</Text> 
             }
              </View>
              <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption1(true); }}>
                <Text style={styles.RegisterBtnTxt}>{t("Ownership Proof Upload")}</Text>
                <Upload name={'upload'} size={25}/>
              </TouchableOpacity> 
              { isLoading &&
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

export default DisOrReconnection;
 
 