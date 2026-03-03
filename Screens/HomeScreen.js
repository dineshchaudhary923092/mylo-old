import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, AppState, Image, FlatList, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { PermissionsAndroid } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { useIsFocused } from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import BuddiesScreen from '../Screens/BuddiesScreen';
import GroupsScreen from '../Screens/GroupsScreen';
import { SocketContext } from '../Components/SocketContext'

let deviceType = getDeviceType();

const NotificationArea = ({navigation, socket}) => {

    const [notificationCount, setNotificationCount] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        setNotificationCount(3);
    }, [isFocused])

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Notification')}
            style={styles.roundBtn}
        >
            <Image source={require('../assets/bell.png')} resizeMode='contain' style={styles.roundBtnImg} />
        </TouchableOpacity>
    )

}

const HomeScreen = ({ navigation }, props) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();

    const bs = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [InviteContactsList, setInviteContactsList] = useState([]);
    const [ContactsMatched, setContactsMatched] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const [BuddyBrowse, setBuddyBrowse] = useState(true);

    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse, 
        _getUserData, 
        userData, 
        setUserData, 
        isData
    ] = useAxios();  

    useEffect(() => {
        if(responseType === 'syncContacts') {
            if(responseData.error === 1) {
                setInviteContactsList(responseData.data.invite);
                setContactsMatched(responseData.data.invite);
                setRequestCount(responseData.data.request.length);
            } else {
                setResponse(false);
                bs.current.snapTo(1);
            }
        }
    }, [responseData]);
    
    useEffect(() => {
        // getUserData(); // Removed as we use static dummy token
        if (bs.current) {
            bs.current.snapTo(1);
        }
    }, [isFocused])

    const openDrawer = () => {
        bs.current.snapTo(0);
        const dummyContacts = [
            {
                name: 'Dummy Contact 1',
                phone: '+1234567890',
                image: 'dummy.jpg',
                idNormal: '1'
            },
            {
                name: 'Dummy Contact 2',
                phone: '+0987654321',
                image: 'dummy.jpg',
                idNormal: '2'
            }
        ];
        setInviteContactsList(dummyContacts);
        setContactsMatched(dummyContacts);
        setRequestCount(2);
    }

    const filteredContacts = (searchTerm) => {
        setContactsMatched(InviteContactsList.filter(value => {
            if(value.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return value;
            }
        }));
    }

    const searchContactsChange = (value) => {
        filteredContacts(value);
    }

    const startConversation = (id) => {
        navigation.navigate('Chat', {
            cData: { id: id },
            chatType: 'cone',
        });
    }

    const renderContent = (socket) => (
        <KeyboardAwareScrollView 
            enableOnAndroid={true} 
            enableAutomaticScroll={true} 
            keyboardShouldPersistTaps='always' 
            style={{minHeight: '100%', backgroundColor: colors.sheet}}
        >
            <View style={[styles.BottomSheet, {backgroundColor: colors.sheet}]}>
                <View style={styles.DrawerHeader}>
                    <Text style={[styles.DrawerTitle, {color: colors.pText}]}>Contacts</Text>
                    <TouchableOpacity 
                        style={styles.CloseDrawer}
                        onPress={() => bs.current.snapTo(1)}
                    >
                        <Text style={[styles.CloseDrawerText, {color: theme.dark ? '#79B7F8' : '#3f97f6'}]}>cancel</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.FormInputFieldStyle, styles.FormInputFieldVarStyle, {backgroundColor: colors.background}]}>
                    <Octicons 
                        name="search" 
                        size={
                            deviceType === 'Tablet' ? 
                            EStyleSheet.value('12rem') :
                            EStyleSheet.value('18rem')
                        } 
                        color={colors.pText} 
                        style={{
                            width: deviceType === 'Tablet' ? 
                            EStyleSheet.value('16rem') :
                            EStyleSheet.value('25rem'),  
                            alignSelf: 'center'
                        }} 
                    />
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={[styles.FormTextInputStyle, {color: colors.pText}]}
                        placeholder="Search..."
                        placeholderTextColor={colors.light}
                        keyboardAppearance="dark"
                        onChangeText={(value) => searchContactsChange(value)}
                    />
                </View>
                <View style={[styles.DrawerBody, {flex: 1}]}>
                    {
                        requestCount != 0 ?
                        <TouchableOpacity 
                            style={styles.requestBtn}
                            onPress={() => {
                                navigation.navigate('Notifications', {
                                    request: true
                                })
                            }}
                        >
                            <Text style={[styles.requestBtnText, {color: colors.pText}]}>You have {requestCount} new requests</Text>
                        </TouchableOpacity> : null
                    }
                    {
                        ContactsMatched.length < 1 ?
                        <Text style={[styles.emptyText, {color: colors.pText}]}>No Contacts Found</Text> :
                        <FlatList 
                            style={styles.ListWrap}
                            data={ContactsMatched}
                            keyExtractor={ (item, index) => item.phone ? item.phone.toString() : index.toString() }
                            renderItem={ ({ item }) => {
                                return (
                                    <TouchableOpacity 
                                        style={[styles.ListItem, {borderBottomColor: colors.lighter}]}
                                        onPress={() => startConversation(item.idNormal)}
                                    >
                                        <View style={styles.ListItemBody}>
                                            <Image 
                                                source={{uri: item.image}} 
                                                resizeMode='cover' 
                                                style={styles.ListItemImg}
                                            />
                                            <View style={styles.ListItemTextWrap}>
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ListItemText, {color: colors.pText}]}>{item.name}</Text>
                                                <Text style={[styles.ListItemSmText, {color: colors.light}]}>{item.phone}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>      
                                )
                            }}
                        />   
                    }
                </View>
            </View> 
        </KeyboardAwareScrollView>
    );

    return (
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <SocketContext.Consumer>
                {
                    socket => 
                    <BottomSheet
                        ref={bs}
                        snapPoints={[
                            screenHeight > 720 ? 
                            deviceType === 'Tablet' ?
                            Dimensions.get('window').height * 0.90 :
                            Dimensions.get('window').height * 0.825 
                            : Dimensions.get('window').height * 0.85, 0
                        ]}
                        renderContent={() => renderContent(socket)}
                        enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                        initialSnap={1}
                        callbackNode={fall}
                    />
                }
            </SocketContext.Consumer>
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <View style={styles.Container}>
                <View style={[styles.UserPanel, {backgroundColor: colors.background, shadowColor: theme.dark ? "#fff" : '#000'}]}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Profile')}
                        style={styles.roundBtn}
                    >
                        <Image 
                                source={require('../assets/profile-user.png')} 
                                resizeMode='contain' 
                                style={styles.roundBtnImg} 
                            />
                    </TouchableOpacity>
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.UserPanelText, {color: colors.pText}]}>Chats</Text>
                    <SocketContext.Consumer>
                        {
                            socket => 
                            <NotificationArea {...props} socket={socket} navigation={navigation} />
                        }
                    </SocketContext.Consumer>   
                </View>
                <View style={styles.HeadingWrap}>
                    <View style={styles.HeadingWrapInner}>
                        <TouchableOpacity
                            onPress={() => setBuddyBrowse(true)}
                        >
                            <Text style={[styles.HeadingWrapText, BuddyBrowse ? styles.HeadingWrapTextActive : null, {color: colors.text}]}>Buddies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setBuddyBrowse(false)}
                        >
                            <Text style={[styles.HeadingWrapText, BuddyBrowse ? null : styles.HeadingWrapTextActive, {color: colors.text}]}>Groups</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            if(BuddyBrowse) {
                                openDrawer()
                            } else {
                                navigation.navigate('ManageGroup', {
                                    type: 'Add'
                                })
                            }
                        }}
                        style={styles.roundBtn}
                    >
                        <Entypo name='plus' style={[styles.roundBtnText, {color: colors.pText}]} />
                    </TouchableOpacity>
                </View>
                {
                    BuddyBrowse ? 
                    <SocketContext.Consumer>
                        {
                            socket => <BuddiesScreen {...props} socket={socket} navigation={navigation} />
                        }
                    </SocketContext.Consumer>                  
                    :
                    <SocketContext.Consumer>
                        {
                            socket => <GroupsScreen {...props} socket={socket} navigation={navigation} />
                        }
                    </SocketContext.Consumer>      
                }
            </View>
        </View>
    )
}

