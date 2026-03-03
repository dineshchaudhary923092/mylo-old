import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, TextInput, Image, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { Api } from '../Constants/Api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../Constants/Colors';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useKeyboard } from "react-native-keyboard-height";
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import ImageScale from 'react-native-scalable-image';
import AsyncStorage from '@react-native-community/async-storage';

let deviceType = getDeviceType();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ChatComponent = ({ navigation, chatType, data, socket }) => {

    const didShow = (height) => {
        setChatNotch(height);
        setViewHeight(screenHeight - height);
        // convo.current.scrollToEnd();
    }

    const didHide = () => {
        setChatNotch(0);
        setViewHeight(screenHeight);
    }

    const [keyboardHeigth] = useKeyboard(didShow, didHide); 
    const [viewHeight, setViewHeight] = useState(screenHeight) 

    const bs = useRef(null);

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();
    const convo = useRef(null);
    const chatInput = useRef(null);
    const [StatusBarHeight, setStatusBarHeight] = useState(getStatusBarHeight(true));
    const [chatData, setChatData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [HeaderHeight, setHeaderHeight] = useState(null);
    const [InputHeight, setInputHeight] = useState(null);
    const [Message, setMessage] = useState(null);
    const [ButtonDisabled, setButtonDisabled] = useState(false);
    const [Notch, setNotch] = useState(StatusBarHeight > 20 ? 34 : 0);
    const [ChatNotch, setChatNotch] = useState(0);
    const [GrpList, setGrpList] = useState(null);
    const [More, setMore] = useState(null);
    const [Refresh, setRefresh] = useState(false);
    const [isTyping, setisTyping] = useState(false);
    const [TypingMsg, setTypingMsg] = useState(null);
    const [TypingTimeOut, setTypingTimeOut] = useState(null);
    const [Distance, setDistance] = useState(null);
    const [NewMessage, setNewMessage] = useState(null);
    const [Contacts, setContacts] = useState(null);
    
    useEffect(() => {
        storeContacts();
    }, [])
    
    useEffect(() => {
        setUserData({
            displayName: chatType === 'cgrp' ? 'Group Chat' : 'Dummy Buddy Chat',
            displayImage: 'dummy.jpg',
            login: 'Last seen today',
            theyBlocked: 'no',
            iBlocked: 'no'
        });
        setGrpList(['User1', 'User2']);
        setDistance('5');
        
        setChatData([
            {
                isOwner: 'no',
                displayName: 'Dummy Buddy',
                text: 'Hey there! This is a dummy chat.',
                timePrint: { fromNow: '5 mins ago' },
                messageType: 'text'
            },
            {
                isOwner: 'yes',
                text: 'Ah, making progress on the UI showcase!',
                timePrint: { fromNow: '1 min ago' },
                messageType: 'text'
            }
        ]);
    }, [Contacts]);

    useEffect(() => {
        // matchLocals(NewMessage, Contacts, 'newMesssageReceived')
    }, [NewMessage]);

    const storeContacts = async() => {
        await AsyncStorage.getItem('localContacts').then((value) => {
            setContacts(value);
            console.log('store')
        })
    }

    const matchLocals = async(data, contacts, type) => {
        if(type === 'getMessages') {
            if(contacts != null) {
                for (var i = 0; i < contacts.length; i++) {
                    if(contacts[i].idNormal == data.data.chat.displayId) {
                        data.data.chat.displayName = contacts[i].name;
                    }
                }
                for (var i = 0; i < contacts.length; i++) {
                    for (var j = 0; j < data.data.messages.length; j++) {
                        if (contacts[i].idNormal == data.data.messages[j].from_id) {
                            data.data.messages[j].displayName = contacts[i].name;
                        } 
                    }
                }
                setChatData(data.data.messages);
                setUserData(data.data.chat);
                // convo.current.scrollToEnd();
            }
        }
        if(type === 'newMesssageReceived') {
            if(data != null) {
                for (var i = 0; i < contacts.length; i++) {
                    if(contacts[i].idNormal == data.data.message[0].from_id) {
                        data.data.message[0].displayName = contacts[i].name;
                    }
                }
                let newData = [...chatData];
                newData.unshift(data.data.message[0]);
                setChatData(newData);
                setTimeout(() => {
                    // convo.current.scrollToEnd();
                }, 500)
            }
        }
        if(type === 'getMoreMessages') {
            for (var i = 0; i < contacts.length; i++) {
                for (var j = 0; j < data.data.messages.length; j++) {
                    if (contacts[i].idNormal == data.data.messages[j].from_id) {
                        data.data.messages[j].displayName = contacts[i].name;
                    } 
                }
            }
            var messages = data.data.messages;
            var newData = [...chatData];
            for(let i = 0; i < messages.length; i++) {
                newData.push(messages[i])
            }
            setChatData(newData);
            setMore(data.more);
            setRefresh(false);
        }
    }

    const onKeyPress = () => {
        socket.emit('send-typing', {type: chatType === 'cgrp' ? 'group' : 'buddy', token: 'dummy-token', displayId: data.displayId, chatId: data.id})
    }

    const sendMessage = (msg, type) => {
        if(msg != null) {
            setButtonDisabled(true);
            const newDummyMessage = {
                isOwner: 'yes',
                text: type === 'image' ? '[Image Uploaded]' : msg,
                timePrint: { fromNow: 'Just now' },
                messageType: type === 'image' ? 'text' : 'text'
            };
            let newData = [...chatData];
            newData.unshift(newDummyMessage);
            chatInput.current.clear();
            setMessage(null);
            setChatData(newData);
            setTimeout(() => {
                const autoReply = {
                    isOwner: 'no',
                    displayName: 'Dummy Buddy',
                    text: 'This is an automatic dummy reply.',
                    timePrint: { fromNow: 'Just now' },
                    messageType: 'text'
                };
                setChatData([autoReply, newDummyMessage, ...chatData]);
            }, 1000);
        }
        setButtonDisabled(false);
    }

    const getMoreMessages = () => {
        if(More != '') {
            setRefresh(true);
            socket.emit('get-messages', {type: chatType === 'cgrp' ? 'group' : 'buddy', token: 'dummy-token', displayId: data.displayId, chatId: data.id, offset: parseInt(More)}, (response) => {
                response = JSON.parse(response);
                matchLocals(response, Contacts,'getMoreMessages')
            })
        }
    }

    const takePhoto = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7,
            includeBase64: true
        }).then(image => {
            sendMessage(image, 'image')
            if (bs.current) {
                bs.current.snapTo(1);
            }
        });
    }
    
    const chooseFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7,
            includeBase64: true
        }).then(async (image) => {
            sendMessage(image, 'image')
            if (bs.current) {
                bs.current.snapTo(1);
            }
        });
    }

    const renderContent = () => (
        <View style={[styles.BottomSheet, {backgroundColor: colors.sheet}]}>
            <Text style={[styles.BsTitle, {color: colors.pText}]}>Upload Photo</Text>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => chooseFromLibrary()}
            >   
                <Text style={styles.SubmitText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => takePhoto()}
            >   
                <Text style={styles.SubmitText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.SubmitContainer}
                onPress={() => {
                if (bs.current) {
                    bs.current.snapTo(1);
                }
                }}
            >   
                <Text style={styles.SubmitText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.bsHeader}>
            <View style={[styles.bsHandle, {backgroundColor: colors.pText}]} />
        </View>
    )

    return (
        <>
            <BottomSheet
                ref={bs}
                snapPoints={[
                    screenHeight > 720 ? 
                    deviceType === 'Tablet' ? 450 : 350 
                    : 320, 0
                ]}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
            />
            {
                userData === null ?
                <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                    <ActivityIndicator color={colors.pText} size='large' />
                </View>
                :
                <View style={{position: 'relative', flex: 1, backgroundColor: theme.dark ? '#212329' : Colors.gray}} >
                    <View style={[styles.ChatHeader, {borderBottomColor: colors.lighter, backgroundColor: colors.background, shadowColor: theme.dark ? "#fff" : '#000'}]}
                        onLayout={(event) => {
                            setHeaderHeight(event.nativeEvent.layout.height);
                        }}
                    >
                        <TouchableOpacity 
                            style={styles.ChatHeaderInner}
                            onPress={()=> {
                                chatType === 'cone' ?
                                navigation.navigate('Buddy', {
                                    id: data.displayIdEnc
                                }) :
                                navigation.navigate('BuddyGroup', {
                                    groupId: data.displayIdEnc,
                                })
                            }}
                        >
                            <Image 
                                source={require('../assets/profile-user.png')} 
                                resizeMode='cover' 
                                style={styles.ChatHeaderImg}
                            />
                            <View style={styles.ChatHeaderTextWrap}>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ChatHeaderText, {color: colors.pText}]}>
                                    {
                                        userData.displayName 
                                    }
                                </Text>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ChatHeaderSmText, {color: colors.text}]}>
                                    {
                                        isTyping ?
                                        TypingMsg :
                                        chatType === 'cone' ?
                                        userData.login + ' ~ ' + Distance : 
                                        GrpList.length > 0 ?
                                        GrpList.join(", ") : 'Tap to view group info'
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.Back}>
                            <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'position' : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? StatusBarHeight : 0}
                        style={styles.KeyboardView}
                        contentContainerStyle={{
                            flex: 1
                        }}
                    >
                        <View style={[styles.ChatBody, {
                            backgroundColor: theme.dark ? '#212329' : Colors.gray,
                            flex: 1,
                            flexGrow: 1
                            // height: screenHeight - (HeaderHeight + InputHeight + StatusBarHeight + Notch),
                        }]}>
                            <FlatList
                                data={chatData}
                                keyExtractor={(item, index) => item + index}
                                ref={convo}
                                inverted
                                onEndReached={() => getMoreMessages()}
                                onEndReachedThreshold={0.1}
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={() => {
                                    return (
                                        <>
                                            {
                                                Refresh ?
                                                <ActivityIndicator size='large' style={styles.Indicator} color={colors.text} /> : null
                                            }
                                        </>
                                    )
                                }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={[styles.ChatListBox, item.isOwner === 'yes' ? styles.ChatListBoxSelf : null,
                                            {
                                                paddingBottom: chatData.length - 1 === index ?
                                                deviceType === 'Tablet' ? 8 : 12 : 0,
                                                paddingTop: index === chatData.length - 1 ? ChatNotch : 0,
                                                marginTop: index === chatData.length - 1 ? EStyleSheet.value('15rem') : 0
                                            }
                                        ]}>
                                            <View style={[styles.ChatListBoxInner, item.isOwner === 'yes' ? styles.ChatListBoxInnerSelf : null, {backgroundColor: colors.background}]}>
                                                {
                                                    item.isOwner === 'yes' ?
                                                    <Text style={[styles.ChatName, {color: colors.pText, opacity: theme.dark ? 1 : 0.65}]}>You</Text>
                                                    :
                                                    <Text style={[styles.ChatName, {color: colors.pText, opacity: theme.dark ? 1 : 0.65}]}>{item.displayName}</Text>
                                                }
                                                {
                                                    item.messageType === 'image' ?
                                                    <TouchableOpacity
                                                        onPress={() => navigation.navigate('ImageView', {
                                                            image: `${Api.baseurl}/n-api${item.text}`
                                                        })}
                                                    >
                                                        <ImageScale 
                                                            source={require('../assets/profile-user.png')} 
                                                        />
                                                    </TouchableOpacity> :
                                                    <Text style={[styles.ChatMessage, {color: colors.text}]}>{item.text}</Text>
                                                }
                                            </View>
                                            <Text style={[styles.ChatTime, item.isOwner === 'yes' ? styles.ChatTimeSelf : null, {color: colors.light}]}>{item.timePrint.fromNow}</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        <View 
                            style={[styles.ChatInputFieldStyle, {
                                backgroundColor: colors.background, shadowColor: theme.dark ? "#fff" : '#000',
                            }]}
                            onLayout={(event) => {
                                setInputHeight(event.nativeEvent.layout.height);
                            }}
                        >
                            {
                                userData.theyBlocked === 'yes' ? 
                                <Text style={styles.BlockedText}>You can't reply to this chat anymore</Text> : 
                                userData.iBlocked === 'yes' ?
                                <Text style={styles.BlockedText}>Unblock buddy to send message</Text> : 
                                <>
                                    <TouchableOpacity 
                                        style={styles.ChatInputFieldBtn}
                                        onPress={() => {
                                            if (bs.current) {
                                                bs.current.snapTo(0);
                                            }
                                        }}
                                    >
                                        <FontAwesome5 
                                            name="camera" 
                                            size={
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('14rem') :
                                                EStyleSheet.value('20rem')
                                            } 
                                            color={colors.light} 
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        style={[styles.ChatTextInputStyle, {color: colors.pText}]}
                                        placeholder="Type your message..."
                                        placeholderTextColor={colors.light}
                                        keyboardAppearance="dark"
                                        multiline={true}
                                        ref={chatInput}
                                        onKeyPress={() => onKeyPress()}
                                        onChangeText={(value) => setMessage(value)}
                                    />
                                    <TouchableOpacity 
                                        style={styles.ChatInputFieldBtn}
                                        onPress={() => sendMessage(Message, 'text')}
                                        disabled={ButtonDisabled}
                                    >
                                        <Ionicons 
                                            name="md-send" 
                                            size={
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('14rem') :
                                                EStyleSheet.value('20rem')
                                            } 
                                            color='#3C99DC' 
                                        />
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </KeyboardAvoidingView>
                </View>
            }
        </>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
    },
    ChatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '46rem' : '65rem',
        borderBottomWidth: 1,
        zIndex: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 3,
        elevation: 2,
    },
    ChatHeaderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        maxWidth: '85%',
    },
    ChatHeaderImg: {
        height: deviceType === 'Tablet' ? '35rem' : '45rem',
        width: deviceType === 'Tablet' ? '35rem' : '45rem',
        borderRadius: deviceType === 'Tablet' ? '17.5rem' : '22.5rem',
    },
    ChatHeaderTextWrap: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        flex: 1,
    },
    ChatHeaderText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        maxWidth: '95%',
        textTransform: 'capitalize', 
        fontFamily: 'GTWalsheimProBold',
    },
    ChatHeaderSmText: {
        fontSize: deviceType === 'Tablet' ? '10rem' : '13rem',
        lineHeight: deviceType === 'Tablet' ? '15rem' : '18rem',
        fontFamily: 'GTWalsheimProRegular',
        maxWidth: '85%',
    },
    Back: {
        height: '100%', 
        justifyContent: 'center',
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    ChatListBox: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
    },
    ChatListBoxSelf: {
        alignItems: 'flex-end'
    },
    ChatListBoxInner: {
        width: '100%',
        maxWidth: deviceType === 'Tablet' ? '90%' : '95%',
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        padding: deviceType === 'Tablet' ? '8rem' : '12rem',
        paddingLeft: deviceType === 'Tablet' ? '7rem' : '10rem',
        paddingBottom: 8,
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderBottomLeftRadius: 0,
    },
    ChatListBoxInnerSelf: {
        borderBottomLeftRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderBottomRightRadius: 0,
    },
    ChatName: {
        fontFamily: 'GTWalsheimProMedium',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        paddingBottom: deviceType === 'Tablet' ? '2rem' : '4rem',
    },
    ChatMessage: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '15rem',
        lineHeight: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    ChatTime: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '9rem' : '12rem',
        paddingTop: deviceType === 'Tablet' ? '2rem' : '4rem',
    },
    ChatTimeSelf: {
        textAlign: 'right'
    },
    KeyboardView: {
        flex: 1,
    },
    ChatInputFieldStyle: {
		flexDirection: 'row',
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    ChatInputFieldBtn: {
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        width: deviceType === 'Tablet' ? '35rem' : '50rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ChatTextInputStyle: {
        flex: 1,
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '9rem' : '16rem',
        paddingTop: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    BlockedText: {
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: 'GTWalsheimProMedium',
        flex: 1,
        color: 'red'
    },
    BottomSheet: {
        padding: deviceType === 'Tablet' ? '12rem' : '16rem',
        height: '100%',
        justifyContent: 'flex-start',
        paddingTop: deviceType === 'Tablet' ? '18rem' : '30rem',
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    bsHeader: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    bsHandle: {
        height: deviceType === 'Tablet' ? '3.75rem' : '6rem',
        width: deviceType === 'Tablet' ? '32rem' : '50rem',
        borderRadius: '3rem'
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        width: '100%'
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '10.5rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProMedium',
    },
    BsTitle: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProRegular',
        textAlign: 'center',
    },
    Indicator: {
        alignSelf: 'center',
        marginVertical: deviceType === 'Tablet' ? '14rem' : '20rem',
    }
})

export default ChatComponent;

