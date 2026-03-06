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
        // Initialize dummy chat data
        setUserData({
            displayName: chatType === 'cgrp' ? 'Group Chat' : 'Sarah Mitchell',
            displayImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            login: 'Online',
        });
        setChatData([
            { id: '1', text: 'Hey! How is the project going?', isOwner: 'no', timePrint: { fromNow: '2m ago' }, displayName: 'Sarah Mitchell' },
            { id: '2', text: 'Its coming along great! Just finishing the profile screens.', isOwner: 'yes', timePrint: { fromNow: '1m ago' }, displayName: 'Me' },
        ]);
    }, [chatType]);

    const sendMessage = (msg, type) => {
        if (!msg.trim()) return;
        const newMsg = {
            id: Date.now().toString(),
            text: msg,
            isOwner: 'yes',
            timePrint: { fromNow: 'Just now' },
            displayName: 'Me'
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
            <View style={[styles.Header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.BackBtn}>
                    <AntDesign name="arrowleft" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.HeaderInfo}>
                    <Image source={{ uri: userData.displayImage }} style={styles.Avatar} />
                    <View style={styles.TitleWrap}>
                        <Text style={styles.Name}>{userData.displayName}</Text>
                        <Text style={styles.Status}>{userData.login}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.MoreBtn}>
                    <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={chatData}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={{ 
                        paddingTop: EStyleSheet.value('100rem') + insets.top,
                        paddingBottom: 20,
                        paddingHorizontal: 20
                    }}
                    renderItem={({ item }) => (
                        <View style={[styles.MessageRow, item.isOwner === 'yes' ? styles.RowSelf : styles.RowOther]}>
                            <View style={[styles.Bubble, item.isOwner === 'yes' ? styles.BubbleSelf : styles.BubbleOther]}>
                                <Text style={[styles.MsgText, { color: item.isOwner === 'yes' ? '#09090B' : '#FFFFFF' }]}>
                                    {item.text}
                                </Text>
                            </View>
                            <Text style={styles.TimeText}>{item.timePrint.fromNow}</Text>
                        </View>
                    )}
                />

                <View style={[styles.InputArea, { paddingBottom: insets.bottom + 10 }]}>
                    <View style={styles.InputWrapper}>
                        <TouchableOpacity style={styles.AddBtn} onPress={() => bs.current.snapTo(0)}>
                            <Feather name="plus" size={20} color="#7FFFD4" />
                        </TouchableOpacity>
                        <TextInput 
                            style={styles.Input}
                            placeholder="Message..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={Message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.SendBtn, !Message.trim() && { opacity: 0.5 }]} 
                            onPress={() => sendMessage(Message, 'text')}
                            disabled={!Message.trim()}
                        >
                            <Ionicons name="send" size={18} color="#09090B" />
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
        backgroundColor: 'rgba(9, 9, 11, 0.8)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    BackBtn: { width: '40rem', height: '40rem', alignItems: 'center', justifyContent: 'center' },
    HeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: '10rem' },
    Avatar: { width: '36rem', height: '36rem', borderRadius: '18rem' },
    TitleWrap: { marginLeft: '12rem' },
    Name: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    Status: { fontSize: '11rem', fontFamily: 'GTWalsheimProRegular', color: '#7FFFD4', marginTop: '2rem' },
    MoreBtn: { width: '40rem', height: '40rem', alignItems: 'center', justifyContent: 'center' },
    MessageRow: { marginBottom: '16rem', maxWidth: '80%' },
    RowSelf: { alignSelf: 'flex-end', alignItems: 'flex-end' },
    RowOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
    Bubble: { padding: '12rem', borderRadius: '20rem' },
    BubbleSelf: { backgroundColor: '#7FFFD4', borderBottomRightRadius: '4rem' },
    BubbleOther: { backgroundColor: 'rgba(255,255,255,0.06)', borderBottomLeftRadius: '4rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    MsgText: { fontSize: '15rem', fontFamily: 'GTWalsheimProRegular' },
    TimeText: { fontSize: '10rem', color: 'rgba(255,255,255,0.3)', marginTop: '4rem' },
    InputArea: { paddingHorizontal: '16rem', paddingTop: '10rem', backgroundColor: '#09090B', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
    InputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '25rem', padding: '5rem' },
    AddBtn: { width: '40rem', height: '40rem', alignItems: 'center', justifyContent: 'center' },
    Input: { flex: 1, paddingHorizontal: '12rem', color: '#FFFFFF', fontSize: '15rem', maxHeight: '100rem' },
    SendBtn: { width: '40rem', height: '40rem', borderRadius: '20rem', backgroundColor: '#7FFFD4', alignItems: 'center', justifyContent: 'center' },
    BottomSheet: { padding: '24rem', borderTopLeftRadius: '25rem', borderTopRightRadius: '25rem' },
    BsIndicator: { width: '40rem', height: '5rem', borderRadius: '3rem', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: '20rem' },
    BsTitle: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center', marginBottom: '20rem' },
    BsOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: '12rem', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    BsOptionText: { fontSize: '15rem', color: '#FFFFFF', marginLeft: '12rem' },
    bsHeader: { height: '30rem', alignItems: 'center', justifyContent: 'center' },
    bsHandle: { height: '6rem', width: '50rem', borderRadius: '3rem', backgroundColor: '#7FFFD4' },
});

export default ChatComponent;
