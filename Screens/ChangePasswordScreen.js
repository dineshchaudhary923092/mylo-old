import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
            <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps='always' enableOnAndroid={true} enableAutomaticScroll={true}>
                <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                    <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Change Password</Text>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.FormContainer, {paddingBottom: 50}]}>
                    <View 
                        style={[styles.FormInputStyle, {
                            marginBottom: 
                            deviceType === 'Tablet' ? 
                            EStyleSheet.value('14rem') :
                            EStyleSheet.value('20rem')
                        }]}
                    >
                        <Text style={[styles.FormInputLabelStyle, {color: colors.pText}]}>Old Password</Text>
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
                                secureTextEntry={data.secureTextEntryOld}
                                style={[styles.FormTextInputStyle, {color: colors.pText}]}
                                keyboardAppearance="dark"
                                placeholderTextColor={colors.light}
                                placeholder="old password"
                                onChangeText={(value) => oldPasswordInputChange(value)}
                            />
                            <TouchableOpacity 
                                style={{alignSelf: 'center'}}
                                onPress={() => handleSecureTextEntryOld()}
                            >
                                {
                                    data.secureTextEntryOld ?
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
                            data.isoldPasswordValid ? null :
                            <Text style={[styles.errorText, {color: colors.text}]}>Password should be minimum 8 characters</Text>
                        }
                    </View>
                    <View 
                        style={[styles.FormInputStyle, {
                            marginBottom: 
                            deviceType === 'Tablet' ? 
                            EStyleSheet.value('14rem') :
                            EStyleSheet.value('20rem')
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
                                placeholder="new password"
                                onChangeText={(value) => newPasswordInputChange(value)}
                            />
                            <TouchableOpacity 
                                style={{alignSelf: 'center'}}
                                onPress={() => handleSecureTextEntryNew()}
                            >
                                {
                                    data.secureTextEntryNew ?
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
                            data.isnewPasswordValid ? null :
                            <Text style={[styles.errorText, {color: colors.text}]}>Password should be minimum 8 characters</Text>
                        }
                    </View>
                    <View 
                        style={[styles.FormInputStyle, {
                            marginBottom: 
                            deviceType === 'Tablet' ? 
                            EStyleSheet.value('14rem') :
                            EStyleSheet.value('20rem')
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
                                placeholder="confirm password"
                                onChangeText={(value) => confirmPasswordInputChange(value)}
                            />
                            <TouchableOpacity 
                                style={{alignSelf: 'center'}}
                                onPress={() => handleSecureTextEntryConfirm()}
                            >
                                {
                                    data.secureTextEntryConfirm ?
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
                            data.isconfirmPasswordValid ? null :
                            <Text style={[styles.errorText, {color: colors.text}]}>Password should match new password</Text>
                        }
                    </View>
                    <TouchableOpacity 
                        style={styles.SubmitContainer}
                        disabled={data.buttonDisabled}
                        onPress={() => updatePassword()}
                    >   
                        {
                            data.buttonDisabled ?
                            <ActivityIndicator color={Colors.dark} />
                            :
                            <Text style={styles.SubmitText}>Update profile</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
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
        fontSize: deviceType === 'Tablet' ? '22rem' : '30rem',
    },
    FormContainer: {
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputStyle: {
		marginBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
	},
	FormInputLabelStyle: {
		fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
		fontFamily: 'GTWalsheimProLight',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '10rem'
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
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '10rem' : '15rem',
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProMedium',
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: '2rem',
        paddingTop: deviceType === 'Tablet' ? '2.8rem' : '4rem',
    }
})

export default ChangePasswordScreen;

