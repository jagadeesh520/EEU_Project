import React, { useEffect,useState } from 'react';
import { View, StyleSheet, Text,Alert } from 'react-native';
// import BackButton from '../components/BackButton';
// import Logo from '../components/Logo';
import { Button, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import { useTranslation } from 'react-i18next';



const MultipleOption = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { t, i18n } = useTranslation();


  const LogoutHandle = () => {
    Alert.alert(
        '',
        t('Are you sure to Logout ?'),
        [
          {
            text: 'Yes', onPress: () =>{
              navigation.navigate('StartScreen'),
              setVisible(false);
            }
          },
          { text: 'No', onPress: () => console.log('OK Pressed') },
        ]
    );
}
    return (
      
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            backgroundColor: 'ffff'
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <>
                <Icon onPress={openMenu} name="dots-three-horizontal" size={30} color={'#666666'}/>
              </>
          }
            >
            {/* <Menu.Item onPress={() => {navigation.navigate('DeActivateScreen'),setVisible(false)}} title="Un-Register" /> */}
            {/* {resetPwd && <Menu.Item onPress={() => {navigation.navigate('ResetPasswordScreen'),setVisible(false)}} title="Forgot Password" />} */}
           <Menu.Item onPress={() => {navigation.navigate('Reset'),setVisible(false)}} title={t("Reset Password")} />
            {/* {showLogout && <Divider />} */}
           <Menu.Item onPress={LogoutHandle} title={t("Logout")} />
           {/*  <Menu.Item onPress={() =>navigation.reset({
                index: 0,
                routes: [{ name: 'StartScreen' }],
              })} title="Logout" /> */}
        </Menu>
        </View>
    );
};
export default MultipleOption;
const styles = StyleSheet.create({
    container: {
    // marginTop:20,
    // alignItems:'center',
    // flex:1,
    backgroundColor: '#fff', // Set the background color of the entire screen
    },
});