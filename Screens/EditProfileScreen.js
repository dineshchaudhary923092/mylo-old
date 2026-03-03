import React, { useState, useRef, useEffect } from 'react';
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
                !isData ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator color={colors.pText} size="large" />
                </View> :
                <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps='always' enableOnAndroid={true} enableAutomaticScroll={true}>
                    <View style={{
                        flex: 1, 
                        justifyContent: showOTP ? 'center' : 'flex-start',
                        paddingBottom: EStyleSheet.value('50rem')
                    }}>
                        {
                            showOTP ?
                            <View style={styles.otparea}>
                                <Text style={[styles.TextLg, {textAlign: 'center', color: colors.pText}]}>Enter OTP</Text>
                                <CodeInput
                                    ref={otpbox}
                                    codeLength={4}
                                    secureTextEntry
                                    activeColor={colors.pText}
                                    inactiveColor={colors.light}
                                    autoFocus={true}
                                    ignoreCase={true}
                                    inputPosition='center'
                                    size={
                                        deviceType === 'Tablet' ? 
                                        EStyleSheet.value('32rem') :
                                        EStyleSheet.value('50rem')
                                    }
                                    onFulfill={(code) => {
                                        setShowActivity(true);
                                        setTimeout(() => {
                                            updateProfile(data, code, OTPData, 'dummy-token', callingCode, countryCode);
                                        }, 1000)
                                    }}
                                    containerStyle={{ 
                                        marginBottom: 
                                        deviceType === 'Tablet' ? 
                                        EStyleSheet.value('32rem') :
                                        EStyleSheet.value('50rem')
                                    }}
                                    codeInputStyle={{ borderWidth: EStyleSheet.value('1rem') }}
                                /> 
                                {
                                    showActivity ?
                                    <ActivityIndicator 
                                        size='large' 
                                        color={colors.pText}
                                        style={{
                                            marginTop: deviceType === 'Tablet' ? 
                                            EStyleSheet.value('24rem') :
                                            EStyleSheet.value('30rem')
                                        }} 
                                    /> : null
                                }
                                <TouchableOpacity 
                                    style={styles.ExtraButton}
                                    onPress={() => getOTP(data, callingCode)}
                                >
                                    <Text style={[styles.ExtraButtonText, {color: colors.pText}]}>
                                        If you didn't receive a code! 
                                    </Text>
                                    <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold, {color: colors.pText}]}>
                                        resend
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.otpBack}
                                    onPress={() => setShowOTP(false)}
                                >
                                    <AntDesign 
                                        name='arrowleft' 
                                        size={
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('14rem') :
                                            EStyleSheet.value('24rem')
                                        } 
                                        color={colors.black} 
                                    />
                                </TouchableOpacity>
                            </View>
                            :
                            <>
                                <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                                    <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Edit Profile</Text>
                                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                                        <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.FormContainer}>
                                    <View style={styles.FormInputStyle}>
                                        <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Full Name</Text>
                                        <View style={[styles.FormInputFieldStyle, {borderColor: theme.dark ? colors.primary : colors.light}]}>
                                            <SimpleLineIcons 
                                                name="user" 
                                                size={
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('10rem') :
                                                    EStyleSheet.value('16rem')
                                                } 
                                                color={colors.pText} 
                                                style={{
                                                    width: deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('16rem') :
                                                    EStyleSheet.value('25rem'),  
                                                    alignSelf: 'center'
                                                }} 
                                            />
                                            <TextInput
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                                placeholder="fullname"
                                                placeholderTextColor={colors.light}
                                                keyboardAppearance="dark"
                                                value={data.fullname}
                                                onChangeText={(value) => fullnameInputChange(value)}
                                            />
                                            {
                                                data.isNameValid ? 
                                                <View
                                                    style={{alignSelf: 'center'}}
                                                >
                                                        <Octicons 
                                                            name="verified" 
                                                            size={
                                                                deviceType === 'Tablet' ? 
                                                                EStyleSheet.value('10rem') :
                                                                EStyleSheet.value('15rem')
                                                            } 
                                                            color={colors.pText}
                                                        />
                                                </View>
                                                : null
                                            }
                                        </View>
                                        {
                                            data.isNameValid ? null :
                                            <Text style={[styles.errorText, {color: colors.text}]}>Please enter first name and last name</Text>
                                        }
                                    </View>
                                    {/* <View style={styles.FormInputStyle}>
                                        <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Email</Text>
                                        <View style={[styles.FormInputFieldStyle, {borderColor: theme.dark ? colors.primary : colors.light}]}>
                                            <MaterialIcons 
                                                name="mail-outline" 
                                                size={
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('12rem') :
                                                    EStyleSheet.value('18rem')
                                                } 
                                                color={colors.pText} 
                                                style={{
                                                    width: deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('16rem') :
                                                    EStyleSheet.value('25rem'),  
                                                    alignSelf: 'center'
                                                }} 
                                            />
                                            <TextInput
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                                keyboardAppearance="dark"
                                                placeholder="email"
                                                placeholderTextColor={colors.light}
                                                keyboardAppearance="dark"
                                                value={data.email}
                                                onChangeText={(value) => emailInputChange(value)}
                                            />
                                            {
                                                data.isEmailValid ? 
                                                <View
                                                    style={{alignSelf: 'center'}}
                                                >
                                                        <Octicons 
                                                            name="verified" 
                                                            size={
                                                                deviceType === 'Tablet' ? 
                                                                EStyleSheet.value('10rem') :
                                                                EStyleSheet.value('15rem')
                                                            } 
                                                            color={colors.pText}
                                                        />
                                                </View>
                                                : null
                                            }
                                        </View>
                                        {
                                            data.isEmailValid ? null :
                                            <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid email</Text>
                                        }
                                    </View> */}
                                    <View style={styles.FormInputStyle}>
                                        <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Phone</Text>
                                        <View style={[styles.FormInputFieldStyle, {borderColor: theme.dark ? colors.primary : colors.light}]}>
                                            <CountryPicker
                                                {...{
                                                    countryCode,
                                                    withFilter,
                                                    withFlag,
                                                    withCountryNameButton,
                                                    withAlphaFilter,
                                                    withCallingCode,
                                                    withEmoji,
                                                    onSelect,
                                                }}
                                                visible = {false}
                                            />
                                            <Text style={[styles.CountryCodeText, {color: colors.pText}]}>+{callingCode}</Text>
                                            <TextInput
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                                placeholder="phone"
                                                placeholderTextColor={colors.light}
                                                keyboardAppearance="dark"
                                                keyboardType="phone-pad"
                                                value={data.phone}
                                                onChangeText={(value) => phoneInputChange(value)}
                                            />
                                            {
                                                data.isPhoneValid ? 
                                                <View
                                                    style={{alignSelf: 'center'}}
                                                >
                                                        <Octicons 
                                                            name="verified" 
                                                            size={
                                                                deviceType === 'Tablet' ? 
                                                                EStyleSheet.value('10rem') :
                                                                EStyleSheet.value('15rem')
                                                            } 
                                                            color={colors.pText}
                                                        />
                                                </View>
                                                : null
                                            }
                                        </View>
                                        {
                                            data.isPhoneValid ? null :
                                            <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid phone number</Text>
                                        }
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.SubmitContainer}
                                        onPress={() => getOTP(data, callingCode)}
                                    >
                                        <Text style={styles.SubmitText}>Update profile</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                    </View>
                </KeyboardAwareScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '46rem' : '50rem',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 3,
        elevation: 2,
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProMedium',
        color: Colors.dark,
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    TextLg: {
        fontSize: deviceType === 'Tablet' ? '24rem' : '35rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    FormContainer: {
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputStyle: {
		marginBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
	},
	FormInputLabelStyle: {
		fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
		fontFamily: 'GTWalsheimProLight',
        paddingBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
	},
	FormInputFieldStyle: {
		flexDirection: 'row',
		borderWidth: '1rem',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '14rem',
        alignItems: 'center'
    },
    FormTextInputStyle: {
        flex: 1,
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
    },
    CountryCodeText: {
        paddingRight: deviceType === 'Tablet' ? '2.8rem' : '4rem',
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '9rem' : '15rem',
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProMedium',
    },
    otpBack: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        width: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        alignSelf: 'center',
        marginTop: deviceType === 'Tablet' ? '32rem' : '50rem',
    },
    ExtraButton: {
        marginTop: deviceType === 'Tablet' ? '18rem' : '30rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ExtraButtonText: {
        textAlign: 'center',
        fontFamily: 'GTWalsheimProLight',
        fontSize: deviceType === 'Tablet' ? '10rem' : '15rem',
    },
    ExtraButtonTextBold:  {
        fontFamily: 'GTWalsheimProMedium', 
        paddingLeft: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '7.5rem' : '13rem',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: '2rem',
        paddingTop: deviceType === 'Tablet' ? '2.8rem' : '4rem',
    }
})

export default EditProfileScreen;