import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarComponent from '../Components/StatusbarComponent';
import { Colors } from '../Constants/Colors';
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
import * as Animatable from 'react-native-animatable';

let deviceType = getDeviceType();

const LoginScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

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

    const usernameInputChange = (value) => {
        setData({
            ...data,
            username: value,
            isUserValid: value.length >= 4
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
    
    const loginHandle = async() => {
        setButtonDisabled(true);
        setTimeout(() => {
            login({
                error: 1,
                token: 'dummy-token',
                data: {
                    user: {
                        id: 1,
                        username: data.username,
                        first_name: 'Showcase',
                        last_name: 'User',
                        device_type: 'ios',
                        status: 'active'
                    }
                }
            });
            setButtonDisabled(false);
        }, 1000);
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
                <Animatable.View animation="fadeIn" duration={1000} style={[styles.InnerContainer, {paddingTop: insets.top + 40}]}>
                    <Animatable.View animation="fadeInDown" delay={200}>
                        <Text style={[styles.TextLg, {color: colors.text}]}>Hello Again!</Text>
                        <Text style={[styles.TextSm, {color: colors.light}]}>Sign in to your account to continue</Text>
                    </Animatable.View>

                    <View style={styles.FormContainer}>
                        <Animatable.View animation="fadeInUp" delay={400} style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Email or Username</Text>
                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isUserValid ? colors.lighter : '#ff4444'}]}>
                                <SimpleLineIcons name="user" size={18} color={colors.pText} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                    placeholder="Enter username"
                                    placeholderTextColor={colors.light}
                                    keyboardAppearance="dark"
                                    onChangeText={(value) => usernameInputChange(value)}
                                />
                                {data.isUserValid && data.username.length > 0 && (
                                    <Octicons name="verified" size={15} color={colors.primary} style={{alignSelf: 'center'}} />
                                )}
                            </View>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={600} style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Password</Text>
                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isPasswordValid ? colors.lighter : '#ff4444'}]}>
                                <MaterialIcons name="lock-outline" size={20} color={colors.pText} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntry}
                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                    keyboardAppearance="dark"
                                    placeholderTextColor={colors.light}
                                    placeholder="Enter password"
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
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{alignSelf: 'flex-end', marginTop: 10}}>
                                <Text style={[styles.ForgotStyle, {color: colors.primary}]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={800} style={{marginTop: 20}}>
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                                onPress={loginHandle}
                                disabled={buttonDisabled}
                            >
                                {buttonDisabled ? (
                                    <ActivityIndicator color={Colors.dark} />
                                ) : (
                                    <View style={styles.SubmitBtnInner}>
                                        <Text style={[styles.SubmitBtnText, {color: Colors.dark}]}>Sign In</Text>
                                        <AntDesign name="arrowright" size={20} color={Colors.dark} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>

                    <Animatable.View animation="fadeInUp" delay={1000} style={styles.SignUpArea}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={[styles.SignUpButtonText, {color: colors.text}]}>
                                New here? <Text style={{fontFamily: 'GTWalsheimProBold', color: colors.primary}}>Create Account</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
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
    ForgotStyle: {
        fontSize: '14rem',
		fontFamily: 'GTWalsheimProMedium',
    },
    SignUpArea: {
        marginTop: '40rem',
        alignItems: 'center',
    },
    SignUpButtonText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
    },
});

export default LoginScreen;

