import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, AppState, Image, FlatList, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusBarComponent from '../Components/StatusbarComponent';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { showMessage } from "react-native-flash-message";
import { useIsFocused } from '@react-navigation/native';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import BuddiesScreen from '../Screens/BuddiesScreen';
import GroupsScreen from '../Screens/GroupsScreen';
import { SocketContext } from '../Components/SocketContext'
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

let deviceType = getDeviceType();

const HomeScreen = (props) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { colors } = useTheme();
    const isFocused = useIsFocused();

    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [InviteContactsList, setInviteContactsList] = useState([]);
    const [ContactsMatched, setContactsMatched] = useState([]);
    const [requestCount, setRequestCount] = useState(3);
    const [BuddyBrowse, setBuddyBrowse] = useState(true);

    const [_getData, _responseData, _setResponseData, _responseType, _response, _setResponse, _getUserData, userData, setUserData, isData] = useAxios();  

    useEffect(() => {
        if (bs.current) {
            bs.current.snapTo(1);
        }
    }, [isFocused])

    const openDrawer = () => {
        const dummyContacts = [
            { name: 'Sarah Mitchell', phone: '+1 (555) 123-4567', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', idNormal: '1' },
            { name: 'James Carter', phone: '+1 (555) 987-6543', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', idNormal: '2' },
            { name: 'Priya Sharma', phone: '+1 (555) 456-7890', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', idNormal: '3' },
            { name: 'Marcus Miller', phone: '+1 (555) 234-5678', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', idNormal: '4' },
            { name: 'Elena Rodriguez', phone: '+1 (555) 345-6789', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', idNormal: '5' }
        ];
        setInviteContactsList(dummyContacts);
        setContactsMatched(dummyContacts);
        bs.current.snapTo(0);
    }

    const filteredContacts = (searchTerm) => {
        setContactsMatched(InviteContactsList.filter(value => 
            value.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }

    const renderDrawerContent = () => (
        <View style={styles.DrawerContainer}>
            <View style={styles.DrawerCard}>
                <View style={styles.DrawerIndicator} />
                <View style={styles.DrawerHeader}>
                    <Text style={styles.DrawerTitle}>New Message</Text>
                    <TouchableOpacity onPress={() => bs.current.snapTo(1)}>
                        <Text style={styles.DrawerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.SearchWrapper}>
                    <Feather name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        placeholder="Search buddies..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        style={styles.SearchInput}
                        onChangeText={filteredContacts}
                        keyboardAppearance="dark"
                    />
                </View>

                {requestCount > 0 && (
                    <TouchableOpacity 
                        style={styles.RequestsAlert}
                        onPress={() => navigation.navigate('Notification')}
                    >
                        <View style={styles.RequestsAlertLeft}>
                            <View style={styles.RequestsIconWrap}>
                                <Feather name="user-plus" size={16} color={colors.primary} />
                            </View>
                            <Text style={styles.RequestsAlertText}>You have {requestCount} new buddy requests</Text>
                        </View>
                        <Feather name="chevron-right" size={16} color={colors.primary} />
                    </TouchableOpacity>
                )}

                <FlatList 
                    data={ContactsMatched}
                    keyExtractor={item => item.idNormal}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.ContactItem}
                            onPress={() => {
                                bs.current.snapTo(1);
                                navigation.navigate('Chat', { cData: item, chatType: 'cone' });
                            }}
                        >
                            <Image source={{ uri: item.image }} style={styles.ContactImg} />
                            <View style={styles.ContactInfo}>
                                <Text style={styles.ContactName}>{item.name}</Text>
                                <Text style={styles.ContactPhone}>{item.phone}</Text>
                            </View>
                            <Feather name="plus-circle" size={20} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.Container}>
            <StatusBarComponent bgcolor="transparent" barStyle="light-content" />
            
            <LinearGradient
                colors={['#0C1A14', '#09090B', '#09090B']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={[StyleSheet.absoluteFill]}
            />

            <View style={styles.GlowBlob} pointerEvents="none">
                <Svg width="500" height="500">
                    <Defs>
                        <RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#7FFFD4" stopOpacity="0.15" />
                            <Stop offset="40%" stopColor="#7FFFD4" stopOpacity="0.06" />
                            <Stop offset="100%" stopColor="#7FFFD4" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="500" height="500" fill="url(#glow)" />
                </Svg>
            </View>

            <BottomSheet
                ref={bs}
                snapPoints={[Dimensions.get('window').height * 0.85, 0]}
                renderContent={renderDrawerContent}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
            />

            <View style={{ flex: 1 }}>
                {/* Modern Unified Header for Home */}
                <View style={[styles.HomeHeader, { paddingTop: insets.top + (deviceType === 'Tablet' ? 8 : 12) }]}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Profile')}
                        style={styles.HeaderAvatarBtn}
                        activeOpacity={0.8}
                    >
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' }} 
                            style={styles.HeaderAvatar} 
                        />
                        <View style={styles.OnlineDot} />
                    </TouchableOpacity>
                    
                    <Text style={styles.HomeHeaderTitle}>Mylo</Text>
                    
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Notification')}
                        style={styles.HeaderIconBtn}
                    >
                        <Feather name="bell" size={20} color="#FFFFFF" />
                        <View style={styles.BadgeDot} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: insets.top + (deviceType === 'Tablet' ? 65 : 78) }}>
                    <View style={styles.TabSwitcherWrap}>
                    <View style={styles.TabSwitcher}>
                        <TouchableOpacity
                            onPress={() => setBuddyBrowse(true)}
                            style={[styles.TabBtn, BuddyBrowse && styles.TabBtnActive]}
                        >
                            <Text style={[styles.TabText, BuddyBrowse && styles.TabTextActive]}>Buddies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setBuddyBrowse(false)}
                            style={[styles.TabBtn, !BuddyBrowse && styles.TabBtnActive]}
                        >
                            <Text style={[styles.TabText, !BuddyBrowse && styles.TabTextActive]}>Groups</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={() => BuddyBrowse ? openDrawer() : navigation.navigate('ManageGroup', { type: 'Add' })}
                        style={styles.AddButton}
                    >
                        <Feather name='plus' size={24} color="#09090B" />
                    </TouchableOpacity>
                </View>

                    {BuddyBrowse ? 
                        <SocketContext.Consumer>
                            {socket => <BuddiesScreen {...props} socket={socket} navigation={navigation} />}
                        </SocketContext.Consumer>                  
                        :
                        <SocketContext.Consumer>
                            {socket => <GroupsScreen {...props} socket={socket} navigation={navigation} />}
                        </SocketContext.Consumer>      
                    }
                </View>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: { flex: 1, backgroundColor: '#09090B' },
    GlowBlob: {
        position: 'absolute', top: -150, left: '50%',
        marginLeft: -250, width: 500, height: 500,
        alignItems: 'center', justifyContent: 'center',
    },
    HomeHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', paddingBottom: '15rem',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    },
    HomeHeaderTitle: {
        fontSize: '18rem', fontFamily: 'GTWalsheimProBold',
        letterSpacing: '0.3rem', color: '#FFFFFF',
    },
    HeaderAvatarBtn: { position: 'relative' },
    HeaderAvatar: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        borderWidth: 1.5, borderColor: 'rgba(127,255,212,0.4)',
    },
    OnlineDot: {
        position: 'absolute', bottom: 0, right: 0,
        width: '12rem', height: '12rem', borderRadius: '6rem',
        backgroundColor: '#7FFFD4', borderWidth: 2, borderColor: '#09090B',
    },
    HeaderIconBtn: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    BadgeDot: {
        position: 'absolute', top: '10rem', right: '10rem',
        width: '8rem', height: '8rem', borderRadius: '4rem',
        backgroundColor: '#FF4E4E', borderWidth: 1.5, borderColor: '#09090B',
    },
    TabSwitcherWrap: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', marginBottom: '16rem', marginTop: '8rem',
    },
    TabSwitcher: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '16rem', padding: '4rem', flex: 1, marginRight: '16rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    TabBtn: { flex: 1, height: '38rem', alignItems: 'center', justifyContent: 'center', borderRadius: '12rem' },
    TabBtnActive: { backgroundColor: '#7FFFD4' },
    TabText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: 'rgba(255,255,255,0.4)' },
    TabTextActive: { color: '#09090B' },
    AddButton: {
        width: '46rem', height: '46rem', borderRadius: '18rem',
        backgroundColor: '#7FFFD4', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#7FFFD4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    // Drawer/BottomSheet Styles
    DrawerContainer: { paddingHorizontal: '16rem', paddingBottom: '20rem' },
    DrawerCard: {
        backgroundColor: '#16171B', borderRadius: '32rem', height: '100%',
        padding: '24rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    DrawerIndicator: {
        width: '40rem', height: '5rem', borderRadius: '3rem',
        backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: '20rem',
    },
    DrawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20rem' },
    DrawerTitle: { fontSize: '18rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    DrawerCancelText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FF4E4E' },
    SearchWrapper: {
        flexDirection: 'row', alignItems: 'center', height: '50rem',
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16rem',
        paddingHorizontal: '16rem', marginBottom: '16rem',
    },
    SearchInput: { flex: 1, marginLeft: '12rem', color: '#FFFFFF', fontSize: '15rem' },
    RequestsAlert: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(127,255,212,0.06)', padding: '14rem', borderRadius: '18rem',
        marginBottom: '20rem', borderWidth: 1, borderColor: 'rgba(127,255,212,0.15)',
    },
    RequestsAlertLeft: { flexDirection: 'row', alignItems: 'center' },
    RequestsIconWrap: {
        width: '32rem', height: '32rem', borderRadius: '10rem',
        backgroundColor: 'rgba(127,255,212,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: '12rem',
    },
    RequestsAlertText: { fontSize: '14rem', fontFamily: 'GTWalsheimProMedium', color: '#7FFFD4' },
    ContactItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: '12rem',
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    ContactImg: { width: '48rem', height: '48rem', borderRadius: '24rem', marginRight: '14rem' },
    ContactInfo: { flex: 1 },
    ContactName: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginBottom: '2rem' },
    ContactPhone: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.4)' },
});

export default HomeScreen;