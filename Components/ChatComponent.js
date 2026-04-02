import React, { useState, useEffect, useRef } from 'react';
import { 
    Text, View, Image, FlatList, TouchableOpacity, TextInput, 
    Dimensions, Platform, ActivityIndicator, KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet from 'reanimated-bottom-sheet';
import { getDeviceType } from 'react-native-device-info';

let deviceType = getDeviceType();
const { height: screenHeight } = Dimensions.get('window');

const ChatComponent = ({ navigation, chatType, data, socket }) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [Message, setMessage] = useState('');
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [TypingMsg, setTypingMsg] = useState('');
    const [GrpList, setGrpList] = useState([]);
    const bs = useRef(null);
    const convo = useRef(null);
    const chatInput = useRef(null);

    useEffect(() => {
        // Initialize distinct dummy chat data based on type
        if (chatType === 'cgrp') {
            const groupName = data.displayName || 'The Weekend Crew';
            setUserData({
                displayName: groupName,
                displayImage: data.displayImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=200&auto=format&fit=crop',
                status: '9 active • 3 nearby',
                isGroup: true
            });

            if (groupName.includes('Runners')) {
                setChatData([
                    { id: '1', text: "Just tracked 8km around the reservoir. The weather is perfect today! 🏃‍♂️", isOwner: 'no', time: '7:15 AM', sender: 'Ryan Callahan', avatar: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_ryan_callahan_v2_1774337894779.png' },
                    { id: '2', text: "Nice work Ryan! I'm planning a 10km route for Saturday. Anyone in?", isOwner: 'no', time: '8:42 AM', sender: 'Natalie Greene', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
                    { id: '3', text: "I'm in! Let's meet at the West Gate. 🤝", isOwner: 'yes', time: '9:05 AM', sender: 'Me', avatar: null },
                ]);
            } else if (groupName.includes('Builders')) {
                setChatData([
                    { id: '1', text: "Has anyone tried the new deployment pipeline on the beta server?", isOwner: 'no', time: '11:20 AM', sender: 'Daniel Okafor', avatar: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_daniel_okafor_1774337845031.png' },
                    { id: '2', text: "Testing it now. The build times seem 30% faster so far.", isOwner: 'no', time: '11:45 AM', sender: 'Isha Patel', avatar: 'file:///Users/craftnotion/.gemini/antigravity/brain/533300fe-5c74-4c78-9696-5c550eafb3a4/avatar_isha_patel_1774337863283.png' },
                    { id: '3', text: "That's a huge win for the CI/CD flow! 🔥", isOwner: 'yes', time: '12:10 PM', sender: 'Me', avatar: null },
                ]);
            } else {
                setChatData([
                    { id: '1', text: "Looking forward to seeing everyone tonight!", isOwner: 'no', time: '4:30 PM', sender: 'Zoe Marchetti', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
                    { id: '2', text: "Table is booked for 7:30. See you there!", isOwner: 'yes', time: '4:55 PM', sender: 'Me', avatar: null },
                ]);
            }
        } else {
            const contactName = data.displayName || 'Natalie Greene';
            let liveStatus = 'Active now' + (data.distance ? ` • ${data.distance}` : ' • 0.8 km');
            
            if (contactName.includes('Isha')) {
                liveStatus = 'Active now • Location Disabled';
            } else if (contactName.includes('Ryan')) {
                liveStatus = 'Last seen 4h ago • Offline';
            }

            setUserData({
                displayName: contactName,
                displayImage: data.displayImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
                status: liveStatus,
                isGroup: false
            });

            if (contactName.includes('Natalie')) {
                setChatData([
                    { id: '1', text: "Hey! Did you get a chance to review the roadmap?", isOwner: 'no', time: '10:15 AM', sender: 'Natalie', avatar: null },
                    { id: '2', text: "Just finished. Sent over some notes on the Q3 milestones.", isOwner: 'yes', time: '10:42 AM', sender: 'Me', avatar: null },
                    { id: '3', text: "Perfect, these look solid. Let's sync on the call at 2.", isOwner: 'no', time: '11:05 AM', sender: 'Natalie', avatar: null },
                ]);
            } else if (contactName.includes('Daniel')) {
                setChatData([
                    { id: '1', text: "The new UI components are ready. Want a walkthrough?", isOwner: 'no', time: 'Yesterday', sender: 'Daniel', avatar: null },
                    { id: '2', text: "Definitely. Can we do 11 AM today?", isOwner: 'yes', time: '9:30 AM', sender: 'Me', avatar: null },
                    { id: '3', text: "11 AM works! Sending the invite now.", isOwner: 'no', time: '9:45 AM', sender: 'Daniel', avatar: null },
                ]);
            } else {
                setChatData([
                    { id: '1', text: "Hey! Long time no see. How's the project going?", isOwner: 'no', time: '2:15 PM', sender: contactName, avatar: null },
                    { id: '2', text: "It's going great! We just hit a major milestone.", isOwner: 'yes', time: '2:18 PM', sender: 'Me', avatar: null },
                    { id: '3', text: "That's awesome! We should celebrate soon. 🎉", isOwner: 'no', time: '2:20 PM', sender: contactName, avatar: null },
                ]);
            }
        }
    }, [chatType, data]);

    const sendMessage = () => {
        if (!Message.trim()) return;
        const newMsg = {
            id: Date.now().toString(),
            text: Message,
            isOwner: 'yes',
            time: 'Just now',
            sender: 'Me',
            avatar: null
        };
        setChatData([newMsg, ...chatData]);
        setMessage('');
    };

    const renderContent = () => (
        <View style={[styles.BottomSheet, { backgroundColor: colors.bgVar }]}>
            <View style={styles.BsIndicator} />
            <Text style={styles.BsTitle}>Shared Files</Text>
            <TouchableOpacity style={styles.BsOption} onPress={() => bs.current.snapTo(1)}>
                <Feather name="image" size={20} color="#7FFFD4" />
                <Text style={styles.BsOptionText}>Photos & Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BsOption} onPress={() => bs.current.snapTo(1)}>
                <Feather name="file" size={20} color="#7FFFD4" />
                <Text style={styles.BsOptionText}>Documents</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.bsHeader}>
            <View style={styles.bsHandle} />
        </View>
    );

    if (!userData) {
        return (
            <View style={[styles.Screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator color="#7FFFD4" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.Screen}>
            <BottomSheet
                ref={bs}
                snapPoints={[300, 0]}
                renderContent={renderContent}
                renderHeader={renderHeader}
                initialSnap={1}
            />
            
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.Header, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.BackBtn}>
                    <Feather name="chevron-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.HeaderInfo}
                    onPress={() => {
                        if (userData.isGroup) {
                            navigation.navigate('BuddyGroup', { groupId: data.displayId, cData: data });
                        } else {
                            navigation.navigate('Buddy', { id: data.displayId, cData: data });
                        }
                    }}
                >
                    <View style={styles.AvatarWrap}>
                        <Image source={{ uri: userData.displayImage }} style={styles.Avatar} />
                        {!userData.isGroup && <View style={styles.OnlineDot} />}
                    </View>
                    <View style={styles.TitleWrap}>
                        <Text style={styles.Name} numberOfLines={1}>{userData.displayName}</Text>
                        <Text style={styles.Status} numberOfLines={1}>
                            {userData.status}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.HeaderActions}>
                    {!userData.isGroup ? (
                        <>
                            <TouchableOpacity style={styles.ActionBtn} onPress={() => navigation.navigate('PhoneCall')}>
                                <Feather name="phone" size={20} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ActionBtn} onPress={() => navigation.navigate('VideoCall', { cData: userData })}>
                                <Feather name="video" size={20} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity 
                            style={styles.ActionBtn}
                            onPress={() => navigation.navigate('BuddyGroup', { groupId: data.displayId, cData: data })}
                        >
                            <Feather name="info" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={chatData}
                    keyExtractor={item => item.id}
                    inverted
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ 
                        paddingBottom: EStyleSheet.value('120rem') + insets.top,
                        paddingTop: 40,
                        paddingHorizontal: 20
                    }}
                    renderItem={({ item }) => (
                        <View style={{ width: '100%' }}>
                            {item.id === '1' && (
                                <View style={styles.DateHeader}>
                                    <View style={styles.DateLine} />
                                    <Text style={styles.DateText}>Today</Text>
                                    <View style={styles.DateLine} />
                                </View>
                            )}
                            <View style={[styles.MessageRow, item.isOwner === 'yes' ? styles.RowSelf : styles.RowOther]}>
                                <View style={styles.MessageContainer}>
                                    {userData.isGroup && item.isOwner === 'no' && (
                                        <Image source={{ uri: item.avatar }} style={styles.MsgAvatar} />
                                    )}
                                    <View style={styles.BubbleAndInfo}>
                                        {userData.isGroup && item.isOwner === 'no' && (
                                            <Text style={styles.SenderLabel}>{item.sender}</Text>
                                        )}
                                        <View style={[styles.Bubble, item.isOwner === 'yes' ? styles.BubbleSelf : styles.BubbleOther]}>
                                            <Text style={[styles.MsgText, { color: item.isOwner === 'yes' ? '#09090B' : '#FFFFFF' }]}>
                                                {item.text}
                                            </Text>
                                        </View>
                                        <Text style={[styles.TimeText, item.isOwner === 'yes' && { textAlign: 'right' }]}>{item.time}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />

                <View style={[styles.InputArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <View style={styles.InputWrapper}>
                        <TouchableOpacity style={styles.AddBtn} onPress={() => bs.current.snapTo(0)}>
                            <Feather name="plus" size={22} color="#7FFFD4" />
                        </TouchableOpacity>
                        <TextInput 
                            style={styles.Input}
                            placeholder="Type a message..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={Message}
                            onChangeText={setMessage}
                            multiline
                            keyboardAppearance="dark"
                        />
                        <TouchableOpacity 
                            style={[styles.SendBtn, !Message.trim() && { opacity: 0.5, backgroundColor: 'rgba(127,255,212,0.1)' }]} 
                            onPress={sendMessage}
                            disabled={!Message.trim()}
                        >
                            <Feather name="send" size={18} color={Message.trim() ? "#09090B" : "rgba(127,255,212,0.4)"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = EStyleSheet.create({
    Screen: { flex: 1, backgroundColor: '#09090B' },
    Header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: '20rem', paddingBottom: '15rem',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: 'transparent',
    },
    BackBtn: { 
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    HeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: '12rem' },
    AvatarWrap: { position: 'relative' },
    Avatar: { width: '42rem', height: '42rem', borderRadius: '21rem', borderWidth: 1, borderColor: 'rgba(127,255,212,0.2)' },
    OnlineDot: { 
        position: 'absolute', bottom: '-2rem', right: '-2rem', width: '12rem', height: '12rem', 
        borderRadius: '6rem', backgroundColor: '#7FFFD4', borderWidth: 2.5, borderColor: '#09090B' 
    },
    TitleWrap: { marginLeft: '12rem', flex: 1 },
    Name: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', letterSpacing: '0.2rem' },
    Status: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.3)', marginTop: '2rem' },
    HeaderActions: { flexDirection: 'row', alignItems: 'center', marginLeft: '8rem' },
    ActionBtn: { 
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    
    MessageRow: { marginBottom: '18rem', width: '100%' },
    RowSelf: { alignItems: 'flex-end' },
    RowOther: { alignItems: 'flex-start' },
    MessageContainer: { flexDirection: 'row', alignItems: 'flex-end', maxWidth: '85%' },
    MsgAvatar: { width: '28rem', height: '28rem', borderRadius: '14rem', marginRight: '8rem', marginBottom: '18rem' },
    BubbleAndInfo: { flexShrink: 1 },
    SenderLabel: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: 'rgba(255,255,255,0.4)', marginBottom: '4rem', marginLeft: '4rem' },
    Bubble: { padding: '14rem', borderRadius: '22rem', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
    BubbleSelf: { backgroundColor: '#7FFFD4', borderBottomRightRadius: '4rem' },
    BubbleOther: { backgroundColor: '#1C1D21', borderBottomLeftRadius: '4rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    MsgText: { fontSize: '15rem', fontFamily: 'GTWalsheimProRegular', lineHeight: '20rem' },
    TimeText: { fontSize: '10rem', color: 'rgba(255,255,255,0.25)', marginTop: '5rem', marginHorizontal: '6rem' },
    
    DateHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginVertical: '20rem', paddingHorizontal: '40rem'
    },
    DateLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
    DateText: { 
        fontSize: '11rem', fontFamily: 'GTWalsheimProMedium', 
        color: 'rgba(255,255,255,0.2)', marginHorizontal: '12rem',
        textTransform: 'uppercase', letterSpacing: '0.5rem'
    },
    
    InputArea: { paddingHorizontal: '20rem', paddingTop: '12rem', backgroundColor: '#09090B' },
    InputWrapper: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', 
        borderRadius: '24rem', padding: '6rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' 
    },
    AddBtn: { width: '42rem', height: '42rem', alignItems: 'center', justifyContent: 'center' },
    Input: { flex: 1, paddingHorizontal: '12rem', color: '#FFFFFF', fontSize: '15rem', fontFamily: 'GTWalsheimProRegular', maxHeight: '120rem' },
    SendBtn: { width: '42rem', height: '42rem', borderRadius: '21rem', backgroundColor: '#7FFFD4', alignItems: 'center', justifyContent: 'center' },
    
    BottomSheet: { padding: '24rem', borderTopLeftRadius: '32rem', borderTopRightRadius: '32rem', backgroundColor: '#121317' },
    BsIndicator: { width: '40rem', height: '5rem', borderRadius: '3rem', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: '24rem' },
    BsTitle: { fontSize: '20rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', marginBottom: '24rem' },
    BsOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: '16rem', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    BsOptionText: { fontSize: '16rem', color: '#FFFFFF', marginLeft: '16rem', fontFamily: 'GTWalsheimProMedium' },
    bsHeader: { height: '30rem', alignItems: 'center', justifyContent: 'center' },
    bsHandle: { height: '6rem', width: '50rem', borderRadius: '3rem', backgroundColor: '#7FFFD4' },
});

export default ChatComponent;
