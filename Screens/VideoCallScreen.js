import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VideoCallScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Get buddy data from params
    const buddyData = route.params?.cData || {};
    const displayName = buddyData.displayName || buddyData.name || 'Natalie Greene';
    
    // Fallback Image Map for consistency
    const imageMap = {
        'Natalie Greene': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        'Daniel Okafor': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png',
        'Isha Patel': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png',
        'Ryan Callahan': 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png',
        'Zoe Marchetti': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    };

    const remoteStream = buddyData.displayImage || buddyData.image || imageMap[displayName] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop';
    const localStream = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Background Full Screen Remote Stream */}
            <Image 
                source={{ uri: remoteStream }}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                resizeMode="cover"
            />

            {/* Gradient for legibility of texts/buttons */}
            <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'android' ? 20 : 10) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.nameText}>{displayName}</Text>
                    <Text style={styles.durationText}>02:45</Text>
                </View>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Local Preview */}
            <View style={[styles.localPreviewWrap, { top: insets.top + 80, zIndex: 10 }]}>
                 {isVideoOff ? (
                     <View style={styles.localPreviewPlaceholder}>
                         <Ionicons name="videocam-off-outline" size={24} color="#FFFFFF" />
                     </View>
                 ) : (
                     <Image 
                        source={{ uri: localStream }}
                        style={styles.localPreview}
                        resizeMode="cover"
                     />
                 )}
            </View>

            {/* Call Controls Box */}
            <View style={[styles.controlsContainer, { paddingBottom: insets.bottom + 30 }]}>
                <TouchableOpacity 
                    style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                    onPress={() => setIsMuted(!isMuted)}
                >
                    <Ionicons name={isMuted ? "mic-off" : "mic-outline"} size={22} color={isMuted ? "#09090B" : "#FFFFFF"} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
                    onPress={() => setIsVideoOff(!isVideoOff)}
                >
                    <Ionicons name={isVideoOff ? "videocam-off" : "videocam-outline"} size={22} color={isVideoOff ? "#09090B" : "#FFFFFF"} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.controlBtn, styles.endCallBtn]}
                    onPress={() => navigation.goBack()}
                >
                    <View style={{ transform: [{ rotate: '135deg' }] }}>
                        <Ionicons name="call" size={32} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlBtn}>
                    <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlBtn}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

import { Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
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
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        alignItems: 'center',
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    durationText: {
        color: '#7FFFD4',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '600',
    },
    localPreviewWrap: {
        position: 'absolute',
        right: 20,
        width: 100,
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(127,255,212,0.5)',
        backgroundColor: '#1E1E24',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    localPreview: {
        width: '100%',
        height: '100%',
    },
    localPreviewPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    controlBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlBtnActive: {
        backgroundColor: '#FFFFFF',
    },
    endCallBtn: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF4E4E',
        transform: [{ scale: 1.1 }],
    }
});

export default VideoCallScreen;
