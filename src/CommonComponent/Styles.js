import React, { useState, useEffect } from 'react';
import { useThemes, lightTheme, darkTheme } from './Theme';
import {
    widthPercentageToDP as responsiveWidth,
    heightPercentageToDP as responsiveHeight,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseScreenHeight = 844;
const baseScreenWidth = 420;
export const wp = (dimension) =>
    responsiveWidth(`${(dimension / baseScreenWidth) * 100}%`);
export const hp = (dimension) =>
    responsiveHeight(`${(dimension / baseScreenHeight) * 100}%`);

const Styles = () => {
    const { theme, themeObj, changeTheme } = useThemes();
    const fullWidth = wp(100); // Get 100% width
    const fullHeight = hp(100); // Get 100% height

    const topBarBackgroundcolor = themeObj.topBarBackgroundcolor;
    const textColorSecondary = themeObj.textColorSecondary;
    

    const styles = {
        barStyle: themeObj.content,
        statusBarColor: themeObj.statusBarColor,
        // Dashboard Page Styles
        DashBoardMain: {
            height: fullHeight,
            backgroundColor: themeObj.themeBackgroundColor,
        },
        DashboardProContainer: {
            // backgroundColor: topBarBackgroundcolor,
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'

        },
        LanguageContainer: {
            // backgroundColor: topBarBackgroundcolor,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: wp(10)
        },
        DashBoradProfileText: {
            color: textColorSecondary,
            fontSize: wp(14),
            marginLeft: wp(10)
        },
        DashboardProfileImage: {
            height: hp(48),
            width: wp(48)
        },
        DashboardProfileNotification: {
            height: hp(32),
            width: wp(32)
        },
        DashboardNotificationContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        DashboardProfileFlag: {
            height: hp(25),
            width: wp(36)
        },
        DashBoradWelcomText: {
            color: '#D30000',
            fontSize: wp(14),
            marginLeft: wp(10)
        },
        DashBoradProfileName: {
            color: textColorSecondary,
            fontSize: wp(16),
            marginLeft: wp(10),
            fontWeight: '500'
        },
        DashBoradProfilAccText: {
            color: textColorSecondary,
            fontSize: wp(14),
        },
        DashboardMainContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },

        DashBoardSubHeader: {
            padding: wp(20),
            backgroundColor: "#FFF",
            borderRadius: wp(15),
            marginTop: wp(20),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        DashboardQuickLinkCon: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        DashboardViewCon: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        DashboardQuickLinkImage: {
            height: hp(30),
            width: wp(30)
        },
        DashboardQuickLnkText: {
            fontSize: wp(10),
            color: '#666666',
            marginTop: wp(10)
        },
        DashboardSubHeaderTxt: {
            fontSize: wp(16),
            fontWeight: 'bold',
            color: '#535353'
        },
        DashboardSubHeaderPaidTxt: {
            fontSize: wp(16),
            fontWeight: 'bold',
            color: '#62AA40'
        },
        DashboardAccContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#5FA756',
            padding: wp(20)
        },
        DashboardProSubContainer: {
            display: 'flex',
            flexDirection: 'row'
        },
        DashboardViewallTxt: {
            color: '#666666',
            fontSize: wp(14),
            marginRight: wp(10)
        },
        DashboardViewAllBtnTxt: {
            color: '#000',
            fontSize: wp(14),
            fontWeight: '500'
        },
        DashboardViewAllBtn: {
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#C9C9C9',
            borderRadius: wp(20),
            paddingVertical: wp(10),
            paddingHorizontal: wp(20)
        },
        DashboardDownArrow: {
            height: hp(8),
            width: wp(15)
        },
        DashboardSubHeaderTxt1: {
            color: '#666666',
            fontSize: wp(14)
        },
        DashboardHeaderTxt1: {
            color: '#666666',
            fontSize: wp(18),
            fontWeight: 'bold'
        },
        DashboardDueTxt: {
            color: '#E74A4B',
            fontSize: wp(14),
            fontWeight: '500'
        },
        DashboardUSDTxt: {
            color: '#666666',
            fontSize: wp(18),
            fontWeight: '500',
            marginTop: wp(10)
        },
        DashboardPayBillBtn: {
            backgroundColor: '#F29037', 
            // backgroundColor: '#E8E9EB',
            borderRadius: wp(20),
            paddingVertical: wp(10),
            paddingHorizontal: wp(15),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        DashboardPayBillBtnTxt: {
            color: '#FFF',
            fontSize: wp(14),
            fontWeight: '500',
            marginRight: wp(10)

        },
        RegisterBtn: {
            backgroundColor: '#63AA5A',
            borderRadius: wp(25),
            paddingVertical: wp(15),
            width: wp(300),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(20),
            marginBottom: wp(20)
        },
        PaymentBtn: {
            backgroundColor: '#63AA5A',
            borderRadius: wp(25),
            paddingVertical: wp(10),
            width: wp(150),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(20),
            marginBottom: wp(20)
        },
        RegisterBtnUpload: {
            backgroundColor: '#F29037',
            borderRadius: wp(25),
            paddingVertical: wp(5),
            width: wp(300),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: wp(10),
            marginBottom: wp(20)
        },
        RegisterBtnTxt: {
            color: '#FFF',
            fontSize: wp(16),
            fontWeight: '500',
            marginRight: wp(10)
        },
        LoginCreateBtn: {
            backgroundColor: '#FFFF',
            borderRadius: wp(25),
            paddingVertical: wp(15),
            width: wp(300),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: wp(1),
            borderColor: 'lightgray',
            marginTop: 20
        },
        LoginCreateTxt: {
            color: '#666666',
            fontSize: wp(16),
            fontWeight: '500'
        },
        LoginLockButton: { position: 'absolute', left: wp(300), display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
        RegisterLockButton: {  position: 'absolute', left: wp(250), display: 'flex', alignItems: 'flex-center', justifyContent: 'flex-end', alignSelf: 'center' },

        DashboardPaymentCon: {
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            backgroundColor: "#FFF",
            borderRadius: wp(15),
        },

        DashboardPaymentInvoice: {
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            backgroundColor: "#FFF",
            borderRadius: wp(15),
        },

        DashboardPaymentSub: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            paddingVertical: wp(10)
        },
        DashboardPayBillMain: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: wp(10)
        },
        LoginContainer: { display: "flex", flexDirection: "row", backgroundColor: "white", justifyContent: "center", alignItems: 'center', alignSelf: 'center', borderRadius: wp(3), paddingHorizontal: wp(12), width: wp(380) },

        // Start Page
        StartMain: {
            height: '100%',
            backgroundColor: '#E5EEE0',
            display: 'flex',
            flexDirection: 'column'
        },
        StartSubContainer: {
            height: '30%',
            backgroundColor: '#E5EEE0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        StartSubContainer1: {
            height: '75%',
            backgroundColor: '#FFF',
            borderWidth: wp(2),
            borderColor: '#FFF',
            borderTopLeftRadius: wp(50),
            borderTopRightRadius: wp(50)
        },
        StartSub: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        StartMainHeader: {
            color: '#121212',
            fontSize: wp(20),
            fontWeight: 'bold',
            marginVertical: wp(20)
        },
        StartGetBtn: {
            backgroundColor: '#F29037',
            borderRadius: wp(20),
            paddingVertical: wp(15),
            paddingHorizontal: wp(70),
            marginTop: wp(40)

        },
        StartLogo: {
            height: hp(44),
            width: wp(44)
        },
        NewServiceHeader: { fontSize: wp(20), fontWeight: 'bold' },
        ResetMainContainer: {
            height: '25%',
            backgroundColor: '#E5EEE0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        NewServiceDocument: {
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        ResetSubContainer1: {
            height: '75%',
            backgroundColor: '#FFFFFF',
            borderWidth: wp(2),
            borderColor: '#FFF',
            borderTopLeftRadius: wp(50),
            borderTopRightRadius: wp(50),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        RegisterMainContainer: {
            height: '15%',
            backgroundColor: '#E5EEE0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        RegisterSubContainer1: {
            height: '85%',
            backgroundColor: '#FFFFFF',
            borderWidth: wp(2),
            borderColor: '#FFF',
            borderTopLeftRadius: wp(50),
            borderTopRightRadius: wp(50),
        },
        RegisterSub: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        RegisterMainHeader: {
            color: '#121212',
            fontSize: wp(16),
            fontWeight: 'bold',
            marginTop: wp(16)
        },
        StartGetTxt: {
            color: '#FFF',
            fontSize: wp(16),
            fontWeight: 'bold'
        },
        StartSubContainer2: {
            height: '70%',
            backgroundColor: '#FFFFFF',
            borderWidth: wp(2),
            borderColor: '#FFF',
            borderTopLeftRadius: wp(50),
            borderTopRightRadius: wp(50),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        StartSubTxt: {
            fontSize: wp(20),
            fontWeight: 'bold',
            color: '#121212',
            marginTop: wp(20)
        },
        StartSubTxt2: {
            fontSize: wp(20),
            color: '#666666'
        },
        ErrorMsg: { color: 'red', fontSize: wp(12), marginTop: wp(5) },
        // Common Profile Header
        CommonHeaderMain: {
            backgroundColor: themeObj.headerBackgroundColor,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: wp(20)
        },
        CommonHeaderBackBtn: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        CommonHeaderTxt: {
            fontSize: wp(16),
            color: '#FFF',
            fontWeight: '500',
            marginLeft: wp(10)
        },

        // Bill History
        BillHistoryMain: {
            backgroundColor: '#fff',
            padding: wp(20),
            borderRadius: wp(10),
            marginTop: wp(10)
        },
        BillHistoryTitle: {
            fontSize: wp(12),
            color: '#212121'
        },
        BillHistoryTxt: {
            fontSize: wp(14),
            color: '#212121',
            fontWeight: 'bold',
            marginTop: wp(10)
        },
        BillHistorySub: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        BillHistoryLine: {
            marginTop: wp(30),
            borderBottomWidth: 1,
            borderBottomColor: '#D9D9D9'
        },
        BillHistorySub2: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: wp(20)
        },
        BillHistorySubCon: {
            display: 'flex',
            flex: 0.5
        },
        BillHistorySub2Title: {
            fontSize: wp(12),
            color: '#666666'
        },
        BillHistorySub2Txt: {
            fontSize: wp(12),
            color: '#212121',
            marginTop: wp(10)
        },
        BillHistoryMainShare: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: wp(20)
        },
        BillHistoryShareTxt: {
            fontSize: wp(14),
            color: '#666666',
            marginRight: wp(10)
        },

        //Bill Due
        BillDueMain: {
            backgroundColor: '#fff',
            padding: wp(20),
            borderRadius: wp(10),
            margin: wp(20)
        },
        BillDueTitle: {
            fontSize: wp(12),
            color: '#666666'
        },
        BillDueTxt: {
            fontSize: wp(14),
            color: '#212121',
            marginTop: wp(10)
        },
        BillDueSubCon: {
            display: 'flex',
            flex: 0.5
        },
        BillDuePayBillBtn: {
            backgroundColor: '#F29037',
            borderRadius: wp(20),
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: wp(200)
        },
        BillDuePayBillBtnTxt: {
            color: '#FFF',
            fontSize: wp(14),
            fontWeight: '500'
        },
        BillDuePayBillBtnTxt1: {
            color: '#F29037', 
            fontSize: wp(12), 
            fontWeight: 'bold',
            marginTop: wp(10)
        },    
        BillDuePayBillMain: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: wp(30)
        },
        UnpaidModalTitle: {
            fontSize: wp(15),
            color: '#666666',
            marginTop: wp(10)
        },
        UnpaidModalText: {
            fontSize: wp(14),
            color: '#212121',
            marginTop: wp(10)
        },
        unpaidModalContainer: {
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginTop: wp(10) 
        },
        // Complaints
        ComplaintsMain: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        },
        ComplaintsWaterMark: {
            width: wp(75),
            height: hp(71),
            marginLeft: wp(15)
        },
        ComplaintsCommonTxt: {
            fontSize: wp(16),
            color: '#666666',
            marginTop: wp(10)
        },
        ComplaintsBtn: {
            backgroundColor: '#FFF',
            borderRadius: wp(20),
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            marginTop: wp(20)
        },
        ComplaintsBtnTxt: {
            color: '#000',
            fontSize: wp(16),
            fontWeight: '500'
        },
        RaiseComplaintMain: {
            margin: wp(20),
            borderRadius: wp(10),
            backgroundColor: '#FFF',
            padding: wp(20)

        },
        RaiseComplaintDropdownTxt: {
            fontSize: wp(12),
            color: '#666666',
            display: 'flex',
            flexWrap: 'wrap'
        },
        RaiseComplaintItem: {
            padding: wp(17),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        RaiseComplaintDropdown: {
            height: hp(50),
            backgroundColor: 'white',
            borderColor: 'lightgrey',
            borderRadius: wp(5),
            width: '100%',
            padding: wp(10),
            marginTop: wp(20),
            borderWidth: wp(1),
            borderColor: '#D9D9D9',
            color: '#666666'
        },
        QuesComplaintDropdown: {
            height: hp(50),
            backgroundColor: 'white',
            borderColor: 'lightgrey',
            borderRadius: wp(5),
            width: wp(300),
            padding: wp(6),
            marginTop: wp(20),
            borderWidth: wp(1),
            borderColor: '#D9D9D9',
            color: '#666666'
        },
        LanguageDropdown: {
            height: hp(30),
            backgroundColor: 'white',
            borderColor: 'lightgrey',
            borderRadius: wp(5),
            width: wp(150),
            padding: wp(10),
            borderWidth: wp(1),
            borderColor: '#D9D9D9',
            color: '#666666',
            marginRight: wp(10)
        },

        RaiseComplaintBtn: {
            backgroundColor: '#F29037',
            borderRadius: wp(30),
            paddingVertical: wp(15),
            paddingHorizontal: wp(50),
            marginTop: wp(20)
        },
        RaiseComplaintBtnTxt: {
            color: '#FFF',
            fontSize: wp(16),
            fontWeight: '500'
        },
        ResetCancelBtn1: {
            backgroundColor: '#FFFF',
            borderRadius: wp(25),
            paddingVertical: wp(15),
            paddingHorizontal: wp(50),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: wp(1),
            borderColor: 'lightgray',
            marginTop: wp(20)

        },
        ComplaintsBtn1: {
            backgroundColor: '#FFF',
            borderRadius: wp(30),
            paddingVertical: wp(15),
            paddingHorizontal: wp(50),
            marginTop: wp(20)
        },
        ComplaintsBtnTxt1: {
            color: '#000',
            fontSize: wp(16),
            fontWeight: '500'
        },
        RaiseComplaintTxt: {
            fontSize: wp(14),
            color: '#666666'
        },
        RaiseComplaintMain2: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: wp(20)
        },
        ComplaintListMain: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        ComplaintListSub: {
            backgroundColor: '#FFF',
            borderRadius: 10,
            padding: wp(20),
            marginTop: wp(20),
            marginBottom: wp(20),
        },
        ComplaintListSubHeader: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: wp(20),
            borderBottomWidth: 1,
            borderBottomColor: '#D9D9D9'
        },
        ComplaintListTitle: {
            fontSize: wp(16),
            color: '#535353',
            fontWeight: 'bold'
        },
        ComplaintListNewBntMain: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        ComplaintListHeader: {
            fontSize: wp(16),
            fontWeight: 'bold',
            color: '#212121',
            flexWrap: 'wrap'
        },
        ComplaintListHeaderValue: {
            fontSize: wp(16),
            fontWeight: '400',
            color: '#666666',
            flexWrap: 'wrap'
        },
        ComplaintListDesMain: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            paddingVertical: wp(20),
            borderBottomWidth: 1,
            borderBottomColor: '#D9D9D9'
        },
        ComplaintListBtn: {
            display: 'flex',
            flexDirection: 'row',
            height: wp(70),
            padding: wp(10)
        },
        ComplaintListEditBtn: {
            flex: 0.5,
            alignItems: 'center',
            justifyContent: 'center'
        },
        ComplaintListEditTxt: {
            fontSize: wp(14),
            color: '#666666'
        },
        ComplaintListDeleteTxt: {
            fontSize: wp(14),
            color: '#E74A4B'
        },
        FooterContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF',
            width: '100%',
            // bottom: 0,
            // position: 'absolute',
            margin: 10
        },
        FooterText: {
            fontSize: 12,
            color: '#666666'
        },
        LoginAccTxt: {
            fontSize: 14,
            color: '#666666'
        },
        LoginResetTxt: {
            fontSize: 14,
            fontWeight: '500',
            color: '#F29037'
        },
        LoginTextInput: {
            width: wp(300),
            fontSize: wp(14),
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 5,
            marginTop: wp(10),
            paddingLeft: wp(10),
            color: '#666666'
        },
        LoginSubTxt: {
            fontSize: wp(14),
            color: '#333333',
        },
        LoginSubTxt1: {
            fontSize: wp(14),
            color: '#333333',
            fontWeight: '500'
        },
        Margin_10: {
            marginTop: wp(10)
        },
        Margin_20: {
            marginTop: wp(20)
        },
        Margin_30: {
            marginTop: wp(30)
        },
        Margin_40: {
            marginTop: wp(40)
        },
        NotFound: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'lightgrey',
            alignSelf: 'center',
            marginTop: wp(20)
        },
        NewLoader: {
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            color: 'lightgrey',
            alignSelf: 'center',
        },
        Loader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'lightgrey',
            alignSelf: 'center',
            marginTop: wp(20)
        },
        callButton: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: wp(40),
            marginRight: wp(10)
        },
        CallIcon: { height: wp(40), width: wp(40) },
        CallText: { fontSize: wp(12) },

        FAQbackicon: {
            position: 'absolute',
            left: wp(10),
        },
        FAQcontainer: {
            padding: wp(20)
        },
        FAQfaqItem: {
            marginBottom: wp(20),
            borderWidth: wp(1),
            borderColor: '#ccc',
            borderRadius: wp(8),
            padding: wp(16),
        },
        FAQquestion: {
            fontSize: wp(18),
            fontWeight: 'bold',
            marginBottom: wp(8),
            color: '#000'
        },
        FAQanswer: {
            fontSize: wp(16),
            color: '#666666'
        },
        FAQimage: {
            width: wp(24),
            height: wp(24),
            left: wp(300),
        },
        FAQheaderMain: {
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: wp(20)
        },
        FAQtitle: {
            fontSize: wp(24),
            fontWeight: 'bold',
            margin: wp(10),
            color: '#333',
            alignSelf: "center"
        },
        FAQMain: { padding: wp(20), marginBottom: wp(140) },
        Contactcontainer: {
            padding: wp(20)
        },
        Contacttitle: {
            fontSize: wp(24),
            fontWeight: 'bold',
            marginBottom: wp(20),
            color: '#333',
            alignSelf: "center",
            marginTop: wp(10)
        },
        ContactaddressContainer: {
            backgroundColor: '#fff',
            padding: wp(20),
            borderRadius: wp(10),
            borderWidth: wp(1),
            borderColor: '#ccc',
            // width: '100%',
            marginBottom: wp(20),
            margin: wp(20)
        },
        Contactlabel: {
            fontSize: wp(18),
            fontWeight: '600',
            marginTop: wp(20),
            color: '#333',
        },
        ContactaddressText: {
            fontSize: wp(15),
            color: '#666',
            marginTop: wp(15)
        },
        Contactimage: {
            width: wp(24),
            height: wp(24),
        },
        ContactheaderMain: {
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: wp(20)
        },
        ContactheaderText: {
            fontSize: wp(16),
            color: '#666',
            fontWeight: 'bold',
            marginTop: wp(20)
        },
        Contactbackicon: {
            position: 'absolute',
            left: wp(10),
        },
        linkButton: { alignSelf: 'flex-end', padding: wp(3), borderBottomWidth: wp(2), borderBottomColor: '#0096FF' },
        linkButtonText: { color: '#0096FF', fontSize: wp(12) },
        ThemeButton: { marginRight: wp(20) },
        modalMainView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        modalView: {
            backgroundColor: 'white',
            borderRadius: wp(20),
            padding: wp(35),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: wp(280),
            height: wp(280)

        },
        unpaidModalView: {
            backgroundColor: 'white',
            borderRadius: wp(20),
            padding: wp(35),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: wp(380),

        },
        modalViewCamera: {
            backgroundColor: 'white',
            borderRadius: wp(20),
            padding: wp(35),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: wp(300),
            height: wp(250)
        },
        modalHeaderText: {
            color: '#666666',
            fontSize: wp(18),
            fontWeight: '500',
            marginLeft: wp(10)
        },
        modalText: {
            color: '#666666',
            fontSize: wp(15)
        },
        RememberMeText: { marginRight: wp(10), color: '#666666' },
        radioContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: wp(10),
        },
        buttonRow: {
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginTop: wp(10)
        },
        cancelButton: {
            backgroundColor: '#f44336',
            padding: wp(10),
            borderRadius: wp(5),
            marginRight: wp(10),
        },
        okButton: {
            backgroundColor: '#4CAF50',
            paddingVertical: wp(10),
            paddingHorizontal: wp(20),
            borderRadius: wp(5),
        },
        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        registrationCameraBtn: { 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: wp(20) 
        },
        switchContainer: { 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center' 
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: wp(20),
            borderRadius: wp(5),
            width: '80%',
        },
        modalHeader: {
            fontSize: wp(15),
            marginBottom: wp(10),
            color: '#666666'
        },
        rememberItem: {
            padding: wp(15),
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        },
        modalScrollContainer: {
            maxHeight: hp(250),
        },
        flagBackground: {
            flex: 1,
            resizeMode: 'cover', // Adjusts the image to cover the entire background
            justifyContent: 'center',
        }
    };

    return { theme, styles, changeTheme }
};

export default Styles;
