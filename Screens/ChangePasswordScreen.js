import React, { useState, useContext, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
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

let deviceType = getDeviceType();

const ChangePasswordScreen = ({ navigation }) => {

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

    useEffect(() => {
        // getUserData removed - not needed for design showcase
    }, [])
    
    const updatePassword = async() => {
        setData({
            ...data,
			buttonDisabled: true
        })
        console.log('password')
        console.log(data)
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
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <Animatable.View animation="fadeIn" duration={800} style={{flex: 1}}>
                <KeyboardAwareScrollView 
                    style={{flex: 1}} 
                    keyboardShouldPersistTaps='always' 
                    enableOnAndroid={true} 
                    enableAutomaticScroll={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                        <Text style={[styles.TopBarBtnText, {color: colors.text}]}>Security</Text>
                        <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.BackBtnContainer}>
                            <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.text}]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.HeaderInfo}>
                        <Text style={[styles.HeaderTitle, {color: colors.text}]}>Change Password</Text>
                        <Text style={[styles.HeaderSub, {color: colors.light}]}>Ensure your account stays secure with a strong password.</Text>
                    </View>

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.FormContainer}>
                        <View style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Current Password</Text>
                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isoldPasswordValid ? colors.lighter : '#ff4444'}]}>
                                <MaterialIcons name="lock-outline" size={18} color={colors.pText} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryOld}
                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                    keyboardAppearance="dark"
                                    placeholderTextColor={colors.light}
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
                                        color={colors.light} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>New Password</Text>
                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isnewPasswordValid ? colors.lighter : '#ff4444'}]}>
                                <MaterialIcons name="lock-outline" size={18} color={colors.pText} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryNew}
                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                    keyboardAppearance="dark"
                                    placeholderTextColor={colors.light}
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
                                        color={colors.light} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.FormInputStyle}>
                            <Text style={[styles.FormInputLabelStyle, {color: colors.text}]}>Confirm New Password</Text>
                            <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.bgVar, borderColor: data.isconfirmPasswordValid ? colors.lighter : '#ff4444'}]}>
                                <MaterialIcons name="lock-outline" size={18} color={colors.pText} style={styles.IconStyle} />
                                <TextInput
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    secureTextEntry={data.secureTextEntryConfirm}
                                    style={[styles.FormTextInputStyle, {color: colors.text}]}
                                    keyboardAppearance="dark"
                                    placeholderTextColor={colors.light}
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
                                        color={colors.light} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            activeOpacity={0.8}
                            style={[styles.SubmitBtn, {backgroundColor: colors.primary}]}
                            disabled={data.buttonDisabled}
                            onPress={() => updatePassword()}
                        >   
                            {
                                data.buttonDisabled ?
                                <ActivityIndicator color={Colors.dark} />
                                :
                                <Text style={[styles.SubmitBtnText, {color: Colors.dark}]}>Update Password</Text>
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
    HeaderInfo: {
        paddingHorizontal: '25rem',
        marginTop: '20rem',
        marginBottom: '30rem',
    },
    HeaderTitle: {
        fontSize: '32rem',
        fontFamily: 'GTWalsheimProBold',
        marginBottom: '10rem',
    },
    HeaderSub: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProRegular',
        lineHeight: '22rem',
    },
    FormContainer: {
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
    EyeIcon: {
        padding: '5rem',
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
    errorText: {
        fontSize: '13rem',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: '2rem',
        paddingTop: '4rem',
    }
})

export default ChangePasswordScreen;

