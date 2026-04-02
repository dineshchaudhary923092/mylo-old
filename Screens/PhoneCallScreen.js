import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PhoneCallScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);

    // Get buddy data from params
    const buddyData = route.params?.cData || {};
    const displayName = buddyData.displayName || buddyData.name || 'Natalie Greene';
    
    // Fallback Image Map for consistency
    const imageMap = {
        'Natalie Greene': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        'Daniel Okafor': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png',
        'Isha Patel': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png',
        'Ryan Callahan': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png',
        'Zoe Marchetti': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    };

    const avatarStream = buddyData.displayImage || buddyData.image || imageMap[displayName] || imageMap['Natalie Greene'];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Background Blur derived organically from background image via extreme BlurRadius or pure gradient */}
            <Image 
                source={{ uri: avatarStream }}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                blurRadius={100}
                resizeMode="cover"
            />
            <LinearGradient
                colors={['rgba(9,9,11,0.85)', '#09090B', '#09090B']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'android' ? 20 : 10) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="chevron-down" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addBtn}>
                    <Feather name="user-plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Caller Info & Avatar */}
            <View style={styles.callerInfoContainer}>
                 <View style={styles.avatarRipple}>
                     <Image source={{ uri: avatarStream }} style={styles.mainAvatar} />
                 </View>
                 <Text style={styles.nameText}>{displayName}</Text>
                 <Text style={styles.durationText}>02:45</Text>
            </View>

            {/* Call Controls Box */}
            <View style={[styles.controlsContainer, { paddingBottom: insets.bottom + 40 }]}>
                <TouchableOpacity 
                    style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                    onPress={() => setIsMuted(!isMuted)}
                >
                    <Feather name={isMuted ? "mic-off" : "mic"} size={22} color={isMuted ? "#09090B" : "#FFFFFF"} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
                    onPress={() => setIsSpeaker(!isSpeaker)}
                >
                    <Feather name={isSpeaker ? "volume-2" : "volume-1"} size={22} color={isSpeaker ? "#09090B" : "#FFFFFF"} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.controlBtn}
                    onPress={() => navigation.navigate('VideoCall', { cData: buddyData })}
                >
                    <Feather name="video" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.controlBtn, styles.endCallBtn]}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="phone-off" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    callerInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    avatarRipple: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: 'rgba(127,255,212,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(127,255,212,0.1)'
    },
    mainAvatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#7FFFD4',
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    durationText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '500',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    controlBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    controlBtnActive: {
        backgroundColor: '#FFFFFF',
    },
    endCallBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF4E4E',
        marginLeft: 15,
    }
});

export default PhoneCallScreen;
