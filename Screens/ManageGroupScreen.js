import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, Image, Dimensions, TouchableOpacity, TextInput, FlatList, ScrollView, LogBox, ActivityIndicator } from 'react-native';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import { Api } from '../Constants/Api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { AuthContext } from '../Components/Context';
import ImagePicker from 'react-native-image-crop-picker';
import { useIsFocused } from '@react-navigation/native';
import useAxios from '../Hooks/useAxios';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';
import Contacts from 'react-native-contacts';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import Feather from 'react-native-vector-icons/Feather';
import { StyleSheet } from 'react-native';

let deviceType = getDeviceType();

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested'
])

const ManageGroupsScreen = ({ navigation, route }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { logout } = useContext(AuthContext);
    const { type, groupId } = route.params;
    const isFocused = useIsFocused();
    const bs = useRef(null);
    const bsOne = useRef(null);
    const [fall, setFall] = useState(new Animated.Value(1));
    const [isBsOpen, setIsBsOpen] = useState(false);
    const [isBsOneOpen, setIsBsOneOpen] = useState(false);
    const [groupImg, setGroupImg] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [allBuddies, setAllBuddies] = useState(null);
    const [reRenderList, setReRenderList] = useState(true);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [FirstFetch, setFirstFetch] = useState([]);
    const [groupName, setGroupName] = useState({
        gName: '',
        isValid: true
    });

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
        // getUserData removed - not needed for design showcase
    }, [])

    useEffect(() => {
        if (isFocused === true) {
            getAsyncData();
        }
    }, [isFocused])

    const getAsyncData = async () => {
        if (type === 'Edit') {
            setLoading(true);
            setTimeout(() => {
                setAllBuddies([]);
                setImageData(null);
                setGroupImg(null);
                setGroupName({
                    ...groupName,
                    gName: 'Dummy Edit Group',
                    isValid: true
                });
                setLoading(false);
            }, 500);
        } else {
            setAllBuddies([]);
            setImageData(null);
            setGroupImg(null);
            setGroupName({
                ...groupName,
                gName: '',
                isValid: true
            });
        }
    }

    useEffect(() => {
        if (responseType === 'getGroup') {
            if (responseData.error === 1) {
                console.log(JSON.stringify(responseData));
                if (JSON.stringify(responseData.data[0].users.length) > 0) {
                    responseData.data[0].users.map(value => {
                        if (value.added === 'yes') {
                            value.localBtnText = 'remove';
                        } else {
                            value.localBtnText = 'add';
                        }
                    })
                    setAllBuddies(responseData.data[0].users);
                } else {
                    setAllBuddies('empty');
                }
                setImageData(responseData.data[0].image)
                setGroupImg(responseData.data[0].image)
                setGroupName({
                    ...groupName,
                    gName: responseData.data[0].name,
                    isValid: true
                })
            } else {
                setResponse(false);
            }
            setLoading(false);
        }
        if(responseType === 'syncContacts') {
            console.log(responseData)
            if(responseData.error === 1) {
                if(typeof responseData.data.invite != 'undefined') {
                    if(type === 'Edit') {
                        const tempBuddies = allBuddies.map(value => value.localBtnText = 'remove');
                        for (var i = 0; i < tempBuddies.length; i++) {
                            for (var j = 0; j < responseData.data.invite.length; j++) {
                                if (tempBuddies[i].id == responseData.data.invite[j].id) {
                                    value.localBtnText = 'remove';
                                } 
                            }
                        }
                    } else {
                        responseData.data.invite.map(value => {
                            value.localBtnText = 'add';
                        })
                        setAllBuddies(responseData.data.invite);
                    }
                } else {
                    setAllBuddies('empty')
                }
            } else {
                setResponse(false);
                if (bs.current) {
                    bs.current.snapTo(1);
                }
            }
        }
    }, [responseData]);

    const groupNameInputChange = (value) => {
        if (value.length >= 3) {
            setGroupName({
                ...groupName,
                gName: value,
                isValid: true
            })
        }
        else {
            setGroupName({
                ...groupName,
                gName: value,
                isValid: false
            })
        }
    }

    const takePhoto = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            if (bs.current) {
                bs.current.snapTo(1);
            }
            setGroupImg(image.path);
            setImageData(image);
        });
    }

    const chooseFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            if (bs.current) {
                bs.current.snapTo(1);
            }
            setGroupImg(image.path);
            setImageData(image);
        });
    }

    // console.log(allBuddies)

    const handleAddBuddy = (buddyId) => {
        var updatedBuddies = allBuddies;
        updatedBuddies.map(value => {
            if (value.id === buddyId) {
                value.localBtnText === 'add' ?
                    value.localBtnText = 'remove' :
                    value.localBtnText = 'add'
            }
        })
        setAllBuddies(updatedBuddies);
        setReRenderList(!reRenderList);
    }

    const handleManageGroup = async (groupImage, groupName, groupMembers) => {
        if (groupName.isValid) {
            setButtonDisabled(true);
            setTimeout(() => {
                navigation.goBack();
                showMessage({
                    message: "Group saved successfully (Dummy)",
                    type: "success",
                    style: {
                        backgroundColor: Colors.dark
                    },
                    titleStyle: {
                        color: Colors.primary,
                        fontFamily: 'GTWalsheimProMedium'
                    }
                });
                setButtonDisabled(false);
            }, 500);
        } else {
            showMessage({
                message: 'Group Name is mandatory',
                type: "danger",
                icon: "danger",
                duration: 3000,
                titleStyle: {
                    fontFamily: 'GTWalsheimProMedium'
                }
            });
            setButtonDisabled(false);
        }
    }

    const filteredUsers = (searchTerm) => {
        setMatchedUsers(allBuddies.filter(value => {
            if (value.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return value;
            }
        }));
    }

    const searchInputChange = (value) => {
        filteredUsers(value);
    }

    const renderBsOneContent = () => (
        <View style={styles.DrawerContainer}>
            <View style={styles.DrawerCard}>
                <View style={styles.DrawerIndicator} />
                <View style={styles.DrawerHeader}>
                    <Text style={styles.DrawerTitle}>Buddies</Text>
                    <TouchableOpacity onPress={() => bsOne.current.snapTo(1)}>
                        <Text style={styles.DrawerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.SearchWrapper}>
                    <Octicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.SearchInput}
                        placeholder="Search buddies..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        keyboardAppearance="dark"
                    />
                </View>
                <View style={styles.DrawerBody}>
                    <FlatList 
                        data={allBuddies === 'empty' ? [] : allBuddies || []}
                        keyExtractor={ (item, index) => item.phone ? item.phone.toString() : index.toString() }
                        scrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <View style={{ paddingTop: '40rem' }}>
                                {allBuddies === null ? (
                                    <ActivityIndicator color="#7FFFD4" size="large" />
                                ) : (
                                    <Text style={styles.emptyText}>No Contacts Found</Text>
                                )}
                            </View>
                        )}
                        renderItem={ ({ item }) => (
                            <View style={styles.SheetContactItem}>
                                <Image 
                                    source={require('../assets/profile-user.png')} 
                                    style={styles.SheetContactImg}
                                />
                                <View style={styles.ContactInfo}>
                                    <Text style={styles.SheetContactName}>{item.name}</Text>
                                    <Text style={styles.SheetContactPhone}>{item.phone}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.SheetAddBtn, item.localBtnText === 'remove' && styles.SheetAddBtnActive]}
                                    onPress={() => handleAddBuddy(item.id)}
                                >
                                    <Feather 
                                        name={item.localBtnText === 'add' ? "plus" : "check"} 
                                        size={18} 
                                        color="#7FFFD4" 
                                    />
                                </TouchableOpacity>
                            </View>      
                        )}
                    />   
                </View>
            </View>
        </View>
    );

    const renderBsContent = () => (
        <View style={styles.DrawerContainer}>
            <View style={[styles.DrawerCard, { height: 'auto', paddingBottom: EStyleSheet.value('40rem') }]}>
                <View style={styles.DrawerIndicator} />
                <View style={styles.DrawerHeader}>
                    <Text style={styles.DrawerTitle}>Upload Photo</Text>
                    <TouchableOpacity onPress={() => bs.current.snapTo(1)}>
                        <Text style={styles.DrawerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.DrawerBody}>
                    <TouchableOpacity
                        style={styles.BsOptionBtn}
                        onPress={() => chooseFromLibrary()}
                    >
                        <View style={styles.BsIconWrap}>
                            <Feather name="image" size={20} color="#7FFFD4" />
                        </View>
                        <Text style={styles.BsOptionText}>Choose from Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.BsOptionBtn, { borderBottomWidth: 0 }]}
                        onPress={() => takePhoto()}
                    >
                        <View style={styles.BsIconWrap}>
                            <Feather name="camera" size={20} color="#7FFFD4" />
                        </View>
                        <Text style={styles.BsOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderBsHeader = () => (
        <View style={styles.bsHeader}>
            <View style={[styles.bsHandle, { backgroundColor: colors.pText }]} />
        </View>
    )

    const addBuddies = () => {
        if (bsOne.current) {
            bsOne.current.snapTo(0);
        }
        if(FirstFetch) {
            const dummyContacts = [
                {
                    name: 'Sarah Mitchell',
                    phone: '+1 (555) 234-8901',
                    image: null,
                    idNormal: '11',
                    localBtnText: 'add'
                },
                {
                    name: 'James Carter',
                    phone: '+1 (555) 876-3421',
                    image: null,
                    idNormal: '22',
                    localBtnText: 'add'
                },
                {
                    name: 'Priya Sharma',
                    phone: '+1 (555) 112-9834',
                    image: null,
                    idNormal: '33',
                    localBtnText: 'add'
                }
            ];
            setAllBuddies(dummyContacts);
            setFirstFetch(false);
        }
    }

    return (
        <View style={styles.Container}>
            <Animated.View
                style={[
                    styles.Backdrop,
                    {
                        opacity: Animated.interpolate(fall, {
                            inputRange: [0, 1],
                            outputRange: [0.65, 0],
                        }),
                    },
                ]}
                pointerEvents={(isBsOpen || isBsOneOpen) ? 'auto' : 'none'}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={() => {
                        bs.current.snapTo(1);
                        bsOne.current.snapTo(1);
                    }}
                />
            </Animated.View>

            <BottomSheet
                ref={bs}
                snapPoints={[340, 0]}
                renderContent={renderBsContent}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
                onCloseEnd={() => setIsBsOpen(false)}
                onOpenStart={() => setIsBsOpen(true)}
            />
            <BottomSheet
                ref={bsOne}
                snapPoints={[Dimensions.get('window').height * 0.82, 0]}
                renderContent={renderBsOneContent}
                enabledGestureInteraction={true}
                initialSnap={1}
                callbackNode={fall}
                onCloseEnd={() => setIsBsOneOpen(false)}
                onOpenStart={() => setIsBsOneOpen(true)}
            />
            <StatusBarComponent bgcolor="#09090B" barStyle="light-content" />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='always'
                enableOnAndroid={true}
                enableAutomaticScroll={true}
            >
                <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1)), flex: 1 }}>
                    <View style={styles.Header}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            style={styles.HeaderBackBtn}
                        >
                            <Feather name="chevron-left" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.HeaderTitle}>{type} Group</Text>
                        <View style={{ width: EStyleSheet.value('40rem') }} />
                    </View>
                    {
                        loading ?
                        <View style={{ paddingTop: EStyleSheet.value('50rem') }}>
                            <ActivityIndicator color={colors.pText} size="large" />
                        </View> :
                        <View>
                            <View style={styles.GroupPhotoSection}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => bs.current.snapTo(0)}
                                    style={styles.AvatarBtn}
                                >
                                    <Image
                                        source={groupImg ? { uri: groupImg } : require('../assets/profile-user.png')}
                                        style={styles.GroupAvatar}
                                    />
                                    <View style={styles.CameraBadge}>
                                        <Feather name='camera' size={14} color="#09090B" />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.AvatarHint}>Set group cover photo</Text>
                            </View>
                            <View style={styles.FormSection}>
                                <View style={styles.InputGroup}>
                                    <Text style={styles.InputLabel}>Group Name</Text>
                                    <View style={[styles.InputWrapper, !groupName.isValid && styles.InputWrapperError]}>
                                        <Feather name="users" size={18} color="rgba(255,255,255,0.4)" />
                                        <TextInput
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={styles.Input}
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            placeholder="Enter brilliant group name..."
                                            value={groupName.gName}
                                            onChangeText={(value) => groupNameInputChange(value)}
                                            keyboardAppearance="dark"
                                        />
                                    </View>
                                    {!groupName.isValid && <Text style={styles.ErrorText}>Minimum 3 characters required</Text>}
                                </View>
                                <View style={styles.BuddiesSection}>
                                    <View style={styles.SectionHeader}>
                                        <Text style={styles.InputLabel}>Add Buddies</Text>
                                        <TouchableOpacity 
                                            onPress={() => addBuddies()}
                                            style={styles.BuddyAddIconBtn}
                                        >
                                            <Feather name="plus-circle" size={24} color="#7FFFD4" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.AddedList}>
                                    <FlatList
                                        data={allBuddies}
                                        keyExtractor={(item, index) => item.phone ? item.phone.toString() : index.toString()}
                                        scrollEnabled={false}
                                        extraData={reRenderList}
                                        renderItem={({ item, index }) => {
                                            if (item.localBtnText === 'remove') {
                                                return (
                                        <View key={index} style={styles.SheetContactItem}>
                                            <Image
                                                source={item.image ? { uri: item.image } : require('../assets/profile-user.png')}
                                                style={styles.SheetContactImg}
                                            />
                                            <View style={styles.ContactInfo}>
                                                <Text style={styles.SheetContactName}>{item.name}</Text>
                                                <Text style={styles.SheetContactPhone}>{item.phone}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.SheetRemoveBtn}
                                                onPress={() => handleRemoveBuddy(item.id)}
                                            >
                                                <Feather name="x" size={16} color="#FF4E4E" />
                                            </TouchableOpacity>
                                        </View>
                                                )
                                            }
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.SubmitBtn}
                                    activeOpacity={0.85}
                                    disabled={buttonDisabled}
                                    onPress={() => handleManageGroup(imageData, groupName, allBuddies)}
                                >
                                    {buttonDisabled ? (
                                        <ActivityIndicator color="#09090B" />
                                    ) : (
                                        <Text style={styles.SubmitBtnText}>{type === 'Edit' ? 'Save Changes' : 'Create Group'}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </Animated.View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: { flex: 1, backgroundColor: '#09090B' },
    Backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', zIndex: 50 },
    Header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: '20rem', paddingTop: '60rem', paddingBottom: '20rem',
    },
    HeaderBackBtn: {
        width: '40rem', height: '40rem', borderRadius: '20rem',
        backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    HeaderTitle: { fontSize: '20rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    
    GroupPhotoSection: { alignItems: 'center', marginTop: '10rem', marginBottom: '30rem' },
    AvatarBtn: { position: 'relative' },
    GroupAvatar: { 
        width: '110rem', height: '110rem', borderRadius: '55rem',
        borderWidth: 3, borderColor: 'rgba(127,255,212,0.15)',
    },
    CameraBadge: {
        position: 'absolute', bottom: '2rem', right: '2rem',
        width: '32rem', height: '32rem', borderRadius: '16rem',
        backgroundColor: '#7FFFD4', alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: '#09090B',
    },
    AvatarHint: { 
        fontSize: '13rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.4)', marginTop: '12rem' 
    },

    FormSection: { paddingHorizontal: '20rem' },
    InputGroup: { marginBottom: '25rem' },
    InputLabel: { 
        fontSize: '14rem', fontFamily: 'GTWalsheimProBold', 
        color: '#FFFFFF', marginBottom: '12rem', marginLeft: '4rem' 
    },
    InputWrapper: {
        flexDirection: 'row', alignItems: 'center', height: '52rem',
        backgroundColor: '#121317', borderRadius: '16rem',
        paddingHorizontal: '16rem', borderWidth: 1.2, borderColor: 'rgba(255,255,255,0.08)',
    },
    InputWrapperError: { borderColor: '#FF4E4E' },
    Input: { flex: 1, marginLeft: '12rem', color: '#FFFFFF', fontSize: '15rem', fontFamily: 'GTWalsheimProRegular' },
    ErrorText: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: '#FF4E4E', marginTop: '6rem', marginLeft: '4rem' },

    BuddiesSection: { marginTop: '10rem' },
    SectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    BuddyAddIconBtn: { padding: '4rem' },
    
    AddedList: { marginTop: '8rem' },
    ContactImg: { width: '48rem', height: '48rem', borderRadius: '24rem', marginRight: '16rem' },
    ContactInfo: { flex: 1 },
    ContactName: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    ContactPhone: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.35)', marginTop: '2rem' },
    
    BuddyActionBtn: {
        backgroundColor: 'rgba(127,255,212,0.1)', paddingHorizontal: '16rem',
        paddingVertical: '8rem', borderRadius: '10rem',
    },
    BuddyActionBtnRemove: { backgroundColor: 'rgba(255,78,78,0.1)' },
    BuddyActionText: { fontSize: '13rem', fontFamily: 'GTWalsheimProBold', color: '#7FFFD4' },
    BuddyActionTextRemove: { color: '#FF4E4E' },
    RemoveBtn: { padding: '8rem' },

    SubmitBtn: {
        height: '56rem', backgroundColor: '#7FFFD4', borderRadius: '18rem',
        alignItems: 'center', justifyContent: 'center', marginTop: '20rem', marginBottom: '40rem',
        shadowColor: '#7FFFD4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    },
    SubmitBtnText: { fontSize: '16rem', fontFamily: 'GTWalsheimProBold', color: '#09090B' },

    // BottomSheet Styles
    DrawerContainer: { paddingHorizontal: '12rem', paddingBottom: '20rem', height: '100%' },
    DrawerCard: {
        backgroundColor: '#121317', borderRadius: '32rem', height: '100%',
        padding: '24rem', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    BottomSheet: { padding: '24rem', borderTopLeftRadius: '32rem', borderTopRightRadius: '32rem' },
    DrawerIndicator: {
        width: '40rem', height: '5rem', borderRadius: '3rem',
        backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: '20rem',
    },
    DrawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20rem' },
    DrawerTitle: { fontSize: '20rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF' },
    DrawerCancelText: { fontSize: '15rem', fontFamily: 'GTWalsheimProBold', color: '#FF4E4E' },
    SearchWrapper: {
        flexDirection: 'row', alignItems: 'center', height: '48rem',
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '14rem',
        paddingHorizontal: '16rem', marginBottom: '16rem',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    },
    SearchInput: { flex: 1, marginLeft: '12rem', color: '#FFFFFF', fontSize: '15rem' },
    DrawerBody: { marginTop: '10rem' },
    SheetContactItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: '10rem',
        marginBottom: '8rem',
    },
    SheetContactImg: { 
        width: '48rem', height: '48rem', borderRadius: '24rem', marginRight: '16rem',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)'
    },
    SheetContactName: { fontSize: '16.5rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', marginBottom: '2rem' },
    SheetContactPhone: { fontSize: '12rem', fontFamily: 'GTWalsheimProRegular', color: 'rgba(255,255,255,0.35)' },
    SheetAddBtn: {
        width: '32rem', height: '32rem', borderRadius: '16rem',
        backgroundColor: 'rgba(127,255,212,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    SheetAddBtnActive: {
        backgroundColor: 'rgba(127,255,212,0.25)',
    },
    SheetRemoveBtn: {
        width: '32rem', height: '32rem', borderRadius: '16rem',
        backgroundColor: 'rgba(255,78,78,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    BsTitle: { fontSize: '20rem', fontFamily: 'GTWalsheimProBold', color: '#FFFFFF', textAlign: 'center' },
    BsTitleSmall: { 
        fontSize: '14rem', fontFamily: 'GTWalsheimProRegular', 
        color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '6rem', marginBottom: '20rem' 
    },
    BsOptionBtn: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: '16rem',
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    BsIconWrap: {
        width: '40rem', height: '40rem', borderRadius: '12rem',
        backgroundColor: 'rgba(127,255,212,0.1)', alignItems: 'center', justifyContent: 'center',
        marginRight: '16rem',
    },
    BsOptionText: { fontSize: '16rem', fontFamily: 'GTWalsheimProMedium', color: '#FFFFFF' },
    emptyText: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '40rem' },
});

export default ManageGroupsScreen;

