import React, { useState, useContext, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, Switch, ScrollView, FlatList, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import { useIsFocused } from '@react-navigation/native';
import useAxios from '../Hooks/useAxios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

let deviceType = getDeviceType();

const ProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();

    const bs = useRef(null);
    const bsPop = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isBsOpen, setIsBsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [distance, setDistance] = useState([
        { dist: 5, selected: true },
        { dist: 10, selected: false },
        { dist: 25, selected: false },
        { dist: 50, selected: false },
    ]);

    const [getData, responseData, setResponseData, responseType, response, setResponse, _getUserData, userData, setUserData, isData] = useAxios();

    useEffect(() => {
        if (isFocused) {
            // Simulated loading for premium feel
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 600);
        }
    }, [isFocused]);

    const changeDistance = (selectedItem) => {
        let items = distance.map(item => ({
            ...item,
            selected: item.dist === selectedItem.dist
        }));
        setDistance(items);
        setTimeout(() => bsPop.current.snapTo(1), 300);
    };

    const renderAvatarSheet = () => (
        <View style={styles.BottomSheetContainer}>
            <View style={styles.BsContentCard}>
                <View style={styles.BsIndicator} />
                <Text style={styles.BsTitle}>Profile Picture</Text>
                <Text style={styles.BsSubtitle}>Choose how you want to update your photo</Text>
                
                <View style={styles.AvatarOptionsGrid}>
                    <TouchableOpacity style={styles.AvatarOptionItem} activeOpacity={0.8} onPress={() => takePhoto()}>
                        <View style={[styles.AvatarIconCircle, { backgroundColor: 'rgba(127,255,212,0.1)' }]}>
                            <Feather name="camera" size={24} color="#7FFFD4" />
                        </View>
                        <Text style={styles.AvatarOptionLabel}>Camera</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.AvatarOptionItem} activeOpacity={0.8} onPress={() => chooseFromLibrary()}>
                        <View style={[styles.AvatarIconCircle, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                            <Feather name="image" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.AvatarOptionLabel}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.AvatarOptionItem} activeOpacity={0.8} onPress={() => bs.current.snapTo(1)}>
                        <View style={[styles.AvatarIconCircle, { backgroundColor: 'rgba(255,78,78,0.08)' }]}>
                            <Feather name="trash-2" size={24} color="#FF4E4E" />
                        </View>
                        <Text style={[styles.AvatarOptionLabel, { color: '#FF4E4E' }]}>Remove</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.BsCancelFullBtn}
                    onPress={() => bs.current.snapTo(1)}
                >
                    <Text style={styles.BsCancelFullBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.18" />
                            <Stop offset="40%" stopColor="#7FFFD4" stopOpacity="0.08" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>

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
                pointerEvents={isBsOpen ? 'auto' : 'none'}
            >
                <TouchableOpacity 
                    style={{ flex: 1 }} 
                    activeOpacity={1} 
                    onPress={() => {
                        bs.current.snapTo(1);
                        bsPop.current.snapTo(1);
                    }} 
                />
            </Animated.View>

            <BottomSheet
                ref={bs}
                snapPoints={[EStyleSheet.value('320rem'), 0]}
                renderContent={renderAvatarSheet}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
                onOpenEnd={() => setIsBsOpen(true)}
                onCloseEnd={() => setIsBsOpen(false)}
            />
            <BottomSheet
                ref={bsPop}
                snapPoints={[EStyleSheet.value('420rem'), 0]}
                renderContent={renderRadiusSheet}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
                onOpenEnd={() => setIsBsOpen(true)}
                onCloseEnd={() => setIsBsOpen(false)}
            />

            <StatusBarComponent bgcolor="transparent" barStyle="light-content" />

            {isLoading ? (
                <View style={styles.Center}>
                    <ActivityIndicator size='large' color={'#7FFFD4'} />
                </View>
            ) : (
                <Animatable.View animation="fadeIn" duration={800} style={{flex: 1}}>
                    {/* Unified Header */}
                    <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Home')} 
                            style={styles.BackBtnContainer}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <AntDesign name="arrowleft" size={22} color="rgba(255,255,255,0.85)" />
                        </TouchableOpacity>
                        <Text style={styles.HeaderTitle}>Profile Settings</Text>
                        <View style={{ width: EStyleSheet.value('40rem') }} />
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        style={{ marginTop: insets.top + (deviceType === 'Tablet' ? 65 : 78) }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        <Animatable.View animation="fadeInDown" delay={200} style={styles.ProfileCardWrap}>
                            <View style={styles.ProfileCard}>
                                <TouchableOpacity 
                                    style={styles.ProfileImgContainer}
                                    onPress={() => bs.current.snapTo(0)}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.ProfileImgBorder}>
                                        <Image 
                                            source={{ uri: userData?.data?.user?.image || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop' }} 
                                            resizeMode='cover' 
                                            style={styles.ProfileImg}
                                        />
                                    </View>
                                    <View style={[styles.ImageEditBadge, {backgroundColor: '#7FFFD4'}]}>
                                        <Feather name='camera' size={14} color='#111214' />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.ProfileInfo}>
                                    <Text style={styles.ProfileNameText} numberOfLines={1}>{userData?.data?.user?.name || 'Alex Johnson'}</Text>
                                    <Text style={styles.ProfilePhoneText}>{userData?.data?.user?.phone || '+1 (555) 000-0000'}</Text>
                                </View>
                            </View>
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" delay={400} style={styles.SettingsWrap}>
                            <View style={styles.SettingsSection}>
                                <Text style={styles.SectionLabel}>Preferences</Text>
                                <View style={styles.SettingsCard}>
                                    <View style={styles.SettingsItemLeft}>
                                        <View style={styles.IconBox}>
                                            <Feather name="moon" size={20} color="#7FFFD4" />
                                        </View>
                                        <Text style={styles.SettingsItemText}>Dark Mode</Text>
                                    </View>
                                    <View style={{ marginRight: EStyleSheet.value('8rem') }}>
                                        <Switch
                                            trackColor={{ false: "#111214", true: "#7FFFD4" }}
                                            thumbColor="#FFFFFF"
                                            ios_backgroundColor="#111214"
                                            value={isDarkMode}
                                            onValueChange={val => setIsDarkMode(val)}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={styles.SettingsCard}
                                    onPress={() => bsPop.current.snapTo(0)}
                                >
                                    <View style={styles.SettingsItemLeft}>
                                        <View style={styles.IconBox}>
                                            <Feather name="target" size={20} color="#7FFFD4" />
                                        </View>
                                        <Text style={styles.SettingsItemText}>Alert Radius</Text>
                                    </View>
                                    <View style={styles.RightAction}>
                                        <Text style={styles.RadiusValText}>{distance.find(d => d.selected)?.dist} KM</Text>
                                        <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.SettingsSection}>
                                <Text style={styles.SectionLabel}>Account</Text>
                                <TouchableOpacity 
                                    style={styles.SettingsCard}
                                    onPress={() => navigation.navigate('EditProfile')}
                                >
                                    <View style={styles.SettingsItemLeft}>
                                        <View style={styles.IconBox}>
                                            <Feather name="user" size={20} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.SettingsItemText}>Edit Profile</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.SettingsCard}
                                    onPress={() => navigation.navigate('ChangePassword')}
                                >
                                    <View style={styles.SettingsItemLeft}>
                                        <View style={styles.IconBox}>
                                            <Feather name="lock" size={20} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.SettingsItemText}>Security</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.SettingsSection}>
                                <Text style={styles.SectionLabel}>Session</Text>
                                <TouchableOpacity style={styles.LogoutCard}>
                                    <View style={styles.SettingsItemLeft}>
                                        <View style={[styles.IconBox, { backgroundColor: 'rgba(255,78,78,0.1)' }]}>
                                            <Feather name="log-out" size={20} color="#FF4E4E" />
                                        </View>
                                        <Text style={[styles.SettingsItemText, { color: '#FF4E4E' }]}>Logout</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.FooterText}>App Version 2.0.4 (2026 Edition)</Text>
                        </Animatable.View>
                    </ScrollView>
                </Animatable.View>
            )}
        </View>
    );
};

