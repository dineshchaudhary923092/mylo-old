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

    const renderBsOneContent = (socket) => (
        <KeyboardAwareScrollView 
            enableOnAndroid={true} 
            enableAutomaticScroll={true} 
            keyboardShouldPersistTaps='always' 
            style={{minHeight: '100%', backgroundColor: colors.sheet}}
        >
            <View style={[styles.BottomSheet, {backgroundColor: colors.sheet}]}>
                <View style={styles.DrawerHeader}>
                    <Text style={[styles.DrawerTitle, {color: colors.pText}]}>Buddies</Text>
                    <TouchableOpacity 
                        style={styles.CloseDrawer}
                        onPress={() => {
                            if (bsOne.current) {
                                bsOne.current.snapTo(1);
                            }
                        }}
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
                        allBuddies === null ?
                        <View style={{ paddingTop: EStyleSheet.value('50rem') }}>
                            <ActivityIndicator color={colors.pText} size="large" />
                        </View> : 
                        allBuddies === 'empty' ?
                        <Text style={[styles.emptyText, {color: colors.pText}]}>No Contacts Found</Text> :
                        <FlatList 
                            style={styles.ListWrap}
                            data={allBuddies}
                            keyExtractor={ (item, index) => item.phone ? item.phone.toString() : index.toString() }
                            renderItem={ ({ item }) => {
                                return (
                                    <View 
                                        style={[styles.ListItem, {borderBottomColor: colors.lighter}]}
                                    >
                                        <View style={styles.ListItemBody}>
                                            <Image 
                                                source={require('../assets/profile-user.png')} 
                                                resizeMode='cover' 
                                                style={styles.ListItemImg}
                                            />
                                            <View style={styles.ListItemTextWrap}>
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ListItemText, {color: colors.pText}]}>{item.name}</Text>
                                                <Text style={[styles.ListItemSmText, {color: colors.light}]}>{item.phone}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.DrawerBuddyAdd}
                                            onPress={() => handleAddBuddy(item.id)}
                                        >
                                            <Text style={styles.DrawerBuddyAddText}>{item.localBtnText}</Text>
                                        </TouchableOpacity>
                                    </View>      
                                )
                            }}
                        />   
                    }
                </View>
            </View> 
        </KeyboardAwareScrollView>
    );

    const renderBsContent = () => (
        <View style={[styles.BottomSheet, { backgroundColor: colors.sheet }]}>
            <Text style={[styles.BsTitle, { color: colors.pText }]}>Upload Photo</Text>
            <Text style={[styles.BsTitleSmall, { color: colors.text, opacity: 0.65 }]}>Choose your Profile Picture</Text>
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
        <View style={[styles.Container, { backgroundColor: colors.background }]}>
            <BottomSheet
                ref={bs}
                snapPoints={[
                    screenHeight > 720 ?
                        deviceType === 'Tablet' ? 450 : 350
                        : 320, 0
                ]}
                renderContent={renderBsContent}
                renderHeader={renderBsHeader}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
                callbackNode={fall}
            />
            <BottomSheet
                ref={bsOne}
                snapPoints={[
                    screenHeight > 720 ?
                        deviceType === 'Tablet' ?
                            Dimensions.get('window').height * 0.90 :
                            Dimensions.get('window').height * 0.825
                        : Dimensions.get('window').height * 0.85, 0
                ]}
                renderContent={renderBsOneContent}
                enabledGestureInteraction={Platform.OS === 'android' ? false : true}
                initialSnap={1}
                callbackNode={fall}
            />
            <StatusBarComponent bgcolor={colors.background} barStyle={theme.dark ? 'light' : 'dark'} />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='always'
                enableOnAndroid={true}
                enableAutomaticScroll={true}
            >
                <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1)) }}>
                    <View style={[styles.TopBarStyle, { backgroundColor: colors.background }]}>
                        <Text style={[styles.TopBarBtnText, { color: colors.pText }]}>{type} Group</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="arrowleft" style={[styles.BackBtn, { color: colors.pText }]} />
                        </TouchableOpacity>
                    </View>
                    {
                        loading ?
                        <View style={{ paddingTop: EStyleSheet.value('50rem') }}>
                            <ActivityIndicator color={colors.pText} size="large" />
                        </View> :
                        <View>
                            <View style={styles.GroupPhotoWrap}>
                                <TouchableOpacity
                                    style={{ position: 'relative' }}
                                    onPress={() => {
                                        if (bs.current) {
                                            bs.current.snapTo(0);
                                        }
                                    }}
                                >
                                    <Image
                                        source={require('../assets/profile-user.png')}
                                        resizeMode='cover'
                                        style={styles.GroupPhotoImg}
                                    />
                                    <View style={styles.ImageEdit}>
                                        <FontAwesome5 name='camera' style={styles.ImageEditIcon} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.FormContainer}>
                                <View style={[styles.FormInputStyle, { marginBottom: 20 }]}>
                                    <Text style={[styles.FormInputLabelStyle, { color: colors.pText }]}>Group Name</Text>
                                    <View style={[styles.FormInputFieldStyle, { borderColor: theme.dark ? colors.primary : colors.light }]}>
                                        <MaterialIcons
                                            name="group"
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
                                            style={[styles.FormTextInputStyle, { color: colors.pText }]}
                                            placeholderTextColor={colors.light}
                                            placeholder="Enter Group Name"
                                            value={groupName.gName}
                                            onChangeText={(value) => groupNameInputChange(value)}
                                        />
                                    </View>
                                    {
                                        groupName.isValid ? null :
                                            <Text style={[styles.errorText, { color: colors.text }]}>Group name should be minimum 3 characters</Text>
                                    }
                                </View>
                                <View style={[styles.borderWrapper, { borderBottomColor: colors.lighter }]}>
                                    <View style={styles.FormInputStyle}>
                                        <View style={styles.FormRow}>
                                            <Text style={[styles.FormInputLabelStyle, { paddingBottom: 0, color: colors.pText }]}>Add Buddies</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addBuddies();
                                                }}
                                            >
                                                <MaterialIcons
                                                    name="add-circle"
                                                    size={
                                                        deviceType === 'Tablet' ?
                                                            EStyleSheet.value('18rem') :
                                                            EStyleSheet.value('28rem')
                                                    }
                                                    color={colors.pText}
                                                    style={{
                                                        paddingRight:
                                                            deviceType === 'Tablet' ?
                                                                EStyleSheet.value('14rem') :
                                                                EStyleSheet.value('20rem')
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[styles.AddedCount, { borderBottomColor: colors.lighter }]}>
                                        {
                                            allBuddies != 'empty' && allBuddies != null ?
                                            <Text style={[styles.AddedCountText, { color: colors.pText }]}>
                                                {
                                                    allBuddies.filter(value => value.localBtnText === 'remove').length === 1 ?
                                                        '1 Buddy Added' :
                                                        `${allBuddies.filter(value => value.localBtnText === 'remove').length} Buddies Added`
                                                }
                                            </Text>
                                            : <Text style={[styles.AddedCountText, { color: colors.pText }]}>Added buddies shown here</Text>
                                        }
                                    </View>
                                    <FlatList
                                        data={allBuddies}
                                        keyExtractor={(item, index) => item.phone ? item.phone.toString() : index.toString()}
                                        extraData={reRenderList}
                                        renderItem={({ item }) => {
                                            if (item.localBtnText === 'remove') {
                                                return (
                                                    <View
                                                        style={[styles.ListItem, { borderBottomColor: colors.lighter }]}
                                                    >
                                                        <View style={styles.ListItemBody}>
                                                            <Image
                                                                source={require('../assets/profile-user.png')}
                                                                resizeMode='cover'
                                                                style={styles.ListItemImg}
                                                            />
                                                            <View style={styles.ListItemTextWrap}>
                                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.ListItemText, { color: colors.pText, }]}>{item.name}</Text>
                                                                <Text style={[styles.ListItemSmText, { color: colors.light }]}>{item.phone}</Text>
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity
                                                            style={[styles.DrawerBuddyAdd, { backgroundColor: '#232323' }]}
                                                            onPress={() => handleAddBuddy(item.id)}
                                                        >
                                                            <Text style={styles.DrawerBuddyAddText}>{item.localBtnText}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.SubmitContainer, styles.SubmitContainerVar]}
                                    disabled={buttonDisabled}
                                    onPress={() => {
                                        setButtonDisabled(true);
                                        handleManageGroup(imageData, groupName, allBuddies)
                                    }}
                                >
                                    {
                                        buttonDisabled ?
                                            <ActivityIndicator color={Colors.dark} />
                                            :
                                            <Text style={styles.SubmitText}>{type === 'Edit' ? 'Update' : 'Add'} Group</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </Animated.View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingVertical: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    GroupPhotoWrap: {
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginVertical: deviceType === 'Tablet' ? '9rem' : '15rem',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '15rem',
        borderRadius: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    GroupPhotoImg: {
        height: deviceType === 'Tablet' ? '70rem' : '100rem',
        width: deviceType === 'Tablet' ? '70rem' : '100rem',
        borderRadius: deviceType === 'Tablet' ? '35rem' : '50rem',
    },
    ImageEdit: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark,
        height: deviceType === 'Tablet' ? '24rem' : '35rem',
        width: deviceType === 'Tablet' ? '24rem' : '35rem',
        borderRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageEditIcon: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        color: Colors.primary,
    },
    FormContainer: {
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        paddingBottom: deviceType === 'Tablet' ? '26rem' : '40rem',
    },
    FormInputStyle: {
        marginBottom: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputLabelStyle: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProLight',
        paddingBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
        paddingLeft: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputFieldStyle: {
        flexDirection: 'row',
        borderWidth: '1rem', 
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '14rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    FormInputFieldVarStyle: {
        borderRadius: deviceType === 'Tablet' ? '5rem' : '8rem',
        borderWidth: 0,
        marginVertical: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    FormTextInputStyle: {
        flex: 1,
        fontSize: deviceType === 'Tablet' ? '9rem' : '13rem',
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
    },
    FormRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    borderWrapper: {
        paddingTop: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderBottomWidth: '1rem'
    },
    SubmitContainer: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        borderRadius: deviceType === 'Tablet' ? '13rem' : '25rem',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    SubmitContainerVar: {
        marginTop: deviceType === 'Tablet' ? '9rem' : '15rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        marginTop: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    SubmitText: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        color: Colors.dark,
        fontFamily: 'GTWalsheimProMedium',
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
    BottomSheetVar: {
        padding: 0,
        paddingTop: deviceType === 'Tablet' ? '11rem' : '16rem',
    },
    bsHeader: {
        height: deviceType === 'Tablet' ? '26rem' : '40rem',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '12rem',
    },
    bsHandle: {
        height: deviceType === 'Tablet' ? '4rem' : '6rem',
        width: deviceType === 'Tablet' ? '35rem' : '50rem',
        borderRadius: deviceType === 'Tablet' ? '2rem' : '3rem',
    },
    BsTitle: {
        color: Colors.dark,
        fontSize: deviceType === 'Tablet' ? '14rem' : '20rem',
        fontFamily: 'GTWalsheimProMedium',
        textAlign: 'center'
    },
    BsTitleSmall: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'GTWalsheimProLight',
        color: Colors.dark,
        textAlign: 'center'
    },
    errorText: {
        fontSize: deviceType === 'Tablet' ? '7.5rem' : '13rem',
        color: '#fff',
        fontFamily: 'GTWalsheimProLight',
        paddingLeft: '2rem',
        paddingTop: deviceType === 'Tablet' ? '2.8rem' : '4rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    DrawerHeader: {
        position: 'relative',
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    DrawerTitle: {
        color: Colors.primary,
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        textAlign: 'center',
        lineHeight: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    CloseDrawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: deviceType === 'Tablet' ? '9rem' : '14rem',
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
        paddingHorizontal: deviceType === 'Tablet' ? '9rem' : '14rem',
        height: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    DrawerBuddyAddText: {
        color: Colors.primary,
        fontSize: deviceType === 'Tablet' ? '7.5rem' : '13rem',
        fontFamily: 'GTWalsheimProMedium',
        lineHeight: deviceType === 'Tablet' ? '18rem' : '30rem',
        textTransform: 'capitalize'
    },
    DrawerBody: {
        borderTopWidth: '1rem',
    },
    ListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: '1rem',
        paddingVertical: deviceType === 'Tablet' ? '9rem' : '14rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    ListItemBody: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '75%',
    },
    ListItemImg: {
        height: deviceType === 'Tablet' ? '30rem' : '42rem',
        width: deviceType === 'Tablet' ? '30rem' : '42rem',
        borderRadius: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    ListItemTextWrap: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        flex: 1
    },
    ListItemText: {
        color: Colors.primary,
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '14rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    ListItemSmText: {
        color: Colors.light,
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        paddingTop: '2rem'
    },
    AddedCount: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderBottomWidth: '1rem'
    },
    AddedCountText: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        fontFamily: 'GTWalsheimProLight',
        letterSpacing: 0.5,
        paddingBottom: deviceType === 'Tablet' ? '7rem' : '10rem',
        textAlign: 'right'
    },
})

export default ManageGroupsScreen;

