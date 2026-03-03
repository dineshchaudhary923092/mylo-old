import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '../Constants/Colors';
import { Api } from '../Constants/Api';
import StatusBarComponent from '../Components/StatusbarComponent';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../Hooks/useAxios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();

import * as Animatable from 'react-native-animatable';

const NotificationScreen = ({ navigation, route }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();
    const [notificationData, setNotificationData] = useState(null);

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
        if (responseType === 'getNotifications' || responseType === 'requestRespond') {
            if (responseData.error === 1) {
                if (JSON.stringify(responseData.data.length) > 0) {
                    const matchLocals = async () => {
                        await AsyncStorage.getItem('localContacts').then((value) => {
                            value = value != null ? JSON.parse(value) : "";
                            if (value != "") {
                                for (var i = 0; i < parseInt(value.length); i++) {
                                    for (var j = 0; j < parseInt(responseData.data.length); j++) {
                                        if (value[i].phone == responseData.data[j].phone) {
                                            responseData.data[j].heading = responseData.data[j].heading.replace("{name}", value[i].name.split(" ")[0]);
                                        } else {
                                            responseData.data[j].heading = responseData.data[j].heading.replace("{name}", responseData.data[j].user_name.split(' ')[0]);
                                        }
                                    }
                                }
                                setNotificationData(responseData.data);
                            } else {
                                for (var j = 0; j < parseInt(responseData.data.length); j++) {
                                    responseData.data[j].heading = responseData.data[j].heading.replace("{name}", responseData.data[j].user_name.split(' ')[0]);
                                }
                                setNotificationData(responseData.data);
                            }

                        })
                    }
                    matchLocals();
                } else {
                    setNotificationData('empty');
                }
                if (responseData.msg === 'Request accepted') {
                    navigation.navigate('Home')
                }
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        // getUserData removed - not needed for design showcase
    }, [])

    useEffect(() => {
        setNotificationData(null);
        if(isFocused === true) {
            const getNotificationData = async () => {
                setNotificationData([
                    {
                        id: 1,
                        image: null,
                        heading: 'James Carter wants to be your buddy',
                        timestamp: '5 minutes ago',
                        type: 'request',
                        type_id: 101,
                        role: 'New Request'
                    },
                    {
                        id: 2,
                        image: null,
                        heading: 'Priya Sharma accepted your request',
                        timestamp: '1 hour ago',
                        type: 'interaction',
                        type_id: null,
                        role: 'Activity'
                    },
                    {
                        id: 3,
                        image: null,
                        heading: 'Alex Johnson sent you a location',
                        timestamp: '3 hours ago',
                        type: 'interaction',
                        type_id: null,
                        role: 'Activity'
                    }
                ]);
            }
            getNotificationData();
        }
    }, [isFocused])

    const handleRespond = (id, respondText) => {
        setNotificationData(prev => {
            if (Array.isArray(prev)) {
                return prev.filter(item => item.id !== id);
            }
            return prev;
        });
    }

    return (
        <View style={[styles.Container, { backgroundColor: colors.background }]}>
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            
            <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                <Text style={[styles.TopBarBtnText, {color: colors.text}]}>Alerts</Text>
                <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.BackBtnContainer}>
                    <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.text}]} />
                </TouchableOpacity>
            </View>

            {
                notificationData === null ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={colors.primary} size="large" />
                    </View>
                    :
                    <Animatable.View animation="fadeIn" duration={800} style={{ flex: 1 }}>
                        <View style={styles.NotificationsWrap}>
                            {
                                notificationData === 'empty' ?
                                    <View style={styles.EmptyState}>
                                        <AntDesign name="notification" size={60} color={colors.lighter} />
                                        <Text style={[styles.emptyText, { color: colors.light }]}>No notifications yet</Text>
                                    </View> :
                                    <FlatList
                                        contentContainerStyle={{paddingBottom: 40}}
                                        style={styles.ListWrap}
                                        data={notificationData}
                                        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <Animatable.View 
                                                    animation="fadeInUp" 
                                                    delay={100 + (index * 100)} 
                                                    style={[styles.NotificationsBox, { backgroundColor: colors.bgVar, borderColor: colors.lighter }]}
                                                >
                                                    <View style={styles.NotificationsBoxInner}>
                                                        <View style={styles.ImgContainer}>
                                                            <Image
                                                                source={require('../assets/profile-user.png')}
                                                                resizeMode='cover'
                                                                style={styles.NotificationsImg}
                                                            />
                                                            <View style={[styles.StatusDot, {backgroundColor: item.type === 'request' ? colors.primary : '#444'}]} />
                                                        </View>
                                                        
                                                        <View style={styles.NotificationsInfo}>
                                                            <View style={styles.RowBetween}>
                                                                <Text style={[styles.RoleText, { color: colors.primary }]}>{item.role}</Text>
                                                                <Text style={[styles.NotificationsTextTime, { color: colors.light }]}>{item.timestamp}</Text>
                                                            </View>
                                                            
                                                            <Text style={[styles.NotificationsText, { color: colors.text }]}>{item.heading}</Text>
                                                            
                                                            {
                                                                item.type_id != null && item.type === 'request' ?
                                                                <View style={styles.NotificationsActionsRight}>
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.8}
                                                                        onPress={() => handleRespond(item.type_id, 'accepted')}
                                                                        style={[styles.NotificationBtn, { backgroundColor: colors.primary }]}
                                                                    >
                                                                        <Text style={styles.NotificationBtnText}>Accept</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.8}
                                                                        onPress={() => handleRespond(item.type_id, 'rejected')}
                                                                        style={[styles.NotificationBtn, styles.NotificationBtnVar, {borderColor: colors.lighter}]}
                                                                    >
                                                                        <Text style={[styles.NotificationBtnText, { color: colors.text }]}>Decline</Text>
                                                                    </TouchableOpacity>
                                                                </View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                </Animatable.View>
                                            )
                                        }}
                                    />
                            }
                        </View>
                    </Animatable.View>
            }
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
    NotificationsBox: {
        marginHorizontal: '20rem',
        marginTop: '15rem',
        padding: '15rem',
        borderRadius: '20rem',
        borderWidth: '1.2rem',
    },
    NotificationsBoxInner: {
        flexDirection: 'row',
    },
    ImgContainer: {
        position: 'relative',
    },
    NotificationsImg: {
        height: '50rem',
        width: '50rem',
        borderRadius: '25rem',
    },
    StatusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '14rem',
        height: '14rem',
        borderRadius: '7rem',
        borderWidth: '2rem',
        borderColor: '#16171B',
    },
    NotificationsInfo: {
        marginLeft: '15rem',
        flex: 1,
    },
    RowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5rem',
    },
    RoleText: {
        fontSize: '12rem',
        fontFamily: 'GTWalsheimProBold',
        letterSpacing: '0.5rem',
        textTransform: 'uppercase',
    },
    NotificationsText: {
        fontSize: '15rem',
        fontFamily: 'GTWalsheimProMedium',
        lineHeight: '20rem',
    },
    NotificationsTextTime: {
        fontSize: '11rem',
        fontFamily: 'GTWalsheimProRegular',
        opacity: 0.6,
    },
    NotificationsActionsRight: {
        flexDirection: 'row',
        marginTop: '15rem',
    },
    NotificationBtn: {
        height: '38rem',
        paddingHorizontal: '20rem',
        borderRadius: '12rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '10rem',
    },
    NotificationBtnText: {
        fontFamily: 'GTWalsheimProBold',
        fontSize: '13rem',
    },
    NotificationBtnVar: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: '1rem',
    },
    EmptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '100rem',
    },
    emptyText: {
        marginTop: '20rem',
        fontSize: '18rem',
        fontFamily: 'GTWalsheimProBold',
    }
})

export default NotificationScreen;

