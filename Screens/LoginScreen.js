import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import StatusBarComponent from '../Components/StatusbarComponent';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { showMessage } from "react-native-flash-message";
import { AuthContext } from '../Components/Context';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDeviceType } from 'react-native-device-info';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

let deviceType = getDeviceType();

const LoginScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { login, latitude, longitude } = useContext(AuthContext);
    const [getData, responseData, setResponseData, responseType, response, setResponse] = useAxios();  
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [data, setData] = useState({
		username: '',
		password: '',
		isUserValid: true,
        isPasswordValid: true,
        secureTextEntry: true,
    });

    useEffect(() => {
        if(responseType === 'login') {
            if(responseData.error === 1) {
                login(responseData);
            } else {
                setResponse(false);
            }
            setButtonDisabled(false);
        }
    }, [responseData]);

    const usernameInputChange = (value) => {
        if (value.length >= 6){
            setData({
                ...data,
                username: value,
                isUserValid: true
            })
        }
        else{
            setData({
                ...data,
                isUserValid: false
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
    
    const loginHandle = async(username, password, latitude, longitude) => {
        login({
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
                <View style={{paddingVertical: 30}}>
                    <View>
                        <Text style={[styles.TextLg, {color: colors.pText}]}>Welcome Back,</Text>
                        <Text style={[styles.TextSm, {color: colors.text}]}>Sign in to continue</Text>
                    </View>
                    <View style={styles.FormContainer}>
                        <View style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Username</Text>
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
                                    placeholder="username"
                                    placeholderTextColor={colors.light}
                                    keyboardAppearance="dark"
                                    onChangeText={(value) => usernameInputChange(value)}
                                />
                                {
                                    data.isUserValid ? 
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
                                data.isUserValid ? null :
                                <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid email/phone number</Text>
                            }
                        </View>
                        <View style={[styles.FormInputStyle, {marginBottom: 10}]}>
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
                                        EStyleSheet.value('18rem') :
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
                                    placeholder="password"
                                    onChangeText={(value) => passwordInputChange(value)}
                                />
                                <TouchableOpacity 
                                    style={{
                                        justifyContent: 'center', 
                                        width: EStyleSheet.value('30rem'), 
                                        height: deviceType === 'Tablet' ? EStyleSheet.value('26rem') : EStyleSheet.value('40rem')
                                    }}
                                    onPress={() => handleSecureTextEntry()}
                                >
                                    {
                                        data.secureTextEntry ?
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
                                data.isPasswordValid ? null :
                                <Text style={[styles.errorText, {color: colors.text}]}>Please enter valid password</Text>
                            }
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={[styles.ForgotStyle, {color: colors.light,}]}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.SubmitContainer, {backgroundColor: colors.primary}]}
                            onPress={() => {
                                setButtonDisabled(true);
                                loginHandle(data.username, data.password, latitude, longitude)
                            }}
                            disabled={buttonDisabled}
                        >
                            {
                                buttonDisabled ?
                                <ActivityIndicator color={colors.black} /> :
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
                        style={styles.SignUpButton}
                        onPress={() => navigation.navigate('SignUp', {
                            latitude: latitude,
                            longitude: longitude
                        })}
                    >
                        <Text style={[styles.SignUpButtonText, {color: colors.pText}]}>
                            Don't have an account?
                        </Text>
                        <Text style={[styles.SignUpButtonText, styles.SignUpButtonTextBold, {color: colors.pText}]}>
                            SignUp
                        </Text>
                    </TouchableOpacity>
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
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        width: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '6rem' : '10rem',
    },
    ForgotStyle: {
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '14rem',
		fontFamily: 'GTWalsheimProLight',
        paddingBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    SignUpButton: {
        marginTop: deviceType === 'Tablet' ? '22rem' : '30rem',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    SignUpButtonText: {
        textAlign: 'center',
        fontFamily: 'GTWalsheimProLight',
        fontSize: deviceType === 'Tablet' ? '9rem' : '15rem',
    },
    SignUpButtonTextBold:  {
        fontFamily: 'GTWalsheimProMedium', 
        paddingLeft: deviceType === 'Tablet' ? '4rem' : '6rem',
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: deviceType === 'Tablet' ? '1.4rem' : '2rem',
        paddingTop: deviceType === 'Tablet' ? '3rem' : '4rem',
    }
})

export default LoginScreen;

