//import liraries
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Styles from './../CommonComponent/Styles';
import { ImagePath } from './../CommonComponent/ImagePath';
import { useThemes } from './../CommonComponent/Theme';
import {
    widthPercentageToDP as responsiveWidth,
    heightPercentageToDP as responsiveHeight,
  } from 'react-native-responsive-screen';

  const baseScreenHeight = 844;
  const baseScreenWidth = 420;
  export const wp = (dimension) =>
    responsiveWidth(`${(dimension / baseScreenWidth) * 100}%`);
  export const hp = (dimension) =>
    responsiveHeight(`${(dimension / baseScreenHeight) * 100}%`);
  
// create a component
const StartScreen = ({navigation}) => {
  const {theme, styles, changeTheme} = Styles()
    return (
        <View style={styles.StartMain}>
            <View style={styles.StartSubContainer}>
               <Image source={ImagePath.Logo}/>
               <Text style={styles.StartMainHeader}>{"Ethiopian Electric Utility"}</Text>
            </View>   
            <View style={styles.StartSubContainer2}>
               <Image source={ImagePath.SliderLogo}/>
               <Text style={styles.StartSubTxt}>{"We made it easy for you!"}</Text>
               <Text style={[styles.StartSubTxt2, { marginTop: wp(10) }]}>{"Deal with your electric bills online"}</Text>
               <Text style={styles.StartSubTxt2}>{"and pay from any location."}</Text>
               {/* <TouchableOpacity style={{ marginTop: wp(30) }}>
                 <Image source={ImagePath.FilterIcon}/>
               </TouchableOpacity> */}
               <TouchableOpacity style={styles.RegisterBtn}
                  onPress={() => { navigation.navigate("Login") }}
               >
                 <Text style={styles.RegisterBtnTxt}>{"GET STARTED"}</Text>
               </TouchableOpacity> 
            </View>
        </View>
    );
};
 
export default StartScreen;
