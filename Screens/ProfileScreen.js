import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, Switch, ScrollView, FlatList } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import { Api } from '../Constants/Api';
import NotificationIcon from '../assets/notification.svg';
import EditIcon from '../assets/edit-user.svg';
import KeyIcon from '../assets/key.svg';
import LogoutIcon from '../assets/logout.svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated, { color } from 'react-native-reanimated';
import { showMessage } from "react-native-flash-message";
import ImagePicker from 'react-native-image-crop-picker';
import useAxios from '../Hooks/useAxios';
const axios = require('axios');
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();

const ProfileScreen = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();

    const { logout, toggleTheme } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(theme.dark ? true : false);
    const [notifyMe, setNotifyMe] = useState(null);

    const bs = useRef(null);
    const bsPop = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [distance, setDistance] = useState([
        {
            dist: 2,
            selected: false
        },
        {
            dist: 10,
            selected: false
        },
        {
            dist: 20,
            selected: false
        },
        {
            dist: 50,
            selected: false
        },
    ]);

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
    
    useEffect(() => {
        if(isFocused) {
            setIsLoading(true);
            const dummyUser = {
                data: {
                    user: {
                        name: 'Alex Johnson',
                        phone: '+1 (555) 876-4521',
                        image: null,
                        notifyMe: '10'
                    }
                }
            };
            setUserData(dummyUser);
            setIsLoading(false);
        }
    }, [isFocused])
    
    useEffect(() => {
        setIsLoading(true);
        const dummyUser = {
            data: {
                user: {
                    name: 'Dummy User',
                    phone: '+1234567890',
                    image: '',
                    notifyMe: '10'
                }
            }
        };
        setUserData(dummyUser);
        if(dummyUser) {
            setNotifyMe(parseInt(dummyUser.data.user.notifyMe));
            const tempDist = [...distance];
            tempDist.map(value => {
                if(value.dist === parseInt(dummyUser.data.user.notifyMe)) {
                    value.selected = true;
                } else {
                    value.selected = false;
                }
            })
            setDistance(tempDist);
            setIsLoading(false);
        }
    }, [])

    const updateProfileImage = async(imgUri, imgType, imgSize) => {
        // Bypassed for design showcase - no backend calls
        showMessage({
            message: 'Profile photo updated!',
            type: 'success',
            duration: 3000,
            style: { backgroundColor: Colors.dark },
            titleStyle: { color: Colors.primary, fontFamily: 'GTWalsheimProMedium' }
        });
    }

    useEffect(() => {
        if(responseType === 'distance') {
            console.log(responseData); 
            if(responseData.error === 1) {
                setNotifyMe(parseInt(responseData.data.distance));
                const tempDist = [...distance];
                const tempData = {...userData};
                tempDist.map(value => {
                    if(value.dist === parseInt(responseData.data.distance)) {
                        value.selected = true;
                        tempData.data.user.notifyMe = responseData.data.distance;
                    } else {
                        value.selected = false;
                    }
                })
                setDistance(tempDist);
                saveUserData(tempData);
                if (bsPop.current) {
                    bsPop.current.snapTo(1);
                }
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    const saveUserData = async(data) => {
        try{
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        } catch(e) {
            console.log(e);
        }
    }

    const takePhoto = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            if (bs.current) {
                bs.current.snapTo(1);
            }
            setIsLoading(true);
            updateProfileImage(image.path, image.mime, image.size);
        });
    }
    
    const chooseFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            console.log(image);
            if (bs.current) {
                bs.current.snapTo(1);
            }
            setIsLoading(true);
            updateProfileImage(image.path, image.mime, image.size);
        });
    }

    const renderContent = () => (
        <View style={[styles.BottomSheet, {backgroundColor: colors.sheet}]}>
            <Text style={[styles.ProfileName, {color: colors.pText}]}>Upload Photo</Text>
            <Text style={[styles.ProfileEmail, {color: colors.text, opacity: 0.65}]}>Choose your Profile Picture</Text>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => chooseFromLibrary()}
            >   
                <Text style={styles.SubmitText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => takePhoto()}
            >   
                <Text style={styles.SubmitText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => {
                if (bs.current) {
                    bs.current.snapTo(1);
                }
                }}
            >   
                <Text style={styles.SubmitText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.bsHeader}>
            <View style={[styles.bsHandle, {backgroundColor: colors.pText}]} />
        </View>
    )

    const toggleSwitch = () => {
        toggleTheme();
        setIsEnabled(previousState => !previousState);
    }

    const confirmPop = () => (
        <View style={{minHeight: '100%', backgroundColor: colors.sheet}}>
            <View style={styles.ConfirmPop}> 
                <Text style={[styles.ConfirmPopText, {color: colors.text}]}>Select Notification Distance</Text>
                <FlatList 
                    style={[styles.ListWrap, {borderColor: colors.light}]}
                    data={distance}
                    keyExtractor={ (item, index) => item.dist ? item.dist.toString() : index.toString() }
                    horizontal={true}
                    renderItem={ ({ item, index }) => {
                        return (
                            <TouchableOpacity 
                                style={[styles.DistanceBtn, {
                                    backgroundColor: item.selected ? colors.primary : colors.lighter,
                                    borderRightColor: index === 3 ? 'rgba(0,0,0,0)' : colors.light
                                }]}
                                onPress={() => changeDistance(item)}
                            >
                                <Text style={[styles.DistanceBtnText, {color: item.selected ? Colors.dark : colors.light  }]}>{item.dist}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />  
            </View>
        </View>
    );

    const changeDistance = (distance) => {
        setNotifyMe(parseInt(distance.dist));
        const tempDist = [...distance];
        const tempData = {...userData};
        tempDist.map(value => {
            if(value.dist === parseInt(distance.dist)) {
                value.selected = true;
                tempData.data.user.notifyMe = distance.dist;
            } else {
                value.selected = false;
            }
        })
        setDistance(tempDist);
        saveUserData(tempData);
        if (bsPop.current) {
            bsPop.current.snapTo(1);
        }
    }

    return (
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <BottomSheet
                ref={bs}
                snapPoints={[
                    screenHeight > 720 ? 
                    deviceType === 'Tablet' ? 450 : 350 
                    : 320, 0
                ]}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
                callbackNode={fall}
            />
            <BottomSheet
                ref={bsPop}
                snapPoints={[
                    deviceType === 'Tablet' ?
                    EStyleSheet.value('100rem') :
                    EStyleSheet.value('150rem'), 0
                ]}
                renderContent={confirmPop}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
                callbackNode={fall}
                onCloseEnd={() => {
                }}
            />
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            {
                isLoading ?
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color={colors.pText} style={{marginTop: EStyleSheet.value('30rem')}} />
                </View> :
                <Animated.View style={{flex: 1}}>
                    <ScrollView>
                        <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                            <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Profile</Text>
                            <TouchableOpacity onPress={()=> navigation.navigate('Home')}>
                                <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ProfileWrap}>
                            <TouchableOpacity 
                                style={{position: 'relative'}}
                                onPress={() => {
                                    bs.current.snapTo(0);
                                }}
                            >
                                <Image 
                                    source={require('../assets/profile-user.png')} 
                                    resizeMode='cover' 
                                    style={styles.ProfileImg}
                                />
                                <View style={styles.ImageEdit}>
                                    <FontAwesome5 name='camera' style={styles.ImageEditIcon} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.ProfileInfo}>
                                <Text style={styles.ProfileName} numberOfLines={1} ellipsizeMode='tail'>{userData.data.user.name}</Text>
                                <Text style={styles.ProfileEmail}>{userData.data.user.phone}</Text>
                            </View>
                        </View>
                        <View style={styles.SettingsWrap}>
                            <View style={[styles.DarkMode, {borderTopColor: colors.lighter, borderBottomColor: colors.lighter}]}>
                                <View style={styles.DarkModeTextWrap}>
                                    <Text style={[styles.DarkModeText, {color: colors.pText}]}>Darkmode</Text>
                                </View>
                                <View>
                                    <Switch
                                        trackColor={{ false: "#767577", true: Colors.primary }}
                                        thumbColor={isEnabled ? Colors.dark : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => toggleSwitch()}
                                        value={isEnabled}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={[styles.SettingsItem, {borderBottomColor: colors.lighter}]}
                                onPress={()=> bsPop.current.snapTo(0)}
                            >
                                <View style={styles.SettingsIcon}>
                                    <Feather name='bell' style={[styles.SettingSvgIcon, {
                                        fontSize: deviceType === 'Tablet' ? 
                                        EStyleSheet.value('14rem') : 
                                        EStyleSheet.value('20rem')
                                    }]} />
                                </View>
                                <Text style={[styles.SettingsItemText, {color: colors.pText}]}>Notification Settings</Text>
                            </TouchableOpacity>  
                            <TouchableOpacity 
                                style={[styles.SettingsItem, {borderBottomColor: colors.lighter}]}
                                onPress={()=> navigation.navigate('EditProfile', {
                                    userData: userData,
                                    token: 'dummy-token'
                                })}
                            >
                                <View style={styles.SettingsIcon}>
                                    <EditIcon style={styles.SettingSvgIcon} fill={Colors.dark} />
                                </View>
                                <Text style={[styles.SettingsItemText, {color: colors.pText}]}>Edit Profile</Text>
                            </TouchableOpacity>  
                            <TouchableOpacity 
                                style={[styles.SettingsItem, {borderBottomColor: colors.lighter}]}
                                onPress={()=> navigation.navigate('ChangePassword')}
                            >
                                <View style={styles.SettingsIcon}>
                                    <KeyIcon style={styles.SettingSvgIcon} fill={Colors.dark} />
                                </View>
                                <Text style={[styles.SettingsItemText, {color: colors.pText}]}>Change Password</Text>
                            </TouchableOpacity>  
                            <TouchableOpacity 
                                style={[styles.SettingsItem, {borderBottomColor: colors.lighter}]}
                                onPress={()=> logout()}
                            >
                                <View style={styles.SettingsIcon}>
                                    <LogoutIcon style={styles.SettingSvgIcon} fill={Colors.dark} />
                                </View>
                                <Text style={[styles.SettingsItemText, {color: colors.pText}]}>Logout</Text>
                            </TouchableOpacity>  
                        </View>
                        <View style={styles.FooterWrap}>
                            <Text style={[styles.FooterText, {color: colors.text}]}>© Mylo. Version 1.0</Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            }
        </View>
    )
}

