import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, AppState, Image, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet from 'reanimated-bottom-sheet';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';
import { showMessage } from "react-native-flash-message";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const BuddiesScreen = ({ navigation, socket }) => {
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    const bsPop = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [buddyData, setBuddyData] = useState(null);
    const [ChatToRemove, SetChatToRemove] = useState(null);

    useEffect(() => { 
        if (isFocused) {
            getBuddyData();
        }
    }, [isFocused]);
    
    const getBuddyData = async() => {
        setBuddyData([
            {
                id: 1, displayId: 1, displayName: 'Natalie Greene',
                displayImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
                timePrint: { fromNow: '4m' }, distance: '0.8 km', statusType: 'active',
                message: { text: "The strategy deck looks clean. Let's sync at 2 PM.", fromUserName: 'Natalie Greene', isOwner: 'no', seenPrint: { fromNow: '4m' } },
                messageCount: 2, online: true
            },
            {
                id: 2, displayId: 2, displayName: 'Daniel Okafor',
                displayImage: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png',
                timePrint: { fromNow: '52m' }, distance: '2.4 km', statusType: 'active',
                message: { text: 'I just pushed the final assets to the drive.', fromUserName: 'Daniel Okafor', isOwner: 'no', seenPrint: { fromNow: '52m' } },
                messageCount: 0, online: true
            },
            {
                id: 3, displayId: 3, displayName: 'Isha Patel',
                displayImage: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png',
                timePrint: { fromNow: '1h' }, distance: 'Location Hidden', statusType: 'hidden',
                message: { text: 'The client loved the glassmorphism approach!', fromUserName: 'Isha Patel', isOwner: 'no', seenPrint: { fromNow: '1h' } },
                messageCount: 1, online: true
            },
            {
                id: 4, displayId: 4, displayName: 'Ryan Callahan',
                displayImage: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png',
                timePrint: { fromNow: '3h' }, distance: 'Offline', statusType: 'offline',
                message: { text: "Got it. I'll take a look at the PR shortly.", fromUserName: 'Me', isOwner: 'yes', seenPrint: { fromNow: '3h' } },
                messageCount: 0, online: false
            },
            {
                id: 5, displayId: 5, displayName: 'Zoe Marchetti',
                displayImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
                timePrint: { fromNow: '1d' }, distance: '3.1 km', statusType: 'active',
                message: { text: 'Are we still on for the design review tomorrow?', fromUserName: 'Zoe Marchetti', isOwner: 'no', seenPrint: { fromNow: '1d' } },
                messageCount: 0, online: true
            },
        ]);
    }

    const deleteChat = (id) => {
        setBuddyData(prev => prev.filter(b => b.displayId !== id));
    }

    const confirmPop = () => (
        <View style={styles.BottomSheetContainer}>
            <View style={styles.BsCard}>
                <View style={styles.BsIndicator} />
                <Text style={styles.BsTitle}>Delete Conversation</Text>
                <Text style={styles.BsSubtitle}>Are you sure you want to remove this chat history? This action cannot be undone.</Text>
                
                <View style={styles.BsActionRow}>
                    <TouchableOpacity style={styles.BsCancelBtn} onPress={() => bsPop.current.snapTo(1)}>
                        <Text style={styles.BsCancelBtnText}>Keep Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.BsDeleteBtn} 
                        onPress={() => {
                            deleteChat(ChatToRemove.displayId);
                            bsPop.current.snapTo(1);
                            SetChatToRemove(null);
                        }}
                    >
                        <Text style={styles.BsDeleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderBuddyItem = ({ item }, rowMap) => (
        <SwipeRow rightOpenValue={EStyleSheet.value('-90rem')} disableRightSwipe={true}>
            <View style={styles.RowBack}>
                <TouchableOpacity style={styles.DeleteAction} onPress={() => { SetChatToRemove(item); bsPop.current.snapTo(0); }}>
                    <Feather name="trash-2" size={24} color="#FFFFFF" />
                    <Text style={styles.DeleteActionText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <TouchableHighlight 
                onPress={() => navigation.navigate('Chat', { cData: item, chatType: 'cone' })}
                underlayColor="#1C1D21"
                style={styles.ListCard}
            >
                <View style={styles.BuddyRow}>
                    <View style={styles.AvatarContainer}>
                        <Image source={{ uri: item.displayImage }} style={styles.Avatar} />
                        {item.online && <View style={styles.StatusDot} />}
                    </View>
                    <View style={styles.BuddyInfo}>
                        <View style={styles.BuddyTop}>
                            <View style={styles.BuddyNameRow}>
                                <Text style={styles.BuddyName} numberOfLines={1}>{item.displayName}</Text>
                                <View style={[styles.DistanceTag, item.statusType !== 'active' && styles.DistanceTagInactive]}>
                                    <Feather name={item.statusType === 'hidden' ? "eye-off" : "map-pin"} size={9} color={item.statusType === 'active' ? "#7FFFD4" : "rgba(255,255,255,0.4)"} />
                                    <Text style={[styles.DistanceText, item.statusType !== 'active' && styles.DistanceTextInactive]}>
                                        {item.distance}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.Timestamp}>{item.timePrint.fromNow}</Text>
                        </View>
                        <View style={styles.BuddyBottom}>
                            <Text style={[styles.LastMessage, item.messageCount > 0 && styles.UnreadText]} numberOfLines={1}>
                                {item.message.text}
                            </Text>
                            {item.messageCount > 0 && (
                                <View style={styles.UnreadBadge}>
                                    <Text style={styles.UnreadCount}>{item.messageCount}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </SwipeRow>
    );

    return (
        <View style={styles.Container}>
            <BottomSheet
                ref={bsPop}
                snapPoints={[EStyleSheet.value('280rem'), 0]}
                renderContent={confirmPop}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
            />
            
            {buddyData === null ? (
                <View style={styles.Center}>
                    <ActivityIndicator color={colors.primary} size='large' />
                </View>
            ) : (
                <SwipeListView 
                    data={buddyData}
                    keyExtractor={item => item.displayId.toString()}
                    renderItem={renderBuddyItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.ListContent}
                />
            )}
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: { flex: 1, backgroundColor: 'transparent' },
    Center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '100rem' },
    ListContent: { paddingHorizontal: '20rem', paddingBottom: '40rem' },
    ListCard: {
        backgroundColor: '#121317', borderRadius: '24rem',
        marginBottom: '16rem', padding: '18rem', 
        borderWidth: 1.2, borderColor: 'rgba(255,255,255,0.06)',
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    BuddyRow: { flexDirection: 'row', alignItems: 'center' },
    AvatarContainer: { position: 'relative' },
    Avatar: { 
        width: '52rem', height: '52rem', borderRadius: '26rem', 
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)'
    },
    StatusDot: {
        position: 'absolute', bottom: '2rem', right: '2rem',
        width: '13rem', height: '13rem', borderRadius: '7rem',
        backgroundColor: '#7FFFD4', borderWidth: 2.5, borderColor: '#121317',
    },
    BuddyInfo: { flex: 1, marginLeft: '16rem' },
    BuddyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' },
    BuddyNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: '8rem' },
    BuddyName: { fontSize: '17.5rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginRight: '10rem' },
    DistanceTag: { 
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '8rem', 
        paddingVertical: '3rem', borderRadius: '8rem',
    },
    DistanceTagInactive: { backgroundColor: 'rgba(255,255,255,0.05)' },
    DistanceText: { fontSize: '10.5rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', marginLeft: '4rem' },
    DistanceTextInactive: { color: 'rgba(255,255,255,0.4)' },
    Timestamp: { fontSize: '11rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.25)' },
    BuddyBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    LastMessage: { fontSize: '14.5rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', flex: 1, marginRight: '10rem' },
    UnreadText: { color: '#FFFFFF', fontFamily: 'GTWalsheimProMedium' },
    UnreadBadge: {
        backgroundColor: '#7FFFD4', height: '22rem', minWidth: '22rem',
        borderRadius: '11rem', alignItems: 'center', justifyContent: 'center', paddingHorizontal: '6rem',
    },
    UnreadCount: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#09090B' },
    RowBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '10rem',
        height: '100%',
        paddingBottom: '16rem', // Match ListCard marginBottom
    },
    DeleteAction: { 
        width: '74rem', 
        height: '74rem', 
        backgroundColor: '#E53E3E', 
        borderRadius: '22rem', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    DeleteActionText: { color: '#FFFFFF', fontSize: '11rem', fontFamily: 'GTWalsheimProBold', marginTop: '4rem' },
    // BottomSheet
    BottomSheetContainer: { paddingHorizontal: '16rem', paddingBottom: '20rem' },
    BsCard: {
        backgroundColor: '#16171B', borderRadius: '32rem', padding: '24rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    BsIndicator: { width: '40rem', height: '5rem', borderRadius: '3rem', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: '20rem' },
    BsTitle: { fontSize: '20rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', marginBottom: '8rem' },
    BsSubtitle: { fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '28rem', lineHeight: '20rem' },
    BsActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    BsCancelBtn: {
        flex: 1, height: '54rem', borderRadius: '27rem',
        backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: '12rem',
    },
    BsCancelBtnText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    BsDeleteBtn: {
        flex: 1, height: '54rem', borderRadius: '27rem',
        backgroundColor: '#FF4E4E', alignItems: 'center', justifyContent: 'center',
    },
    BsDeleteBtnText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
});

export default BuddiesScreen;