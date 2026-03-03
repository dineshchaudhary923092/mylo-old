import React, { useState, useContext, useRef } from 'react';
import { Text, View, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import StatusBarComponent from '../Components/StatusbarComponent';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { showMessage } from "react-native-flash-message";
import { Colors } from '../Constants/Colors';
import CodeInput from 'react-native-confirmation-code-input';
import CountryPicker from 'react-native-country-picker-modal';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

let deviceType = getDeviceType();

const ForgotPasswordScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const [data, setData] = useState({
        phone: '',
        password: '',
        confirm_password: '',
        isPhoneValid: true,
        isPasswordValid: true,
        isConfirmPasswordValid: true,
        secureTextEntry: true,
        confirmSecureTextEntry: true,
    });

    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Reset
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [countryCode, setCountryCode] = useState('IN');
    const [callingCode, setCallingCode] = useState('91');

    const otpbox = useRef();

    const phoneInputChange = (value) => {
        setData({
            ...data,
            phone: value,
            isPhoneValid: value.length >= 6
        })
    }

    const passwordInputChange = (value) => {
        setData({
            ...data,
            password: value,
            isPasswordValid: value.length >= 6
        })
    }

    const confirmPasswordInputChange = (value) => {
        setData({
            ...data,
            confirm_password: value,
            isConfirmPasswordValid: value === data.password
        })
    }

    const handleSecureTextEntry = () => {
        setData({ ...data, secureTextEntry: !data.secureTextEntry });
    }

    const handleConfirmSecureTextEntry = () => {
        setData({ ...data, confirmSecureTextEntry: !data.confirmSecureTextEntry });
    }

    const onSelect = (country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode);
    }

    const getOTP = () => {
        setButtonDisabled(true);
        setTimeout(() => {
            setStep(2);
            setButtonDisabled(false);
        }, 1000);
    }

    const verifyOTP = (code) => {
        setShowActivity(true);
        setTimeout(() => {
            setStep(3);
            setShowActivity(false);
        }, 1500);
    }

    const loginReset = () => {
        setButtonDisabled(true);
        setTimeout(() => {
            showMessage({ message: "Password reset successful!", type: "success" });
            navigation.navigate('Login');
            setButtonDisabled(false);
        }, 1500);
    }

    const renderStep1 = () => (
        <Animatable.View animation="fadeIn" duration={800}>
            <Animatable.View animation="fadeInDown" delay={200}>
                <Text style={[styles.TextLg, {color: colors.text}]}>Forgot Password?</Text>
                <Text style={[styles.TextSm, {color: colors.light}]}>No worries! Enter your phone number below to receive a reset code.</Text>
            </Animatable.View>

            <View style={styles.FormContainer}>
                <Animatable.View animation="fadeInUp" delay={400} style={styles.FormInputStyle}>
                    <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Phone Number</Text>
                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isPhoneValid ? colors.lighter : '#ff4444'}]}>
                        <CountryPicker
                            {...{ countryCode, withFilter: true, withFlag: true, withCallingCode: true, onSelect }}
                            theme={theme.dark ? { backgroundColor: '#16171B', primaryColor: '#fff' } : {}}
                        />
                        <Text style={[styles.CountryCodeText, {color: colors.text}]}>+{callingCode}</Text>
                        <TextInput
                            style={[styles.FormTextInputStyle, {color: colors.text}]}
                            placeholder="Enter phone number"
                            placeholderTextColor={colors.light}
                            keyboardType="phone-pad"
                            keyboardAppearance="dark"
                            onChangeText={phoneInputChange}
                        />
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={600} style={{marginTop: 20}}>
                    <TouchableOpacity 
                        style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                        onPress={getOTP}
                        disabled={buttonDisabled}
                    >
                        {buttonDisabled ? <ActivityIndicator color={Colors.dark} /> : <Text style={styles.SubmitBtnText}>Send Code</Text>}
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </Animatable.View>
    );

    const renderStep2 = () => (
        <Animatable.View animation="fadeIn" duration={800} style={styles.otparea}>
            <Text style={[styles.TextLg, {textAlign: 'center', color: colors.text}]}>Verify Code</Text>
            <Text style={[styles.TextSm, {textAlign: 'center', color: colors.light, marginBottom: 30}]}>Enter the 4-digit code sent to +{callingCode} {data.phone}</Text>
            
            <CodeInput
                ref={otpbox}
                codeLength={4}
                activeColor={colors.primary}
                inactiveColor={colors.lighter}
                autoFocus={true}
                inputPosition='center'
                size={55}
                onFulfill={verifyOTP}
                codeInputStyle={styles.otpInputStyle}
                containerStyle={{height: 100}}
            /> 

            {showActivity && <ActivityIndicator size='large' color={colors.primary} style={{marginTop: 40}} />}

            {!showActivity && (
                <View style={{alignItems: 'center', marginTop: 40}}>
                    <TouchableOpacity onPress={() => setStep(1)} style={styles.BackBtn}>
                        <AntDesign name="arrowleft" size={20} color={colors.text} />
                        <Text style={[styles.BackBtnText, {color: colors.text}]}>Change Number</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animatable.View>
    );

    const renderStep3 = () => (
        <Animatable.View animation="fadeIn" duration={800}>
            <Animatable.View animation="fadeInDown" delay={200}>
                <Text style={[styles.TextLg, {color: colors.text}]}>Reset Password</Text>
                <Text style={[styles.TextSm, {color: colors.light}]}>Create a strong new password for your account.</Text>
            </Animatable.View>

            <View style={styles.FormContainer}>
                <Animatable.View animation="fadeInUp" delay={400} style={styles.FormInputStyle}>
                    <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>New Password</Text>
                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isPasswordValid ? colors.lighter : '#ff4444'}]}>
                        <MaterialIcons name="lock-outline" size={20} color={colors.pText} style={styles.IconStyle} />
                        <TextInput
                            secureTextEntry={data.secureTextEntry}
                            style={[styles.FormTextInputStyle, {color: colors.text}]}
                            placeholder="New password"
                            placeholderTextColor={colors.light}
                            keyboardAppearance="dark"
                            onChangeText={passwordInputChange}
                        />
                        <TouchableOpacity onPress={handleSecureTextEntry}>
                            <MaterialCommunityIcons name={data.secureTextEntry ? "eye-off" : "eye"} size={20} color={colors.pText} />
                        </TouchableOpacity>
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={600} style={styles.FormInputStyle}>
                    <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Confirm Password</Text>
                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isConfirmPasswordValid ? colors.lighter : '#ff4444'}]}>
                        <MaterialIcons name="lock-outline" size={20} color={colors.pText} style={styles.IconStyle} />
                        <TextInput
                            secureTextEntry={data.confirmSecureTextEntry}
                            style={[styles.FormTextInputStyle, {color: colors.text}]}
                            placeholder="Confirm new password"
                            placeholderTextColor={colors.light}
                            keyboardAppearance="dark"
                            onChangeText={confirmPasswordInputChange}
                        />
                        <TouchableOpacity onPress={handleConfirmSecureTextEntry}>
                            <MaterialCommunityIcons name={data.confirmSecureTextEntry ? "eye-off" : "eye"} size={20} color={colors.pText} />
                        </TouchableOpacity>
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={800} style={{marginTop: 20}}>
                    <TouchableOpacity 
                        style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                        onPress={loginReset}
                        disabled={buttonDisabled}
                    >
                        {buttonDisabled ? <ActivityIndicator color={Colors.dark} /> : <Text style={styles.SubmitBtnText}>Reset Password</Text>}
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </Animatable.View>
    );

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <StatusBarComponent bgColor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <KeyboardAwareScrollView style={styles.ContainerStyle} contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.InnerContainer}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    <Animatable.View animation="fadeInUp" delay={1000} style={styles.BackToLoginArea}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.BackToLoginText, {color: colors.text}]}>
                                Remembered? <Text style={{fontFamily: 'GTWalsheimProBold', color: colors.primary}}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = EStyleSheet.create({
    ContainerStyle: { flex: 1 },
    InnerContainer: { paddingHorizontal: '25rem', paddingVertical: '60rem', justifyContent: 'center' },
    TextLg: { fontSize: '32rem', fontFamily: 'GTWalsheimProBold', marginBottom: '8rem' },
    TextSm: { fontSize: '15rem', fontFamily: 'GTWalsheimProLight', marginBottom: '40rem' },
    FormContainer: { width: '100%' },
    FormInputStyle: { marginBottom: '20rem' },
    FormInputLabelStyle: { fontSize: '14rem', fontFamily: 'GTWalsheimProMedium', marginBottom: '10rem', opacity: 0.9 },
    FormInputFieldStyle: { flexDirection: 'row', borderWidth: '1rem', height: '52rem', borderRadius: '14rem', paddingHorizontal: '15rem', alignItems: 'center' },
    FormTextInputStyle: { flex: 1, height: '100%', fontSize: '15rem', fontFamily: 'GTWalsheimProRegular' },
    IconStyle: { marginRight: '12rem', opacity: 0.7 },
    CountryCodeText: { marginLeft: '10rem', marginRight: '10rem', fontSize: '15rem', fontFamily: 'GTWalsheimProMedium' },
    SubmitBtn: { height: '55rem', borderRadius: '16rem', alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    SubmitBtnText: { fontSize: '17rem', fontFamily: 'GTWalsheimProBold', color: Colors.dark },
    otparea: { flex: 1, paddingTop: '20rem' },
    otpInputStyle: { borderRadius: '12rem', borderWidth: '1.5rem', fontSize: '24rem', fontFamily: 'GTWalsheimProBold', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    BackBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: '10rem', paddingHorizontal: '20rem', borderRadius: '25rem', borderWidth: '1rem', borderColor: 'rgba(255,255,255,0.1)' },
    BackBtnText: { marginLeft: '8rem', fontSize: '16rem', fontFamily: 'GTWalsheimProMedium' },
    BackToLoginArea: { marginTop: '40rem', alignItems: 'center' },
    BackToLoginText: { fontSize: '15rem', fontFamily: 'GTWalsheimProRegular' },
});

export default ForgotPasswordScreen;