const screenHeight = Dimensions.get('window').height;

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
    },
    TopBarStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '30rem' : '42rem',
        paddingBottom: deviceType === 'Tablet' ? '5rem' : '8rem',
        zIndex: 2
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    FormInputFieldStyle: {
		flexDirection: 'row',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '7rem' : '10rem',
        paddingLeft: deviceType === 'Tablet' ? '9rem' : '14rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginTop: deviceType === 'Tablet' ? '7rem' : '10rem',
        backgroundColor: Colors.gray
    },
    FormInputFieldVarStyle: {
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderWidth: 0,
        marginBottom: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    FormTextInputStyle: {
        flex: 1,
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
    },
    UserPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        paddingVertical: deviceType === 'Tablet' ? '7rem' : '10rem',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    UserPanelText: {
        fontFamily: 'GTWalsheimProBold',
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        maxWidth: '50%',
    },
    HeadingWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginTop: deviceType === 'Tablet' ? '12rem' : '18rem',
        marginBottom: deviceType === 'Tablet' ? '3.5rem' : '5rem',
    },
    HeadingWrapText: {
        fontSize: deviceType === 'Tablet' ? '20rem' : '24rem',
        paddingRight: deviceType === 'Tablet' ? '5rem' : '8rem',
        fontFamily: 'GTWalsheimProBold',
        opacity: 0.35,
    },
    HeadingWrapTextActive: {
        opacity: 1
    },
    HeadingWrapInner: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    roundBtn: {
        height: deviceType === 'Tablet' ? '24rem' : '30rem',
        width: deviceType === 'Tablet' ? '24rem' : '30rem',
        borderRadius: deviceType === 'Tablet' ? '24rem' : '30rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roundBtnText: {
        fontSize: deviceType === 'Tablet' ? '17rem' : '24rem',
    },
    roundBtnImg: {
        height: '100%',
        width: '100%',
        borderRadius: deviceType === 'Tablet' ? '24rem' : '30rem',
        resizeMode: 'cover'
    },
    ListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: '1rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '63rem' : '90rem',
    },
    ListItemBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ListItemImg: {
        height: deviceType === 'Tablet' ? '42rem' : '60rem',
        width: deviceType === 'Tablet' ? '42rem' : '60rem',
        borderRadius: deviceType === 'Tablet' ? '21rem' : '30rem',
    },
    ListItemTextWrap: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        flex: 1
    },
    ListItemInner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    ListItemText: {
        fontFamily: 'GTWalsheimProBold',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ListItemChatText: {
        fontSize: deviceType === 'Tablet' ? '10rem' : '13rem',
        lineHeight: deviceType === 'Tablet' ? '15rem' : '18rem',
        fontFamily: 'GTWalsheimProRegular',
        maxWidth: '85%',
    },
    ListItemSmText: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        textTransform: 'capitalize', 
        fontFamily: 'GTWalsheimProLight',
        letterSpacing: '0.5rem'
    },
    ListItemCount: {
        height: deviceType === 'Tablet' ? '17.5rem' : '25rem',
        width: deviceType === 'Tablet' ? '17.5rem' : '25rem',
        borderRadius: deviceType === 'Tablet' ? '9rem' : '12.5rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ListItemCountText: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        lineHeight: deviceType === 'Tablet' ? '17.5rem' : '25rem',
        fontFamily: 'GTWalsheimProMedium',
    },
    ListItemActive: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: deviceType === 'Tablet' ? '14rem' : '18rem',
        width: deviceType === 'Tablet' ? '14rem' : '18rem',
        borderRadius: deviceType === 'Tablet' ? '7rem' : '9rem',
        backgroundColor: '#58C174',
        borderWidth: '1rem',
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ListItemActiveIcon: {
        color: '#fff',
        fontSize: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    BottomSheet: {
        paddingTop: deviceType === 'Tablet' ? '12rem' : '16rem',
        height: '100%',
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    DrawerHeader: {
        position: 'relative',
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    DrawerTitle: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '14rem',
        fontFamily: 'GTWalsheimProMedium',
        textAlign: 'center',
        lineHeight: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    CloseDrawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: deviceType === 'Tablet' ? '8rem' : '14rem',
    },
    CloseDrawerText: {
        textTransform: "capitalize",
        fontFamily: 'GTWalsheimProMedium',
        lineHeight: deviceType === 'Tablet' ? '18rem' : '30rem',
        fontSize: deviceType === 'Tablet' ? '10rem' : '14rem',
    },
    DrawerBuddyAdd: {
        backgroundColor: Colors.dark,
        borderRadius: deviceType === 'Tablet' ? '18rem' : '30rem',
        paddingVertical: 0,
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '14rem',
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    DrawerBuddyAddText: {
        color: Colors.primary,
        fontSize: deviceType === 'Tablet' ? '7.5rem' : '13rem',
        fontFamily: 'GTWalsheimProMedium',
        lineHeight: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    DrawerBody: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    requestBtn: {
        alignItems: 'flex-end',
        paddingVertical: deviceType === 'Tablet' ? '8rem' : '14rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    requestBtnText: {
        color: Colors.primary,
        fontFamily: 'GTWalsheimProMedium',
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
    },
    rowDeleteBtn: {
        height: deviceType === 'Tablet' ? '63rem' : '90rem',
        width: deviceType === 'Tablet' ? '63rem' : '90rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ED3833',
    },
    rowDeleteBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        color: '#fff',
        opacity: 0.65
    }
})

export default HomeScreen;