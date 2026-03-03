import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import StatusBarComponent from '../Components/StatusbarComponent'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { showMessage } from "react-native-flash-message";
import CountryPicker from 'react-native-country-picker-modal';
import CodeInput from 'react-native-confirmation-code-input';
import { AuthContext } from '../Components/Context'
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

let deviceType = getDeviceType();

const ForgotPasswordScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { register } = useContext(AuthContext);
    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse
    ] = useAxios();  

    var regNum = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    const [data, setData] = useState({
        phone: '',
        newPassword: '',
        confirmPassword: '',
        isValidPhone: true,
        isValidNewPassword: true,
        isValidConfirmPassword: true,
        secureTextEntryNew: true,
        secureTextEntryConfirm: true,
    });

    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [OTPData, setOTPData] = useState(null);
    const [OTP, setOTP] = useState('');
    const [showActivity, setShowActivity] = useState(false);
    const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const otpbox = useRef();

    const phoneInputChange = (value) => {
        if (regNum.test(value) === true && value.length >= 6){
            setData({
                ...data,
                phone: value,
                isValidPhone: true
            })
        }
        else{
            setData({
                ...data,
                isValidPhone: false
            })
        }
    }

    const newPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                newPassword: value,
                isValidNewPassword: true
            })
        }
        else{
            setData({
                ...data,
                isValidNewPassword: false
            })
        }
    }

    const confirmPasswordInputChange = (value) => {
        if (value === data.newPassword){
            setData({
                ...data,
                confirmPassword: value,
                isValidConfirmPassword: true
            })
        }
        else{
            setData({
                ...data,
                isValidConfirmPassword: false
            })
        }
    }
    
    const handleSecureTextEntryNew = () => {
		setData({
            ...data,
			secureTextEntryNew: !data.secureTextEntryNew
		})
    }

    const handleSecureTextEntryConfirm = () => {
		setData({
            ...data,
			secureTextEntryConfirm: !data.secureTextEntryConfirm
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
        console.log(responseData);
        if(responseType === 'fOTP') {
            if(responseData.error === 1) {
                setOTPData(responseData);
                setShowOTP(true);
            } else {
                setResponse(false);
            }
            setOtpButtonDisabled(false);
        }
        if(responseType === 'vOTP') {
            if(responseData.error === 1) {
                setShowPassword(true);
            } else {
                otpbox.current.clear();
            }
            setShowActivity(false);
            setResponse(false);
        }
        if(responseType === 'rpassword') {
            if(responseData.error === 1) {
                navigation.goBack();
            } else {
                setResponse(false);
            }
            setButtonDisabled(false);
        }
    }, [responseData]);

    const getOTP = async(data, callingCode) => {
        if(data.isValidPhone && data.phone.length > 0) {
            setOtpButtonDisabled(true);
            setTimeout(() => {
                setOTPData({ data: { hash: 'dummyhash', timestamp: 'dummytime', secret_key: 'dummysecret' } });
                setShowOTP(true);
                setOtpButtonDisabled(false);
            }, 500);
        } else {
            showMessage({
                message: 'Entered phone number is not valid',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'GTWalsheimProMedium'
                }
            });
            setOtpButtonDisabled(false);
        }
    }

    const verifyOTP = async(code, OTPData) => {
        setTimeout(() => {
            setShowPassword(true);
            setShowActivity(false);
        }, 500);
    }

    const loginReset = async(password, OTP, OTPData) => {
        setTimeout(() => {
            setButtonDisabled(false);
            navigation.goBack();
            showMessage({
                message: "Password reset complete",
                type: "success",
                icon: "success",
                duration: 3000
            });
        }, 500);
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
                <View style={{paddingVertical: 30}}>
                    {
                        showPassword ? 
                        <>
                            <View>
                            <Text style={[styles.TextLg, {color: colors.pText}]}>Reset Password</Text>
                            </View>
                            <View style={styles.FormContainer}>
                                <View 
                                    style={[styles.FormInputStyle, {
                                        marginBottom: 
                                        deviceType === 'Tablet' ? 
                                        EStyleSheet.value('8rem') :
                                        EStyleSheet.value('10rem')
                                    }]}
                                >
                                    <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>New Password</Text>
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
                                            secureTextEntry={data.secureTextEntryNew}
                                            style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                            keyboardAppearance="dark"
                                            placeholderTextColor={colors.light}
                                            placeholder="Enter New Password"
                                            onChangeText={(value) => newPasswordInputChange(value)}
                                        />
                                        <TouchableOpacity 
                                            style={{
                                                justifyContent: 'center', 
                                                width: 
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('22rem') :
                                                EStyleSheet.value('30rem'), 
                                                height: deviceType === 'Tablet' ? 
                                                EStyleSheet.value('26rem') :
                                                EStyleSheet.value('40rem')
                                            }}
                                            onPress={() => handleSecureTextEntryNew()}
                                        >
                                            {
                                                data.secureTextEntryNew ?
                                                <View
                                                    style={{alignSelf: 'flex-end'}}
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
                                                    style={{alignSelf: 'flex-end'}}
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
                                        data.isValidNewPassword ? null :
                                        <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid password</Text>
                                    }
                                </View>
                                <View 
                                    style={[styles.FormInputStyle, {
                                        marginBottom: 
                                        deviceType === 'Tablet' ? 
                                        EStyleSheet.value('8rem') :
                                        EStyleSheet.value('10rem')
                                    }]}
                                >
                                    <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Confirm Password</Text>
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
                                            secureTextEntry={data.secureTextEntryConfirm}
                                            style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                            keyboardAppearance="dark"
                                            placeholderTextColor={colors.light}
                                            placeholder="Enter Confirm Password"
                                            onChangeText={(value) => confirmPasswordInputChange(value)}
                                        />
                                        <TouchableOpacity 
                                            style={{
                                                justifyContent: 'center', 
                                                width: 
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('22rem') :
                                                EStyleSheet.value('30rem'), 
                                                height: deviceType === 'Tablet' ? 
                                                EStyleSheet.value('26rem') :
                                                EStyleSheet.value('40rem')
                                            }}
                                            onPress={() => handleSecureTextEntryConfirm()}
                                        >
                                            {
                                                data.secureTextEntryConfirm ?
                                                <View
                                                    style={{alignSelf: 'flex-end'}}
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
                                                    style={{alignSelf: 'flex-end'}}
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
                                        data.isValidConfirmPassword ? null :
                                        <Text style={[styles.errorText, {color: colors.text}]}>Confirm password doesn't match</Text>
                                    }
                                </View>
                                <TouchableOpacity 
                                    style={[styles.SubmitContainer, {backgroundColor: colors.primary}]}
                                    onPress={() => {
                                        setButtonDisabled(true);
                                        loginReset(data.newPassword, OTP, OTPData);
                                    }}
                                >
                                    <AntDesign 
                                        name='arrowright' 
                                        size={
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('14rem') :
                                            EStyleSheet.value('24rem')
                                        } 
                                        color={colors.black} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.ExtraButton}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold, {color: colors.pText}]}>
                                        Back to login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </> 
                        :
                        <>
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
                                            setOTP(code);
                                            setTimeout(() => {
                                                verifyOTP(code, OTPData);
                                            }, 1000)
                                        }}
                                        containerStyle={{ 
                                            marginBottom: 
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('32rem') :
                                            EStyleSheet.value('50rem')
                                        }}
                                        codeInputStyle={{ borderWidth: 1 }}
                                    /> 
                                    {
                                        showActivity ?
                                        <ActivityIndicator 
                                            color={colors.pText}
                                            size='large' 
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
                                    <View>
                                        <Text style={[styles.TextLg, {color: colors.pText}]}>Forgot Password</Text>
                                    </View>
                                    <View style={styles.FormContainer}>
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
                                                    onChangeText={(value) => phoneInputChange(value)}
                                                />
                                                {
                                                    data.isValidPhone ? 
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
                                                data.isValidPhone ? null :
                                                <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid phone number</Text>
                                            }
                                        </View>
                                        <TouchableOpacity 
                                            disabled={otpButtonDisabled}
                                            style={[styles.SubmitContainer, {backgroundColor: colors.primary}]}
                                            onPress={() => {
                                                setOtpButtonDisabled(true);
                                                getOTP(data, callingCode);
                                            }}
                                        >
                                            {
                                                otpButtonDisabled ?
                                                <ActivityIndicator color={colors.pText} /> :
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
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={[styles.ExtraButtonText, styles.ExtraButtonTextBold, {color: colors.pText}]}>
                                            Back to login
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }
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

export default ForgotPasswordScreen;

