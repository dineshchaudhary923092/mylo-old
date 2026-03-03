import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, ScrollView } from 'react-native';
import StatusBarComponent from '../Components/StatusbarComponent'
import {Colors} from '../Constants/Colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { showMessage } from "react-native-flash-message";
import CountryPicker from 'react-native-country-picker-modal';
import CodeInput from 'react-native-confirmation-code-input';
import { AuthContext } from '../Components/Context'
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

let deviceType = getDeviceType();

const SignUpScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { register, latitude, longitude } = useContext(AuthContext);
    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse
    ] = useAxios();  

    console.log(latitude);
    console.log(longitude);

    var regName = /^[A-za-z\s']{3,}$/gm;
    var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var regNum = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    const [data, setData] = useState({
		// email: '',
        password: '',
        phone: '',
        fullname: '',
		isNameValid: true,
		// isEmailValid: true,
		isPhoneValid: true,
		isPasswordValid: true,
	    secureTextEntry: true
    });
    const [showOTP, setShowOTP] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [showActivity, setShowActivity] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const otpbox = useRef();

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
    //             isEmailValid: false
    //         })
    //     }
	// }

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
    
    const passwordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                password: value,
                isPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                password: value,
                isPasswordValid: false
            })
        }
    }
    
    const handleSecureTextEntry = () => {
		setData({
            ...data,
			secureTextEntry: !data.secureTextEntry
		})
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
        if(responseType === 'rOTP') {
            console.log(responseData);
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
            setButtonDisabled(false)
        }
        if(responseType === 'signup') {
            if(responseData.error === 1) {
                register(responseData);
            } else {
                otpbox.current.clear();
            }
            setShowActivity(false);
            setResponse(false);
        }
    }, [responseData]);

    const getOTP = async(data, callingCode) => {
        setOTPData({
            error: 1,
            data: {
                hash: 'dummy',
                timestamp: '11111'
            }
        });
        setShowOTP(true);
        setButtonDisabled(false);
    }

    const handleRegister = async(data, OTP, OTPData, callingCode, countryCode, latitude, longitude) => {
        register({
            error: 1,
            token: 'dummy-token',
            data: {
                user: {
                    id: 1,
                    username: 'dummy',
                    first_name: 'Dummy',
                    last_name: 'User',
                    device_type: 'ios',
                    status: 'active'
                }
            }
        });
    }

    return (
        <View style={{flex: 1}}>
            <StatusBarComponent bgColor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <KeyboardAwareScrollView 
                style={[styles.ContainerStyle, {backgroundColor: colors.background}]} 
                keyboardShouldPersistTaps='always'
                enableOnAndroid={true}
                enableAutomaticScroll={true}
            >
                <View style={{paddingVertical: EStyleSheet.value('30rem')}}>
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
                                        handleRegister(data, code, OTPData, callingCode, countryCode, latitude, longitude);
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
                                style={[styles.SubmitContainer, styles.otpBack, {backgroundColor: colors.primary}]}
                                onPress={() => {
                                    setShowOTP(false);
                                    setResponse(false);
                                }}
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
                            <View>
                                <Text style={[styles.TextLg, {color: colors.pText}]}>Create Account,</Text>
                                <Text style={[styles.TextSm, {color: colors.text}]}>Sign up to continue</Text>
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
                                            placeholder="Enter Full Name"
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
                                            placeholder="email"
                                            placeholderTextColor={colors.light}
                                            keyboardAppearance="dark"
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
                                            placeholder="Enter Phone Number"
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
                                <View style={[styles.FormInputStyle, {marginBottom: EStyleSheet.value('10rem')}]}>
                                    <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Password</Text>
                                    <View style={[styles.FormInputFieldStyle, {borderColor: theme.dark ? colors.primary : colors.light}]}>
                                        <MaterialIcons 
                                            name="lock-outline" 
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
                                            secureTextEntry={data.secureTextEntry}
                                            style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                            keyboardAppearance="dark"
                                            placeholderTextColor={colors.light}
                                            placeholder="Enter Password"
                                            value={data.password}
                                            onChangeText={(value) => passwordInputChange(value)}
                                        />
                                        <TouchableOpacity 
                                            style={{alignSelf: 'center'}}
                                            onPress={() => handleSecureTextEntry()}
                                        >
                                            {
                                                data.secureTextEntry ?
                                                <View
                                                    style={{alignSelf: 'center'}}
                                                >
                                                    <MaterialCommunityIcons 
                                                        name="eye-off" 
                                                        size={
                                                            deviceType === 'Tablet' ? 
                                                            EStyleSheet.value('11rem') :
                                                            EStyleSheet.value('16rem')
                                                        } 
                                                        color={colors.pText} 
                                                    />
                                                </View> 
                                                :
                                                <View
                                                    style={{alignSelf: 'center'}}
                                                >
                                                    <MaterialCommunityIcons 
                                                        name="eye" 
                                                        size={
                                                            deviceType === 'Tablet' ? 
                                                            EStyleSheet.value('11rem') :
                                                            EStyleSheet.value('16rem')
                                                        } 
                                                        color={colors.pText} 
                                                    /> 
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        data.isPasswordValid ? null :
                                        <Text style={[styles.errorText, {color: colors.text}]}>Password should be minimum 8 characters</Text>
                                    }
                                </View>
                                <TouchableOpacity 
                                    style={[styles.SubmitContainer, {backgroundColor: colors.primary}]}
                                    onPress={() => {
                                        setButtonDisabled(true);
                                        getOTP(data, callingCode);
                                    }}
                                    disabled={buttonDisabled}
                                >
                                    {
                                        buttonDisabled ?
                                        <ActivityIndicator color={Colors.dark} /> :
                                        <AntDesign 
                                            name='arrowright' 
                                            size={
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('14rem') :
                                                EStyleSheet.value('24rem')
                                            } 
                                            color={colors.black} 
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity 
                                style={styles.ExtraButton}
                                onPress={() => navigation.navigate('Login', {
                                    latitude: latitude,
                                    longitude: longitude
                                })}
                            >
                                <Text style={[styles.ExtraButtonText, {color: colors.pText}]}>
                                    Already have an account?
                                </Text>
                                <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold, {color: colors.pText}]}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = EStyleSheet.create({
    ContainerStyle: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingVertical: '5%',
        width: '100%',
        minHeight: '100%',
        maxWidth: deviceType === 'Tablet' ? '75%' : '100%',
        alignSelf: 'center'
    },
    TextLg: {
        fontSize: deviceType === 'Tablet' ? '24rem' : '35rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingBottom: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    TextSm: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'GTWalsheimProLight',
    },
    FormContainer: {
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputStyle: {
		marginBottom: deviceType === 'Tablet' ? '8rem' : '10rem'
	},
	FormInputLabelStyle: {
		fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
		fontFamily: 'GTWalsheimProLight',
        paddingBottom: deviceType === 'Tablet' ? '6rem' : '10rem'
	},
	FormInputFieldStyle: {
		flexDirection: 'row',
        borderWidth: '1rem',
        alignItems: 'center',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '14rem',
	},
	FormTextInputStyle: {
        flex: 1,
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        paddingLeft: deviceType === 'Tablet' ? '4rem' : 0,
    },
    CountryCodeText: {
        paddingRight: deviceType === 'Tablet' ? '1.5rem' : '4rem',
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        width: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '6rem' : '10rem',
    },
    otpBack: {
        alignSelf: 'center',
        marginTop: deviceType === 'Tablet' ? '32rem' : '50rem',
    },
    ExtraButton: {
        marginTop: deviceType === 'Tablet' ? '22rem' : '30rem',
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
        paddingLeft: deviceType === 'Tablet' ? '3.5rem' : '6rem',
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: deviceType === 'Tablet' ? '1.4rem' : '2rem',
        paddingTop: deviceType === 'Tablet' ? '3rem' : '4rem',
    }
})

export default SignUpScreen;

