import React, { useState , useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Switch, ActivityIndicator, Linking, ScrollView, FlatList, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../Constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Api } from '../Constants/Api';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BlurView } from "@react-native-community/blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

let deviceType = getDeviceType();

const BuddyScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    
    // Add scroll tracking for animated header background
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50, 90],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
    });

    const [isEnabled, setIsEnabled] = useState(true);
    const [buddyInfo, setBuddyInfo] = useState(null);
    const [mutualGroups, setMutualGroups] = useState(null);
    const [btnText, setBtnText] = useState('Request Location');
    const [btnBlockText, setBtnBlockText] = useState('Block');

    const { id } = route.params;

    useEffect(() => {
        if (isFocused) {
            getBuddyInfo();
        }
    }, [isFocused]);

    const getBuddyInfo = async() => {
        const personas = {
            'Natalie Greene': {
                id: 1,
                name: 'Natalie Greene',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
                phone: '+1 (555) 123-4567',
                distance: '0.8',
                bio: 'Strategy Lead 🚀 | Marathon runner 🏃‍♀️ | Always looking for the best rooftop matcha.',
            },
            'Daniel Okafor': {
                id: 2,
                name: 'Daniel Okafor',
                image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png',
                phone: '+1 (555) 987-6543',
                distance: '2.4',
                bio: 'Full-stack developer and UI enthusiast. Pushing pixels by day, building communities by night. 💻✨',
            },
            'Isha Patel': {
                id: 3,
                name: 'Isha Patel',
                image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png',
                phone: '+1 (555) 456-7890',
                distance: '1.5',
                bio: 'Product Designer 🎨 | Weekend baker 🍰 | Bibliophile. Currently exploring minimalist design.',
            },
            'Ryan Callahan': {
                id: 4,
                name: 'Ryan Callahan',
                image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png',
                phone: '+1 (555) 234-5678',
                distance: '4.2',
                bio: 'Backend Engineer ⚙️ | Coffee snob ☕ | On a mission to find the world\'s best tacos. 🌮',
            },
            'Zoe Marchetti': {
                id: 5,
                name: 'Zoe Marchetti',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
                phone: '+1 (555) 345-6789',
                distance: '3.1',
                bio: 'Events Specialist 🎪 | Travel photographer 📸 | Capturing the essence of city life, one shot at a time.',
            }
        };

        // Attempt to find by name from route params, or fallback to id-based lookup
        const name = route.params?.cData?.displayName || route.params?.cData?.name || route.params?.name;
        let selectedPersona = null;

        if (name && personas[name]) {
            selectedPersona = personas[name];
        } else {
            // Fallback to ID map or default
            const idMap = { 1: 'Natalie Greene', 2: 'Daniel Okafor', 3: 'Isha Patel', 4: 'Ryan Callahan', 5: 'Zoe Marchetti' };
            selectedPersona = personas[idMap[id] || 'Natalie Greene'];
        }

        setBuddyInfo([{
            ...selectedPersona,
            theyBlocked: 'no',
            buddyStatusMine: 'accepted'
        }]);

        setMutualGroups([{
            id: '2',
            name: 'Product Builders',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format&fit=crop',
            total_buddies: 12
        }, {
            id: '4',
            name: 'Remote & Thriving',
            image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=200&auto=format&fit=crop',
            total_buddies: 8
        }]);
        setIsEnabled(true);
    };

    const toggleSwitch = () => setIsEnabled(prev => !prev);
    const blockBuddy = () => setBtnBlockText(prev => prev === 'Block' ? 'Unblock' : 'Block');

    if (buddyInfo === null) {
        return (
            <View style={[styles.Container, { backgroundColor: '#09090B', justifyContent: 'center' }]}>
                <ActivityIndicator color="#7FFFD4" size="large" />
            </View>
        );
    }

    const buddy = buddyInfo[0];

    return (
        <View style={styles.Container}>
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                {/* Genuine Backdrop Blur Effect */}
                <AnimatedBlurView 
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            opacity: headerOpacity,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(255, 255, 255, 0.05)',
                            zIndex: 0
                        }
                    ]}
                    blurType="dark"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="#09090B"
                />
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.HeaderActionBtn, { zIndex: 1 }]}>
                    <Feather name="chevron-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[styles.HeaderTitle, { zIndex: 1 }]}>Contact Info</Text>
                <TouchableOpacity onPress={blockBuddy} style={[styles.HeaderActionBtn, { zIndex: 1 }]}>
                    <Feather name="more-vertical" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <Animated.ScrollView 
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{ 
                    paddingBottom: 60,
                    paddingTop: insets.top + (deviceType === 'Tablet' ? 70 : 85)
                }}
            >
                {/* Hero Section */}
                <View style={styles.HeroSection}>
                    <View style={styles.AvatarContainer}>
                        <Image source={{ uri: buddy.image }} style={styles.HeroImage} />
                        <View style={styles.ActiveStatus} />
                    </View>
                    <Text style={styles.HeroName}>{buddy.name}</Text>
                    <Text style={styles.HeroPhone}>{buddy.phone}</Text>
                    <View style={styles.BadgeRow}>
                        <View style={styles.DistanceBadge}>
                            <Feather name="map-pin" size={12} color="#7FFFD4" />
                            <Text style={styles.BadgeText}>{buddy.distance} km away</Text>
                        </View>
                    </View>
                </View>

                {/* Main Action Bar */}
                <View style={styles.ActionBar}>
                    <TouchableOpacity style={styles.ActionItem} onPress={() => navigation.navigate('PhoneCall', { cData: buddy })}>
                        <View style={styles.ActionIconWrap}>
                            <Feather name="phone" size={20} color="#7FFFD4" />
                        </View>
                        <Text style={styles.ActionLabel}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.ActionItem} 
                        onPress={() => navigation.navigate('Chat', { cData: buddy, chatType: 'cone' })}
                    >
                        <View style={styles.ActionIconWrap}>
                            <Feather name="message-square" size={20} color="#7FFFD4" />
                        </View>
                        <Text style={styles.ActionLabel}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ActionItem} onPress={() => navigation.navigate('VideoCall', { cData: buddy })}>
                        <View style={styles.ActionIconWrap}>
                            <Feather name="video" size={20} color="#7FFFD4" />
                        </View>
                        <Text style={styles.ActionLabel}>Video</Text>
                    </TouchableOpacity>
                </View>

                {/* About/Bio Section */}
                <View style={styles.SectionCard}>
                    <Text style={styles.SectionTitle}>About</Text>
                    <Text style={styles.BioContent}>{buddy.bio}</Text>
                </View>

                {/* Privacy/Location Settings */}
                <View style={styles.SectionCard}>
                    <View style={styles.SettingRow}>
                        <View style={styles.SettingInfo}>
                            <View style={[styles.SettingIcon, { backgroundColor: 'rgba(127,255,212,0.1)' }]}>
                                <Feather name="navigation" size={18} color="#7FFFD4" />
                            </View>
                            <Text style={styles.SettingLabel}>Share My Location</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#1C1D21", true: "#7FFFD4" }}
                            thumbColor={isEnabled ? "#09090B" : "#f4f3f4"}
                            ios_backgroundColor="#1C1D21"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <View style={[styles.SettingRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', marginTop: 12, paddingTop: 12 }]}>
                        <View style={styles.SettingInfo}>
                            <View style={[styles.SettingIcon, { backgroundColor: 'rgba(255,78,78,0.1)' }]}>
                                <Feather name="slash" size={18} color="#FF4E4E" />
                            </View>
                            <Text style={[styles.SettingLabel, { color: '#FF4E4E' }]}>{btnBlockText} User</Text>
                        </View>
                        <TouchableOpacity onPress={blockBuddy}>
                            <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Shared Groups Section */}
                {mutualGroups !== 'empty' && (
                    <View style={styles.SectionCard}>
                        <View style={styles.SectionHeaderRow}>
                            <Text style={styles.SectionTitle}>Shared Groups</Text>
                            <Text style={styles.SectionCount}>{mutualGroups?.length}</Text>
                        </View>
                        {mutualGroups?.map((group, index) => (
                            <TouchableOpacity 
                                key={group.id}
                                style={[styles.GroupItem, index === 0 && { marginTop: 12 }]}
                                onPress={() => navigation.navigate('BuddyGroup', { groupId: group.id })}
                            >
                                <Image source={{ uri: group.image }} style={styles.GroupThumb} />
                                <View style={styles.GroupInfo}>
                                    <Text style={styles.GroupNameText}>{group.name}</Text>
                                    <Text style={styles.GroupSubText}>{group.total_buddies} members</Text>
                                </View>
                                <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </Animated.ScrollView>
        </View>
    );
};

const styles = EStyleSheet.create({
    Container: { flex: 1, backgroundColor: '#09090B' },
    Header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', paddingBottom: '15rem', zIndex: 10,
        position: 'absolute', top: 0, left: 0, right: 0,
    },
    HeaderActionBtn: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    HeaderTitle: { fontSize: '17rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    
    HeroSection: { alignItems: 'center', marginTop: '20rem', marginBottom: '30rem' },
    AvatarContainer: { position: 'relative', marginBottom: '16rem' },
    HeroImage: { 
        width: '120rem', height: '120rem', borderRadius: '60rem',
        borderWidth: 3, borderColor: 'rgba(127,255,212,0.15)',
    },
    ActiveStatus: {
        position: 'absolute', bottom: '6rem', right: '6rem',
        width: '24rem', height: '24rem', borderRadius: '12rem',
        backgroundColor: '#7FFFD4', borderWidth: 4, borderColor: '#09090B',
    },
    HeroName: { fontSize: '26rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    HeroPhone: { 
        fontSize: '15rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.4)', marginTop: '4rem' 
    },
    BadgeRow: { flexDirection: 'row', marginTop: '12rem' },
    DistanceBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(127,255,212,0.1)',
        paddingHorizontal: '12rem', paddingVertical: '6rem', borderRadius: '12rem',
        borderWidth: 1, borderColor: 'rgba(127,255,212,0.15)',
    },
    BadgeText: { fontSize: '13rem', fontFamily: 'GTWalsheimProMedium', color: '#7FFFD4', marginLeft: '6rem' },

    ActionBar: {
        flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: '20rem',
        backgroundColor: '#121317', paddingVertical: '16rem', borderRadius: '24rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: '24rem'
    },
    ActionItem: { alignItems: 'center', width: '25%' },
    ActionIconWrap: {
        width: '48rem', height: '48rem', borderRadius: '24rem',
        backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
    },
    ActionLabel: { fontSize: '12rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.6)' },

    SectionCard: {
        backgroundColor: '#121317', marginHorizontal: '20rem', borderRadius: '24rem',
        padding: '20rem', marginBottom: '16rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    SectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    SectionTitle: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    SectionCount: { 
        fontSize: '12rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4',
        backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '8rem', 
        paddingVertical: '2rem', borderRadius: '8rem' 
    },
    BioContent: { 
        fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.5)', marginTop: '8rem', lineHeight: '22rem' 
    },

    SettingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    SettingInfo: { flexDirection: 'row', alignItems: 'center' },
    SettingIcon: {
        width: '36rem', height: '36rem', borderRadius: '10rem',
        alignItems: 'center', justifyContent: 'center', marginRight: '14rem'
    },
    SettingLabel: { fontSize: '15rem', fontFamily: 'GTWalsheimProMedium', color: '#FFFFFF' },

    GroupItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: '12rem',
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    GroupThumb: { width: '48rem', height: '48rem', borderRadius: '24rem', marginRight: '16rem' },
    GroupInfo: { flex: 1 },
    GroupNameText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    GroupSubText: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.35)', marginTop: '2rem' },
});

export default BuddyScreen;