import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, Modal, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
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
import Clipboard from '@react-native-clipboard/clipboard';
import Close from 'react-native-vector-icons/AntDesign';
import {data} from '../../Languages/data';
import Icon from 'react-native-vector-icons/AntDesign';


const NewRegistration = ({navigation}) => {
    const toast = useToast();
    const { t, i18n } = useTranslation();
    const { styles } = Styles()
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const [ newPassword, setNewPassword] = useState("")
    const [ answer, setAnswer] = useState("")
    const [ accountNo, setAccountNo ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ accountStatus, setAccountStatus] = useState("")
    const [ genderOption, setGenderOption ] = useState([
      { label: "Male",  value:"2" },
      { label: "Female", value:"1"},
      { label: "unknown", value:"Unknown"}
    ])
    const [ categoryOption, setCategoryOption ] = useState([
      { label: "Postpaid",  value:"1" },
      { label: "Prepaid",  value:"2" },

    ])
    const [ connectionTypeList, setConnectionListType ] = useState([
      { label: "Regular",  value:"REG" },
      { label: "Temporary",  value:"TEMP" },
    ])
    const [ titleOptions, setTitleOptions ] = useState([
      { label: "Mr", value:"0002" },
      { label: "Blank", value:"0047" },
      { label: "Mrs",  value:"0004" },
      { label: "W/RO",  value:"0005" },
      { label: "W/RT",  value:"0006" },
      { label: "ATO",  value:"0007" },
    ])
    const [ selectedConnectionType, setSelectedConnectionType ] = useState("")
    const [cscOptions, setCscOption ] = useState([
      { label: "EAST AA CSC NO.2",  value:"AA01" },
      { label: "SOUTH AA CSC NO.1",  value:"AB01" },
      { label: "WEST AA CSC NO.1",  value:"AC01" },
      { label: "NORTH AA CUSTOMER CSC .1",  value:"AD01" },
      { label: "ADAMA DST ADAMA CSC NO.1",  value:"BA01" },
      { label: "FINFINE DST SENDAFA CSC",  value:"BB01" },
      { label: "SHASHEMEN NO 1CSC",  value:"BC01" },
      { label: "CHIRO DISTRICT CHIRO CSC",  value:"BD01" },
      { label: "JIMMA DST JIMMA CSC NO.1",  value:"BE01" },
      { label: "NEKEMITE DST NEKEMT CSC",  value:"BF01" },
      { label: "AMBO DST AMBO DST AMBO CSC",  value:"BG01" },
      { label: "BALE ROBE DST BALE ROBE CSC",  value:"BH01" },
      { label: "METU DST METU CSC",  value:"BI01" },
      { label: "BAHIRDARDST BAHIR DAR 1 CSC",  value:"CA01" },
      { label: "DESSIE DST DESSIE 1 CSC",  value:"CB01" },
      { label: "BAHIRDARDST BAHIR DAR 1 CSC",  value:"CA01" },
      { label: "GONDER DST GONDER 1 CSC",  value:"CC01" },
      { label: "DEBERE BIRHAN NO 1 CSC",  value:"CD01" },
      { label: "DEBEREMARKOS NO. 1 CSC",  value:"CE01" },
      { label: "WOLEDIYA DST WOLEDIYA CSC",  value:"CF01" },
    ])
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
      { label: "Three Phase",  value:"2" },
    ]);
    const [ IDTypeOptions, setIDTypeOptions ] = useState([
      { label: "Identity card",  value:"A00001" },
      { label: "Passport",  value:"A00002" },
      { label: "SWIFT-BIC (Business Identifier Code)",  value:"A00006" },
      { label: "Legal Entity Identifier (LEI)",  value:"A00007" },
      { label: "Driving License",  value:"A00008" },
      { label: "Residential ID",  value:"A00009" },
      { label: "Non EEU Employee ID",  value:"A00010" },
      { label: "Active / Retired Staff ID",  value:"A00011" },
      { label: "Govt. Official Letter",  value:"A00012" },
      { label: "Tax Payer ID",  value:"A00013" },
      { label: "Trade License ID",  value:"A00014" },
      { label: "Investment License ID",  value:"A00015" },
      { label: "Citizenship ID",  value:"A00016" },
      { label: "Old Account No.",  value:"A00017" }
    ]);
    const [ partnerCategoryOptions, setPartnerCategoryOptions ] = useState([
      { label: "Person",  value:"1" },
      { label: "Organization",  value:"2" },

    ]);

    /* const data = [
      {
        label: "Afar",
        value: "01",
        zone: [
          {
            label: "01",
            value: "01",
            kebele: [
              {
                label: "Semara K/k",
                value: "01",
                csc:[
                  {
                    label: "FA01",
                    value: "01"
                  }
                ]
              },
              {
                label: "Logiya k/k",
                value: "02",
                csc: [
                  {
                     label: "FA01",
                     value: "01"
                  }
                ]
              },
            ]
          },
          {
            label: "02",
            value: "02",
            kebele : [
              {
                label: "Abeala Ketema",
                value: "01",
                csc: [
                  {
                     label: "FA01",
                     value: "01"
                  }
                ]
              }
            ]

  
          }
        ],
      }, 
      {
        label: "Amhara",
        value: "02",
        zone: [
          {
            label: "01",
            value: "01",
            kebele: [
              {
                name: "Semara K/k",
                csc: "FA01"
              },
              {
                name: "Logiya k/k",
                csc: "FA08"
  
              },
            ]
          },
          {
            name: "02",
            kebele : [
              {
                name: "Abeala Ketema",
                csc: "FA16"
              }
            ]
  
          },
        ],
      }
    ];
 */

    
