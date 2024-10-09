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

  return (
    <View style={[styles.CommonHeaderMain, { alignItems: 'flex-start' }]}>
      <View style={styles.CommonHeaderBackBtn}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={ImagePath.LeftArrow} />
        </TouchableOpacity>
        <Text style={styles.CommonHeaderTxt}>{t(title)}</Text>
      </View> 
      <View style={[styles.LanguageContainer, { flexDirection: 'column', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
        <MultipleOption navigation={navigation} />
         <Dropdown
             placeholderStyle={styles.RaiseComplaintDropdownTxt}
             selectedTextStyle={styles.RaiseComplaintDropdownTxt}
             inputSearchStyle={styles.RaiseComplaintDropdownTxt}
             iconStyle={styles.RaiseComplaintDropdownTxt}
             labelField="label"
             valueField="value"
             placeholder={t("Language")}
             style={[styles.LanguageDropdown, { marginTop: -10 }]}
             renderItem={renderItems}
             data={languageOption}
             value={selectedLang}
             onChange={item => {
               setSelectedLang(item.value);
               i18n.changeLanguage(item.value)
             }}               
        />
      </View>  
      </View> 
     
  );
};

export default CommonHeader;
