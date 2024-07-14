//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ImagePath } from '../CommonComponent/ImagePath';
import Styles from '../CommonComponent/Styles';
import MultipleOption from '../CommonComponent/MultipleOption'; 

  
// create a component
const CommonHeader = (props) => {
  const {theme, styles, changeTheme} = Styles()
    return (
        <View style={styles.CommonHeaderMain}>
          <View style={styles.CommonHeaderBackBtn}>
           <TouchableOpacity onPress={props.onBackPress}>
              <Image source={ImagePath.LeftArrow}/>
           </TouchableOpacity>
           <Text style={styles.CommonHeaderTxt}>{props.title}</Text>
          </View> 
          <MultipleOption/>
        </View>
    );
};
export default CommonHeader;