const [selectedZone, setSelectedZone] = useState("");
const [selectedKabele, setSelectedKabele] = useState("");
const [selectedCsc, setSelectedCsc] = useState("");

    const regionOptions = [
      { label: "Addis Ababa ", value:"01" },
      { label: "Afar", value:"02" },
      { label: "Amhara", value:"03" },
      { label: "Benishangul- Gumuz",  value:"04" },
      { label: "Dire Dawa",  value:"05" },
      { label: "Gambela",  value:"06" },
      { label: "Harari",  value:"07" },
      { label: "Oromia",  value:"08" },
      { label: "Somali",  value:"09" },
      { label: "Southern Nations",  value:"10" },
      { label: "Tigray",  value:"11" },
      { label: "Sidama",  value:"12" },
      { label: "South West",  value:"13" },
    ];
    

    const [ partnerTypeOptions, setPartnerTypeOptions ] = useState([
      { label: "Others",  value:"0009" },

    ])

    const [ selectedInstallType, setSelectedInstallType ] = useState('');
    const [ selectedPhaseType, setSelectedPhaseType ] = useState('');
    const [ selectedPartnerCategory, setSelectedPartnerCategory ] = useState("1")
    const [ appliedLoad, setAppliedLoad ] = useState('');
    const [ selectedCategory, setSelectedCategory ] = useState('');
    const [ selectedGender, setSelectedGender ] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [landmark, setLandMark] = useState('');
    const [kebele, setKebele] = useState("");
    const [zone, setZone] = useState("");
    const [region, setRegion] = useState("");
    const [csc, setCsc] = useState("");
    const [custService, setCustService] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [isDocumentOption, setDocumentOption] = useState(false);
    const [isDocumentOption2, setDocumentOption2] = useState(false);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [imageName, setImageName] = useState(null);
    const [file2, setFile2] = useState(null);
    const [imageName2, setImageName2] = useState(null);
    const [file, setFile] = useState(null);
    const { theme, themeObj } = useThemes();
    const [ connStartDate, setConnStartDate  ] = useState(new Date());
    const [ connEndDate, setConnEndDate  ] = useState(new Date());
    const [ selectedImage, setSelectedImage ] = useState("");
    const [ selectedImage2, setSelectedImage2 ] = useState("");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selectPartnerType, setSelectPartnerType] = useState("");
    const [selectedIDType, setSelectedIDType] = useState("");
    const [orgName1, setOrgName1] = useState("");
    const [orgName2, setOrgName2] = useState("");
    const [orgName3, setOrgName3] = useState("");

    const [IDNumber, setIDNumber] = useState("");
    const [invalidIDType, setInvalidIDType] = useState("")
    const [invalidIDNumber, setInvalidIDNumber] = useState("")
    const [invalidFirstName, setInvalidFirstName] = useState("");
    const [invalidLastName, setInvalidLastName] = useState("");
    const [invalidTitle, setInvalidTitle] = useState("");
    const [invalidEmail, setInvalidEmail] = useState("");
    const [invalidMobileNo, setInvalidMobileNo] = useState("");
    const [invalidGender, setInvalidGender] = useState("");
    const [invalidHouseNumber, setInvalidHouseNumber] = useState("");
    const [invalidLandmark, setInvalidLandmark] = useState("");
    const [invalidKebele, setInvalidKebele] = useState("");
    const [invalidZone, setInvalidZone] = useState("");
    const [invalidRegion, setInvalidRegion] = useState("");
    const [invalidConnectionType, setInvalidConnectionType] = useState("");
    const [invalidAppliedLoad, setInvalidAppliedLoad] = useState("");
    const [invalidInstallType, setInvalidInstallType] = useState("");
    const [invalidPhaseType, setInvalidPhaseType] = useState("");
    const [invalidImage, setInvalidImage] = useState("");
    const [invalidCusService, setInvalidCusService] = useState("");
    const [invalidCategory, setInvalidCategory ] = useState("");
    const [invalidPartnerType, setInvalidPartnerType] = useState("");
    const [invalidPartnerCategory, setInvalidPartnerCategory] = useState("");
    const [invalidOrgName1, setInvalidOrgName1] = useState("");
    const [invalidOrgName2, setInvalidOrgName2] = useState("");
    const [invalidOrgName3, setInvalidOrgName3] = useState("");
    const [isLoading, setLoading]= useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const [partnerCategory, setPartnerCategory] = useState("Person");
    const [partnerType, setPartnerType] = useState("");
    const [titleLabel, setTitleLabel] = useState("");
    const [paidOption, setPaidOption] = useState("");
    const [phaseType, setPhaseType] = useState("");
    const [cscService, setCSCService] = useState("");
    const [idType, setIDType] = useState("");
    const [gender, setGender] = useState("");
    const [reg, setReg]= useState("");  
    const [connType, setConnType]= useState("");  
    const [insType, setInsType] = useState("");
    const [selectedImageName, setSelectedImageName] = useState("");

    const [countryCode, setCountryCode] = useState("+251")
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
      setImageName2('');
      setSelectedPhaseType('');
      setSelectedIDType('');
      setIDNumber('');
      setSelectedPartnerCategory('1');
      setSelectPartnerType('');
      setOrgName1("");
      setOrgName2("");
      setOrgName3("");
    }

    const validateInputs = () => {
      let valid = true;
  
      if (firstName === '' && selectedPartnerCategory == "1") {
        setInvalidFirstName(t("First name can't be empty"));
        valid = false;
      } else {
        setInvalidFirstName('');
      }
      if (lastName === '' && selectedPartnerCategory == "1") {
        setInvalidLastName(t("Last name can't be empty"));
        valid = false;
      } else {
        setInvalidLastName('');
      }
      if (title === '' && selectedPartnerCategory == "1") {
        setInvalidTitle(t("Title can't be empty"));
        valid = false;
      } else {
        setInvalidTitle('');
      }
      if ( email== '') {
        setInvalidEmail(t("Email can't be empty"));
        valid = false;
      } else {
        setInvalidEmail('');
      }
      if ( mobileNo == '') {
        setInvalidMobileNo(t("Mobile number can't be empty"));
        valid = false;
      } else {
        setInvalidMobileNo('');
      }
      if ( selectedGender == '' && selectedPartnerCategory == "1") {
        setInvalidGender(t("Gender can't be empty"));
        valid = false;
      } else {
        setInvalidGender('');
      }
      if ( houseNumber == '') {
        setInvalidHouseNumber(t("House number can't be empty"));
        valid = false;
      } else {
        setInvalidHouseNumber('');
      }
      if ( landmark == '') {
        setInvalidLandmark(t("Landmark can't be empty"));
        valid = false;
      } else {
        setInvalidLandmark('');
      }
      if ( kebele == '') {
        setInvalidKebele(t("Kebele can't be empty"));
        valid = false;
      } else {
        setInvalidKebele('');
      }
      if ( zone == '') {
        setInvalidZone(t("Zone can't be empty"));
        valid = false;
      } else {
        setInvalidZone('');
      }
      if ( region == '') {
        setInvalidRegion(t("Region can't be empty"));
        valid = false;
      } else {
        setInvalidRegion('');
      }
      if ( selectedCsc == '') {
        setInvalidCusService(t("Customer service can't be empty"));
        valid = false;
      } else {
        setInvalidCusService('');
      }

      if ( selectedConnectionType == '') {
        setInvalidConnectionType(t("Connection type can't be empty"));
        valid = false;
      } else {
        setInvalidConnectionType('');
      }
      if (selectedCategory === '') {
        setInvalidCategory(t("Category can't be empty"));
        valid = false;
      } else {
        setInvalidCategory('');
      }
      if ( appliedLoad == '') {
        setInvalidAppliedLoad(t("Applied Load can't be empty"));
        valid = false;
      } else {
        setInvalidAppliedLoad('');
      }
      if (selectedInstallType === '') {
        setInvalidInstallType(t("Install type can't be empty"));
        valid = false;
      } else {
        setInvalidInstallType('');
      }
      if (selectedImage === '' && file == null) {
        setInvalidImage(t("ID Softcopy can't be empty"));
        valid = false;
      } else {
        setInvalidImage('');
      }
      if (selectPartnerType === '') {
        setInvalidPartnerType(t("Partner Type can't be empty"));
        valid = false;
      } else {
        setInvalidPartnerType('');
      }
      // if (selectedPhaseType === '') {
      //   setInvalidPhaseType(t("Phase type can't be empty"));
      //   valid = false;
      // } else {
      //   setInvalidPhaseType('');
      // }
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
      if (orgName1 === '' && selectedPartnerCategory == "2") {
        setInvalidOrgName1(t("Organization Name1 can't be empty"));
        valid = false;
      } else {
        setInvalidOrgName1('');
      }

      if (orgName2 === '' && selectedPartnerCategory == "2") {
        setInvalidOrgName2(t("Organization Name2 can't be empty"));
        valid = false;
      } else {
        setInvalidOrgName2('');
      }

      if (orgName3 === '' && selectedPartnerCategory == "2") {
        setInvalidOrgName3(t("Organization Name3 can't be empty"));
        valid = false;
      } else {
        setInvalidOrgName3('');
      }
      if (selectedPartnerCategory === '') {
        setInvalidPartnerCategory(t("Partner category can't be empty"));
        valid = false;
      } else {
        setInvalidPartnerCategory('');
      }
  
      return valid;
    };
    const onPressRegistration = () => {
      var validate = validateInputs()

      if (validateInputs()) { 
      const url = constant.BASE_URL + constant.NEW_SERVICE_CREATION
      var data =  {
              "PartnerCategory": selectedPartnerCategory,
              "PartnerType": selectPartnerType,
              "Title": title,
              "FirstName": firstName,
              "MiddleName": middleName,
              "LastName": lastName,
              "OrganisationName1": orgName1,
              "OrganisationName2": orgName2,
              "OrganisationName3": orgName3,
              "EmailAddress": email,
              "PhoneNumber": mobileNo,
              "Gender": selectedGender,
              "HouseNo": houseNumber,
              "landmark": landmark,
              "Kebele": kebele,
              "Zone": zone,
              "IDType": selectedIDType,
              "IDNumber": IDNumber,
              "Region": region,
              "District": "",
              "CustomerServiceCentre": custService,
              "Category": selectedCategory,
              "ConnectionType": selectedConnectionType,
              "ConnectionStartDate": connStartDate,
              "ConnectionEndDate": connEndDate,
              "AppliedLoad": appliedLoad,
              "InstallType": selectedInstallType,
              "IDSoftCopyUpload": selectedImage,
              "PhaseType": selectedPhaseType
      }
      console.log(data, "data--->")
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            Record: {
              "PartnerCategory": selectedPartnerCategory,
              "PartnerType": selectPartnerType,
              "Title": title,
              "FirstName": firstName,
              "MiddleName": middleName,
              "LastName": lastName,
              "OrganisationName1": orgName1,
              "OrganisationName2": orgName2,
              "OrganisationName3": orgName3,
              "EmailAddress": email,
              "PhoneNumber": mobileNo,
              "Gender": selectedGender,
              "HouseNo": houseNumber,
              "landmark": landmark,
              "Kebele": kebele,
              "Zone": zone,
              "IDType": selectedIDType,
              "IDNumber": IDNumber,
              "Region": region,
              "District": "",
              "CustomerServiceCentre": custService,
              "Category": selectedCategory,
              "ConnectionType": selectedConnectionType,
              "ConnectionStartDate": connStartDate,
              "ConnectionEndDate": connEndDate,
              "AppliedLoad": appliedLoad,
              "InstallType": selectedInstallType,
              "IDSoftCopyUpload": selectedImage,
              "PhaseType": selectedPhaseType
    
            },
        }),
      })
        .then((response) => response.json())
        .then(async (responseData) => {
          var data = responseData.MT_NewServiceConnection_Res.Record
          let ServiceRequestNumber =   data?.ServiceRequestNumber ? data?.ServiceRequestNumber : "";
          setLoading(false)
          // if(data?.CANumber) {
            Alert.alert(
              '',
              t('New service has been successfully created, CA Number: ') + String(data.CANumber) + t(" and Service Request Number: ") + String(ServiceRequestNumber) + "  "+ t("BP Number : ") + String(data.BP),
              [
                {
                  text: 'COPY CA Number',
                  onPress: () => {
                    Clipboard.setString(String(data.CANumber)); // Copy CA Number as a string
                    navigation.navigate("Registration");
                  },
                },
              ]
            );
            clearData()
          // }
        })
        .catch((error) => {
          console.log('error---->new service', error);
          if(error) {
            showToast('error', error);
          }
        });
    }
    }
    const renderItem = (item) => {
      return (
        <View style={styles.RaiseComplaintItem}>
          <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
        </View>
      );
    };

    const partnerInfoMessage = () => {
      Alert.alert(
        '',
        t("Select “Person“ if you are applying with your own name; if not, Choose “Organization“"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    }

    const LandInfoMessage = () => {
      Alert.alert(
        '',
        t("To identify your location, encode a known close-by address"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    
    }

    const AppliedLoadInfoMessage = () => {
      Alert.alert(
        '',
        t("For Single phase service enter upto 7.5Kw or For three phase service enter the Kw that need to be approved"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    
    }

    const IDNumberInfoMessage = () => {
      Alert.alert(
        '',
        t("From ID card/letter that will be uploaded, encode the ID number"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    
    }


    const connectionInfoMessage = () => {
      Alert.alert(
        '',
        t("Choose “Regular“ for permanent use,or Temporary for one-time use"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    }

    const installTypeInfoMessage = () => {
      Alert.alert(
        '',
        t("Choose the service that suit your intended use from the drop-down list"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    }

    const phaseInfoMessage = ()=> {
      Alert.alert(
        '',
        t("For Single phase service, Select “Single phase“ For three phase service Select “Three Phase“"),
        [
          
          { text: 'Ok', onPress: () => console.log('OK Pressed') },
        ]
      );
    }

  
    const renderTextInput = (name, placeholder, value, updateState, ErrorMsg, setErrorMsg) => {
        return(
          <View>
           { name === "Mobile No" ? 
          <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t(name) + " *"}</Text>  
           <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput style={styles.countryCodeInput} editable={false} value={countryCode}/> 
            <TextInput
            placeholder={t(placeholder)}
            value={value}
            maxLength={9}
            style={[styles.LoginTextInput, {width: 220}]}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
                const MobRegex = text.replace(/[^0-9]/g, '');
                if (MobRegex.length < 10) {
                  updateState(MobRegex);
                  setErrorMsg('');
                }
                 // Set error message if the length is not valid
                if (MobRegex.length < 9 && text.length > 1) {
                  setErrorMsg('Phone number must be 9 digits.');
                }  
                if(text[0] == 0) {
                  setErrorMsg('Invalid mobile number');
                }
                if( name === "Mobile No" && text == "" ){
                  setErrorMsg('');
                }
            }}
          />
          </View>
          <Text style={styles.ErrorMsg}>{ErrorMsg}</Text>
          </View>:
          <View style={styles.Margin_10}>
           <Text style={styles.LoginSubTxt}>{t(name) + (name === "Middle Name" ? "" : " *")}</Text> 
           {(name == "Landmark") && <Icon onPress= {LandInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />}
           {(name == "Applied load") && <Icon onPress= {AppliedLoadInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />}
           {(name == "ID Number") && <Icon onPress= {IDNumberInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />}
            <TextInput
            placeholder={t(placeholder)}
            value={value}
            maxLength={name === "Mobile No"? 10 : name === "ID Number" ? 20 : null}
            keyboardType={name === "Mobile No" || name === "Applied load" ? "phone-pad" : null}
            style={styles.LoginTextInput}
            placeholderTextColor="#9E9E9E"
            onChangeText={(text) =>{ 
              if (name === "Email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              
                // Check if the input is empty first
               
                // If input is not empty, check for valid email pattern
                if (!emailRegex.test(text)) {
                  // Invalid email entered, set error message
                  setErrorMsg('Please enter a valid email address.');
                } else {
                  setErrorMsg("");
                }
                if( name === "Email" && text == "" ){
                  setErrorMsg('');
                }
                updateState(text);

              } else if (name === "Applied load" && text !== "") {
                const numericValue = parseFloat(text); // Convert text to number for comparison
                // if(selectedPhaseType == "") {

                //     setErrorMsg("Please select the phase type");

                //  } else if(selectedPhaseType === "1") {

                //     if( numericValue <= 7.5 ) {
                //         console.log("update", numericValue)
                //         updateState(numericValue);
                //         setErrorMsg("")
                //     } else {
                //         setErrorMsg('Please enter a valid Applied load');
                //     }
                    
                //  } else if(selectedPhaseType === "2") {

                //   if( numericValue >= 7.5 && numericValue <= 25 ) {
                //       updateState(numericValue);
                //       setErrorMsg("")
                //   } else {
                //       setErrorMsg('Please enter a valid Applied load');
                //   }

                // }
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
              if(ErrorMsg?.length > 0 && text != "" && name != "Mobile No" && name != "Email" && name != "Applied load") {
                setErrorMsg("")
              }
            }}
           />
           <Text style={styles.ErrorMsg}>{ErrorMsg}</Text>
          </View> }
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
        setSelectedImage(`data:${image.mime};base64,${image.data}`);
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
        setSelectedImage(`data:${image.mime};base64,${image.data}`);
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
        setFile(selectedFile.uri);
        setImageName(selectedFile.name);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled the picker');
        } else {
          throw err;
        }
      }
    }
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
         openGallery2()
      }
     
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
        setHeight(height);
        setWidth(width);
        setDocumentOption2(false)
        const imagePathParts = image.path.split('/');
        const imageFileName = imagePathParts[imagePathParts.length - 1];
        setImageName2(imageFileName);
        setSelectedImage2(`data:${image.mime};base64,${image.data}`);
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
        setHeight(height);
        setWidth(width);
        setDocumentOption2(false)
        setSelectedImage2(`data:${image.mime};base64,${image.data}`);
        const imagePathParts = image.path.split('/');
        const imageFileName = imagePathParts[imagePathParts.length - 1];
        setImageName2(imageFileName);
       
      }).catch(error => { 
        console.log(error);
      });
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
    const handlePDFUpload2 = async () => { 
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
        });
        setFile2(res);
        const selectedFile = res[0];
        setFile2(selectedFile.uri);
        setImageName2(selectedFile.name);
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
    renderPreview = (label, value) => {
      return(
        <View style = {{ marginTop: 20, width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={[styles.LoginSubTxt, {flex: 0.6}]}>{t(label) + (label === "Middle Name" ? "" : " *")}</Text>   
          <Text style={[styles.LoginSubTxt, {flex: 0.1}]}>{":"}</Text>   
          <Text style={[styles.LoginSubTxt, {flex: 0.3}]}>{(label === "Mobile No" ? "+251 " : "") + value}</Text>   
        </View>
      )
    } 
    console.log(selectedPhaseType, "selectedPhaseType")
    const zoneData =[];

    return (
        <View style={styles.StartMain}>
           <View style={styles.RegisterMainContainer}>
             <TouchableOpacity style={{ left: 0, position: 'absolute', top: 30 }} onPress={() =>{ navigation.navigate("Login") }}>
                   <Image source={ImagePath.Left} />
             </TouchableOpacity>
             <Image source={ImagePath.Logo} style={styles.StartLogo} />
             <Text style={styles.RegisterMainHeader}>{t("Ethiopian Electric Utility")}</Text>
           </View>
           { isPreview ? 
              <ScrollView style={styles.RegisterSubContainer1}>
                <View style={styles.RegisterSub}>
                  <Text style={styles.StartMainHeader}>{t("New Connection Request")}</Text>
                  <Text style={styles.NewServiceHeader}>{t("Personal Details")}</Text>
                  {renderPreview("Partner Category", partnerCategory)}
                  {renderPreview("Partner Type", partnerType)}
                  { selectedPartnerCategory === "1" ? (
                   <>  
                    {renderPreview("Title", titleLabel)}
                    {renderPreview("First Name", firstName)}
                    {renderPreview("Middle Name", middleName)}
                    {renderPreview("Last Name", lastName)}
                    {renderPreview("Please Select Gender", gender)}
                   </>) : (
                   <>
                    {renderPreview("Organization Name1", orgName1)}
                    {renderPreview("Organization Name2", orgName2)}
                    {renderPreview("Organization Name3", orgName3)}
                   </>)}

                  <Text style={[styles.NewServiceHeader, {marginTop: 20}]}>{t("Contact Details")}</Text>
 
                  {renderPreview("Mobile No", mobileNo)}
                  {renderPreview("Email", email)}
                  <Text style={[styles.NewServiceHeader, {marginTop: 20}]}>{t("Address Details")}</Text>

                  {renderPreview("House No", houseNumber)}
                  {renderPreview("Landmark", landmark)}
                  {renderPreview("Region", reg )}
                  {renderPreview("Zone", zone)}
                  {renderPreview("Kebele", kebele)}
                  {renderPreview("CSC Customer Service", selectedCsc[0]?.label )}
                  <Text style={[styles.NewServiceHeader, {marginTop: 20}]}>{t("Service Connection Details")}</Text>
                  {renderPreview("Prepaid/Postpaid", paidOption )}
                  {renderPreview("Phase type", phaseType )}
                  {renderPreview("Connection type", connType )}
                  {renderPreview("Connection start date", moment(connStartDate).format('DD-MM-YYYY') )}
                  {renderPreview("Connection end date", moment(connEndDate).format('DD-MM-YYYY') )}
                  {renderPreview("Install type", insType )}

                  <Text style={[styles.NewServiceHeader, {marginTop: 20}]}>{t("Identity Details") + (" *")}</Text>

                  {renderPreview("ID type", idType )}
                  {renderPreview("ID Number", IDNumber )}
                  <View style = {{ marginTop: 20, width: '80%', display: 'flex', flexDirection: 'row', flex: 1 }}>
                    <Text style={[styles.LoginSubTxt, {flex: 0.6}]}>{t("ID Softcopy Upload") + " 1" +  " *"}</Text>   
                    <Text style={[styles.LoginSubTxt, {flex: 0.1}]}>{":"}</Text> 
                    { selectedImage ?   
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ width: '100%', height: 100, marginBottom: 20, flex: 0.3 }}
                      resizeMode="cover"
                    />  : <Text style={[styles.Margin_10, {color: themeObj.imageNameColor, flex: 0.3}] }>{imageName}</Text>   }           
                  </View>
                  <View style = {{ marginTop: 20, width: '80%', display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.LoginSubTxt, {flex: 0.6}]}>{t("ID Softcopy Upload")+ " 2"}</Text>   
                    <Text style={[styles.LoginSubTxt, {flex: 0.1}]}>{":"}</Text> 
                    { selectedImage2 ?   
                    <Image
                      source={{ uri: selectedImage2 }}
                      style={{ width: '100%', height: 100, marginBottom: 20, flex: 0.3 }}
                      resizeMode="cover"
                    />  : <Text style={[styles.Margin_10, {color: themeObj.imageNameColor, flex: 0.3}] }>{imageName2}</Text>   }           
                  </View>
                  <View>
                  <TouchableOpacity disabled={isLoading} style={[styles.RegisterBtn, { backgroundColor: accountStatus == "VALID CA" || isLoading ? '#DCDCDC' : '#63AA5A', display:'flex', flexDirection: 'row' }]}
                    onPress={() => { 
                      Alert.alert(
                        '',
                        t("Confirm that all fields are filled correctly"),
                        [
                          {
                           text: 'SUBMIT',
                           onPress: () => {
                             if (validateInputs()) { 
                               setLoading(true)
                             } 
                             onPressRegistration()
                          },
                         },
                       { text: 'CANCEL', onPress: () => console.log('Alert Closed') },
                       ]
                      ); 
                    }}>
                    <Text style={[styles.RegisterBtnTxt, { color: accountStatus == "VALID CA" ?  '#FFF' : '#666666' }]}>{t("REGISTER")}</Text>
                  </TouchableOpacity> 
                  {isLoading &&
                   < View style={[styles.NewLoader, { marginLeft: 10, display: 'flex', flexDirection: 'row' }]}>
                     <ActivityIndicator size="small" />
                     <Text style={{ marginLeft: 10}} >Processing....</Text>
                    </View>
                  }  
                  <TouchableOpacity disabled={isLoading} style={[styles.RegisterBtn, { backgroundColor: accountStatus == "VALID CA" || isLoading ? '#DCDCDC' : '#F29037', display:'flex', flexDirection: 'row' }]}
                    onPress={() => {
                      setIsPreview(false);
                    }}
                  >
                    <Text style={[styles.RegisterBtnTxt, { color: accountStatus == "VALID CA" ?  '#FFF' : '#666666' }]}>{t("GO BACK")}</Text>
                  </TouchableOpacity> 
                </View>
              </View>
          </ScrollView>
           :
           <ScrollView style={styles.RegisterSubContainer1}>
           <View style={styles.RegisterSub}>
           <Text style={styles.StartMainHeader}>{t("New Connection Request")}</Text>
           <Text style={styles.NewServiceHeader}>{t("Personal Details")}</Text>
           <View style={styles.Margin_10}>
            <View>
            <Text style={styles.LoginSubTxt}>{t("Partner Category") + (" *")}</Text>
            <Icon onPress= {partnerInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />
            </View>
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the partner category")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={partnerCategoryOptions}
                value={selectedPartnerCategory}
                onChange={item => {
                  setSelectedPartnerCategory(item.value);
                  setPartnerCategory(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidPartnerCategory('');
                    }
                    
                }}               
           />
           <Text style={styles.ErrorMsg}>{invalidPartnerCategory}</Text>
           </View>
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
                    setPartnerType(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidPartnerType('');
                    }
                    
                }}               
           />
           <Text style={styles.ErrorMsg}>{invalidPartnerType}</Text>
           </View>
          
           { selectedPartnerCategory === "1" ? 
             <View>
               <View style={styles.Margin_10}>
                 <Text style={styles.LoginSubTxt}>{t("Title")  + (" *")}</Text>   
                <Dropdown
                 placeholderStyle={styles.RaiseComplaintDropdownTxt}
                 selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                 inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                 iconStyle={styles.RaiseComplaintDropdownTxt}
                 labelField="label"
                 valueField="value"
                 placeholder={t("Select the title")}
                 style={styles.QuesComplaintDropdown}
                 renderItem={renderItem}
                 data={titleOptions}
                 value={title}
                 onChange={item => {
                    setTitle(item.value);
                    setTitleLabel(item.label);
                    if((item.value).length > 0) {
                      setInvalidTitle("")
                    }
                 }}               
               />
               <Text style={styles.ErrorMsg}>{invalidTitle}</Text>
            </View>
              {renderTextInput("First Name", "Enter first name", firstName, setFirstName, invalidFirstName, setInvalidFirstName)}
              {renderTextInput("Middle Name", "Enter middle name", middleName, setMiddleName)}
              {renderTextInput("Last Name", "Enter last name", lastName, setLastName, invalidLastName, setInvalidLastName)}
              <View style={styles.Margin_10}>
               <Text style={styles.LoginSubTxt}>{t("Please Select Gender") + (" *")}</Text>   
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
                    setGender(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidGender("")
                    }
                }}               
               />
               <Text style={styles.ErrorMsg}>{invalidGender}</Text>
              </View>
             </View> : 
             <View>
               {renderTextInput("Organization Name1", "Enter Organization Name1", orgName1, setOrgName1, invalidOrgName1, setInvalidOrgName1)}
               {renderTextInput("Organization Name2", "Enter Organization Name2", orgName2, setOrgName2, invalidOrgName2, setInvalidOrgName2)}
               {renderTextInput("Organization Name3", "Enter Organization Name3", orgName3, setOrgName3, invalidOrgName3, setInvalidOrgName3)}
             </View>
            }
           
 
           <Text style={styles.NewServiceHeader}>{"Contact Details"}</Text>
           {renderTextInput("Mobile No", "Enter mobile no", mobileNo, setMobileNo, invalidMobileNo, setInvalidMobileNo)}
           {renderTextInput("Email", "Enter email", email, setEmail, invalidEmail, setInvalidEmail)}

           <Text style={styles.NewServiceHeader}>{t("Address Details")}</Text>
           {renderTextInput(t("House No"), "Enter House No", houseNumber, setHouseNumber, invalidHouseNumber, setInvalidHouseNumber)}
           {renderTextInput(t("Landmark"), "Enter Landmark", landmark, setLandMark, invalidLandmark, setInvalidLandmark)}
           {/* {renderTextInput(t("Kebele"), "Enter Kebele", kebele, setKebele, invalidKebele, setInvalidKebele)}
           {renderTextInput(t("Zone"), "Enter Zone", zone, setZone, invalidZone, setInvalidZone)} */}
           {/* {renderTextInput(t("Region"), "Enter Region", region, setRegion, invalidRegion, setInvalidRegion)} */}
           <View style={styles.Margin_10}>
               <Text style={styles.LoginSubTxt}>{t("Region") + (" *")}</Text>   
               <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Enter Region")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={data}
                value={region}
                onChange={item => {
                   setRegion(item.value);
                   setReg(item.label);
                   zoneData.push(item.zone)
                   setSelectedZone(...zoneData)
                    if((item.value)?.length > 0 ) {
                      setInvalidRegion("")
                    }
                }}        
               />
               <Text style={styles.ErrorMsg}>{invalidGender}</Text>
             </View>
             <View style={styles.Margin_10}>
               <Text style={styles.LoginSubTxt}>{t("Zone") + (" *")}</Text>   
               <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Enter Zone")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={selectedZone?.length ? selectedZone : []}
                value={zone}
                onChange={item => {
                  setZone(item.value);
                  setSelectedKabele(item.kebele);
                    if((item.value)?.length > 0 ) {
                      setInvalidZone("")
                    }
                }}               
               />
               <Text style={styles.ErrorMsg}>{invalidGender}</Text>
             </View>
             
             <View style={styles.Margin_10}>
               <Text style={styles.LoginSubTxt}>{t("Kebele") + (" *")}</Text>   
               <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Enter Kebele")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={selectedKabele?.length ? selectedKabele : []}
                value={kebele}
                onChange={item => {
                  setKebele(item.value);
                  setSelectedCsc(item.csc)
                    if((item.value)?.length > 0 ) {
                      setInvalidKebele("")
                    }
                }}               
               />
               <Text style={styles.ErrorMsg}>{invalidGender}</Text>
             </View>
             <View style={styles.Margin_10}>
               <Text style={styles.LoginSubTxt}>{t("CSC Customer Service") + (" *")}</Text>   
               <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the CSC Customer Service")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={selectedCsc?.length ? selectedCsc : []}
                value={csc}
                onChange={item => {
                  console.log(item.value, "item---->")
                  setCustService(item.label);
                  setCsc(item.value);
                    if((item.value)?.length > 0 ) {
                      setInvalidCusService("")
                    }  
                }}               
               />
               <Text style={styles.ErrorMsg}>{invalidGender}</Text>
             </View>
           <Text style={styles.NewServiceHeader}>{t("Service Connection Details")}</Text>
           <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("Prepaid/Postpaid") + (" *")}</Text>   
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
                    setPaidOption(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidCategory("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCategory}</Text>
           </View>
           {renderTextInput("Applied load", "Enter Applied load", appliedLoad, setAppliedLoad, invalidAppliedLoad, setInvalidAppliedLoad)}
           <View style={styles.Margin_10} pointerEvents={'none'}>
            <View>
            <Text style={styles.LoginSubTxt}>{t("Phase type") + ("*")}</Text>   
            <Icon onPress= {phaseInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />
            </View>
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
                    setPhaseType(item.label)
                    if( (item.value)?.length > 0 ) {
                      setInvalidPhaseType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidInstallType}</Text>
           </View>
           
           <View style={styles.Margin_10}>
            <View>
            <Text style={styles.LoginSubTxt}>{t("Connection type") + (" *")}</Text>  
            <Icon onPress= {connectionInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} /> 
            </View>
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
                    setConnType(item.label);
                    if((item.value)?.length > 0 ) {
                      setInvalidConnectionType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidConnectionType}</Text>
           </View>
           { selectedConnectionType != 'REG' ? 
           <View>
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
            {show  && selectedConnectionType != "REG"  && (
             <DateTimePicker
               testID="dateTimePicker"
               value={connEndDate}
               mode="date"
               display="default"
               onChange={onChangeEndConnection}
             />
            )}
           </View>
           </View>: null }
          
          <View style={styles.Margin_10}>
          <View>
           <Text style={styles.LoginSubTxt}>{t("Install type") + (" *")}</Text>  
           <Icon onPress= {installTypeInfoMessage} style={styles.infoIcon} name="exclamationcircle" size={10} color={'#666666'} />  
           </View>
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
                   setInsType(item.label);
                   if( (item.value)?.length > 0 ) {
                     setInvalidInstallType("")
                   }
               }}               
          />
           <Text style={styles.ErrorMsg}>{invalidInstallType}</Text>
          </View>
          {/*  <View style={styles.Margin_10}>
            <Text style={styles.LoginSubTxt}>{t("CSC Customer Service") + (" *")}</Text>   
            <Dropdown
                placeholderStyle={styles.RaiseComplaintDropdownTxt}
                selectedTextStyle={styles.RaiseComplaintDropdownTxt}
                inputSearchStyle={styles.RaiseComplaintDropdownTxt}
                iconStyle={styles.RaiseComplaintDropdownTxt}
                labelField="label"
                valueField="value"
                placeholder={t("Select the CSC Customer Service")}
                style={styles.QuesComplaintDropdown}
                renderItem={renderItem}
                data={cscOptions}
                value={custService}
                onChange={item => {
                  setCustService(item.value);
                  setCSCService(item.label);
                  if((item.value)?.length > 0 ) {
                    setInvalidCusService("")
                  }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidCusService}</Text>
           </View> */}
           
           <Text style={styles.NewServiceHeader}>{t("Identity Details") + (" *")}</Text>
           
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
                    setIDType(item.label);
                    if( (item.value)?.length > 0 ) {
                      setInvalidIDType("")
                    }
                }}               
           />
            <Text style={styles.ErrorMsg}>{invalidInstallType}</Text>
           </View>
           {renderTextInput("ID Number", "Enter ID Number", IDNumber, setIDNumber, invalidIDNumber, setInvalidIDNumber)}
           

             <View>
             {imageName && imageName ?
              <View style={styles.NewServiceDocument}> 
                <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName}</Text> 
                <TouchableOpacity style={[ styles.Margin_10, {marginLeft: 5} ]} onPress={() => { setImageName(''); setSelectedImage(''); }}>
                    <Close name="closecircle" size={20} color={"black"}/>
                </TouchableOpacity>
              </View>  
              : <Text style={[styles.ErrorMsg, { marginTop: 20 }]}>{invalidImage}</Text> }
             </View>
           <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption(true) }}>
              <Text style={styles.RegisterBtnTxt}>{t("ID Softcopy Upload") + " 1"}</Text>
              <Upload name={'upload'} size={25}/>
           </TouchableOpacity> 
           {imageName2 && imageName2 ?
              <View style={styles.NewServiceDocument}> 
                <Text style={[styles.Margin_10, {color: themeObj.imageNameColor}] }>{imageName2}</Text> 
                <TouchableOpacity style={[ styles.Margin_10, {marginLeft: 5} ]} onPress={() => { setImageName2(''); setSelectedImage2(''); }}>
                    <Close name="closecircle" size={20} color={"black"}/>
                </TouchableOpacity>
              </View>  
              : null }
           <TouchableOpacity style={styles.RegisterBtnUpload} onPress={() => { setDocumentOption2(true) }}>
              <Text style={styles.RegisterBtnTxt}>{t("ID Softcopy Upload") + " 2"}</Text>
              <Upload name={'upload'} size={25}/>
           </TouchableOpacity> 
           <TouchableOpacity disabled={isLoading} style={[styles.RegisterBtn, { backgroundColor: accountStatus == "VALID CA" || isLoading ? '#DCDCDC' : '#63AA5A', display:'flex', flexDirection: 'row' }]}
            onPress={() => {
              var validate = validateInputs()
              if (validateInputs()) { 
               setIsPreview(true) 
              } 
               
            }}>
              <Text style={[styles.RegisterBtnTxt, { color: accountStatus == "VALID CA" ?  '#FFF' : '#666666' }]}>{t("PREVIEW")}</Text>
            
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
            visible={isDocumentOption2}
            onRequestClose={() => {
              setDocumentOption2(false);
            }}
          >
            <View style={styles.modalMainView}>
               <View style={styles.modalViewCamera}> 
                  <Text style={styles.modalHeaderText}>{t("Select photo / pdf file to upload")}</Text>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption2(false)
                        handleCameraCapture2() 
                    }}
                  >
                    <Camera name={"camera"} size={25} color={"#F29037"}/>
                    <Text style={[styles.modalText, { marginLeft: 10 }]}>{t("Take Photo")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption2(false)
                        handleImagePicker2() 
                    }}
                  >
                    <Gallery name={"photo-library"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("Take from Gallery")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.registrationCameraBtn}
                    onPress={() => { 
                        setDocumentOption2(false)
                        handlePDFUpload2() 
                    }}
                  >
                    <FileUpload name={"file-upload"} size={25} color={"#F29037"}/>
                    <Text  style={[styles.modalText, { marginLeft: 10 }]}>{t("PDF Upload")}</Text>
                  </TouchableOpacity>
               </View> 
            </View>
          </Modal>  
          </ScrollView> }
         
        </View>
    );
};

export default NewRegistration;
