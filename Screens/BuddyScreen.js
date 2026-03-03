import React, { useState , useEffect} from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Switch, ActivityIndicator, Linking, ScrollView, FlatList } from 'react-native';
import { Colors } from '../Constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Api } from '../Constants/Api';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();

const BuddyScreen = ({ navigation, route }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState(true);
    const [buddyInfo, setBuddyInfo] = useState(null);
    const [mutualGroups, setMutualGroups] = useState(null);
    const [btnText, setBtnText] = useState('Request Location');
    const [btnBlockText, setBtnBlockText] = useState(null);

    const { id } = route.params;

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
        if(responseType === 'getBuddy') {
            // console.log(responseData);
            if(responseData.error === 1) {
                const matchLocals = async() => {
                    await AsyncStorage.getItem('localContacts').then((value) => {
                        value = value != null ? JSON.parse(value) : null;
                        for (var i = 0; i < value.length; i++) {
                            for (var j = 0; j < responseData.data.length; j++) {
                                // if (value[i].phone.includes(responseData.data[j].phone)) {
                                //     responseData.data[j].name = value[i].name;
                                // } 
                                if (value[i].idNormal == responseData.data[j].idNormal) {
                                    responseData.data[j].name = value[i].name;
                                } 
                            }
                        }
                    })
                    setBuddyInfo(responseData.data);
                }
                matchLocals();
                if(JSON.stringify(responseData.data[0].mutual_groups.length) > 0) {
                    setMutualGroups(responseData.data[0].mutual_groups);
                } else {
                    setMutualGroups('empty');
                }
                if(responseData.data[0].location === 'y') {
                    setIsEnabled(true);
                } else {
                    setIsEnabled(false);
                }
                if(responseData.data[0].iBlocked === 'no') {
                    setBtnBlockText('Block')
                } else {
                    setBtnBlockText('Unblock')
                }
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'toggleBuddyLocation') {
            // console.log(responseData); 
            if(responseData.error === 1) {
                setIsEnabled(previousState => !previousState)
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'addBuddy') {
            if(responseData.error === 1) {
                setBtnText('Requested')
            } else {
                setResponse(false);
            }
        }
        if(responseType === 'blockBuddy') {
            console.log(responseData);
            if(responseData.error === 1) {
                setBtnBlockText(responseData.data.button_heading);
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        // getUserData removed - not needed for design showcase
    }, [])

    // console.log(buddyInfo)

    useEffect(() => {
        isFocused ? getBuddyInfo() : null
    }, [isFocused])

    const getBuddyInfo = async() => {
        setBuddyInfo([{
            id: id || 1,
            name: 'Sarah Mitchell',
            image: null,
            phone: '+1 (555) 234-8901',
            distance: '1.2',
            theyBlocked: 'no',
            buddyStatusMine: 'accepted'
        }]);
        setMutualGroups([{
            id: '1',
            name: 'Weekend Crew 🏖️',
            image: null,
            total_buddies: 5
        }, {
            id: '2',
            name: 'Hiking Buddies 🏔️',
            image: null,
            total_buddies: 8
        }]);
        setIsEnabled(true);
        setBtnBlockText('Block');
    }

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    }

    const addBuddy = (data) => {
        setBtnText('Requested');
    }

    const blockBuddy = (data) => {
        setBtnBlockText(btnBlockText === 'Block' ? 'Unblock' : 'Block');
    }

    // console.log(buddyInfo)

    return (
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Contact Info</Text>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1, marginBottom: EStyleSheet.value('40rem')}} contentContainerStyle={{flexGrow: 1}}>
                {
                    buddyInfo === null ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator color={colors.pText} size='large' />
                    </View>
                    :
                    <View style={styles.BuddyWrap}>
                        <View style={styles.BuddyWrapHeader}>
                            <TouchableOpacity
                                onPress={() => {}}
                            >
                                <Image 
                                    source={require('../assets/profile-user.png')} 
                                    resizeMode='cover' 
                                    style={styles.BuddyImg}
                                />
                            </TouchableOpacity>
                            <View style={styles.BuddyInfo}>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.BuddyName, {color: colors.pText}]}>{buddyInfo[0].name}</Text>
                                <View style={styles.BuddyEmail}>
                                    <Text style={{color: colors.light}}>{buddyInfo[0].phone}</Text>
                                    <Text style={{color: colors.light}}>~{buddyInfo[0].distance} kms away</Text> 
                                </View>
                            </View>
                        </View>
                        {
                            buddyInfo[0].theyBlocked === 'yes' ? null :
                            <View style={styles.BuddyWrapBody}>
                                {
                                    buddyInfo[0].buddyStatusMine === 'accepted' ?
                                    <View style={[styles.BuddyLocation, {borderTopColor: colors.lighter, borderBottomColor: colors.lighter, marginTop: 0}]}>
                                        <View style={styles.BuddyLocationTextWrap}>
                                            <FontAwesome
                                                name="location-arrow"
                                                style={[styles.BackBtn, {
                                                    fontSize: 
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('11rem') :
                                                    EStyleSheet.value('16rem'), 
                                                    color: colors.pText
                                                }]} 
                                            />
                                            <Text style={[styles.BuddyLocationText, {color: colors.pText}]}>Location Enable</Text>
                                        </View>
                                        <View>
                                            <Switch
                                                trackColor={{ false: "#767577", true: Colors.primary }}
                                                thumbColor={isEnabled ? Colors.dark : "#f4f3f4"}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={() => toggleSwitch()}
                                                value={isEnabled}
                                            />
                                        </View>
                                    </View>
                                    :
                                    buddyInfo[0].buddyStatusMine === 'pending' ?
                                    <View style={[styles.BtnLg, {backgroundColor: colors.bgVar}]}>
                                        <Text style={[styles.BtnLgText, {color: colors.pText}]}>Location Requested</Text>
                                    </View> :
                                    <TouchableOpacity
                                        onPress={() => {
                                            if(btnText === 'Request Location') {
                                                addBuddy(buddyInfo[0])
                                            }
                                        }}
                                    >
                                        <View style={[styles.BtnLg, {backgroundColor: colors.bgVar}]}>
                                            <Text style={[styles.BtnLgText, {color: colors.pText}]}>{btnText}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                <View style={styles.BuddyContact}>
                                    <View style={[styles.BuddyContactWrap, {borderRightColor: colors.lighter}]}>                                
                                        <TouchableOpacity 
                                            style={styles.BuddyContactBtn}
                                            onPress={() => Linking.openURL(`tel:${+buddyInfo[0].callingcode+buddyInfo[0].phone}`)}
                                            >
                                            <Entypo 
                                                name="phone" 
                                                style={[styles.BackBtn, {
                                                    fontSize: 
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('32rem') :
                                                    EStyleSheet.value('50rem'), 
                                                    color: colors.pText
                                                }]} 
                                            />
                                            <Text style={[styles.BuddyContactBtnText, {color: colors.pText}]}>Call</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.BuddyContactWrap, {borderRightWidth: 0}]}>                                
                                        <TouchableOpacity style={styles.BuddyContactBtn}
                                            onPress={() => {
                                                Linking.openURL('whatsapp://send?text=hello&phone=' + buddyInfo[0].callingcode+buddyInfo[0].phone).then((data) => {
                                                    console.log('WhatsApp Opened');
                                                }).catch((err) => {
                                                    console.log(err);
                                                });
                                            }}
                                        >
                                            <FontAwesome 
                                                name="whatsapp" 
                                                style={[styles.BackBtn, {
                                                    fontSize: 
                                                    deviceType === 'Tablet' ? 
                                                    EStyleSheet.value('32rem') :
                                                    EStyleSheet.value('50rem'), 
                                                    color: colors.pText
                                                }]} 
                                            />
                                            <Text style={[styles.BuddyContactBtnText, {color: colors.pText}]}>Message</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    mutualGroups === 'empty' ? null :
                                    <>
                                        <View style={[styles.BuddyLocation, {borderTopColor: colors.lighter, borderBottomColor: colors.lighter}]}>
                                            <View style={styles.BuddyLocationTextWrap}>
                                                <MaterialIcons 
                                                    name="group" 
                                                    style={[styles.BackBtn, {
                                                        fontSize: 
                                                        deviceType === 'Tablet' ? 
                                                        EStyleSheet.value('12.5rem') :
                                                        EStyleSheet.value('18rem'), 
                                                        color: colors.pText
                                                    }]} 
                                                />
                                                <Text style={[styles.BuddyLocationText, {color: colors.pText}]}>Shared Groups</Text>
                                            </View>
                                        </View>
                                        <FlatList 
                                            style={styles.ListWrap}
                                            data={mutualGroups}
                                            keyExtractor={ (item, index) => item.id ? item.id.toString() : index.toString() }
                                            renderItem={ ({ item }) => {
                                                return (
                                                    <TouchableOpacity 
                                                        style={[styles.ListItem, {backgroundColor: colors.background, borderBottomColor: colors.lighter}]}
                                                        onPress={()=> navigation.navigate('BuddyGroup', {
                                                            groupId: item.id
                                                        })}
                                                    >
                                                        <View style={styles.ListItemBody}>
                                                            <Image 
                                                                source={require('../assets/profile-user.png')} 
                                                                resizeMode='cover' 
                                                                style={styles.ListItemImg}
                                                            />
                                                            <View style={styles.ListItemTextWrap}>
                                                                <Text style={[styles.ListItemText, {color: colors.pText,}]}>{item.name}</Text>
                                                                <Text style={[styles.ListItemSmText, {color: colors.light}]}>{item.total_buddies} members</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>      
                                                )
                                            }}
                                        />    
                                    </>
                                }
                            </View>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                if(btnText === 'Request Location') {
                                    blockBuddy(buddyInfo[0])
                                }
                            }}
                        >
                            <View style={[styles.BtnLg, {backgroundColor: colors.bgVar}]}>
                                <Text style={[styles.BtnLgText, {color: 'red'}]}>{btnBlockText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

const styles = EStyleSheet.create({
    Container: {
        flex: 1
    },
    TopBarStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '46rem' : '50rem',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 3,
        elevation: 2,
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProMedium',
        color: Colors.dark,
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    BuddyWrap: {
        flex: 1,
    },
    BuddyImg: {
        height: deviceType === 'Tablet' ? '140rem' : '200rem',
        width: '100%'
    },
    BuddyInfo: {
        paddingVertical: deviceType === 'Tablet' ? '10rem' : '14rem',
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    BuddyName: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProBold',
    },
    BuddyEmail: {
        fontSize: deviceType === 'Tablet' ? '9rem' : '14rem',
        paddingTop: deviceType === 'Tablet' ? '3.5rem' : '5rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    BuddyLocation: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: '1rem',
        borderBottomWidth: '1rem',
        marginTop: deviceType === 'Tablet' ? '18rem' : '25rem',
        height: deviceType === 'Tablet' ? '35rem' : '55rem',
    },
    BuddyLocationTextWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    BuddyLocationText: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingLeft: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    BuddyContact: {
        flexDirection: 'row'
    },
    BuddyContactWrap: {
        width: '50%',
        height: deviceType === 'Tablet' ? '70rem' : '100rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceType === 'Tablet' ? '18rem' : '30rem',
        borderRightWidth: '1rem',
    },
    BuddyContactBtn: {
        height: deviceType === 'Tablet' ? '45rem' : '70rem',
        width: deviceType === 'Tablet' ? '45rem' : '70rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    BuddyContactBtnText: {
        paddingTop: deviceType === 'Tablet' ? '8rem' : '12rem',
        fontSize: deviceType === 'Tablet' ? '10rem' : '14rem',
    },
    ListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: '1rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '50rem' : '75rem'
    },
    ListItemBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ListItemImg: {
        height: deviceType === 'Tablet' ? '30rem' : '42rem',
        width: deviceType === 'Tablet' ? '30rem' : '42rem',
        borderRadius: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    ListItemTextWrap: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    ListItemText: {
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '14rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    ListItemSmText: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem',
        paddingTop: '2rem'
    },
    BtnLg: {
        marginHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '35rem' : '50rem',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10rem'
    },
    BtnLgText: {
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
    }
})

export default BuddyScreen;