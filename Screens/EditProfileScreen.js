import React, { useState, useRef, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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

let deviceType = getDeviceType();

const EditProfileScreen = ({ navigation }) => {

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

    // const emailInputChange = (value) => {
    //     if (regEmail.test(value) === true){
    //         setData({
    //             ...data,
    //             email: value, 
    //             isEmailValid: true
    //         })
    //     }
    //     else{
    //         setData({
    //             ...data,
    //             email: value, 
    //             isEmailValid: false
    //         })
    //     }
	// }

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
    const [withCountryNameButton, setWithCountryNameButton] = useState(
      false,
    )
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(true)
    const [withCallingCode, setWithCallingCode] = useState(true)
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
            phone: '+1234567890',
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
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            {
                <Animatable.View animation="fadeIn" duration={800} style={{flex: 1}}>
                    <KeyboardAwareScrollView 
                        style={{flex: 1}} 
                        keyboardShouldPersistTaps='always' 
                        enableOnAndroid={true} 
                        enableAutomaticScroll={true}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{
                            flex: 1, 
                            justifyContent: showOTP ? 'center' : 'flex-start',
                        }}>
                            {
                                showOTP ?
                                <Animatable.View animation="zoomIn" duration={500} style={styles.otparea}>
                                    <Text style={[styles.TextLg, {textAlign: 'center', color: colors.text}]}>Verify Change</Text>
                                    <Text style={[styles.TextSm, {textAlign: 'center', color: colors.light, marginBottom: 30}]}>Enter the code sent to your phone</Text>
                                    
                                    <CodeInput
                                        ref={otpbox}
                                        codeLength={4}
                                        secureTextEntry={false}
                                        activeColor={colors.primary}
                                        inactiveColor={colors.lighter}
                                        autoFocus={true}
                                        ignoreCase={true}
                                        inputPosition='center'
                                        size={55}
                                        onFulfill={(code) => {
                                            setShowActivity(true);
                                            setTimeout(() => {
                                                updateProfile(data, code, OTPData, 'dummy-token', callingCode, countryCode);
                                            }, 1000)
                                        }}
                                        codeInputStyle={styles.otpInputStyle}
                                        containerStyle={{height: 100}}
                                    /> 
                                    
                                    {
                                        showActivity && (
                                            <ActivityIndicator 
                                                size='large' 
                                                color={colors.primary}
                                                style={{marginTop: 40}} 
                                            />
                                        )
                                    }

                                    {!showActivity && (
                                        <View style={{alignItems: 'center', marginTop: 40}}>
                                            <TouchableOpacity 
                                                style={styles.ExtraButton}
                                                onPress={() => getOTP(data, callingCode)}
                                            >
                                                <Text style={[styles.ExtraButtonText, {color: colors.text}]}>
                                                    Didn't receive code? <Text style={{color: colors.primary, fontFamily: 'GTWalsheimProBold'}}>Resend</Text>
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={[styles.otpBack, {borderColor: colors.lighter}]}
                                                onPress={() => setShowOTP(false)}
                                            >
                                                <AntDesign name="arrowleft" size={22} color={colors.text} />
                                                <Text style={[styles.otpBackText, {color: colors.text}]}>Back</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </Animatable.View>
                                :
                                <>
                                    <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                                        <Text style={[styles.TopBarBtnText, {color: colors.text}]}>Edit Profile</Text>
                                        <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.BackBtnContainer}>
                                            <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.text}]} />
                                        </TouchableOpacity>
                                    </View>

                                    <Animatable.View animation="fadeInUp" delay={200} style={styles.FormContainer}>
                                        <View style={styles.FormInputStyle}>
                                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Display Name</Text>
                                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isNameValid ? colors.lighter : '#ff4444'}]}>
                                                <SimpleLineIcons name="user" size={18} color={colors.pText} style={styles.IconStyle} />
                                                <TextInput
                                                    autoCapitalize='words'
                                                    autoCorrect={false}
                                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                                    placeholder="Enter your name"
                                                    placeholderTextColor={colors.light}
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
                                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Phone Number</Text>
                                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isPhoneValid ? colors.lighter : '#ff4444'}]}>
                                                <CountryPicker
                                                    {...{
                                                        countryCode,
                                                        withFilter: true,
                                                        withFlag: true,
                                                        withCallingCode: true,
                                                        onSelect,
                                                    }}
                                                    theme={theme.dark ? {
                                                        backgroundColor: '#16171B',
                                                        primaryColor: '#fff',
                                                        primaryColorVariant: '#7FFFD4',
                                                    } : {}}
                                                />
                                                <Text style={[styles.CountryCodeText, {color: colors.text}]}>+{callingCode}</Text>
                                                <TextInput
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                                    placeholder="Phone number"
                                                    placeholderTextColor={colors.light}
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
                                            style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                                            onPress={() => getOTP(data, callingCode)}
                                        >
                                            <Text style={[styles.SubmitBtnText, {color: Colors.dark}]}>Save Changes</Text>
                                        </TouchableOpacity>
                                    </Animatable.View>
                                </>
                            }
                        </View>
                    </KeyboardAwareScrollView>
                </Animatable.View>
            }
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
    },
    TopBarStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '25rem',
        height: '80rem',
        paddingTop: '20rem',
        justifyContent: 'center',
    },
    TopBarBtnText: {
        fontSize: '20rem',
        fontFamily: 'GTWalsheimProBold',
    },
    BackBtnContainer: {
        position: 'absolute',
        left: '20rem',
        top: '38rem',
    },
    BackBtn: {
        fontSize: '28rem',
    },
    TextLg: {
        fontSize: '32rem',
        fontFamily: 'GTWalsheimProBold',
        marginBottom: '10rem',
    },
    TextSm: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    FormContainer: {
        marginTop: '30rem',
        paddingHorizontal: '25rem',
    },
    FormInputStyle: {
		marginBottom: '25rem',
	},
	FormInputLabelStyle: {
		fontSize: '15rem',
		fontFamily: 'GTWalsheimProMedium',
        marginBottom: '10rem',
        opacity: 0.8,
	},
	FormInputFieldStyle: {
		flexDirection: 'row',
		borderWidth: '1.5rem',
        height: '60rem',
        borderRadius: '18rem',
        paddingHorizontal: '18rem',
        alignItems: 'center'
    },
    FormTextInputStyle: {
        flex: 1,
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProMedium',
        height: '100%',
        marginLeft: '10rem',
    },
    IconStyle: {
        opacity: 0.6,
    },
    CountryCodeText: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProBold',
        marginLeft: '10rem',
        paddingRight: '5rem',
    },
    SubmitBtn: {
        height: '60rem',
        borderRadius: '18rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20rem',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    SubmitBtnText: {
        fontSize: '18rem',
        fontFamily: 'GTWalsheimProBold',
    },
    otparea: {
        paddingHorizontal: '30rem',
        paddingTop: '60rem',
    },
    otpInputStyle: {
        borderWidth: '2rem',
        borderRadius: '12rem',
        fontSize: '22rem',
        fontFamily: 'GTWalsheimProBold',
    },
    otpBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '30rem',
        paddingVertical: '10rem',
        paddingHorizontal: '20rem',
        borderRadius: '12rem',
        borderWidth: '1rem',
    },
    otpBackText: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProBold',
        marginLeft: '10rem',
    },
    ExtraButton: {
        marginTop: '20rem',
    },
    ExtraButtonText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
    }
})

export default EditProfileScreen;