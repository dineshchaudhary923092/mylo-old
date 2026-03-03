import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableHighlight, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CloseIcon from '../assets/close.svg';
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
        if(responseType === 'deleteGroup' || responseType === 'leaveGroup') {
            if(responseData.error === 1) {
                setGroupData(null);
                getGroupData();
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        // getUserData removed - not needed for design showcase
    }, [])
    
    useEffect(() => {
        if (bsPop.current) {
            bsPop.current.snapTo(1);
        }
        setGroupData(null);
        getGroupData();
    }, [isFocused])

    // console.log(groupData)
    
    const getGroupData = async() => {
        setGroupData([
            {
                id: 1,
                displayId: 1,
                displayIdEnc: 'dummy-enc-1',
                displayName: 'Weekend Crew 🏖️',
                displayImage: null,
                isOwner: 'yes',
                lastSeenDetailed: { customFormat: '30m' },
                message: { text: 'Are we still on for Saturday?', fromUserName: 'You', isOwner: 'yes' },
                messageCount: 0
            },
            {
                id: 2,
                displayId: 2,
                displayIdEnc: 'dummy-enc-2',
                displayName: 'Work Lunch Group',
                displayImage: null,
                isOwner: 'no',
                lastSeenDetailed: { customFormat: '2h' },
                message: { text: 'Pizza place at 1pm?', fromUserName: 'Sarah', isOwner: 'no' },
                messageCount: 4
            },
            {
                id: 3,
                displayId: 3,
                displayIdEnc: 'dummy-enc-3',
                displayName: 'Hiking Buddies 🏔️',
                displayImage: null,
                isOwner: 'no',
                lastSeenDetailed: { customFormat: '1d' },
                message: { text: 'Trail map is shared. See you Sunday!', fromUserName: 'Mike', isOwner: 'no' },
                messageCount: 2
            },
        ]);
    }

    const matchLocals = async(data) => {
        await AsyncStorage.getItem('localContacts').then((value) => {
            value = value != null ? JSON.parse(value) : null;
            // console.log(value);
            if(value != null) {
                for (var i = 0; i < value.length; i++) {
                    for (var j = 0; j < JSON.stringify(data.length); j++) {
                        if(typeof data[j].message.isOwner=="undefined"){
                            continue;
                        }
                        else if(data[j].message.isOwner=="yes"){
                            data[j].message.fromUserName = "Me";
                        }
                        else if (value[i].idNormal == data[j].message.from_id) {
                            data[j].message.fromUserName = value[i].name;
                        } 
                    }
                }
            }
        })
        setGroupData(data);
    }



    const deleteGroup = (groupId, type) => {
        setGroupData(prev => {
            if (Array.isArray(prev)) {
                return prev.filter(g => g.id !== groupId);
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
                <Text style={[styles.ConfirmPopText, {color: colors.text}]}>Are you sure you want to  
                    {
                        GroupToRemove != null ? 
                        GroupToRemove.admin === 'yes' ?
                        ' delete ' + GroupToRemove.name 
                        : ' leave ' + GroupToRemove.name 
                        : 'Group'
                    }?
                </Text>
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
                            GroupToRemove.admin === 'no' ?
                            deleteGroup(GroupToRemove.id, 'user') :
                            deleteGroup(GroupToRemove.id, 'admin') 
                            bsPop.current.snapTo(1);
                            SetGroupToRemove(null);
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

    const deleteGroupPop = (group) => {
        SetGroupToRemove(group);
        bsPop.current.snapTo(0); 
    }

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
                }}
            />
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always' enableOnAndroid={true} enableAutomaticScroll={true} style={{flex: 1}}>
                <View 
                    style={{
                        paddingBottom: 
                        deviceType === 'Tablet' ? 
                        EStyleSheet.value('7rem') :
                        EStyleSheet.value('10rem')
                    }}
                    animation="slideInDown"
                    easing="ease-out"
                    duration={300}
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
                    groupData === null ?
                    <View style={{paddingTop: EStyleSheet.value('50rem')}}>
                        <ActivityIndicator color={colors.pText} size='large' />
                    </View>
                    :
                    <>
                        {
                            groupData === 'empty' ?
                            <View style={{flex: 1}}>
                                <Text style={[styles.emptyText, {color: colors.pText}]}>No Groups Found</Text>
                            </View> :
                            <SwipeListView 
                                style={styles.ListWrap}
                                data={groupData}
                                keyExtractor={ (item, index) => item.id ? item.id.toString() : index.toString() }
                                ListFooterComponent={ () => {
                                    return (
                                        <View style={{height: 40}}></View>
                                    )
                                }}
                                renderItem={ ({ item }, rowMap) => (
                                    <SwipeRow
                                        rightOpenValue={
                                            item.isOwner === 'yes' ?
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('-126rem') :
                                            EStyleSheet.value('-180rem') :
                                            deviceType === 'Tablet' ? 
                                            EStyleSheet.value('-63rem') :
                                            EStyleSheet.value('-90rem')
                                        }
                                    >
                                        <View style={[styles.rowBack, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}>
                                            <TouchableOpacity 
                                                style={[styles.rowEditBtn, {display: item.isOwner === 'no' ? 'none' : 'flex'}]}
                                                onPress={() => {
                                                    navigation.navigate('ManageGroup', {
                                                        type: 'Edit',
                                                        groupId: item.displayIdEnc
                                                    })
                                                }}
                                            >
                                                <AntDesign name="edit" style={styles.rowEditBtnIcon} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={styles.rowDeleteBtn}
                                                onPress={() => {
                                                    item.isOwner === 'no' ?
                                                    deleteGroupPop(item) :
                                                    deleteGroupPop(item) 
                                                }}
                                            >
                                                <FontAwesome5 name="trash-alt" style={styles.rowDeleteBtnIcon} />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableHighlight 
                                            style={[styles.ListItem, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}
                                            underlayColor={theme.dark ? "#282C34" : '#d1d1d1'}
                                            onPress={()=> navigation.navigate('Chat', {
                                                cData: item,
                                                chatType: 'cgrp'
                                            })}
                                        >
                                            <>
                                                <View style={styles.ListItemBody}>
                                                    <View style={{position: 'relative'}}>
                                                        <Image 
                                                            source={require('../assets/profile-user.png')} 
                                                            resizeMode='cover' 
                                                            style={styles.ListItemImg}
                                                        />
                                                    </View>  
                                                    <View style={styles.ListItemTextWrap}>
                                                    <View style={[styles.ListItemInner, {
                                                            marginBottom: 
                                                            deviceType === 'Tablet' ?
                                                            EStyleSheet.value('2rem') :
                                                            EStyleSheet.value('4rem')
                                                        }]}>
                                                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ListItemText, {color: colors.pText}]}>
                                                                {item.displayName}
                                                            </Text>
                                                            <Text style={[styles.ListItemSmText, {color: colors.text}]}>{item.lastSeenDetailed.customFormat}</Text>
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
                                                                        item.messageCount === 0 ? null : styles.ListItemChatTextVar,
                                                                        {color: colors.text}
                                                                    ]}
                                                                >
                                                                    <Text style={styles.ListItemTextBold}>{item.message.fromUserName.split(' ')[0]}: </Text>
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

const styles = EStyleSheet.create({
    Container: {
        flex: 1,
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
    FormTextInputStyle: {
        flex: 1,
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '12rem' : '15rem',
    },
    HeadingWrap: {
        height: deviceType === 'Tablet' ? '50rem' : '75rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        justifyContent: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
        backgroundColor: Colors.primary,
        marginVertical: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    HeadingWrapText: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '28rem',
        fontFamily: 'GTWalsheimProBold',
        color: Colors.dark
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
        textTransform: 'capitalize'
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
    ListItemTextBold: {
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
        borderBottomWidth: '1rem'
    },
    rowEditBtn: {
        height: deviceType === 'Tablet' ? '63rem' : '90rem',
        width: deviceType === 'Tablet' ? '63rem' : '90rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary
    },
    rowEditBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '16rem' : '24rem',
        color: '#000',
        opacity: 0.65
    },
    rowDeleteBtn: {
        height: deviceType === 'Tablet' ? '63rem' : '90rem',
        width: deviceType === 'Tablet' ? '63rem' : '90rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ED3833',
    },
    rowDeleteBtnIcon: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        color: '#fff',
        opacity: 0.65
    },
    ConfirmPop: {
        padding: deviceType === 'Tablet' ? '14rem' : '20rem'
    },
    BottomSheet: {
        paddingTop: deviceType === 'Tablet' ? '12rem' : '16rem',
        height: '100%',
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    ConfirmPopText: {
        fontFamily: 'GTWalsheimProRegular',
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        paddingBottom: deviceType === 'Tablet' ? '10.5rem' : '15rem',
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
    },
})

export default GroupsScreen;

