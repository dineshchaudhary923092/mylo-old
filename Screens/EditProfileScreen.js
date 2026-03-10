import React, { useState, useRef, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import CountryPicker from 'react-native-country-picker-modal';
import CodeInput from 'react-native-confirmation-code-input';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

let deviceType = getDeviceType();

const EditProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const { colors } = useTheme();

    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse, 
        _getUserData, 
        userData, 
        setUserData, 
        isData
    ] = useAxios();  

    const isFocused = useIsFocused();

    var regName = /^[A-za-z\s']{3,}$/gm;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regNum = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    const [data, setData] = useState({
		email: '',
        phone: '',
        fullname: '',
		isNameValid: true,
		isEmailValid: true,
		isPhoneValid: true,
    });
    const [showOTP, setShowOTP] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [showActivity, setShowActivity] = useState(false);

    const otpbox = useRef();

    const fullnameInputChange = (value) => {
        if (regName.test(value) === true){
            setData({
                ...data,
                fullname: value,
                isNameValid: true
            })
        }
        else{
            setData({
                ...data,
                fullname: value,
                isNameValid: false
            })
        }
	}

    const phoneInputChange = (value) => {
        if (regNum.test(value) === true && value.length >= 6){
            setData({
                ...data,
                phone: value,
                isPhoneValid: true
            })
        }
        else{
            setData({
                ...data,
                phone: value,
                isPhoneValid: false
            })
        }
    }
    
    const [countryCode, setCountryCode] = useState('IN')
    const [callingCode, setCallingCode] = useState('91')
    
    const onSelect = (country) => {
        setCountryCode(country.cca2)
        setCallingCode(country.callingCode)
    }

    useEffect(() => {
        if(responseType === 'updateTypeOne') {
            if(responseData.error === 1) {
                setShowOTP(false);
                setShowActivity(false);
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: 'Home' },
                        { name: "Profile" }
                    ],
                })
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'updateTypeTwo') {
            if(responseData.error === 1) {
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: 'Home' },
                        { name: "Profile" }
                    ],
                })
            } else {
                otpbox.current.clear();
            }
            setResponse(false);
            setShowActivity(false);
        }
        if(responseType === 'pEditOtp') {
            console.log(responseData);
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
            setShowActivity(false);
        }
    }, [responseData]);

    useEffect(() => {
        setData({
            ...data,
            email: 'dummy@example.com',
            phone: '1234567890',
            fullname: 'Dummy User',
        })
    }, [])

    const getOTP = async(data, callingCode) => {
        if(data.isNameValid && data.isPhoneValid) {
            setOTPData({
                error: 1,
                data: {
                    hash: 'dummy',
                    timestamp: '11111'
                }
            });
            setShowOTP(true);
        } else {
            showMessage({
                message: 'Some of the fields you entered are not valid',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'GTWalsheimProMedium'
                }
            });
        }
    }

    const updateProfile = async(data, OTP, OTPData, userToken, callingCode, countryCode) => {
        setShowActivity(true);
        setTimeout(() => {
            setShowOTP(false);
            setShowActivity(false);
            navigation.reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: "Profile" }
                ],
            });
            showMessage({
                message: "Profile updated successfully (Dummy)",
                type: "success",
                style: {
                    backgroundColor: Colors.dark
                },
                titleStyle: {
                    color: Colors.primary,
                    fontFamily: 'GTWalsheimProMedium'
                }
            });
        }, 500);
    }

    return (
        <View style={styles.Container}>
            <StatusBarComponent bgcolor="transparent" barStyle="light-content" />
            
            {/* Background gradient */}
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={styles.GradientBg}
            />

            {/* Subtle green massive radial glow overlay */}
            <View style={styles.GlowBlob} pointerEvents="none">
                <Svg width="500" height="500">
                    <Defs>
                        <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.15" />
                            <Stop offset="35%" stopColor="#7FFFD4" stopOpacity="0.08" />
                            <Stop offset="70%" stopColor="#7FFFD4" stopOpacity="0.03" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>

            <Animatable.View animation="fadeIn" duration={800} style={{flex: 1}}>
                {
                    showOTP ?
                    <View style={styles.OtpMainWrapper}>
                        <Animatable.View animation="fadeInUp" duration={600} style={styles.otparea}>
                            <View style={styles.OtpHeaderIconWrap}>
                                <View style={styles.OtpIconInner}>
                                    <Feather name="shield" size={32} color={colors.primary} />
                                </View>
                            </View>

                            <Text style={styles.OtpTitle}>Verify Change</Text>
                            <Text style={styles.OtpSubtitle}>Enter the 4-digit code sent to your phone to confirm your profile updates</Text>
                            
                            <View style={styles.CodeInputWrapper}>
                                <CodeInput
                                    ref={otpbox}
                                    codeLength={4}
                                    secureTextEntry={false}
                                    activeColor={colors.primary}
                                    inactiveColor="rgba(255,255,255,0.08)"
                                    autoFocus={true}
                                    ignoreCase={true}
                                    inputPosition='center'
                                    size={EStyleSheet.value('64rem')}
                                    onFulfill={(code) => {
                                        setShowActivity(true);
                                        setTimeout(() => {
                                            updateProfile(data, code, OTPData, 'dummy-token', callingCode, countryCode);
                                        }, 1000)
                                    }}
                                    codeInputStyle={styles.otpInputStyle}
                                    containerStyle={{ height: EStyleSheet.value('90rem') }}
                                /> 
                            </View>
                            
                            {
                                showActivity ? (
                                    <View style={{ height: 100, justifyContent: 'center' }}>
                                        <ActivityIndicator 
                                            size='large' 
                                            color={colors.primary}
                                        />
                                    </View>
                                ) : (
                                    <Animatable.View animation="fadeIn" delay={300} style={styles.OtpActions}>
                                        <TouchableOpacity 
                                            style={styles.ResendBtn}
                                            onPress={() => getOTP(data, callingCode)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.ResendText}>
                                                Didn't receive code? <Text style={{ color: colors.primary, fontFamily: 'GTWalsheimProBold' }}>Resend</Text>
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity 
                                            style={styles.OtpBackBtn}
                                            onPress={() => setShowOTP(false)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.6)" />
                                            <Text style={styles.OtpBackText}>Back to Edit</Text>
                                        </TouchableOpacity>
                                    </Animatable.View>
                                )
                            }
                        </Animatable.View>
                    </View>
                    :
                    <>
                        {/* Unified Header */}
                        <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                            <TouchableOpacity 
                                onPress={() => navigation.goBack()} 
                                style={styles.BackBtnContainer}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <AntDesign name="arrowleft" size={22} color="rgba(255,255,255,0.85)" />
                            </TouchableOpacity>
                            <Text style={styles.HeaderTitle}>Edit Profile</Text>
                            <View style={{ width: EStyleSheet.value('40rem') }} />
                        </View>

                        <KeyboardAwareScrollView 
                            style={{ flex: 1 }} 
                            contentContainerStyle={{ paddingTop: insets.top + (deviceType === 'Tablet' ? 65 : 78), paddingBottom: 40 }}
                            keyboardShouldPersistTaps='always' 
                            enableOnAndroid={true} 
                            enableAutomaticScroll={true}
                            showsVerticalScrollIndicator={false}
                        >
                            <Animatable.View animation="fadeInUp" delay={200} style={styles.FormContainer}>
                                <View style={styles.FormInputStyle}>
                                    <Text style={styles.FormInputLabelStyle}>Display Name</Text>
                                    <View style={[styles.FormInputFieldStyle, !data.isNameValid && { borderColor: '#ff4444' }]}>
                                        <Feather name="user" size={18} color={colors.primary} style={styles.IconStyle} />
                                        <TextInput
                                            autoCapitalize='words'
                                            autoCorrect={false}
                                            style={styles.FormTextInputStyle}
                                            placeholder="Enter your name"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            keyboardAppearance="dark"
                                            value={data.fullname}
                                            onChangeText={(value) => fullnameInputChange(value)}
                                        />
                                        {data.isNameValid && data.fullname.length > 0 && (
                                            <Octicons name="verified" size={15} color={colors.primary} />
                                        )}
                                    </View>
                                </View>

                                <View style={styles.FormInputStyle}>
                                    <Text style={styles.FormInputLabelStyle}>Phone Number</Text>
                                    <View style={[styles.FormInputFieldStyle, !data.isPhoneValid && { borderColor: '#ff4444' }]}>
                                        <View style={styles.CountryPickerWrap}>
                                            <CountryPicker
                                                {...{
                                                    countryCode,
                                                    withFilter: true,
                                                    withFlag: true,
                                                    withCallingCode: true,
                                                    onSelect,
                                                }}
                                                theme={{
                                                    backgroundColor: '#1E1F23',
                                                    primaryColor: '#fff',
                                                    primaryColorVariant: '#7FFFD4',
                                                    onBackgroundTextColor: '#fff',
                                                    fontSize: 16,
                                                }}
                                            />
                                            <Text style={styles.CountryCodeText}>+{callingCode}</Text>
                                        </View>
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={styles.FormTextInputStyle}
                                            placeholder="Phone number"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            keyboardAppearance="dark"
                                            keyboardType="phone-pad"
                                            value={data.phone}
                                            onChangeText={(value) => phoneInputChange(value)}
                                        />
                                        {data.isPhoneValid && data.phone.length > 0 && (
                                            <Octicons name="verified" size={15} color={colors.primary} />
                                        )}
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    style={styles.SubmitBtn}
                                    onPress={() => getOTP(data, callingCode)}
                                >
                                    <Text style={styles.SubmitBtnText}>Save Changes</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </KeyboardAwareScrollView>
                    </>
                }
            </Animatable.View>
        </View>
    );
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    GradientBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    GlowBlob: {
        position: 'absolute',
        top: -150,
        left: '50%',
        marginLeft: -250,
        width: 500,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '20rem',
        paddingBottom: '15rem',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    HeaderTitle: {
        fontSize: '18rem',
        fontFamily: 'GTWalsheimProBold',
        letterSpacing: '0.3rem',
        color: '#FFFFFF',
    },
    BackBtnContainer: {
        width: '40rem',
        height: '40rem',
        borderRadius: '20rem',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
    },
    FormContainer: {
        paddingHorizontal: '24rem',
    },
    FormInputStyle: {
        marginBottom: '24rem',
    },
    FormInputLabelStyle: {
        fontSize: '11rem',
        fontFamily: 'GTWalsheimProBold',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '8rem',
        marginLeft: '4rem',
        textTransform: 'uppercase',
        letterSpacing: '1rem',
    },
    FormInputFieldStyle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        height: '52rem',
        borderRadius: '16rem',
        paddingHorizontal: '16rem',
        alignItems: 'center',
    },
    FormTextInputStyle: {
        flex: 1,
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProMedium',
        color: '#FFFFFF',
        height: '100%',
        marginLeft: '10rem',
    },
    CountryCodeText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        marginLeft: '4rem',
    },
    CountryPickerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '12rem',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    SubmitBtn: {
        height: '52rem',
        borderRadius: '26rem',
        backgroundColor: '#7FFFD4',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '12rem',
        shadowColor: '#7FFFD4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    SubmitBtnText: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#09090B',
        letterSpacing: '0.3rem',
    },
    // OTP Styles
    OtpMainWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '24rem',
    },
    otparea: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '32rem',
        padding: '30rem',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    OtpHeaderIconWrap: {
        width: '80rem',
        height: '80rem',
        borderRadius: '40rem',
        backgroundColor: 'rgba(127,255,212,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24rem',
    },
    OtpIconInner: {
        width: '60rem',
        height: '60rem',
        borderRadius: '30rem',
        backgroundColor: 'rgba(127,255,212,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    OtpTitle: {
        fontSize: '26rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        marginBottom: '12rem',
        textAlign: 'center',
    },
    OtpSubtitle: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: '22rem',
        marginBottom: '32rem',
    },
    CodeInputWrapper: {
        width: '100%',
        height: '80rem',
        marginBottom: '10rem',
    },
    otpInputStyle: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: '16rem',
        fontSize: '28rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#7FFFD4',
    },
    OtpActions: {
        width: '100%',
        alignItems: 'center',
    },
    ResendBtn: {
        paddingVertical: '12rem',
        marginBottom: '20rem',
    },
    ResendText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.6)',
    },
    OtpBackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '12rem',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    OtpBackText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProBold',
        color: 'rgba(255,255,255,0.6)',
        marginLeft: '8rem',
    },
    IconStyle: {
        opacity: 0.6,
    },
})

export default EditProfileScreen;