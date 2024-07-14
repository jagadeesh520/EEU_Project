import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import BackIcon from 'react-native-vector-icons/Ionicons';
import Styles from '../CommonComponent/Styles';
import CommonHeader from '../CommonComponent/CommonComponent';
import { useTranslation } from 'react-i18next';

const FAQModal = ({ navigation }) => {
    const {theme, styles, changeTheme} = Styles()
    const { t, i18n } = useTranslation();
    const [faqData, setFQA] = React.useState([
        { question: 'Which is a common cause of electrical fires ?', answer: 'Overloading circuits' },
        { question: 'What does the term “overloading” mean in electrical safety ?', answer: "Using too many electrical devices simultaneously" },
        { question: 'Which is NOT a recommended practice for preventing electrical accidents ?', answer: 'Using damaged electrical cords' },
        { question: 'What should you do if you experience an electrical shock ?', answer: 'Remove the person from the electrical source' },
        { question: 'What is the purpose of a circuit breaker in an electrical system', answer: 'To prevent overloading and short circuits' },
        { question: 'What does the term “arc flash” refer to in electrical safety ?', answer: 'sudden burst of light and heat during an electrical fault' },
        { question: 'Which type of fire extinguisher is suitable for electrical fires ?', answer: 'CO2 extinguisher' },
        { question: 'What is the recommended distance to maintain between electrical equipment and water sources ?', answer: '3 feet' },
        { question: 'What does the term “electrical insulation” mean ?', answer: 'The use of protective materials to prevent electrical shocks' },
        { question: 'Which one should be used to disconnect power to electrical equipment before servicing ?', answer: 'Circuit breaker' }
    ]);
    const onBackPress = () => {
        navigation.goBack("BottomTab")
    }
    return (
        <ScrollView style={styles.DashBoardMain}>
            <CommonHeader title={t("FAQ")} onBackPress ={onBackPress}/>
            {/* <View style={styles.FAQheaderMain}>
                <TouchableOpacity
                    style={styles.FAQbackicon}
                    onPress={() => { navigation.navigate('Dashboard') }}>
                    <BackIcon name="arrow-back-circle" size={25}></BackIcon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Dashboard') }}>
                    <Image
                        style={styles.image}
                        source={require('../assets/home-icons.png')}
                    />
                </TouchableOpacity>

            </View> */}
            {/* <View style={styles.FAQheaderMain}> */}
            <Text style={styles.FAQtitle}>FAQ</Text>
            <ScrollView style={styles.FAQMain}>
                {faqData.map((faqItem, index) => (
                    <View key={index} style={styles.FAQfaqItem}>
                        <Text style={styles.FAQquestion}>{ "Q: " + t(faqItem.question)}</Text>
                        <Text style={styles.FAQanswer}>{"A: " + t(faqItem.answer)}</Text>
                    </View>
                ))}
            </ScrollView>
            {/* </View> */}
        </ScrollView>
    );
};

export default FAQModal;