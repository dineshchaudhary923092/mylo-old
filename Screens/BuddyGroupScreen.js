import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, StyleSheet, Linking, StatusBar, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from "@react-native-community/blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

let deviceType = getDeviceType();
const { width } = Dimensions.get('window');

const BuddyGroupScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [groupData, setGroupData] = useState(null);
    const [sharedMedia, setSharedMedia] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    
    // Add scroll tracking for animated header background
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50, 90],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        if (isFocused) {
            getGroupInfo();
        }
    }, [isFocused]);

    const getGroupInfo = async () => {
        const groups = {
            'City Runners Club 🏃': {
                id: 1,
                name: 'City Runners Club 🏃',
                image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=400&auto=format&fit=crop',
                description: 'A community of passionate runners hitting the city streets. From morning jogs to marathon training, we move together. 🏃‍♂️💨',
                created_at: '6 months ago',
                member_count: 24,
                media_count: 156,
                events_count: 8,
                pinned_msg: "Next weekend's bridge run schedule is pinned! Check the route details. 🌉",
                next_event: { title: 'Sunrise Bridge Run', date: 'Mar 28, 2026', time: '5:30 AM' },
                role: 'admin',
                users: [
                    { id: 1, name: 'Natalie Greene', role: 'admin', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
                    { id: 4, name: 'Ryan Callahan', role: 'member', distance: '1.2 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png' },
                    { id: 2, name: 'Daniel Okafor', role: 'member', distance: '2.4 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png' },
                ]
            },
            'Product Builders': {
                id: 2,
                name: 'Product Builders',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop',
                description: 'Founders, designers, and engineers building the next generation of digital products. Sharing insights, feedback, and coffee. ☕️🚀',
                created_at: '3 months ago',
                member_count: 18,
                media_count: 84,
                events_count: 3,
                pinned_msg: "Beta testing slots for the new Mylo update are now open! Sign up via the link. 🔗",
                next_event: { title: 'Demo Night: Q1 Projects', date: 'Apr 02, 2026', time: '6:30 PM' },
                role: 'member',
                users: [
                    { id: 2, name: 'Daniel Okafor', role: 'admin', distance: '2.4 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png' },
                    { id: 3, name: 'Isha Patel', role: 'member', distance: '1.5 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png' },
                    { id: 1, name: 'Natalie Greene', role: 'member', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
                ]
            },
            'Rooftop Social 🍸': {
                id: 3,
                name: 'Rooftop Social 🍸',
                image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400&auto=format&fit=crop',
                description: 'For the lovers of city skylines and craft cocktails. We find the best rooftop spots in the city. 🏙️✨',
                created_at: '1 month ago',
                member_count: 32,
                media_count: 240,
                events_count: 12,
                pinned_msg: "Grand opening of The Heights tonight! We have a reserved area at the lounge. 🍸",
                next_event: { title: 'After-office Sip & Social', date: 'Mar 27, 2026', time: '7:00 PM' },
                role: 'member',
                users: [
                    { id: 5, name: 'Zoe Marchetti', role: 'admin', distance: '3.1 km', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
                    { id: 1, name: 'Natalie Greene', role: 'member', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
                    { id: 3, name: 'Isha Patel', role: 'member', distance: '1.5 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png' },
                ]
            },
            'Remote & Thriving': {
                id: 4,
                name: 'Remote & Thriving',
                image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=400&auto=format&fit=crop',
                description: 'The ultimate space for digital nomads and remote workers. Tips on productivity, work-life balance, and travel. 💻🌍',
                created_at: '4 months ago',
                member_count: 15,
                media_count: 62,
                events_count: 2,
                pinned_msg: "Shared doc for 'Best Remote Work Cafes' is updated. Add your favorites! ☕️",
                next_event: { title: 'Virtual Work-along Session', date: 'Mar 25, 2026', time: '10:00 AM' },
                role: 'admin',
                users: [
                    { id: 4, name: 'Ryan Callahan', role: 'member', distance: '0.8 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png' },
                    { id: 2, name: 'Daniel Okafor', role: 'member', distance: '2.4 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png' },
                    { id: 3, name: 'Isha Patel', role: 'member', distance: '1.5 km', image: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png' },
                ]
            }
        };

        const name = route.params?.cData?.displayName || route.params?.cData?.name || route.params?.name;
        let selectedGroup = null;

        if (name && groups[name]) {
            selectedGroup = groups[name];
        } else {
            const idMap = { 1: 'City Runners Club 🏃', 2: 'Product Builders', 3: 'Rooftop Social 🍸', 4: 'Remote & Thriving' };
            selectedGroup = groups[idMap[route.params?.groupId] || 'Product Builders'];
        }

        setGroupData(selectedGroup);

        setSharedMedia([
            'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1532270660266-d4748bd782d4?q=80&w=200&auto=format&fit=crop'
        ]);
    };

    if (groupData === null) {
        return (
            <View style={[styles.Container, { backgroundColor: '#09090B', justifyContent: 'center' }]}>
                <ActivityIndicator color="#7FFFD4" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.Container}>
            <StatusBar barStyle="light-content" transparent backgroundColor="transparent" />
            
            {/* Background Image Hero */}
            <View style={styles.HeroImageWrapper}>
                <Image 
                    source={{ uri: groupData.image }} 
                    style={styles.HeroBackgroundImage}
                    blurRadius={10}
                />
                <LinearGradient
                    colors={['rgba(9,9,11,0.2)', 'rgba(9,9,11,0.8)', '#09090B']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

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
                <Text style={[styles.HeaderTitle, { zIndex: 1 }]}>Group Details</Text>
                <TouchableOpacity style={[styles.HeaderActionBtn, { zIndex: 1 }]}>
                    <Feather name="search" size={20} color="#FFFFFF" />
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
                {/* Hero Content */}
                <View style={styles.HeroContent}>
                    <View style={styles.AvatarContainer}>
                        <Image source={{ uri: groupData.image }} style={styles.HeroImage} />
                        <View style={styles.AdminBadgeFloating}>
                            <Feather name="star" size={14} color="#09090B" />
                        </View>
                    </View>
                    <Text style={styles.HeroName}>{groupData.name}</Text>
                    <View style={styles.ProximityRow}>
                        <View style={styles.ProximityBadge}>
                            <Feather name="navigation" size={10} color="#7FFFD4" />
                            <Text style={styles.ProximityText}>3 members nearby</Text>
                        </View>
                        <Text style={styles.HeroSub}>Active {groupData.created_at}</Text>
                    </View>

                    {/* Primary Actions Row */}
                    <View style={styles.PrimaryActions}>
                        <TouchableOpacity style={styles.PrimaryActionItem}>
                            <View style={styles.PrimaryActionIcon}>
                                <Feather name="message-circle" size={20} color="#7FFFD4" />
                            </View>
                            <Text style={styles.PrimaryActionLabel}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.PrimaryActionItem} onPress={() => navigation.navigate('VideoCall', { cData: groupData })}>
                            <View style={styles.PrimaryActionIcon}>
                                <Feather name="video" size={20} color="#7FFFD4" />
                            </View>
                            <Text style={styles.PrimaryActionLabel}>Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.PrimaryActionItem} onPress={() => setIsMuted(!isMuted)}>
                            <View style={[styles.PrimaryActionIcon, isMuted && { backgroundColor: 'rgba(255,78,78,0.15)' }]}>
                                <Feather name={isMuted ? "bell-off" : "bell"} size={20} color={isMuted ? "#FF4E4E" : "#7FFFD4"} />
                            </View>
                            <Text style={[styles.PrimaryActionLabel, isMuted && { color: '#FF4E4E' }]}>{isMuted ? 'Muted' : 'Notify'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.PrimaryActionItem}>
                            <View style={styles.PrimaryActionIcon}>
                                <Feather name="user-plus" size={20} color="#7FFFD4" />
                            </View>
                            <Text style={styles.PrimaryActionLabel}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.StatsGrid}>
                    <View style={styles.StatCard}>
                        <Feather name="users" size={18} color="#7FFFD4" style={styles.StatIcon} />
                        <Text style={styles.StatValue}>{groupData.member_count}</Text>
                        <Text style={styles.StatLabel}>Members</Text>
                    </View>
                    <View style={styles.StatCard}>
                        <Feather name="image" size={18} color="#7FFFD4" style={styles.StatIcon} />
                        <Text style={styles.StatValue}>{groupData.media_count}</Text>
                        <Text style={styles.StatLabel}>Shared</Text>
                    </View>
                    <View style={styles.StatCard}>
                        <Feather name="calendar" size={18} color="#7FFFD4" style={styles.StatIcon} />
                        <Text style={styles.StatValue}>{groupData.events_count}</Text>
                        <Text style={styles.StatLabel}>Events</Text>
                    </View>
                </View>

                {/* Pinned Message Card */}
                <View style={[styles.SectionCard, styles.PinnedCard]}>
                    <View style={styles.PinnedHeader}>
                         <Feather name="bookmark" size={14} color="#7FFFD4" />
                         <Text style={styles.PinnedTitle}>Pinned Message</Text>
                    </View>
                    <Text style={styles.PinnedContent}>{groupData.pinned_msg}</Text>
                </View>

                {/* Upcoming Event Section */}
                <View style={styles.SectionCard}>
                    <View style={styles.SectionHeaderRow}>
                        <Text style={styles.SectionTitle}>Next Adventure</Text>
                        <View style={styles.LiveBadge}>
                            <View style={styles.LiveDot} />
                            <Text style={styles.LiveText}>Upcoming</Text>
                        </View>
                    </View>
                    <View style={styles.EventBox}>
                        <View style={styles.EventIconWrap}>
                            <Feather name="map" size={24} color="#7FFFD4" />
                        </View>
                        <View style={styles.EventInfo}>
                            <Text style={styles.EventTitle}>{groupData.next_event.title}</Text>
                            <Text style={styles.EventTime}>{groupData.next_event.date} • {groupData.next_event.time}</Text>
                        </View>
                        <TouchableOpacity style={styles.JoinBtn}>
                            <Text style={styles.JoinBtnText}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.SectionCard}>
                    <Text style={styles.SectionTitle}>About Group</Text>
                    <Text style={styles.AboutContent}>{groupData.description}</Text>
                </View>

                {/* Shared Media Section */}
                <View style={styles.SectionPadding}>
                    <View style={styles.SectionHeaderRow}>
                        <Text style={styles.SectionTitle}>Recent Media</Text>
                        <TouchableOpacity>
                            <Text style={styles.SeeAllText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.MediaScroll}>
                        {sharedMedia.map((url, index) => (
                            <Image key={index} source={{ uri: url }} style={styles.MediaThumb} />
                        ))}
                    </ScrollView>
                </View>

                {/* Participant List */}
                <View style={styles.SectionCard}>
                    <View style={styles.SectionHeaderRow}>
                        <Text style={styles.SectionTitle}>Participants</Text>
                        <Text style={styles.SectionCount}>{groupData.users.length}</Text>
                    </View>
                    <View style={{ marginTop: 12 }}>
                        {groupData.users.slice(0, 3).map((item) => (
                            <TouchableOpacity 
                                key={item.id} 
                                style={styles.ParticipantItem}
                                onPress={() => navigation.navigate('Buddy', { id: item.id })}
                            >
                                <View style={styles.ParticipantRow}>
                                    <View style={styles.ParticipantAvatarWrap}>
                                        <Image source={{ uri: item.image }} style={styles.ParticipantAvatar} />
                                        {item.role === 'admin' && <View style={styles.AdminIndicator} />}
                                    </View>
                                    <View style={styles.ParticipantInfo}>
                                        <View style={styles.ParticipantTopRow}>
                                            <Text style={styles.ParticipantName}>{item.name}</Text>
                                            <Text style={styles.MemberDistance}>{item.distance || '—'}</Text>
                                        </View>
                                        <Text style={styles.ParticipantRole}>{item.role === 'admin' ? 'Host' : 'Member'}</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.2)" />
                            </TouchableOpacity>
                        ))}
                        {groupData.users.length > 3 && (
                            <TouchableOpacity style={styles.ShowMoreBtn}>
                                <Text style={styles.ShowMoreText}>Show all {groupData.users.length} members</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Danger Zone Actions */}
                <View style={styles.FooterActions}>
                    {groupData.role === 'admin' && (
                        <TouchableOpacity 
                            style={styles.SettingsBtn}
                            onPress={() => navigation.navigate('ManageGroup', { type: 'Edit', groupId: groupData.id })}
                        >
                            <Feather name="settings" size={18} color="#FFFFFF" />
                            <Text style={styles.SettingsBtnText}>Group Settings</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.LeaveBtn}>
                        <Feather name="log-out" size={18} color="#FF4E4E" />
                        <Text style={styles.LeaveBtnText}>Exit Group</Text>
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

const styles = EStyleSheet.create({
    Container: { flex: 1, backgroundColor: '#09090B' },
    
    HeroImageWrapper: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '400rem', 
    },
    HeroBackgroundImage: { width: '100%', height: '100%', opacity: 0.5 },

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
    
    HeroContent: { alignItems: 'center', marginTop: '20rem', marginBottom: '24rem' },
    AvatarContainer: { position: 'relative', marginBottom: '16rem' },
    HeroImage: { 
        width: '120rem', height: '120rem', borderRadius: '60rem',
        borderWidth: 3, borderColor: 'rgba(127,255,212,0.3)',
    },
    AdminBadgeFloating: {
        position: 'absolute', bottom: '-5rem', right: '-5rem',
        width: '32rem', height: '32rem', borderRadius: '16rem',
        backgroundColor: '#7FFFD4', alignItems: 'center', justifyContent: 'center',
        borderWidth: 4, borderColor: '#09090B'
    },
    HeroName: { fontSize: '28rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', paddingHorizontal: '20rem' },
    HeroSub: { 
        fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.5)', marginTop: '6rem', letterSpacing: '0.5rem'
    },

    PrimaryActions: {
        flexDirection: 'row', justifyContent: 'center', marginTop: '24rem', width: '100%'
    },
    PrimaryActionItem: { alignItems: 'center', marginHorizontal: '12rem' },
    PrimaryActionIcon: {
        width: '52rem', height: '52rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: '8rem'
    },
    PrimaryActionLabel: { fontSize: '12.5rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.6)' },

    StatsGrid: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: '20rem', marginBottom: '20rem'
    },
    StatCard: {
        width: (width - 60) / 3,
        backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: '16rem',
        borderRadius: '24rem', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
    },
    StatIcon: { marginBottom: '8rem' },
    StatValue: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    StatLabel: { fontSize: '11rem', fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' },

    SectionCard: {
        backgroundColor: '#121317', marginHorizontal: '20rem', borderRadius: '24rem',
        padding: '20rem', marginBottom: '16rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    SectionPadding: { paddingHorizontal: '20rem', marginBottom: '16rem' },
    PinnedCard: { backgroundColor: 'rgba(127,255,212,0.05)', borderColor: 'rgba(127,255,212,0.1)' },
    PinnedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: '8rem' },
    PinnedTitle: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', marginLeft: '6rem', textTransform: 'uppercase' },
    PinnedContent: { fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', color: '#FFFFFF', lineHeight: '20rem' },

    SectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem' },
    SectionTitle: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    SeeAllText: { fontSize: '13rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },
    SectionCount: { 
        fontSize: '12rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4',
        backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '8rem', 
        paddingVertical: '2rem', borderRadius: '8rem' 
    },

    LiveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '10rem', paddingVertical: '4rem', borderRadius: '10rem' },
    LiveDot: { width: '6rem', height: '6rem', borderRadius: '3rem', backgroundColor: '#7FFFD4', marginRight: '6rem' },
    LiveText: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },

    EventBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)',
        padding: '12rem', borderRadius: '18rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
    },
    EventIconWrap: {
        width: '48rem', height: '48rem', borderRadius: '16rem',
        backgroundColor: 'rgba(127,255,212,0.1)', alignItems: 'center', justifyContent: 'center'
    },
    EventInfo: { flex: 1, marginLeft: '14rem' },
    EventTitle: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    EventTime: { fontSize: '12.5rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' },
    JoinBtn: {
        backgroundColor: '#7FFFD4', paddingHorizontal: '16rem', paddingVertical: '8rem', borderRadius: '12rem'
    },
    JoinBtnText: { color: '#09090B', fontSize: '13rem', fontFamily: 'GTWalsheimProBold' },

    AboutContent: { 
        fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.5)', lineHeight: '22rem' 
    },

    MediaScroll: { marginTop: '8rem' },
    MediaThumb: { width: '85rem', height: '85rem', borderRadius: '42.5rem', marginRight: '12rem' },

    ParticipantItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: '12rem', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    ParticipantRow: { flexDirection: 'row', alignItems: 'center' },
    ParticipantAvatarWrap: { position: 'relative' },
    ParticipantAvatar: { width: '44rem', height: '44rem', borderRadius: '22rem', marginRight: '14rem' },
    AdminIndicator: { position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7FFFD4', borderWidth: 1.5, borderColor: '#121317' },
    ParticipantInfo: { flex: 1 },
    ParticipantTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    ParticipantName: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    MemberDistance: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '6rem', paddingVertical: '2rem', borderRadius: '6rem' },
    ParticipantRole: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.35)', marginTop: '2rem' },
    
    ProximityRow: { flexDirection: 'row', alignItems: 'center', marginTop: '8rem' },
    ProximityBadge: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: 'rgba(127,255,212,0.12)', paddingHorizontal: '10rem', 
        paddingVertical: '4rem', borderRadius: '10rem', marginRight: '10rem',
        borderWidth: 1, borderColor: 'rgba(127,255,212,0.2)'
    },
    ProximityText: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', marginLeft: '6rem' },
    
    ShowMoreBtn: { alignItems: 'center', paddingVertical: '12rem', marginTop: '4rem' },
    ShowMoreText: { fontSize: '13.5rem', fontFamily: 'GTWalsheimProMedium', color: '#7FFFD4' },

    FooterActions: { paddingHorizontal: '20rem', marginTop: '10rem' },
    SettingsBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        height: '52rem', borderRadius: '20rem', marginBottom: '12rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
    },
    SettingsBtnText: { color: '#FFFFFF', fontSize: '15rem', fontFamily: 'GTWalsheimProBold', marginLeft: '10rem' },

    LeaveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,78,78,0.08)',
        height: '52rem', borderRadius: '20rem', marginBottom: '30rem',
        borderWidth: 1, borderColor: 'rgba(255,78,78,0.15)'
    },
    LeaveBtnText: { color: '#FF4E4E', fontSize: '15rem', fontFamily: 'GTWalsheimProBold', marginLeft: '10rem' },
});

export default BuddyGroupScreen;