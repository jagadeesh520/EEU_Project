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
    const [ selectedCategory1, setSelectedCategory1] = useState("")
    const [ Category1Option, setCategory1Option] = useState([
        { label: "Load enhancement",  value:"Load enhancement" },
        { label: "Load reduction",  value:"Load reduction" },
        { label: "Load enhancement with Tariff change",  value:"Load enhancement with Tariff change" },
        { label: "Load reduction with Tariff change",  value:"Load reduction with Tariff change" }
    ]);
    const [ MeterReplacementReqOption, setMeterReplacementReqOption ] = useState([
        { label: "Yes",  value:"Yes" },
        { label: "No",  value:"No" }
    ]);
    const [ selectedReplacementReq, setSelectedReplacementReq] = useState("");
    const [ selectedMeterType, setSelectedMeterType] = useState("");
    const [ MeterTypeOption, setMeterTypeOption] = useState([
        { label: "Single Phase",  value:"Single Phase" },
        { label: "Three Phase",  value:"Three Phase" },
        { label: "Active Reactive",  value:"Active Reactive" }
    ]);
    const [ installTypeOptions, setInstallTypeOptions ] = useState([
        { label: "Active Staff Consumption",  value:"001" },
        { label: "Domestic",  value:"023" },
        { label: "Food Process",  value:"029" },
        { label: "Mix building",  value:"082" },
        { label: "Street light",  value:"086" },
        { label: "Bottled water factory",  value:"089" }
      ]);
    const [ phaseTypeOptions, setPhaseTypeOptions ] = useState([
        { label: "Single Phase",  value:"1" },
        { label: "Three Phase",  value:"2" }
      ]);
    const [ selectedInstallType, setSelectedInstallType ] = useState('');
    const [ selectedPhaseType, setSelectedPhaseType ] = useState('');
    const [ appliedLoad, setAppliedLoad ] = useState('');
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
      const [invalidAppliedLoad, setInvalidAppliedLoad] = useState("");
      const [invalidInstallType, setInvalidInstallType] = useState("");
      const [invalidPhaseType, setInvalidPhaseType] = useState("");
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
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
               if (name === "Applied load" && text !== "") {
                const numericValue = parseFloat(text); // Convert text to number for comparison
               
                if(numericValue <= 7.5) {
                  setSelectedPhaseType("1")
                  setPhaseType("Single Phase")
                  updateState(numericValue);
                } else if(numericValue > 7.5) {
                  setSelectedPhaseType("2")
                  setPhaseType("Three Phase")
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
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
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
                style={[styles.QuesComplaintDropdown, { backgroundColor: '#F4F4F4' }]}
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
            <Text style={styles.ErrorMsg}>{invalidInstallType}</Text>
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
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
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
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
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
                    // if( (item.value)?.length > 0 ) {
                    //   setInvalidIDType("")
                    // }
                }}               
           />
            {/* <Text style={styles.ErrorMsg}>{invalidInstallType}</Text> */}
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

export default LoadChange;
 
 