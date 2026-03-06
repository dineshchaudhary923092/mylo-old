import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableHighlight, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import * as Animatable from 'react-native-animatable';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

let deviceType = getDeviceType();

const GroupsScreen = ({ navigation, socket }) => {
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    const bsPop = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [groupData, setGroupData] = useState(null);
    const [GroupToRemove, SetGroupToRemove] = useState(null);

    useEffect(() => {
        if (isFocused) {
            getGroupData();
        }
    }, [isFocused])
    
    const getGroupData = async() => {
        setGroupData([
            {
                id: 1,
                displayId: 1,
                displayIdEnc: 'dummy-enc-1',
                displayName: 'Weekend Crew 🏖️',
                displayImage: 'https://images.unsplash.com/photo-1539193593-70829d1e5d85?q=80&w=200&auto=format&fit=crop',
                isOwner: 'yes',
                lastSeenDetailed: { customFormat: '30m' },
                message: { text: 'Are we still on for Saturday?', fromUserName: 'You', isOwner: 'yes' },
                messageCount: 0
            },
            {
                id: 2,
                displayId: 2,
                displayIdEnc: 'dummy-enc-2',
                displayName: 'Design Enthusiasts',
                displayImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no',
                lastSeenDetailed: { customFormat: '2h' },
                message: { text: 'Check out this glassmorphic layout!', fromUserName: 'Sarah', isOwner: 'no' },
                messageCount: 4
            },
            {
                id: 3,
                displayId: 3,
                displayIdEnc: 'dummy-enc-3',
                displayName: 'Hiker Community 🏔️',
                displayImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no',
                lastSeenDetailed: { customFormat: '1d' },
                message: { text: 'Trail map shared. See you Sunday!', fromUserName: 'Mike', isOwner: 'no' },
                messageCount: 2
            },
            {
                id: 4,
                displayId: 4,
                displayIdEnc: 'dummy-enc-4',
                displayName: 'Tech Talk JP',
                displayImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no',
                lastSeenDetailed: { customFormat: '3d' },
                message: { text: 'New API docs are live now.', fromUserName: 'Yuki', isOwner: 'no' },
                messageCount: 0
            },
        ]);
    }

    const deleteGroup = (groupId) => {
        setGroupData(prev => prev.filter(g => g.id !== groupId));
    }

    const confirmPop = () => (
        <View style={styles.BottomSheetContainer}>
            <View style={styles.BsCard}>
                <View style={styles.BsIndicator} />
                <Text style={styles.BsTitle}>
                    {GroupToRemove?.isOwner === 'yes' ? 'Delete Group' : 'Leave Group'}
                </Text>
                <Text style={styles.BsSubtitle}>
                    {GroupToRemove?.isOwner === 'yes' 
                        ? `Are you sure you want to delete ${GroupToRemove?.displayName}? This will remove it for all members.`
                        : `Are you sure you want to leave ${GroupToRemove?.displayName}?`}
                </Text>
                
                <View style={styles.BsActionRow}>
                    <TouchableOpacity style={styles.BsCancelBtn} onPress={() => bsPop.current.snapTo(1)}>
                        <Text style={styles.BsCancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.BsDeleteBtn} 
                        onPress={() => {
                            deleteGroup(GroupToRemove.id);
                            bsPop.current.snapTo(1);
                            SetGroupToRemove(null);
                        }}
                    >
                        <Text style={styles.BsDeleteBtnText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderGroupItem = ({ item }) => (
        <SwipeRow 
            rightOpenValue={item.isOwner === 'yes' ? EStyleSheet.value('-180rem') : EStyleSheet.value('-90rem')}
            disableRightSwipe={true}
        >
            <View style={styles.RowBack}>
                <View style={styles.RowBackActions}>
                    {item.isOwner === 'yes' && (
                        <TouchableOpacity 
                            style={styles.EditAction}
                            onPress={() => navigation.navigate('ManageGroup', { type: 'Edit', groupId: item.displayIdEnc })}
                        >
                            <Feather name="edit-3" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={styles.DeleteAction} 
                        onPress={() => { SetGroupToRemove(item); bsPop.current.snapTo(0); }}
                    >
                        <Feather name={item.isOwner === 'yes' ? "trash-2" : "log-out"} size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableHighlight 
                onPress={() => navigation.navigate('Chat', { cData: item, chatType: 'cgrp' })}
                underlayColor="rgba(255,255,255,0.05)"
                style={styles.ListCard}
            >
                <View style={styles.GroupRow}>
                    <View style={styles.AvatarContainer}>
                        <Image source={{ uri: item.displayImage }} style={styles.Avatar} />
                        {item.isOwner === 'yes' && (
                            <View style={styles.AdminBadge}>
                                <Text style={styles.AdminText}>Admin</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.GroupInfo}>
                        <View style={styles.GroupTop}>
                            <Text style={styles.GroupName} numberOfLines={1}>{item.displayName}</Text>
                            <Text style={styles.Timestamp}>{item.lastSeenDetailed.customFormat}</Text>
                        </View>
                        <View style={styles.GroupBottom}>
                            <Text style={[styles.LastMessage, item.messageCount > 0 && styles.UnreadText]} numberOfLines={1}>
                                <Text style={styles.SenderName}>{item.message.fromUserName}: </Text>
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
                snapPoints={[EStyleSheet.value('300rem'), 0]}
                renderContent={confirmPop}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
            />
            
            {groupData === null ? (
                <View style={styles.Center}>
                    <ActivityIndicator color={colors.primary} size='large' />
                </View>
            ) : (
                <SwipeListView 
                    data={groupData}
                    keyExtractor={item => item.displayId.toString()}
                    renderItem={renderGroupItem}
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
        backgroundColor: 'rgba(255,255,255,0.035)', borderRadius: '24rem',
        marginBottom: '12rem', padding: '16rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    GroupRow: { flexDirection: 'row', alignItems: 'center' },
    AvatarContainer: { position: 'relative' },
    Avatar: { width: '56rem', height: '56rem', borderRadius: '20rem', backgroundColor: 'rgba(255,255,255,0.05)' },
    AdminBadge: {
        position: 'absolute', bottom: '-4rem', right: '-4rem',
        backgroundColor: '#7FFFD4', paddingHorizontal: '6rem', paddingVertical: '2rem',
        borderRadius: '8rem', borderWidth: 2, borderColor: '#09090B',
    },
    AdminText: { fontSize: '8rem', fontFamily: 'GTWalsheimProBold', color: '#111214', textTransform: 'uppercase' },
    GroupInfo: { flex: 1, marginLeft: '16rem' },
    GroupTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' },
    GroupName: { fontSize: '17rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', flex: 1, marginRight: '8rem' },
    Timestamp: { fontSize: '11rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.3)' },
    GroupBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    LastMessage: { fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.5)', flex: 1, marginRight: '10rem' },
    SenderName: { fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.7)' },
    UnreadText: { color: '#FFFFFF', fontFamily: 'GTWalsheimProMedium' },
    UnreadBadge: {
        backgroundColor: '#7FFFD4', height: '22rem', minWidth: '22rem',
        borderRadius: '11rem', alignItems: 'center', justifyContent: 'center', paddingHorizontal: '6rem',
    },
    UnreadCount: { fontSize: '11rem', fontFamily: 'GTWalsheimProBold', color: '#09090B' },
    RowBack: {
        backgroundColor: '#FF4E4E', borderRadius: '24rem', height: '88rem',
        justifyContent: 'center', alignItems: 'flex-end', marginBottom: '12rem', overflow: 'hidden',
    },
    RowBackActions: { flexDirection: 'row', height: '100%' },
    EditAction: { width: '90rem', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7FFFD4' },
    DeleteAction: { width: '90rem', height: '100%', alignItems: 'center', justifyContent: 'center' },
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

export default GroupsScreen;
