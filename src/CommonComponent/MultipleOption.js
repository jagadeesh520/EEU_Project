import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import { useTranslation } from 'react-i18next';
import { useThemes, darkTheme, lightTheme } from './../CommonComponent/Theme';
import useTheme from '../CommonComponent/ThemeProvider';
import { RadioButton } from 'react-native-paper';
import Styles from './../CommonComponent/Styles';

const MultipleOption = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { t, i18n } = useTranslation();
  const themeList = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ];
  const [isThemeOpen, setThemeOpen] = useState(false);
  const { theme, themeObj } = useThemes();
  const [checked, setChecked] = useState(theme);
  const { styles, changeTheme } = Styles();
  const LogoutHandle = () => {
    Alert.alert(
      '',
      t('Are you sure to Logout ?'),
      [
        {
          text: 'Yes', onPress: () => {
            navigation.navigate('Login');
            setVisible(false);
          }
        },
        { text: 'No', onPress: () => console.log('OK Pressed') },
      ]
    );
  }
  const onPressThemeOk = async () => {
    setThemeOpen(!isThemeOpen);
    changeTheme(checked);
  }
  return (

    <View
      style={{
        marginLeft: 10,
        flexDirection: 'row',
        backgroundColor: 'ffff',
      }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <>
            <Icon onPress={openMenu} name="dots-three-horizontal" size={30} color={'#666666'} />
            <Text style={{ color: '#000', fontSize: 12, marginBottom: 20, marginTop: -10 }}>{t("Settings")}</Text>
          </>
        }
      >
        <Menu.Item onPress={() => { navigation.navigate('Reset'); setVisible(false); }} title={t("Change Password")} />
        <Menu.Item onPress={LogoutHandle} title={t("Logout")} />
        <Menu.Item onPress={() => { setThemeOpen(true); }} title={t("Theme")} />
      </Menu>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isThemeOpen}
        onRequestClose={() => {
          setThemeOpen(!isThemeOpen);
        }}
      >
        <View style={styles.modalMainView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose theme</Text>
            <View style={{ marginTop: 10 }}>
              {themeList.map((themeItem) => (
                <View key={themeItem.value} style={styles.radioContainer}>
                  <RadioButton
                    value={themeItem.value}
                    status={checked === themeItem.value ? 'checked' : 'unchecked'}
                    onPress={() => { setChecked(themeItem.value); }}
                  />
                  <Text style={styles.modalText}>{themeItem.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setThemeOpen(!isThemeOpen)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => { onPressThemeOk() }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default MultipleOption;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // Set the background color of the entire screen
  },
});