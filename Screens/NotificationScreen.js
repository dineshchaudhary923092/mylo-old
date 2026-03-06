import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../Constants/Colors';
import { Api } from '../Constants/Api';
import StatusBarComponent from '../Components/StatusbarComponent';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../Hooks/useAxios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

let deviceType = getDeviceType();

const FILTER_TABS = ['All', 'Requests', 'Activity'];

const NotificationScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    const bs = useRef(null);
    const fall = new Animated.Value(1);

    const [notificationData, setNotificationData] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [distance, setDistance] = useState([
        { dist: 5, selected: true },
        { dist: 10, selected: false },
        { dist: 25, selected: false },
        { dist: 50, selected: false },
    ]);

    const changeDistance = (selectedItem) => {
        let items = distance.map(item => ({
            ...item,
            selected: item.dist === selectedItem.dist
        }));
        setDistance(items);
        setTimeout(() => bs.current.snapTo(1), 300);
    };

    const [getData, responseData, setResponseData, responseType, response, setResponse, _getUserData, userData, setUserData, isData] = useAxios();

    useEffect(() => {
        if (isFocused) {
            setNotificationData([
                {
                    id: 1,
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                    heading: 'James Carter wants to be your buddy',
                    timestamp: '5 min ago',
                    type: 'request',
                    type_id: 101,
                    role: 'New Request'
                },
                {
                    id: 2,
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                    heading: 'Priya Sharma accepted your buddy request',
                    timestamp: '1 hr ago',
                    type: 'interaction',
                    type_id: null,
                    role: 'Activity'
                },
                {
                    id: 3,
                    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
                    heading: 'Alex Johnson sent you a location pin',
                    timestamp: '3 hrs ago',
                    type: 'interaction',
                    type_id: null,
                    role: 'Activity'
                },
                {
                    id: 4,
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
                    heading: 'Sarah M. liked your profile update',
                    timestamp: 'Yesterday',
                    type: 'interaction',
                    type_id: null,
                    role: 'Activity'
                },
            ]);
        }
    }, [isFocused]);

    const handleRespond = (id, respondText) => {
        setNotificationData(prev => prev.filter(item => item.id !== id));
    }

    const getFilteredData = () => {
        if (!Array.isArray(notificationData)) return notificationData;
        if (activeFilter === 'Requests') return notificationData.filter(i => i.type === 'request');
        if (activeFilter === 'Activity') return notificationData.filter(i => i.type === 'interaction');
        return notificationData;
    };

    const renderNotificationCard = ({ item, index }) => {
        const isRequest = item.type === 'request';
        return (
            <Animatable.View animation="fadeInUp" delay={80 + (index * 80)} useNativeDriver>
                <View style={[styles.Card, { borderColor: isRequest ? 'rgba(127, 255, 212, 0.18)' : 'rgba(255, 255, 255, 0.08)' }]}>
                    <View style={styles.AvatarWrap}>
                        <Image source={{ uri: item.image }} style={styles.AvatarImg} />
                        <View style={[styles.AvatarBadge, { backgroundColor: isRequest ? '#7FFFD4' : '#2A2B2E' }]}>
                            <Feather name={isRequest ? 'user-plus' : 'bell'} size={11} color={isRequest ? '#09090B' : 'rgba(255,255,255,0.7)'} />
                        </View>
                    </View>

                    <View style={styles.CardContent}>
                        <View style={styles.CardTopRow}>
                            <View style={[styles.RolePill, { backgroundColor: isRequest ? 'rgba(127, 255, 212, 0.1)' : 'rgba(255, 255, 255, 0.06)' }]}>
                                <Text style={[styles.RoleText, { color: isRequest ? '#7FFFD4' : 'rgba(255,255,255,0.45)' }]}>{item.role}</Text>
                            </View>
                            <Text style={styles.TimeText}>{item.timestamp}</Text>
                        </View>
                        <Text style={styles.CardBodyText} numberOfLines={2}>{item.heading}</Text>
                        {isRequest && (
                            <View style={styles.ActionRow}>
                                <TouchableOpacity onPress={() => handleRespond(item.id, 'accepted')} style={styles.AcceptBtn}>
                                    <Text style={styles.AcceptBtnText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRespond(item.id, 'rejected')} style={styles.DeclineBtn}>
                                    <Text style={styles.DeclineBtnText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Animatable.View>
        );
    };

    const renderRadiusSheet = () => (
        <View style={styles.BsContentCard}>
            <View style={styles.BsIndicator} />
            <Text style={styles.BsTitle}>Alert Radius</Text>
            <Text style={styles.BsSubtitle}>Select the distance (km) for proximity alerts</Text>
            
            <View style={styles.RadiusGrid}>
                {distance.map((item, index) => (
                    <TouchableOpacity 
                        key={index}
                        activeOpacity={0.8}
                        style={[
                            styles.RadiusBox, 
                            item.selected && styles.RadiusBoxActive
                        ]}
                        onPress={() => changeDistance(item)}
                    >
                        <Text style={[
                            styles.RadiusBoxText, 
                            item.selected && styles.RadiusBoxTextActive
                        ]}>
                            {item.dist}
                        </Text>
                        <Text style={[
                            styles.RadiusUnit, 
                            item.selected && styles.RadiusUnitActive
                        ]}>KM</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.Screen}>
            <Animated.View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: '#000',
                    opacity: Animated.interpolate(fall, {
                        inputRange: [0, 1],
                        outputRange: [0.75, 0],
                    }),
                    zIndex: 15,
                }}
                pointerEvents={fall >= 0.9 ? 'none' : 'auto'}
            >
                <TouchableOpacity 
                    style={{ flex: 1 }} 
                    activeOpacity={1} 
                    onPress={() => bs.current.snapTo(1)} 
                />
            </Animated.View>

            <BottomSheet
                ref={bs}
                snapPoints={[EStyleSheet.value('420rem'), 0]}
                renderContent={renderRadiusSheet}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
            />
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={styles.GradientBg}
            />

            <View style={styles.GlowBlob} pointerEvents="none">
                <Svg width="500" height="500">
                    <Defs>
                        <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.2" />
                            <Stop offset="40%" stopColor="#7FFFD4" stopOpacity="0.08" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>

            <StatusBarComponent bgcolor="transparent" barStyle="light-content" />

            {/* Unified Header */}
            <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.BackBtnContainer}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <AntDesign name="arrowleft" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <Text style={styles.HeaderTitle}>Notifications</Text>
                <TouchableOpacity 
                    onPress={() => bs.current.snapTo(0)}
                    style={{ width: EStyleSheet.value('40rem'), height: EStyleSheet.value('40rem'), alignItems: 'center', justifyContent: 'center' }}
                >
                    <Feather name="navigation" size={20} color="#7FFFD4" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginTop: insets.top + (deviceType === 'Tablet' ? 65 : 78) }}>
                {/* Filter tabs */}
                <View style={styles.FilterWrap}>
                    {FILTER_TABS.map((tab) => (
                        <TouchableOpacity key={tab} onPress={() => setActiveFilter(tab)} activeOpacity={0.75} style={[styles.FilterTab, activeFilter === tab && styles.FilterTabActive]}>
                            <Text style={[styles.FilterTabText, activeFilter === tab && styles.FilterTabTextActive]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {notificationData === null ? (
                    <View style={styles.Center}>
                        <ActivityIndicator color={colors.primary} size="large" />
                    </View>
                ) : (
                    <Animatable.View animation="fadeIn" duration={600} style={{ flex: 1 }}>
                        {getFilteredData() === 'empty' || (Array.isArray(getFilteredData()) && getFilteredData().length === 0) ? (
                            <View style={styles.Center}>
                                <View style={styles.EmptyIconWrap}>
                                    <Feather name="bell-off" size={28} color="rgba(127,255,212,0.5)" />
                                </View>
                                <Text style={styles.EmptyTitle}>All caught up</Text>
                                <Text style={styles.EmptySubtitle}>No notifications in this category</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={getFilteredData()}
                                keyExtractor={item => item.id.toString()}
                                renderItem={renderNotificationCard}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.ListContainer}
                            />
                        )}
                    </Animatable.View>
                )}
            </View>
        </View>
    );
}

const styles = EStyleSheet.create({
    Screen: { flex: 1, backgroundColor: '#09090B' },
    GradientBg: { ...StyleSheet.absoluteFillObject },
    GlowBlob: {
        position: 'absolute', top: -150, left: '50%',
        marginLeft: -250, width: 500, height: 500,
        alignItems: 'center', justifyContent: 'center',
    },
    Header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', paddingBottom: '15rem',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    },
    BackBtnContainer: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    },
    HeaderTitle: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', letterSpacing: '0.3rem' },
    FilterWrap: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)',
        marginHorizontal: '20rem', borderRadius: '14rem', padding: '4rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: '16rem',
    },
    FilterTab: { flex: 1, height: '36rem', borderRadius: '10rem', alignItems: 'center', justifyContent: 'center' },
    FilterTabActive: { backgroundColor: '#7FFFD4' },
    FilterTabText: { fontSize: '13rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.4)' },
    FilterTabTextActive: { color: '#09090B', fontFamily: 'GTWalsheimProBold' },
    ListContainer: { paddingHorizontal: '20rem', paddingBottom: '40rem' },
    Card: {
        flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '24rem', borderWidth: 1, padding: '16rem', marginBottom: '12rem',
    },
    AvatarWrap: { position: 'relative', marginRight: '14rem' },
    AvatarImg: { width: '52rem', height: '52rem', borderRadius: '26rem', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
    AvatarBadge: {
        position: 'absolute', bottom: -1, right: -4, width: '22rem', height: '22rem',
        borderRadius: '11rem', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#111214',
    },
    CardContent: { flex: 1 },
    CardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8rem' },
    RolePill: { borderRadius: '8rem', paddingHorizontal: '8rem', paddingVertical: '3rem' },
    RoleText: { fontSize: '10rem', fontFamily: 'GTWalsheimProBold', letterSpacing: '0.5rem', textTransform: 'uppercase' },
    TimeText: { fontSize: '11rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.3)' },
    CardBodyText: { fontSize: '14rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.85)', lineHeight: '20rem' },
    ActionRow: { flexDirection: 'row', marginTop: '14rem' },
    AcceptBtn: {
        flex: 1, height: '36rem', borderRadius: '18rem', backgroundColor: '#7FFFD4',
        alignItems: 'center', justifyContent: 'center', marginRight: '10rem',
    },
    AcceptBtnText: { fontSize: '13rem', fontFamily: 'GTWalsheimProBold', color: '#09090B' },
    DeclineBtn: {
        flex: 1, height: '36rem', borderRadius: '18rem', backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    DeclineBtnText: { fontSize: '13rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.45)' },
    Center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: '100rem' },
    EmptyIconWrap: {
        width: '64rem', height: '64rem', borderRadius: '32rem',
        backgroundColor: 'rgba(127, 255, 212, 0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: '16rem',
    },
    EmptyTitle: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginBottom: '6rem' },
    EmptySubtitle: { fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.3)' },
    BottomSheetContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    RadiusGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '32rem' },
    RadiusBox: {
        width: '48%', height: '80rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center', marginBottom: '12rem',
    },
    RadiusBoxActive: { backgroundColor: '#7FFFD4', borderColor: '#7FFFD4' },
    RadiusBoxText: { fontSize: '24rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    RadiusBoxTextActive: { color: '#09090B' },
    RadiusUnit: { fontSize: '12rem', fontFamily: 'GTWalsheimProBold', color: 'rgba(255,255,255,0.3)', marginTop: '2rem' },
    RadiusUnitActive: { color: 'rgba(0,0,0,0.5)' },
    BsContentCard: {
        backgroundColor: '#111214', borderTopLeftRadius: '32rem', borderTopRightRadius: '32rem',
        padding: '24rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        height: '420rem',
    },
    BsIndicator: { width: '40rem', height: '5rem', borderRadius: '3rem', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: '20rem' },
    BsTitle: { fontSize: '22rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', marginBottom: '8rem' },
    BsSubtitle: { fontSize: '15rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '32rem' },
});

export default NotificationScreen;
