import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
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
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import * as Animatable from 'react-native-animatable';

let deviceType = getDeviceType();

const SignUpScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { register, latitude, longitude } = useContext(AuthContext);
    
    const [data, setData] = useState({
        password: '',
        phone: '',
        fullname: '',
		isNameValid: true,
		isPhoneValid: true,
		isPasswordValid: true,
	    secureTextEntry: true
    });
    const [showOTP, setShowOTP] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const otpbox = useRef();

    const fullnameInputChange = (value) => {
        setData({
            ...data,
            fullname: value,
            isNameValid: value.length >= 3
        })
	}

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
    
    const handleSecureTextEntry = () => {
		setData({
            ...data,
			secureTextEntry: !data.secureTextEntry
		})
    }

    const [countryCode, setCountryCode] = useState('IN')
    const [callingCode, setCallingCode] = useState('91')
    
    const onSelect = (country) => {
        setCountryCode(country.cca2)
        setCallingCode(country.callingCode)
    }

    const handleRegister = async() => {
        setShowActivity(true);
        setTimeout(() => {
            register({
                error: 1,
                token: 'dummy-token',
                data: {
                    user: {
                        id: 1,
                        username: data.fullname ? data.fullname.toLowerCase().replace(' ', '_') : 'showcase_user',
                        first_name: data.fullname ? data.fullname.split(' ')[0] : 'Showcase',
                        last_name: data.fullname ? data.fullname.split(' ')[1] || '' : 'User',
                        device_type: 'ios',
                        status: 'active'
                    }
                }
            });
            setShowActivity(false);
        }, 1500);
    }

    const getOTP = async() => {
        setButtonDisabled(true);
        handleRegister();
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <StatusBarComponent bgColor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <KeyboardAwareScrollView 
                style={styles.ContainerStyle} 
                keyboardShouldPersistTaps='always'
                enableOnAndroid={true}
                contentContainerStyle={{flexGrow: 1}}
            >
                <Animatable.View animation="fadeIn" duration={1000} style={styles.InnerContainer}>
                    {
                        showOTP ? 
                        <Animatable.View animation="zoomIn" duration={500} style={styles.otparea}>
                            <Text style={[styles.TextLg, {textAlign: 'center', color: colors.text}]}>Verify Identity</Text>
                            <Text style={[styles.TextSm, {textAlign: 'center', color: colors.light, marginBottom: 30}]}>Enter the 4-digit code sent to +{callingCode} {data.phone}</Text>
                            
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
                                    handleRegister();
                                }}
                                codeInputStyle={styles.otpInputStyle}
                                containerStyle={{height: 100}}
                            /> 

                            {
                                showActivity ?
                                <ActivityIndicator 
                                    size='large' 
                                    color={colors.primary}
                                    style={{marginTop: 40}} 
                                /> : null
                            }

                            {!showActivity && (
                                <View style={{alignItems: 'center', marginTop: 40}}>
                                    <TouchableOpacity onPress={() => setShowOTP(false)} style={styles.ResendBtn}>
                                        <Text style={[styles.ExtraButtonText, {color: colors.text}]}>
                                            Didn't receive code? <Text style={{color: colors.primary, fontFamily: 'GTWalsheimProBold'}}>Resend</Text>
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[styles.BackBtn, {borderColor: colors.lighter}]}
                                        onPress={() => setShowOTP(false)}
                                    >
                                        <AntDesign name='arrowleft' size={22} color={colors.text} />
                                        <Text style={[styles.BackBtnText, {color: colors.text}]}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Animatable.View>
                        :
                        <>
                            <Animatable.View animation="fadeInDown" delay={200}>
                                <Text style={[styles.TextLg, {color: colors.text}]}>Create Account</Text>
                                <Text style={[styles.TextSm, {color: colors.light}]}>Join Mylo and start connecting today</Text>
                            </Animatable.View>

                            <View style={styles.FormContainer}>
                                <Animatable.View animation="fadeInUp" delay={400} style={styles.FormInputStyle}>
                                    <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Full Name</Text>
                                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isNameValid ? colors.lighter : '#ff4444'}]}>
                                        <SimpleLineIcons name="user" size={18} color={colors.pText} style={styles.IconStyle} />
                                        <TextInput
                                            autoCapitalize='words'
                                            autoCorrect={false}
                                            style={[styles.FormTextInputStyle, {color: colors.text}]}
                                            placeholder="Enter full name"
                                            placeholderTextColor={colors.light}
                                            keyboardAppearance="dark"
                                            value={data.fullname}
                                            onChangeText={(value) => fullnameInputChange(value)}
                                        />
                                        {data.isNameValid && data.fullname.length > 0 && (
                                            <Octicons name="verified" size={15} color={colors.primary} style={{alignSelf: 'center'}} />
                                        )}
                                    </View>
                                </Animatable.View>

                                <Animatable.View animation="fadeInUp" delay={600} style={styles.FormInputStyle}>
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
                                            placeholder="Enter phone number"
                                            placeholderTextColor={colors.light}
                                            keyboardAppearance="dark"
                                            keyboardType="phone-pad"
                                            value={data.phone}
                                            onChangeText={(value) => phoneInputChange(value)}
                                        />
                                    </View>
                                </Animatable.View>

                                <Animatable.View animation="fadeInUp" delay={800} style={styles.FormInputStyle}>
                                    <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Secure Password</Text>
                                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isPasswordValid ? colors.lighter : '#ff4444'}]}>
                                        <MaterialIcons name="lock-outline" size={20} color={colors.pText} style={styles.IconStyle} />
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            secureTextEntry={data.secureTextEntry}
                                            style={[styles.FormTextInputStyle, {color: colors.text}]}
                                            keyboardAppearance="dark"
                                            placeholderTextColor={colors.light}
                                            placeholder="Min. 6 characters"
                                            value={data.password}
                                            onChangeText={(value) => passwordInputChange(value)}
                                        />
                                        <TouchableOpacity onPress={handleSecureTextEntry} style={styles.EyeStyle}>
                                            <MaterialCommunityIcons 
                                                name={data.secureTextEntry ? "eye-off" : "eye"} 
                                                size={20} 
                                                color={colors.pText} 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>

                                <Animatable.View animation="fadeInUp" delay={1000} style={{marginTop: 20}}>
                                    <TouchableOpacity 
                                        activeOpacity={0.8}
                                        style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                                        onPress={getOTP}
                                        disabled={buttonDisabled}
                                    >
                                        {buttonDisabled ? (
                                            <ActivityIndicator color={Colors.dark} />
                                        ) : (
                                            <View style={styles.SubmitBtnInner}>
                                                <Text style={[styles.SubmitBtnText, {color: Colors.dark}]}>Create Account</Text>
                                                <AntDesign name="arrowright" size={20} color={Colors.dark} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </Animatable.View>
                            </View>

                            <Animatable.View animation="fadeInUp" delay={1200} style={styles.LoginArea}>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.LoginButtonText, {color: colors.text}]}>
                                        Already have an account? <Text style={{fontFamily: 'GTWalsheimProBold', color: colors.primary}}>Sign In</Text>
                                    </Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </>
                    }
                </Animatable.View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = EStyleSheet.create({
    ContainerStyle: {
        flex: 1,
    },
    InnerContainer: {
        paddingHorizontal: '25rem',
        paddingVertical: '60rem',
        justifyContent: 'center',
    },
    TextLg: {
        fontSize: '32rem',
        fontFamily: 'GTWalsheimProBold',
        marginBottom: '6rem',
    },
    TextSm: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProLight',
        marginBottom: '40rem',
    },
    FormContainer: {
        width: '100%',
    },
    FormInputStyle: {
		marginBottom: '20rem',
	},
	FormInputLabelStyle: {
		fontSize: '14rem',
		fontFamily: 'GTWalsheimProMedium',
        marginBottom: '10rem',
        opacity: 0.9,
	},
	FormInputFieldStyle: {
		flexDirection: 'row',
		borderWidth: '1rem',
        height: '52rem',
        borderRadius: '14rem',
        paddingHorizontal: '15rem',
        alignItems: 'center',
	},
	FormTextInputStyle: {
        flex: 1,
        height: '100%',
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    IconStyle: {
        marginRight: '12rem',
        opacity: 0.7
    },
    CountryCodeText: {
        marginLeft: '10rem',
        marginRight: '10rem',
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProMedium',
    },
    EyeStyle: {
        padding: '5rem',
    },
    SubmitBtn: {
        height: '55rem',
        borderRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    SubmitBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    SubmitBtnText: {
        fontSize: '17rem',
        fontFamily: 'GTWalsheimProBold',
        marginRight: '10rem',
    },
    LoginArea: {
        marginTop: '30rem',
        alignItems: 'center',
    },
    LoginButtonText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    otparea: {
        flex: 1,
        paddingTop: '20rem',
    },
    otpInputStyle: {
        borderRadius: '12rem',
        borderWidth: '1.5rem',
        fontSize: '24rem',
        fontFamily: 'GTWalsheimProBold',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    ResendBtn: {
        marginBottom: '30rem',
    },
    BackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '10rem',
        paddingHorizontal: '20rem',
        borderRadius: '25rem',
        borderWidth: '1rem',
    },
    BackBtnText: {
        marginLeft: '8rem',
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProMedium',
    }
});

export default SignUpScreen;
