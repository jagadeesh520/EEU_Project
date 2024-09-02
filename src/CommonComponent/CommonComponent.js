// Import libraries
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ImagePath } from '../CommonComponent/ImagePath';
import Styles from '../CommonComponent/Styles';
import MultipleOption from '../CommonComponent/MultipleOption';
import { useTranslation } from 'react-i18next';

// Define the CommonHeader component
const CommonHeader = ({ navigation, title, onBackPress }) => {
  const { theme, styles, changeTheme } = Styles();
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.CommonHeaderMain}>
      <View style={styles.CommonHeaderBackBtn}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={ImagePath.LeftArrow} />
        </TouchableOpacity>
        <Text style={styles.CommonHeaderTxt}>{t(title)}</Text>
      </View> 
      <MultipleOption navigation={navigation} />
    </View>
  );
};

export default CommonHeader;
