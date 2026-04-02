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
                id: 1, displayId: 1, displayIdEnc: 'dummy-enc-1',
                displayName: 'City Runners Club 🏃', nearbyCount: 3,
                displayImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=200&auto=format&fit=crop',
                isOwner: 'yes', lastSeenDetailed: { customFormat: '15m' },
                message: { text: "Morning run at Central Park? 5:30 AM crew.", fromUserName: 'Natalie', isOwner: 'no' },
                messageCount: 0
            },
            {
                id: 2, displayId: 2, displayIdEnc: 'dummy-enc-2',
                displayName: 'Product Builders', nearbyCount: 5,
                displayImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no', lastSeenDetailed: { customFormat: '45m' },
                message: { text: 'The feedback from the beta cohort is in.', fromUserName: 'Daniel', isOwner: 'no' },
                messageCount: 4
            },
            {
                id: 3, displayId: 3, displayIdEnc: 'dummy-enc-3',
                displayName: 'Rooftop Social 🍸', nearbyCount: 2,
                displayImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no', lastSeenDetailed: { customFormat: '2h' },
                message: { text: "Reservation confirmed for Friday night!", fromUserName: 'Zoe', isOwner: 'no' },
                messageCount: 0
            },
            {
                id: 4, displayId: 4, displayIdEnc: 'dummy-enc-4',
                displayName: 'Remote & Thriving', nearbyCount: 0,
                displayImage: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=200&auto=format&fit=crop',
                isOwner: 'no', lastSeenDetailed: { customFormat: '6h' },
                message: { text: 'Best coffee shops in Lisbon? Any leads?', fromUserName: 'Me', isOwner: 'yes' },
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
            rightOpenValue={EStyleSheet.value('-174rem')}
            disableRightSwipe={true}
        >
            <View style={styles.RowBack}>
                <View style={styles.RowBackActions}>
                        <TouchableOpacity 
                            style={styles.EditAction}
                            onPress={() => navigation.navigate('BuddyGroup', { groupId: item.displayId, cData: item })}
                        >
                            <Feather name="info" size={24} color="#111214" />
                            <Text style={styles.EditActionText}>Info</Text>
                        </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.DeleteAction} 
                        onPress={() => { SetGroupToRemove(item); bsPop.current.snapTo(0); }}
                    >
                        <Feather name={item.isOwner === 'yes' ? "trash-2" : "log-out"} size={22} color="#FFFFFF" />
                        <Text style={styles.DeleteActionText}>
                            {item.isOwner === 'yes' ? 'Delete' : 'Leave'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableHighlight 
                onPress={() => navigation.navigate('Chat', { cData: item, chatType: 'cgrp' })}
                underlayColor="#1C1D21"
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
                            <View style={styles.GroupNameRow}>
                                <Text style={styles.GroupName} numberOfLines={1}>{item.displayName}</Text>
                                {item.nearbyCount > 0 && (
                                    <View style={styles.NearbyTag}>
                                        <Entypo name="location-pin" size={10} color="#7FFFD4" />
                                        <Text style={styles.NearbyText}>{item.nearbyCount} nearby</Text>
                                    </View>
                                )}
                            </View>
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
        backgroundColor: '#121317', borderRadius: '24rem',
        marginBottom: '16rem', padding: '18rem', borderWidth: 1.2, borderColor: 'rgba(255,255,255,0.06)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    GroupRow: { flexDirection: 'row', alignItems: 'center' },
    AvatarContainer: { position: 'relative' },
    Avatar: { 
        width: '52rem', height: '52rem', borderRadius: '26rem', 
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)'
    },
    AdminBadge: {
        position: 'absolute', bottom: '-2rem', right: '-2rem',
        backgroundColor: '#7FFFD4', paddingHorizontal: '5rem', paddingVertical: '2rem',
        borderRadius: '7rem', borderWidth: 2, borderColor: '#121317',
    },
    AdminText: { fontSize: '7rem', fontFamily: 'GTWalsheimProBold', color: '#111214', textTransform: 'uppercase' },
    GroupInfo: { flex: 1, marginLeft: '16rem' },
    GroupTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' },
    GroupNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: '8rem' },
    GroupName: { fontSize: '17.5rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginRight: '10rem' },
    NearbyTag: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '8rem',
        paddingVertical: '3rem', borderRadius: '8rem',
    },
    NearbyText: { fontSize: '10.5rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4', marginLeft: '3rem' },
    Timestamp: { fontSize: '11rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.25)' },
    GroupBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    LastMessage: { fontSize: '14.5rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)', flex: 1, marginRight: '10rem' },
    SenderName: { fontFamily: 'GTWalsheimProMedium', color: 'rgba(255,255,255,0.55)' },
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
    RowBackActions: { flexDirection: 'row', alignItems: 'center' },
    EditAction: { 
        width: '74rem', height: '74rem', borderRadius: '22rem', 
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#7FFFD4',
        marginRight: '10rem'
    },
    EditActionText: { color: '#111214', fontSize: '11rem', fontFamily: 'GTWalsheimProBold', marginTop: '3rem' },
    DeleteAction: { 
        width: '74rem', height: '74rem', borderRadius: '22rem', 
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#E53E3E' 
    },
    DeleteActionText: { color: '#FFFFFF', fontSize: '11rem', fontFamily: 'GTWalsheimProBold', marginTop: '3rem' },
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
