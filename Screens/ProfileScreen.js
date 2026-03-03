import React, { useState, useContext, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
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
                <Animatable.View animation="fadeIn" duration={800} style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                            <Text style={[styles.TopBarBtnText, {color: colors.text}]}>Profile Settings</Text>
                            <TouchableOpacity onPress={()=> navigation.navigate('Home')} style={styles.BackBtnContainer}>
                                <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.text}]} />
                            </TouchableOpacity>
                        </View>

                        <Animatable.View animation="fadeInDown" delay={200} style={styles.ProfileCardWrap}>
                            <View style={[styles.ProfileCard, {backgroundColor: colors.bgVar, borderColor: colors.lighter}]}>
                                <TouchableOpacity 
                                    style={styles.ProfileImgContainer}
                                    onPress={() => bs.current.snapTo(0)}
                                >
                                    <Image 
                                        source={require('../assets/profile-user.png')} 
                                        resizeMode='cover' 
                                        style={styles.ProfileImg}
                                    />
                                    <View style={[styles.ImageEdit, {backgroundColor: colors.primary}]}>
                                        <Feather name='camera' style={[styles.ImageEditIcon, {color: Colors.dark}]} />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.ProfileInfo}>
                                    <Text style={[styles.ProfileNameText, {color: colors.text}]} numberOfLines={1}>{userData.data.user.name}</Text>
                                    <Text style={[styles.ProfilePhoneText, {color: colors.light}]}>{userData.data.user.phone}</Text>
                                </View>
                            </View>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={400} style={styles.SettingsWrap}>
                            <View style={[styles.SettingsSection, {backgroundColor: colors.bgVar, borderColor: colors.lighter}]}>
                                <View style={[styles.DarkMode, {borderBottomWidth: 1, borderBottomColor: colors.lighter}]}>
                                    <View style={styles.SettingsItemIconWrap}>
                                        <View style={[styles.SettingsIconSmall, {backgroundColor: 'rgba(255, 255, 255, 0.05)'}]}>
                                            <Feather name='moon' size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.SettingsItemText, {color: colors.text}]}>Dark Mode</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#333", true: colors.primary }}
                                        thumbColor={isEnabled ? Colors.dark : "#f4f3f4"}
                                        ios_backgroundColor="#1A1B1F"
                                        onValueChange={() => toggleSwitch()}
                                        value={isEnabled}
                                    />
                                </View>

                                <TouchableOpacity 
                                    style={[styles.SettingsItem, {borderBottomWidth: 1, borderBottomColor: colors.lighter}]}
                                    onPress={()=> bsPop.current.snapTo(0)}
                                >
                                    <View style={styles.SettingsItemIconWrap}>
                                        <View style={[styles.SettingsIconSmall, {backgroundColor: 'rgba(255, 255, 255, 0.05)'}]}>
                                            <Feather name='bell' size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.SettingsItemText, {color: colors.text}]}>Notification Radius</Text>
                                    </View>
                                    <View style={styles.RightAction}>
                                        <Text style={[styles.NotifyText, {color: colors.primary}]}>{notifyMe}km</Text>
                                        <Feather name='chevron-right' size={18} color={colors.light} />
                                    </View>
                                </TouchableOpacity>  

                                <TouchableOpacity 
                                    style={[styles.SettingsItem, {borderBottomWidth: 1, borderBottomColor: colors.lighter}]}
                                    onPress={()=> navigation.navigate('EditProfile', {
                                        userData: userData,
                                        token: 'dummy-token'
                                    })}
                                >
                                    <View style={styles.SettingsItemIconWrap}>
                                        <View style={[styles.SettingsIconSmall, {backgroundColor: 'rgba(255, 255, 255, 0.05)'}]}>
                                            <Feather name='edit-3' size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.SettingsItemText, {color: colors.text}]}>Edit Profile</Text>
                                    </View>
                                    <Feather name='chevron-right' size={18} color={colors.light} />
                                </TouchableOpacity>  

                                <TouchableOpacity 
                                    style={[styles.SettingsItem, {borderBottomWidth: 1, borderBottomColor: colors.lighter}]}
                                    onPress={()=> navigation.navigate('ChangePassword')}
                                >
                                    <View style={styles.SettingsItemIconWrap}>
                                        <View style={[styles.SettingsIconSmall, {backgroundColor: 'rgba(255, 255, 255, 0.05)'}]}>
                                            <Feather name='lock' size={18} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.SettingsItemText, {color: colors.text}]}>Change Password</Text>
                                    </View>
                                    <Feather name='chevron-right' size={18} color={colors.light} />
                                </TouchableOpacity>  

                                <TouchableOpacity 
                                    style={styles.SettingsItem}
                                    onPress={()=> logout()}
                                >
                                    <View style={styles.SettingsItemIconWrap}>
                                        <View style={[styles.SettingsIconSmall, {backgroundColor: 'rgba(255, 78, 78, 0.1)'}]}>
                                            <Feather name='log-out' size={18} color="#FF4E4E" />
                                        </View>
                                        <Text style={[styles.SettingsItemText, {color: "#FF4E4E"}]}>Logout Account</Text>
                                    </View>
                                </TouchableOpacity>  
                            </View>
                        </Animatable.View>

                        <View style={styles.FooterWrap}>
                            <Text style={[styles.FooterText, {color: colors.light}]}>Mylo v2026.1.0 • Connected Hearts</Text>
                        </View>
                    </ScrollView>
                </Animatable.View>
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
    ProfileCardWrap: {
        paddingHorizontal: '25rem',
        marginTop: '20rem',
        marginBottom: '30rem',
    },
    ProfileCard: {
        width: '100%',
        paddingVertical: '30rem',
        paddingHorizontal: '20rem',
        borderRadius: '24rem',
        borderWidth: '1rem',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    ProfileImgContainer: {
        position: 'relative',
        marginBottom: '15rem',
    },
    ProfileImg: {
        height: '110rem',
        width: '110rem',
        borderRadius: '55rem',
        borderWidth: '3rem',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    ImageEdit: {
        position: 'absolute',
        bottom: '5rem',
        right: '5rem',
        height: '32rem',
        width: '32rem',
        borderRadius: '16rem',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    ImageEditIcon: {
        fontSize: '16rem',
    },
    ProfileInfo: {
        alignItems: 'center',
    },
    ProfileNameText: {
        fontSize: '24rem',
        fontFamily: 'GTWalsheimProBold',
        marginBottom: '5rem',
    },
    ProfilePhoneText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProRegular',
        letterSpacing: '0.5rem',
    },
    SettingsWrap: {
        paddingHorizontal: '25rem',
    },
    SettingsSection: {
        borderRadius: '24rem',
        borderWidth: '1rem',
        overflow: 'hidden',
    },
    SettingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '20rem',
        paddingVertical: '18rem',
    },
    DarkMode: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '20rem',
        paddingVertical: '16rem',
    },
    SettingsItemIconWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    SettingsIconSmall: {
        height: '42rem',
        width: '42rem',
        borderRadius: '14rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '15rem',
    },
    SettingsItemText: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProMedium',
    },
    RightAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    NotifyText: {
        fontSize: '14rem',
        fontFamily: 'GTWalsheimProBold',
        marginRight: '8rem',
    },
    FooterWrap: {
        marginTop: '40rem',
        marginBottom: '30rem',
        alignItems: 'center',
    },
    FooterText: {
        fontSize: '13rem',
        fontFamily: 'GTWalsheimProRegular',
        opacity: 0.5,
    },
    BottomSheet: {
        padding: '25rem',
        height: '100%',
        borderTopLeftRadius: '30rem',
        borderTopRightRadius: '30rem',
    },
    bsHeader: {
        height: '30rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bsHandle: {
        height: '6rem',
        width: '50rem',
        borderRadius: '3rem',
    },
    SubmitContainer: {
        height: '55rem',
        borderRadius: '16rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15rem',
        width: '100%'
    },
    SubmitText: {
        fontSize: '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProBold',
    },
    ConfirmPop: {
        padding: '25rem',
    },
    ConfirmPopText: {
        fontFamily: 'GTWalsheimProBold',
        fontSize: '20rem',
        marginBottom: '20rem',
    },
    ListWrap: {
        borderWidth: '1rem',
        borderRadius: '15rem',
        overflow: 'hidden',
    },
    DistanceBtn: {
        height: '50rem',
        width: '70rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: '1rem',
    },
    DistanceBtnText: {
        fontSize: '16rem',
        fontFamily: 'GTWalsheimProBold'
    }
})

export default ProfileScreen;

