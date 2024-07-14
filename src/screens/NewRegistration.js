import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, Modal, StyleSheet } from 'react-native';
import Styles from '../CommonComponent/Styles';
import { ImagePath } from '../CommonComponent/ImagePath';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
import { constant } from '../CommonComponent/Constant';
import Camera from 'react-native-vector-icons/Entypo';
import Gallery from 'react-native-vector-icons/MaterialIcons';
import Upload from 'react-native-vector-icons/Feather';
import FileUpload from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications';

const NewRegistration = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const { styles } = Styles()
    const [ newPassword, setNewPassword] = useState("")
    const [ answer, setAnswer] = useState("")
    const [ accountNo, setAccountNo ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ accountStatus, setAccountStatus] = useState("")
    const [ genderOption, setGenderOption ] = useState([
      { label: "Male",  value:"Male" },
      { label: "Female", value:"Female"},
      { label: "unknown", value:"unknown"}
    ])
    const [ categoryOption, setCategoryOption ] = useState([
      { label: "Prepaid",  value:"Prepaid" },
      { label: "Postpaid",  value:"Postpaid" },

    ])
    const [ connectionTypeList, setConnectionListType ] = useState([
      { label: "Regular",  value:"Regular" },
      { label: "Temporary",  value:"Temporary" },
    ])
    const [ selectedConnectionType, setSelectedConnectionType ] = useState("")
    
    const [ installTypeOptions, setInstallTypeOptions ] = useState([
      { label: "Active Staff Consumption",  value:"Active Staff Consumption" },
      { label: "Domestic",  value:"Domestic" },
      { label: "Food Process",  value:"Food Process" },
      { label: "Mix building",  value:"Mix building" },
      { label: "Street light",  value:"Street light" },
      { label: "Bottled water factory",  value:"Bottled water factory" }
    ])
    const [ selectedInstallType, setSelectedInstallType ] = useState('')
    const [ appliedLoad, setAppliedLoad ] = useState('')
    const [ selectedCategory, setSelectedCategory ] = useState('')
    const [ selectedGender, setSelectedGender ] = useState('')
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [houseNumber, setHouseNumber] = useState('')
    const [landmark, setLandMark] = useState('')
    const [kebele, setKebele] = useState("");
    const [zone, setZone] = useState("");
    const [region, setRegion] = useState("");
    const [custService, setCustService] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [isDocumentOption, setDocumentOption] = useState(false)
    const [width, setWidth] = useState(200)
    const [height, setHeight] = useState(200)
    const [imageName, setImageName] = useState(null)
    const [file, setFile] = useState(null);
    const { theme, themeObj } = useThemes();
    const [ connStartDate, setConnStartDate  ] = useState(new Date())
    const [ connEndDate, setConnEndDate  ] = useState(new Date())
    const [ selectedImage, setSelectedImage ] = useState("")
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
  
    const clearData = () => {
      setTitle('');
      setFirstName('');
      setLastName('');
      setMiddleName('');

      setEmail('');
      setMobileNo('');
      setSelectedGender('');
      setHouseNumber('');
      setLandMark('');
      setKebele('');
      setZone('');
      setRegion('');
      setCustService('');
      setSelectedCategory('');
      setSelectedConnectionType('');
      setConnStartDate(new Date());
      setConnEndDate(new Date());
      setAppliedLoad('');
      setSelectedInstallType('');
      setSelectedImage('');
      setImageName('');
    }
    const onPressRegistration = () => {
      fetch(constant.BASE_URL + constant.NEW_SERVICE_CREATION, {
        method: 'POST',
        body: JSON.stringify({
            Record: {
              "PartnerCategory": "",
              "PartnerType": "",
              "Title": title,
              "FirstName": firstName,
              "MiddleName": middleName,
              "LastName": lastName,
              "OrganisationName1": "",
              "OrganisationName2": "",
              "OrganisationName3": "",
              "EmailAddress": email,
              "PhoneNumber": mobileNo,
              "Gender": selectedGender,
              "HouseNo": houseNumber,
              "landmark": landmark,
              "Kebele": kebele,
              "Zone": zone,
              "IDType": "",
              "IDNumber": "",
              "Region": region,
              "District": "",
              "CustomerServiceCentre": custService,
              "Category": selectedCategory,
              "ConnectionType": selectedConnectionType,
              "ConnectionStartDate": connStartDate,
              "ConnectionEndDate": connEndDate,
              "AppliedLoad": appliedLoad,
              "InstallType": selectedInstallType,
              "IDSoftCopyUpload": selectedImage
    
            },
        }),
    })
        .then((response) => response.json())
        .then(async (responseData) => {
          var data = responseData.MT_NewServiceConnection_Res
          if(data.Record == "") { 
            showToast('success', 'New service has been successfully created');
            clearData()
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    
    }
    const renderItem = (item) => {
      return (
        <View style={styles.RaiseComplaintItem}>
          <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
        </View>
      );
    };

    // const handleNumberChange = (input) => {
    //   // Allow only numbers and one decimal point in the input
    //   const validNumber = input.match(/^\d*\.?\d*$/);
    //   if (validNumber) {
    //     setAppliedLoad(input);
  
    //     // Parse the input to a float and format it to 3 decimal places
    //     const parsedNumber = parseFloat(input);
    //     if (!isNaN(parsedNumber)) {
    //       setAppliedLoad(parsedNumber.toFixed(3));
    //     } else {
    //       setAppliedLoad('0.000');
    //     }
    //   }
    // };
  
    const renderTextInput = (name, placeholder, value, updateState) => {
        return(
          <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t(name)}</Text>   
            <TextInput
            placeholder={t(placeholder)}
            value={value}
            maxLength={name === "Mobile No"? 10 : null}
            keyboardType={name === "Mobile No" || name === "Applied load" ? "phone-pad" : null}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              // if(name === "Applied load") {
              //   handleNumberChange()
              // } 
               updateState(text) 
            }}
           />
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
         openGallery()
      }
     
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
    const onChangeStartConnection = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setConnStartDate(currentDate);
      setShow(false)
    };
  
    const showDatepickerStartConnection = () => {
      setShow(true);
    };
    const onChangeEndConnection = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setConnEndDate(currentDate);
      setShow(false)
    };
  
    const showDatepickerEndConnection = () => {
      setShow(true);
    };
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
    return (
        <View style={styles.StartMain}>
           <View style={styles.RegisterMainContainer}>
             <TouchableOpacity style={{ left: 0, position: 'absolute', top: 30 }} onPress={() =>{ navigation.navigate("Login") }}>
                   <Image source={ImagePath.Left} />
             </TouchableOpacity>
             <Image source={ImagePath.Logo} style={styles.StartLogo} />
             <Text style={styles.RegisterMainHeader}>{t("Ethiopian Electric Utility")}</Text>
           </View>
           <ScrollView style={styles.RegisterSubContainer1}>
           <View style={styles.RegisterSub}>
           <Text style={styles.StartMainHeader}>{t("New Connection Request")}</Text>
           {renderTextInput(t("First Name"), "Enter first name", firstName, setFirstName)}
           {renderTextInput(t("Middle Name"), "Enter middle name", middleName, setMiddleName)}
           {renderTextInput(t("Last Name"), "Enter last name", lastName, setLastName)}
           {renderTextInput(t("Email"), "Enter email", email, setEmail)}
           {renderTextInput(t("Mobile No"), "Enter mobile no", mobileNo, setMobileNo)}
           {renderTextInput(t("Title"), "Enter title", title, setTitle)}

           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Please Select Gender")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the Gender")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={genderOption}
                value={selectedGender}
                onChange={item => {
                    setSelectedGender(item.value);
                }}               
           />
           </View>
           {renderTextInput(t("House No"), "Enter House No", houseNumber, setHouseNumber)}
           {renderTextInput(t("Landmark"), "Enter Landmark", landmark, setLandMark)}
           {renderTextInput(t("Kebele"), "Enter Kebele", kebele, setKebele)}
           {renderTextInput(t("Zone"), "Enter Zone", zone, setZone)}
           {renderTextInput(t("Region"), "Enter Region", region, setRegion)}
           {renderTextInput(t("CSC Customer Service"), "Enter CSC Customer Service", custService, setCustService)}
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Prepaid/Postpaid")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the category")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={categoryOption}
                value={selectedCategory}
                onChange={item => {
                    setSelectedCategory(item.value);
                }}               
           />
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Connection type")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the connection type")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={connectionTypeList}
                value={selectedConnectionType}
                onChange={item => {
                    setSelectedConnectionType(item.value);
                }}               
           />
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Connection start date")}</Text>   
            <TouchableOpacity onPress={showDatepickerStartConnection} style={styles.QuesComplaintDropdown}>
               <TextInput
                 style={{color: '#666666', fontSize: 12}}
                 value={moment(connStartDate).format('DD-MM-YYYY')}
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
               onChange={onChangeStartConnection}
             />
            )}
           </View>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Connection end date")}</Text>   
            <TouchableOpacity onPress={showDatepickerStartConnection} style={styles.QuesComplaintDropdown}>
               <TextInput
                 style={{color: '#666666', fontSize: 12}}
                 value={moment(connEndDate).format('DD-MM-YYYY')}
                 placeholder={t("Select Date")}
                 editable={false}
              />
             </TouchableOpacity>
            {show && (
             <DateTimePicker
               testID="dateTimePicker"
               value={connEndDate}
               mode="date"
               display="default"
               onChange={onChangeEndConnection}
             />
            )}
           </View>
           {renderTextInput(t("Applied load"), "Enter Applied load", appliedLoad, setAppliedLoad)}
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Install type")}</Text>   
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
                }}               
           />
           </View>
           {imageName && imageName ? <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName}</Text> : null }
           <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption(true) }}>
              <Text style={styles.RegisterBtnTxt}>{t("ID Softcopy Upload")}</Text>
              <Upload name={'upload'} size={25}/>
           </TouchableOpacity> 
           <TouchableOpacity style={[styles.RegisterBtn, { backgroundColor: accountStatus == "VALID CA" ? '#DCDCDC' : '#63AA5A' }]} onPress={() => { onPressRegistration() }}>
              <Text style={[styles.RegisterBtnTxt, { color: accountStatus == "VALID CA" ?  '#FFF' : '#666666' }]}>{t("REGISTER")}</Text>
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
          </ScrollView>
         
        </View>
    );
};

export default NewRegistration;
