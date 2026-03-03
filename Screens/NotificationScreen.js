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
                        type_id: 101
                    },
                    {
                        id: 2,
                        image: null,
                        heading: 'Priya Sharma accepted your request',
                        timestamp: '1 hour ago',
                        type: 'interaction',
                        type_id: null
                    },
                    {
                        id: 3,
                        image: null,
                        heading: 'Alex Johnson sent you a location',
                        timestamp: '3 hours ago',
                        type: 'interaction',
                        type_id: null
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
            {
                notificationData === null ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={colors.pText} size="large" />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                            <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Notifications</Text>
                            <TouchableOpacity onPress={()=> navigation.goBack()}>
                                <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.NotificationsWrap}>
                            {
                                notificationData === 'empty' ?
                                    <View style={{ flex: 1 }}><Text style={[styles.emptyText, { color: colors.pText }]}>No Notification</Text></View> :
                                    <FlatList
                                        style={styles.ListWrap}
                                        data={notificationData}
                                        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={[styles.NotificationsBox, { borderBottomColor: colors.lighter }]}>
                                                    <View style={styles.NotificationsBoxInner}>
                                                        <Image
                                                            source={require('../assets/profile-user.png')}
                                                            resizeMode='cover'
                                                            style={styles.NotificationsImg}
                                                        />
                                                        <View style={styles.NotificationsInfo}>
                                                            <Text style={[styles.NotificationsText, { color: colors.text }]}>{item.heading}</Text>
                                                            <View style={styles.NotificationsActions}>
                                                                <Text style={[styles.NotificationsTextTime, { color: colors.light }]}>{item.timestamp}</Text>
                                                                {
                                                                    item.type_id != null && item.type === 'request' ?
                                                                    <View style={styles.NotificationsActionsRight}>
                                                                        <TouchableOpacity
                                                                            onPress={() => handleRespond(item.type_id, 'accepted')}
                                                                        >
                                                                            <View style={[styles.NotificationBtn, { backgroundColor: colors.primary, }]}>
                                                                                <Text style={styles.NotificationBtnText}>Accept</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity
                                                                            onPress={() => handleRespond(item.type_id, 'rejected')}
                                                                        >
                                                                            <View style={[styles.NotificationBtn, styles.NotificationBtnVar]}>
                                                                                <Text style={[styles.NotificationBtnText, { color: '#fff' }]}>Reject</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    </View> : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                            }
                        </View>
                    </View>
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
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    NotificationsBox: {
        paddingVertical: deviceType === 'Tablet' ? '9rem' : '15rem',
        borderBottomWidth: '1rem',
    },
    NotificationsBoxInner: {
        flexDirection: 'row',
        marginLeft: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    NotificationsImg: {
        height: deviceType === 'Tablet' ? '30rem' : '42rem',
        width: deviceType === 'Tablet' ? '30rem' : '42rem',
        borderRadius: deviceType === 'Tablet' ? '15rem' : '21rem',
    },
    NotificationsInfo: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        flexShrink: 1,
        flex: 1
    },
    NotificationsText: {
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '14rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    NotificationsActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    NotificationsTextTime: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    NotificationsActionsRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    NotificationBtn: {
        paddingVertical: deviceType === 'Tablet' ? '3.2rem' : '5rem',
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '12rem',
        marginLeft: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem'
    },
    NotificationBtnText: {
        fontFamily: 'GTWalsheimProMedium',
        fontSize: deviceType === 'Tablet' ? '8.5rem' : '13rem',
    },
    NotificationBtnVar: {
        backgroundColor: '#CD2F2A'
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: deviceType === 'Tablet' ? '18rem' : '30rem',
    }
})

export default NotificationScreen;

