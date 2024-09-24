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

const IDType = [
    { label: "Passport", value:"Passport" },
    { label: "Residential ID", value:"Residential ID" },
    { label: "Active / Retried Staff ID", value:"Active / Retried Staff ID" },
    { label: "Tax Payer ID", value:"Tax Payer ID" },
    { label: "Investment License ID", value:"Investment License ID" },
    { label: "Driving License", value:"Driving License" },
    { label: "Govt. Official Letter", value:"Govt. Official Letter" },
    { label: "Trade License ID", value:"Trade License ID" },
    { label: "Citizenship ID", value:"Citizenship ID" },
    { label: "Non-EEU Employee ID Mandatory", value:"Non-EEU Employee ID" },
]
const OwnershipType = [
    { label: "Map of Premise/Building", value:"Map of Premise/Building" },
    { label: "Govt. Allotment Letter", value:"Govt. Allotment Letter" },
    { label: "License from sub-city / local admin", value:"License from sub-city / local admin" },
    { label: "Three witness presentation", value:"Three witness presentation" },
    { label: "Investment License ID", value:"Investment License ID" },
]    
// create a component
const ServiceShifting = ({ navigation }) => {
    const { t } = useTranslation();
    const { theme, styles, changeTheme } = Styles();
    const [accountData, setAccountData] = useState({});
    const [BPVal, setBP] = useState("");
    const [CAVal, setCA] = useState("");
    const [requestDes, setRequestDes] = useState("Service Shifting");
    const [category1, setCategory1] = useState("Shifting Connection");
    const [idType, setIdType] = useState("");
    const [selectIDType, setSelectedIDType] = useState("");
    const [selectOwnerShip, setSelectOwnerShip] = useState("");
    const [isDocumentOption, setDocumentOption] = useState(false);
    const [isDocumentOption1, setDocumentOption1] = useState(false);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [imageName, setImageName] = useState(null);
    const [imageName2, setImageName2] = useState(null);
    const { themes, themeObj } = useThemes();
    const [ selectedImage, setSelectedImage ] = useState("");

    // Run useEffect only once when the component mounts
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
                setBP(data.BP_No); // Set BP from stored data
                setCA(data.CA_No); // Set CA from stored data
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderTextInput = (name, placeholder, value, updateState, editable) => {
        return (
            <View style={styles.Margin_10}>
                <Text style={styles.LoginSubTxt}>{t(name) + " *"}</Text>
                <TextInput
                    placeholder={t(placeholder)}
                    value={value}
                    editable={editable}
                    style={[styles.LoginTextInput, { backgroundColor: name === "Request Description" ? "#EEEEEE": null }]}
                    placeholderTextColor="#9E9E9E"
                    onChangeText={(text) => updateState(text)}
                />
            </View>
        );
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
           openGallery()
        }
       
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
      openGallery = () => {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,
          mediaType: 'photo',
        }).then(async image => {
          console.log('Image captured:', image.data);
          setHeight(height);
          setWidth(width);
          setDocumentOption(false)
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
          setImageName(imageFileName);

          setSelectedImage(image.data)
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
          console.log('Image captured:', image.data);
          setHeight(height);
          setWidth(width);
          setDocumentOption(false)
          setSelectedImage(image.data)
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
          setImageName(imageFileName);
         
        }).catch(error => { 
          console.log(error);
        });
      }
      const handlePDFUpload = async () => { 
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
          });
          setFile(res);
          const selectedFile = res[0];
          setFile(selectedFile);
          setImageName(selectedFile.name);
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            throw err;
          }
        }
      }
      const handleCameraCapture1 = async () => {
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
        openCamera1()
      };
      
      openGallery1 = () => {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,
          mediaType: 'photo',
        }).then(async image => {
          console.log('Image captured:', image.data);
          setHeight(height);
          setWidth(width);
          setDocumentOption(false)
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
          setImageName2(imageFileName);

          setSelectedImage(image.data)
        }).catch(error => {
          console.log(error);
        });
      }
      const openCamera1 = () => {
        ImagePicker.openCamera({
          width: 400,
          height: 400,
          cropping: true,
          useFrontCamera: false,
          includeBase64: true,  
          mediaType: 'photo',
        }).then(async image => {
          console.log('Image captured:', image.data);
          setHeight(height);
          setWidth(width);
          setDocumentOption(false)
          setSelectedImage(image.data)
          const imagePathParts = image.path.split('/');
          const imageFileName = imagePathParts[imagePathParts.length - 1];
          setImageName2(imageFileName);
         
        }).catch(error => { 
          console.log(error);
        });
      }
      
      const handlePDFUpload1 = async () => { 
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
          });
          setFile(res);
          const selectedFile = res[0];
          setFile(selectedFile);
          setImageName2(selectedFile.name);
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            throw err;
          }
        }
      }
    return (
        <ScrollView style={styles.DashBoardMain}>

            <CommonHeader title={t("Service Shifting")} onBackPress={onBackPress} navigation={navigation} />
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
                {renderTextInput("Request Description", "Enter Request Description", requestDes, setRequestDes, true)}
                {renderTextInput("Category1", "Enter Category1", category1, setCategory1, true)}
                <View style={styles.Margin_10}>
                  <Text style={styles.LoginSubTxt}>{t("ID type") + (" *")}</Text>   
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
                    data={IDType}
                    value={selectIDType}
                    onChange={item => {
                       setSelectedIDType(item.value);
                       if((item.value)?.length > 0 ) {
                        setSelectedIDType('')
                       }   
                    }}               
                 />
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
                  <Text style={styles.LoginSubTxt}>{t("Ownership Proof Type") + (" *")}</Text>   
                  <Dropdown
                    placeholderStyle={styles.RaiseComplaintDropdownTxt}
                    selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                    inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                    iconStyle={styles.RaiseComplaintDropdownTxt}
                    labelField="label"
                    valueField="value"
                    placeholder={t("Select the Ownership Proof Type")}
                    style={styles.QuesComplaintDropdown}
                    renderItem={renderItem}
                    data={OwnershipType}
                    value={selectOwnerShip}
                    onChange={item => {
                        setSelectOwnerShip(item.value);
                       if((item.value)?.length > 0 ) {
                        setSelectOwnerShip('')
                       }   
                    }}               
                 />
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
              <TouchableOpacity style={[styles.RegisterBtn, { backgroundColor: '#63AA5A', display:'flex', flexDirection: 'row' }]}
                onPress={() => { }}
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
                        handleCameraCapture1() 
                    }}
                  >
                    <Camera name={"camera"} size={25} color={"#F29037"}/>
                    <Text style={[styles.modalText, { marginLeft: 10 }]}>{t("Take Photo")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false)
                        handleImagePicker1() 
                    }}
                  >
                    <Gallery name={"photo-library"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("Take from Gallery")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption1(false)
                        handlePDFUpload1() 
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

export default ServiceShifting;
