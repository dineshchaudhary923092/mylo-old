import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, AppState, Image, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
    const [InviteContactsList, setInviteContactsList] = useState([]);
    const [buddyData, setBuddyData] = useState();
    const [ChatToRemove, SetChatToRemove] = useState(null);

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
        if(responseType === 'manageBuddy') {
            if(responseData.error === 1) {
                if(responseData.data.id) {
                    const updatedBuddies = [...buddyData];
                    const prevIndex = buddyData.findIndex(value => value.displayId == responseData.data.id);
                    if(prevIndex != -1) {
                        updatedBuddies.splice(prevIndex, 1);
                        setBuddyData(updatedBuddies);
                    }
                }
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);
    
    useEffect(() => { 
        // getUserData();
        if (bsPop.current) {
            bsPop.current.snapTo(1);
        }
        setBuddyData(null);
        getBuddyData();
    }, [isFocused]);
    
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    
    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("App has come to the foreground!");
            setBuddyData(null);
            getBuddyData();
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    const getBuddyData = async() => {
        setBuddyData([
            {
                id: 1,
                displayId: 1,
                displayName: 'Sarah Mitchell',
                displayImage: null,
                timePrint: { fromNow: '2m' },
                message: { text: 'Hey! Are you free tonight?', fromUserName: 'Sarah Mitchell', isOwner: 'no', seenPrint: { fromNow: '2m' } },
                messageCount: 3
            },
            {
                id: 2,
                displayId: 2,
                displayName: 'James Carter',
                displayImage: null,
                timePrint: { fromNow: '1h' },
                message: { text: 'Sounds good, lets meet at 6!', fromUserName: 'James Carter', isOwner: 'yes', seenPrint: { fromNow: '1h' } },
                messageCount: 0
            },
            {
                id: 3,
                displayId: 3,
                displayName: 'Priya Sharma',
                displayImage: null,
                timePrint: { fromNow: '3h' },
                message: { text: 'Did you see the new update?', fromUserName: 'Priya Sharma', isOwner: 'no', seenPrint: { fromNow: '3h' } },
                messageCount: 1
            },
            {
                id: 4,
                displayId: 4,
                displayName: 'Alex Johnson',
                displayImage: null,
                timePrint: { fromNow: '1d' },
                message: { text: 'Check out this cool spot!', fromUserName: 'Alex Johnson', isOwner: 'no', seenPrint: { fromNow: '1d' } },
                messageCount: 0
            },
        ]);
    }



    const matchLocals = async(data) => {
        await AsyncStorage.getItem('localContacts').then((value) => {
            value = value != null ? JSON.parse(value) : null;
            if(value != null) {
                for (var i = 0; i < value.length; i++) {
                    for (var j = 0; j < JSON.stringify(data.length); j++) {
                        if (value[i].idNormal == data[j].displayId) {
                            data[j].displayName = value[i].name;
                        } 
                    }
                }
            }
        })
        setBuddyData(data);
    }

    const deleteChat = (id) => {
        setBuddyData(prev => {
            if (Array.isArray(prev)) {
                return prev.filter(b => b.chatId !== id && b.id !== id);
            }
            return prev;
        });
    }

    const searchInputChange = (value) => {
        // Do nothing in mock mode to let it simulate simple without emit errors
    }

    const confirmPop = () => (
        <View style={{minHeight: '100%', backgroundColor: colors.sheet}}>
            <View style={styles.ConfirmPop}> 
                <Text style={[styles.ConfirmPopText, {color: colors.text}]}>Are you sure you want to delete this chat?</Text>
                <View style={styles.ConfirmPopActionsRight}>
                    <TouchableOpacity
                        onPress={() => bsPop.current.snapTo(1)}
                    >
                        <View style={[styles.ConfirmPopBtn, { backgroundColor: colors.primary, }]}>
                            <Text style={styles.ConfirmPopBtnText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            deleteChat(ChatToRemove.displayId);
                            bsPop.current.snapTo(1);
                            SetChatToRemove(null);
                        }}
                    >
                        <View style={[styles.ConfirmPopBtn, styles.ConfirmPopBtnVar]}>
                            <Text style={[styles.ConfirmPopBtnText, { color: '#fff' }]}>Confirm</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const deleteBuddy = (buddy) => {
        SetChatToRemove(buddy);
        bsPop.current.snapTo(0);
    }

    // console.log(buddyData)

    return (
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <BottomSheet
                ref={bsPop}
                snapPoints={[
                    deviceType === 'Tablet' ?
                    EStyleSheet.value('85rem') :
                    EStyleSheet.value('125rem'), 0
                ]}
                renderContent={confirmPop}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
                callbackNode={fall}
                onCloseEnd={() => {
                    SetChatToRemove(null);
                }}
            />
            
            <KeyboardAwareScrollView 
                style={{flex: 1}} 
                keyboardShouldPersistTaps='always' 
                enableOnAndroid={true} 
                enableAutomaticScroll={true}
            >
                <View 
                    style={{ 
                        paddingBottom: 
                        deviceType === 'Tablet' ?
                        EStyleSheet.value('6rem') :
                        EStyleSheet.value('10rem')
                    }}
                >
                    <View style={[styles.FormInputFieldStyle, {backgroundColor: colors.lighter}]}>
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
                            onChangeText={(value) => searchInputChange(value)}
                        />
                    </View>
                </View>
                {
                    buddyData === null ? 
                    <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator color={colors.pText} size='large' />
                    </View>
                    :
                    <>
                        {
                            buddyData === 'empty' ?
                            <View style={{flex: 1}}>
                                <Text style={[styles.emptyText, {color: colors.pText}]}>No Buddies Added</Text>
                            </View> : 
                            <SwipeListView 
                                style={styles.ListWrap}
                                data={buddyData}
                                keyExtractor={ (item, index) => item.id ? item.id.toString() : index.toString() }
                                ListFooterComponent={ () => {
                                    return (
                                        <View style={{height: 40}}></View>
                                    )
                                }}
                                renderItem={ ({ item }, rowMap) => (
                                    <SwipeRow
                                        rightOpenValue={
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('-63rem') :
                                            EStyleSheet.value('-90rem')
                                        }
                                    >
                                        <View style={[styles.rowBack, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}>
                                            <TouchableOpacity 
                                                style={[styles.rowBack, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}
                                                onPress={() => {
                                                    deleteBuddy(item);
                                                }}
                                            >
                                                <View style={styles.rowDeleteBtn}>
                                                    <FontAwesome5 name="trash-alt" style={styles.rowDeleteBtnIcon} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableHighlight 
                                            style={[styles.ListItem, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}
                                            underlayColor={theme.dark ? "#282C34" : '#d1d1d1'}
                                            onPress={()=> {
                                                navigation.navigate('Chat', {
                                                    cData: item,
                                                    chatType: 'cone',
                                                })
                                            }}
                                        >
                                            <> 
                                                <View style={styles.ListItemBody}>
                                                    <View style={{position: 'relative'}}>
                                                        <Image 
                                                            source={require('../assets/profile-user.png')} 
                                                            resizeMode='cover' 
                                                            style={styles.ListItemImg}
                                                        />
                                                        {/* <View style={styles.ListItemActive}>
                                                            <FontAwesome5 name='check' style={styles.ListItemActiveIcon} />
                                                        </View> */}
                                                    </View>  
                                                    <View style={styles.ListItemTextWrap}>
                                                        <View style={[styles.ListItemInner, {
                                                            marginBottom: 
                                                            deviceType === 'Tablet' ?
                                                            EStyleSheet.value('2rem') :
                                                            EStyleSheet.value('4rem')
                                                        }]}>
                                                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ListItemText, {color: colors.pText}]}>{item.displayName}</Text>
                                                            <Text style={[styles.ListItemSmText, {color: colors.text}]}>{item.timePrint.fromNow}</Text>
                                                        </View>
                                                        <View style={styles.ListItemInner}>
                                                            {
                                                                typeof item.message.fromUserName === 'undefined' ? 
                                                                <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.ListItemChatText, {color: colors.text}]}>
                                                                    Be the first one to send message
                                                                </Text> 
                                                                :
                                                                <Text 
                                                                    ellipsizeMode='tail' 
                                                                    numberOfLines={2} 
                                                                    style={[
                                                                        styles.ListItemChatText, 
                                                                        typeof item.message.seenPrint.fromNow === 'undefined' && item.message.isOwner === 'no' ? styles.ListItemChatTextVar : null
                                                                        , {color: colors.text}
                                                                    ]}
                                                                >
                                                                    {item.message.text}
                                                                </Text>
                                                            }
                                                            {
                                                                item.messageCount === 0 ? null :
                                                                <View style={[styles.ListItemCount, {backgroundColor: colors.primary}]}>    
                                                                    <Text style={[styles.ListItemCountText, {color: colors.black}]}>{item.messageCount}</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        </TouchableHighlight>         
                                    </SwipeRow>
                                )}                            
                            />    
                        }
                    </>
                }
            </KeyboardAwareScrollView>
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
        fontSize: deviceType === 'Tablet' ? '12rem' : '15rem',
    },
    ListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: '1rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '63rem' : '90rem'
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
        maxWidth: '65%',
    },
    ListItemChatText: {
        fontSize: deviceType === 'Tablet' ? '10rem' : '13rem',
        lineHeight: deviceType === 'Tablet' ? '16rem' : '20rem',
        fontFamily: 'GTWalsheimProRegular',
        maxWidth: '86%',
    },
    ListItemChatTextVar: {
        fontFamily: 'GTWalsheimProBold',
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
    },
    ConfirmPop: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        paddingVertical: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ConfirmPopText: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        paddingBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    ConfirmPopActionsRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    ConfirmPopBtn: {
        paddingVertical: deviceType === 'Tablet' ? '4rem' : '6rem',
        paddingHorizontal: deviceType === 'Tablet' ? '8rem' : '12rem',
        marginLeft: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem'
    },
    ConfirmPopBtnText: {
        fontFamily: 'GTWalsheimProMedium',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ConfirmPopBtnVar: {
        backgroundColor: '#CD2F2A'
    }
})

export default BuddiesScreen;