const screenHeight = Dimensions.get('window').height;

const styles = EStyleSheet.create({
    Container: {
        flex: 1
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
        marginBottom: deviceType === 'Tablet' ? '13rem' : '25rem',
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProMedium',
        color: Colors.dark,
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    ProfileWrap: {
        height: deviceType === 'Tablet' ? '130rem' : '180rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '15rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: Colors.primary,
    },
    ProfileInfo: {
        marginTop: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    ProfileImg: {
        height: deviceType === 'Tablet' ? '62rem' : '90rem',
        width: deviceType === 'Tablet' ? '62rem' : '90rem',
        borderRadius: deviceType === 'Tablet' ? '31rem' : '45rem',
    },
    ImageEdit: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark,
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
        width: deviceType === 'Tablet' ? '18rem' : '30rem',
        borderRadius: deviceType === 'Tablet' ? '9rem' : '15rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageEditIcon: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        color: Colors.primary,
    },
    ProfileName: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProRegular',
        textAlign: 'center',
        maxWidth: '80%'
    },
    ProfileEmail: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        fontFamily: 'GTWalsheimProLight',
        textAlign: 'center',
        letterSpacing: '0.5rem'
    },
    SettingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        paddingVertical: deviceType === 'Tablet' ? '9rem' : '15rem',
        borderBottomWidth: '1rem'
    },
    SettingsIcon: {
        height: deviceType === 'Tablet' ? '30rem' : '45rem',
        width: deviceType === 'Tablet' ? '30rem' : '45rem',
        borderRadius: deviceType === 'Tablet' ? '15rem' : '23rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    SettingSvgIcon: {
        height: deviceType === 'Tablet' ? '14rem' : '20rem',
        width: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    SettingsItemText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        marginLeft: deviceType === 'Tablet' ? '9rem' : '15rem',
    },
    FooterWrap: {
        paddingVertical: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FooterText: {
        textAlign: 'center',
        fontSize: deviceType === 'Tablet' ? '7.5rem' : '13rem',
    },
    BottomSheet: {
        padding: deviceType === 'Tablet' ? '12rem' : '16rem',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: deviceType === 'Tablet' ? '18rem' : '30rem',
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    bsHeader: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    bsHandle: {
        height: deviceType === 'Tablet' ? '3.75rem' : '6rem',
        width: deviceType === 'Tablet' ? '32rem' : '50rem',
        borderRadius: '3rem'
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        width: '100%'
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProMedium',
    },
    DarkMode: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: deviceType === 'Tablet' ? '13rem' : '25rem',
        marginBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
        height: deviceType === 'Tablet' ? '35rem' : '55rem',
    },
    DarkModeTextWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    DarkModeText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingLeft: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    ConfirmPop: {
        padding: deviceType === 'Tablet' ? '14rem' : '20rem'
    },
    ConfirmPopText: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        paddingBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ListWrap: {
        borderWidth: '1rem',
        alignSelf: 'center',
        borderRadius: '5rem'
    },
    DistanceBtn: {
        height: deviceType === 'Tablet' ? '21.65rem' : '35rem',
        width: deviceType === 'Tablet' ? '35rem' : '55rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: '1rem'
    },
    DistanceBtnText: {
        fontFamily: 'GTWalsheimProMedium'
    }
})

export default ProfileScreen;