const styles = EStyleSheet.create({
    Screen: { flex: 1, backgroundColor: '#09090B' },
    GradientBg: { ...StyleSheet.absoluteFillObject },
    GlowBlob: {
        position: 'absolute', top: -150, left: '50%',
        marginLeft: -250, width: 500, height: 500,
        alignItems: 'center', justifyContent: 'center',
    },
    Center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    Header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', paddingBottom: '15rem',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    },
    HeaderTitle: {
        fontSize: '18rem', fontFamily: 'GTWalsheimProBold',
        letterSpacing: '0.3rem', color: '#FFFFFF',
    },
    BackBtnContainer: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    ProfileCardWrap: { paddingHorizontal: '24rem', marginTop: '12rem' },
    ProfileCard: {
        width: '100%', paddingVertical: '16rem', borderRadius: '24rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    ProfileImgBorder: {
        padding: '3rem', borderRadius: '44rem',
        borderWidth: 1.5, borderColor: '#7FFFD4',
    },
    ProfileImg: { width: '74rem', height: '74rem', borderRadius: '37rem' },
    ProfileImgContainer: { position: 'relative', marginBottom: '12rem' },
    ImageEditBadge: {
        position: 'absolute', bottom: '2rem', right: '2rem',
        width: '28rem', height: '28rem', borderRadius: '14rem',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: '#16171B',
    },
    ProfileInfo: { alignItems: 'center' },
    ProfileNameText: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginBottom: '2rem' },
    ProfilePhoneText: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.45)' },
    SettingsWrap: { paddingHorizontal: '24rem', marginTop: '12rem' },
    SettingsSection: { marginBottom: '12rem' },
    SectionLabel: {
        fontSize: '10rem', fontFamily: 'GTWalsheimProBold',
        color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
        letterSpacing: '1rem', marginBottom: '8rem', marginLeft: '8rem',
    },
    SettingsCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '14rem', paddingVertical: '10rem', borderRadius: '16rem',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.07)',
        marginBottom: '8rem',
    },
    LogoutCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '14rem', paddingVertical: '10rem', borderRadius: '16rem',
        backgroundColor: 'rgba(255, 78, 78, 0.05)',
        borderWidth: 1, borderColor: 'rgba(255, 78, 78, 0.1)',
    },
    SettingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
    IconBox: {
        width: '30rem', height: '30rem', borderRadius: '9rem',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center', justifyContent: 'center', marginRight: '10rem',
    },
    SettingsItemText: { fontSize: '14rem', fontFamily: 'GTWalsheimProMedium', color: '#FFFFFF' },
    RightAction: { flexDirection: 'row', alignItems: 'center' },
    RadiusValText: { fontSize: '14rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', marginRight: '8rem' },
    FooterText: {
        fontSize: '12rem', color: 'rgba(255,255,255,0.25)',
        textAlign: 'center', marginTop: '20rem', fontFamily: 'GTWalsheimProRegular',
    },
    // BottomSheet Styles
    BottomSheetContainer: {
        paddingHorizontal: '16rem', paddingBottom: '20rem',
    },
    BsContentCard: {
        backgroundColor: '#111214', borderTopLeftRadius: '32rem', borderTopRightRadius: '32rem',
        padding: '24rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        height: '420rem',
    },
    BsIndicator: {
        width: '40rem', height: '5rem', borderRadius: '3rem',
        backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: '20rem',
    },
    BsTitle: { fontSize: '22rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', marginBottom: '8rem' },
    BsSubtitle: { fontSize: '15rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '32rem' },
    BsOptionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: '10rem' },
    BsMainOption: { flex: 1, alignItems: 'center' },
    BsIconWrap: {
        width: '60rem', height: '60rem', borderRadius: '20rem',
        alignItems: 'center', justifyContent: 'center', marginBottom: '10rem',
    },
    AvatarOptionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '32rem', marginTop: '10rem' },
    AvatarOptionItem: { alignItems: 'center', width: '30%' },
    AvatarIconCircle: {
        width: '60rem', height: '60rem', borderRadius: '30rem',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: '10rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    AvatarOptionLabel: { fontSize: '12rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', opacity: 0.8 },
    BsCancelFullBtn: {
        height: '52rem', borderRadius: '26rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center',
    },
    BsCancelFullBtnText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: 'rgba(255, 255, 255, 0.5)' },
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
});

export default ProfileScreen;
