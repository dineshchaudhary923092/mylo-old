import React, { useState, useContext, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage } from "react-native-flash-message";
import { AuthContext } from '../Components/Context';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { getDeviceType } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

let deviceType = getDeviceType();

const ChangePasswordScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const { colors } = useTheme();

    const { logout } = useContext(AuthContext);

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

    const [data, setData] = useState({
		oldPassword: '',
        newPassword: '',
        confirmPassword: '',
		isoldPasswordValid: true,
		isnewPasswordValid: true,
		isconfirmPasswordValid: true,
	    secureTextEntryOld: true,
	    secureTextEntryNew: true,
        secureTextEntryConfirm: true,
        buttonDisabled: false
    });

    const oldPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                oldPassword: value,
                isoldPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isoldPasswordValid: false
            })
        }
    }

    const newPasswordInputChange = (value) => {
        if (value.length >= 8){
            setData({
                ...data,
                newPassword: value,
                isnewPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isnewPasswordValid: false
            })
        }
    }

    const confirmPasswordInputChange = (value) => {
        if (value === data.newPassword){
            setData({
                ...data,
                confirmPassword: value,
                isconfirmPasswordValid: true
            })
        }
        else{
            setData({
                ...data,
                isconfirmPasswordValid: false
            })
        }
    }

    const handleSecureTextEntryOld = () => {
		setData({
            ...data,
			secureTextEntryOld: !data.secureTextEntryOld
		})
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

    useEffect(() => {
        if(responseType === 'cPassword') {
            if(responseData.error === 1) {
                logout();
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    const updatePassword = async() => {
        setData({
            ...data,
			buttonDisabled: true
        })
        if(data.isoldPasswordValid && data.isnewPasswordValid && data.isconfirmPasswordValid && data.confirmPassword != '') {
            setTimeout(() => {
                setData({
                    ...data,
                    buttonDisabled: false
                });
                navigation.goBack();
                showMessage({
                    message: "Password changed successfully (Dummy)",
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
            setData({
                ...data,
                buttonDisabled: false
            })
        }
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
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.12" />
                            <Stop offset="35%" stopColor="#7FFFD4" stopOpacity="0.06" />
                            <Stop offset="70%" stopColor="#7FFFD4" stopOpacity="0.02" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>

            {/* Unified Header */}
            <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.BackBtnContainer}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <AntDesign name="arrowleft" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <Text style={styles.HeaderTitle}>Security</Text>
                <View style={{ width: EStyleSheet.value('40rem') }} />
            </View>

            <Animatable.View animation="fadeIn" duration={800} style={{flex: 1, marginTop: insets.top + (deviceType === 'Tablet' ? 65 : 78)}}>
                <KeyboardAwareScrollView 
                    style={{flex: 1}} 
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps='always' 
                    enableOnAndroid={true} 
                    enableAutomaticScroll={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.HeaderInfo}>
                        <Text style={styles.ScreenTitle}>Change Password</Text>
                        <Text style={styles.HeaderSub}>Ensure your account stays secure with a strong password.</Text>
                    </View>

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.FormContainer}>
                        <View style={styles.FormInputStyle}>
                            <Text style={styles.FormInputLabelStyle}>Current Password</Text>
                            <View style={[styles.FormInputFieldStyle, !data.isoldPasswordValid && { borderColor: '#ff4444' }]}>
                                <Feather name="lock" size={18} color={colors.primary} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryOld}
                                    style={styles.FormTextInputStyle}
                                    keyboardAppearance="dark"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    placeholder="••••••••"
                                    onChangeText={(value) => oldPasswordInputChange(value)}
                                />
                                <TouchableOpacity 
                                    style={styles.EyeIcon}
                                    onPress={() => handleSecureTextEntryOld()}
                                >
                                    <Feather 
                                        name={data.secureTextEntryOld ? "eye-off" : "eye"} 
                                        size={18} 
                                        color="rgba(255,255,255,0.5)" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.FormInputStyle}>
                            <Text style={styles.FormInputLabelStyle}>New Password</Text>
                            <View style={[styles.FormInputFieldStyle, !data.isnewPasswordValid && { borderColor: '#ff4444' }]}>
                                <Feather name="shield" size={18} color={colors.primary} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryNew}
                                    style={styles.FormTextInputStyle}
                                    keyboardAppearance="dark"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    placeholder="Minimum 8 characters"
                                    onChangeText={(value) => newPasswordInputChange(value)}
                                />
                                <TouchableOpacity 
                                    style={styles.EyeIcon}
                                    onPress={() => handleSecureTextEntryNew()}
                                >
                                    <Feather 
                                        name={data.secureTextEntryNew ? "eye-off" : "eye"} 
                                        size={18} 
                                        color="rgba(255,255,255,0.5)" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.FormInputStyle}>
                            <Text style={styles.FormInputLabelStyle}>Confirm New Password</Text>
                            <View style={[styles.FormInputFieldStyle, !data.isconfirmPasswordValid && { borderColor: '#ff4444' }]}>
                                <Feather name="check-circle" size={18} color={colors.primary} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryConfirm}
                                    style={styles.FormTextInputStyle}
                                    keyboardAppearance="dark"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    placeholder="Repeat new password"
                                    onChangeText={(value) => confirmPasswordInputChange(value)}
                                />
                                <TouchableOpacity 
                                    style={styles.EyeIcon}
                                    onPress={() => handleSecureTextEntryConfirm()}
                                >
                                    <Feather 
                                        name={data.secureTextEntryConfirm ? "eye-off" : "eye"} 
                                        size={18} 
                                        color="rgba(255,255,255,0.5)" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={styles.SubmitBtn}
                            disabled={data.buttonDisabled}
                            onPress={() => updatePassword()}
                        >   
                            {
                                data.buttonDisabled ?
                                <ActivityIndicator color={Colors.dark} />
                                :
                                <Text style={styles.SubmitBtnText}>Update Password</Text>
                            }
                        </TouchableOpacity>
                    </Animatable.View>
                </KeyboardAwareScrollView>
            </Animatable.View>
        </View>
    )
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
        textAlign: 'center',
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
    HeaderInfo: {
        paddingHorizontal: '24rem',
        marginTop: '10rem',
        marginBottom: '32rem',
    },
    ScreenTitle: {
        fontSize: '32rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#FFFFFF',
        marginBottom: '10rem',
    },
    HeaderSub: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
        color: 'rgba(255,255,255,0.5)',
        lineHeight: '22rem',
    },
    FormContainer: {
        paddingHorizontal: '24rem',
    },
    FormInputStyle: {
        marginBottom: '24rem',
    },
    FormInputLabelStyle: {
        fontSize: '14rem',
        fontFamily: 'GTWalsheimProBold',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '10rem',
        marginLeft: '4rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5rem',
    },
    FormInputFieldStyle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        height: '60rem',
        borderRadius: '18rem',
        paddingHorizontal: '18rem',
        alignItems: 'center',
    },
    FormTextInputStyle: {
        flex: 1,
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProMedium',
        color: '#FFFFFF',
        height: '100%',
        marginLeft: '12rem',
    },
    IconStyle: {
        opacity: 0.8,
    },
    EyeIcon: {
        padding: '5rem',
    },
    SubmitBtn: {
        height: '58rem',
        borderRadius: '29rem',
        backgroundColor: '#7FFFD4',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20rem',
        shadowColor: '#7FFFD4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    SubmitBtnText: {
        fontSize: '17rem',
        fontFamily: 'GTWalsheimProBold',
        color: '#09090B',
        letterSpacing: '0.3rem',
    },
})

export default ChangePasswordScreen;
