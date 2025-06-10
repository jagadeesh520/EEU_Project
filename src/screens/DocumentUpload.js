// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Switch, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { constant } from '../CommonComponent/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import Gallery from 'react-native-vector-icons/MaterialIcons';
import Upload from 'react-native-vector-icons/Feather';
import FileUpload from 'react-native-vector-icons/MaterialCommunityIcons';
import Camera from 'react-native-vector-icons/Entypo';
import Close from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';  // Import RNFS
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
// Component
const DocumentUpload = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { theme, styles, changeTheme } = Styles();
  const { applicationDetails } = route.params;
  const [selectedIDType, setSelectedIDType] = useState("");
  const [selectedOwnerShipType, setSelectedOwnerShipType] = useState("");
  const [isDocumentOption, setDocumentOption] = useState(false);
  const [isDocumentOption1, setDocumentOption1] = useState(false);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [imageName, setImageName] = useState(null);
  const [imageName2, setImageName2] = useState(null);
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [ selectedImage, setSelectedImage ] = useState("");
  const [ selectedImage2, setSelectedImage2] = useState("");
  const [isLoading, setLoading]= useState(false);
  const { themes, themeObj } = useThemes();
  const [ IDNumber, setIDNumber ] = useState(""); 

  const [ invalidIDType, setInvalidIDType] = useState("");
  const [ invalidIDNumber, setInvalidIDNumber] = useState("");
  const [ invalidIDProof, setInvalidIDProof] = useState("");

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
  // console.log(applicationDetails, "app details=====> {"Root": {"ApplicationNo": 9000000016, "BP": 2500002294, "CA": 100000112485, "SRNumber": 8000004349, "Status": "CA and SR Created"}} ")
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
    setSelectedImage2(null);

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

  if (selectedIDType === '') {
    setInvalidIDType(t("ID Type can't be empty"));
    valid = false;
  } else {
    setInvalidIDType('');
  }
  if (IDNumber === '') {
    setInvalidIDNumber(t("ID Number can't be empty"));
    valid = false;
  } else {
    setInvalidIDNumber('');
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
  const submitOnClick = () => {
    const idProof = selectedImage ? selectedImage : file ? file : "";
    const idProof2 = selectedImage2 ? selectedImage2 : file2 ? file2 : "";
   var data =  {
    "ApplicationNo": applicationDetails?.ApplicationNo ? applicationDetails?.ApplicationNo : "",
    "BP":  applicationDetails?.BP ? applicationDetails?.BP : "",
    "CA": applicationDetails?.CA ? applicationDetails?.CA : "",
    "SRNumber": applicationDetails?.SRNumber ? applicationDetails?.SRNumber : "",
    "IDType": selectedIDType,
    "IDNo": IDNumber,
    "IDAttachment1": idProof,
    "IDAttachment2": idProof2,
   }
   console.log(data, "data---->")
   if (validateInputs()) {
    fetch(constant.BASE_URL + constant.APPLICATION_ATTACHMENTS, {
      method: 'POST',
      body: JSON.stringify({
          Root: {
            "ApplicationNo": applicationDetails?.ApplicationNo ? applicationDetails?.ApplicationNo : "",
            "BP":  applicationDetails?.BP ? applicationDetails?.BP : "",
            "CA": applicationDetails?.CA ? applicationDetails?.CA : "",
            "SRNumber": applicationDetails?.SRNumber ? applicationDetails?.SRNumber : "",
            "IDType": selectedIDType,
            "IDNo": IDNumber,
            "IDattachment1": idProof,
            "IDattachment2": idProof2,
          }
   }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log(responseData, "upload--->")
        var status = responseData.Root.Status ? responseData.Root.Status : ""

        if(responseData.Root.Status == "Attachment Created Successfully") {
         Alert.alert(
          '',
          t('Your application has been successfully completed and please create your Mob App login account using your CA number and proceed for payment after login. Contract Account Number: ') + String(applicationDetails.CA),
          [
            {
              text: 'COPY CA Number',
              onPress: () => {
                Clipboard.setString(String(applicationDetails.CA)); // Copy CA Number as a string
                navigation.navigate("Registration");
              },
            },
          ]
         );
      } else if(responseData.Root.Status == "CA Creation Failure") {
        Alert.alert(
         '',
         t('Your Application process has failed..!!! Please check status again after sometime or please contact EEU ...!!! ') ,
         [
           {
             text: '',
             onPress: () => {
              //  Clipboard.setString(String(applicationDetails.CA)); // Copy CA Number as a string
              //  navigation.navigate("Registration");
             },
           },
         ]
        );
      } else if(responseData.Root.Status == "BP Creation Failure") {
        Alert.alert(
         '',
         t('Your Application process has failed..!!! Please check status again after sometime or please contact EEU ...!!! ') ,
         [
           {
             text: '',
             onPress: () => {
              //  Clipboard.setString(String(applicationDetails.CA)); // Copy CA Number as a string
              //  navigation.navigate("Registration");
             },
           },
         ]
        );
      }
   })
      .catch((error) => {
        console.log(error, "error")
        // showToast('error', error);
        
      });
   }
  }
  console.log(applicationDetails, "check--->")
  return (
    <View style={styles.StartMain}>
      <View style={styles.StartSubContainer}>
        <Image source={ImagePath.Logo} />
        <Text style={styles.StartMainHeader}>{t("Ethiopian Electric Utility")}</Text>
      </View>
      <ScrollView style={styles.StartSubContainer1}>
       <View style={styles.StartSub}>
        <Text style={styles.StartMainHeader}>{t("Document Upload")}</Text>
        <View style={[styles.Margin_30, { width: '72%'   }]}>
            <Text style={styles.LoginSubTxt}>{t("Application No") + " *"}</Text>    
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{applicationDetails.ApplicationNo}</Text>
            </View>
         </View>
        <View style={[styles.Margin_30, { width: '72%'   }]}>
            <Text style={styles.LoginSubTxt}>{t("CA") + " *"}</Text>    
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{applicationDetails.CA}</Text>
            </View>
         </View>  
         <View style={[styles.Margin_30, { width: '72%'   }]}>
            <Text style={styles.LoginSubTxt}>{t("BP") + " *"}</Text>    
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{applicationDetails.BP}</Text>
            </View>
         </View>
         <View style={[styles.Margin_30, { width: '72%'   }]}>
            <Text style={styles.LoginSubTxt}>{t("SR Number") + " *"}</Text>    
            <View style={{ padding: 10, borderWidth: 0.5, borderRadius: 2, borderColor: 'grey', marginTop: 10, backgroundColor: '#EEEEEE'  }}>
              <Text style={styles.DashBoradProfilAccText}>{applicationDetails.SRNumber}</Text>
            </View>
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
            <TextInput
            placeholder={t("Enter ID Number")}
            value={IDNumber}
            maxLength={16}
            keyboardType="number"
            style={styles.documentUploadInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
                setIDNumber(text);
                if( text && text.length > 0 ) {
                  setInvalidIDNumber("")
                }
            }}
          />
            <Text style={styles.ErrorMsg}>{invalidIDNumber}</Text>
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
                <Text style={styles.RegisterBtnTxt}>{t("ID Proof Upload") + " 1"}</Text>
                <Upload name={'upload'} size={25}/>
              </TouchableOpacity> 
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
                <Text style={styles.RegisterBtnTxt}>{t("ID Proof Upload" + " 2")}</Text>
                <Upload name={'upload'} size={25}/>
              </TouchableOpacity> 
              {isLoading &&
                   < View style={[styles.NewLoader, { marginLeft: 10, display: 'flex', flexDirection: 'row' }]}>
                     <ActivityIndicator size="small" />
                     <Text style={{ marginLeft: 10, marginBottom: 10}} >Processing....</Text>
                    </View>
              } 
              <TouchableOpacity disabled={isLoading} style={[styles.RegisterBtn, { backgroundColor: isLoading ? '#DCDCDC' : '#63AA5A', display:'flex', flexDirection: 'row' }]}
                onPress={() => { 
                  submitOnClick();
                }}
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
   </View>
  );
};
export default DocumentUpload;
