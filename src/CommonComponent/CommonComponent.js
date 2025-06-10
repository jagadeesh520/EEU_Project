// Import libraries
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ImagePath } from '../CommonComponent/ImagePath';
import Styles from '../CommonComponent/Styles';
import MultipleOption from '../CommonComponent/MultipleOption';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-native-element-dropdown';
// Define the CommonHeader component
const CommonHeader = ({ navigation, title, onBackPress }) => {
  const { theme, styles, changeTheme } = Styles();
  const { t, i18n } = useTranslation();
  const languageOption = [
    { label: "Eng",  value:"Eng" },
    { label: "አማርኛ", value:"አማርኛ"}
  ];
  const [ selectedLang, setSelectedLang] = useState('');
  const renderItems = (item) => {
    return (
      <View style={styles.RaiseComplaintItem}>
        <Text style={styles.RaiseComplaintDropdownTxt}>{item.label}</Text>
      </View>
    );
  };
<<<<<<< HEAD

  return (
    <View style={[styles.CommonHeaderMain, { alignItems: 'flex-start' }]}>
=======
  console.log(title, "title-text amharic")
  return (
    <View>
        <View style={styles.commonSubContainer}>
        <Image source={ImagePath.Logo} style={{ width: 20, height: 20 }} />
        <Text style={styles.StartMainHeader}>{t("Ethiopian Electric Utility")}</Text>
      </View>
    <View style={styles.CommonHeaderMain}>
     <View style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
>>>>>>> development
      <View style={styles.CommonHeaderBackBtn}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={ImagePath.LeftArrow} />
        </TouchableOpacity>
        <Text style={styles.CommonHeaderTxt}>{t(title)}</Text>
      </View> 
<<<<<<< HEAD
      <View style={[styles.LanguageContainer, { flexDirection: 'column', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
        <MultipleOption navigation={navigation} />
         <Dropdown
=======
      <View style={[styles.LanguageContainer]}>
        <MultipleOption navigation={navigation} />
      </View>  
      </View> 
      <View style={{ display: 'flex', flexDirection: 'row', flex:1, justifyContent: 'flex-end'}}>
        <Dropdown
>>>>>>> development
             placeholderStyle={styles.RaiseComplaintDropdownTxt}
             selectedTextStyle={styles.RaiseComplaintDropdownTxt}
             inputSearchStyle={styles.RaiseComplaintDropdownTxt}
             iconStyle={styles.RaiseComplaintDropdownTxt}
             labelField="label"
             valueField="value"
             placeholder={t("Language")}
<<<<<<< HEAD
             style={[styles.LanguageDropdown, { marginTop: -10 }]}
=======
             style={[styles.LanguageDropdown]}
>>>>>>> development
             renderItem={renderItems}
             data={languageOption}
             value={selectedLang}
             onChange={item => {
               setSelectedLang(item.value);
               i18n.changeLanguage(item.value)
             }}               
<<<<<<< HEAD
        />
      </View>  
      </View> 
     
=======
          />
          { title === "Service Request Status" || title === "የአገልግሎት ጥያቄ ሁኔታ" ? 
          <TouchableOpacity
           style={styles.ComplaintsBtn}
           onPress={() => {
            navigation.navigate('ServiceRequest');
           }}
          >
           <View style={styles.ComplaintListNewBntMain}>
             <Image source={ImagePath.PlusIcon} />
             <Text style={[styles.ComplaintsBtnTxt, {marginLeft: 10}]}>{t('NEW')}</Text>
           </View>
          </TouchableOpacity> : null }
        </View>
        </View> 
    
      </View>

>>>>>>> development
  );
};

export default CommonHeader;
